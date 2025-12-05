import { Hono } from 'hono'
import { AwsClient } from 'aws4fetch'
import { requireAuth } from '../middleware/auth'
import type { Env } from '../types'

const MAX_DIRECT_SIZE = 50 * 1024 * 1024 // 50MB - use presigned URLs above this

function sanitizeFilename(name: string): string {
  return name.replace(/["\r\n]/g, '_')
}

// Helper to get metadata - handles both camelCase (direct upload) and lowercase (presigned URL)
function getMetadata(meta: Record<string, string> | undefined, key: string): string | undefined {
  if (!meta) return undefined
  // Try camelCase first (direct upload), then lowercase (presigned URL)
  return meta[key] ?? meta[key.toLowerCase()]
}

interface UploadMetadata {
  originalName: string
  folder: string
  uploadedAt: string
}

async function generatePresignedUrl(
  env: Env,
  key: string,
  contentType: string,
  metadata: UploadMetadata,
  expiresIn: number = 3600
): Promise<{ url: string; headers: Record<string, string> }> {
  const url = new URL(`${env.R2_ENDPOINT}/${env.R2_BUCKET_NAME}/${key}`)
  
  const aws = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    service: 's3',
    region: 'auto',
  })
  
  const headers: Record<string, string> = {
    'Content-Type': contentType,
    'x-amz-meta-originalname': metadata.originalName,
    'x-amz-meta-uploadedat': metadata.uploadedAt,
    'x-amz-meta-shared': 'false',
    'x-amz-meta-folder': metadata.folder,
  }
  
  // Create a signed request with metadata headers
  const signed = await aws.sign(
    new Request(url.toString(), {
      method: 'PUT',
      headers,
    }),
    {
      aws: { signQuery: true },
    }
  )
  
  return { url: signed.url, headers }
}

const files = new Hono<{ Bindings: Env }>()

files.use('/*', requireAuth)

files.get('/stats', async (c) => {
  const objects = await c.env.FILES.list()
  
  let totalSize = 0
  const folderCounts: Record<string, number> = { '/': 0 }
  
  for (const obj of objects.objects) {
    totalSize += obj.size
    const head = await c.env.FILES.head(obj.key)
    const folder = getMetadata(head?.customMetadata, 'folder') || '/'
    folderCounts[folder] = (folderCounts[folder] || 0) + 1
  }
  
  return c.json({
    totalFiles: objects.objects.length,
    totalSize,
    folderCounts
  })
})

// Direct upload for small files (<50MB)
files.post('/upload', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || '/'
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }
    
    if (file.size > MAX_DIRECT_SIZE) {
      return c.json({ error: 'File too large for direct upload. Use presigned URL.' }, 413)
    }
    
    const key = `${Date.now()}-${file.name}`
    const buffer = await file.arrayBuffer()
    
    await c.env.FILES.put(key, buffer, {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        shared: 'false',
        folder: folder,
      },
    })
    
    return c.json({ success: true, key, name: file.name, folder })
  } catch (error) {
    console.error('Upload error:', error)
    return c.json({ error: 'Upload failed. File may be too large for this environment.' }, 500)
  }
})

// Get presigned URL for large file uploads (direct to R2)
files.post('/upload-url', async (c) => {
  try {
    const { filename, contentType, folder } = await c.req.json()
    console.log('[upload-url] Request:', { filename, contentType, folder })
    
    // Validate filename: only alphanumeric, dashes, underscores, dots, spaces
    const validFilename = /^[\w\-. ]+$/
    if (!filename || !validFilename.test(filename)) {
      return c.json({ error: 'Invalid filename. Use only letters, numbers, dashes, underscores, dots, and spaces.' }, 400)
    }
    
    if (filename.length > 200) {
      return c.json({ error: 'Filename too long. Max 200 characters.' }, 400)
    }
    
    const key = `${Date.now()}-${filename}`
    const metadata: UploadMetadata = {
      originalName: filename,
      folder: folder || '/',
      uploadedAt: new Date().toISOString(),
    }
    
    console.log('[upload-url] Generating presigned URL for key:', key)
    
    const { url: uploadUrl, headers } = await generatePresignedUrl(
      c.env,
      key,
      contentType || 'application/octet-stream',
      metadata
    )
    
    console.log('[upload-url] Success, URL generated with metadata headers')
    return c.json({ 
      success: true, 
      uploadUrl, 
      key,
      folder: folder || '/',
      headers // Client must send these exact headers
    })
  } catch (error) {
    console.error('[upload-url] Error:', error)
    return c.json({ error: 'Failed to generate upload URL' }, 500)
  }
})

// Note: /complete-upload endpoint removed - metadata is now set via presigned URL headers

files.get('/list', async (c) => {
  const objects = await c.env.FILES.list()
  
  const allFiles = await Promise.all(
    objects.objects.map(async (obj) => {
      const head = await c.env.FILES.head(obj.key)
      const meta = head?.customMetadata
      return {
        key: obj.key,
        name: getMetadata(meta, 'originalName') || obj.key,
        size: obj.size,
        uploadedAt: getMetadata(meta, 'uploadedAt') || obj.uploaded,
        contentType: head?.httpMetadata?.contentType || 'application/octet-stream',
        shared: getMetadata(meta, 'shared') === 'true',
        folder: getMetadata(meta, 'folder') || '/',
      }
    })
  )
  
  // Extract unique folders
  const folderSet = new Set<string>()
  folderSet.add('/')
  allFiles.forEach(f => {
    if (f.folder && f.folder !== '/') {
      // Add the folder and all parent folders
      const parts = f.folder.split('/').filter(Boolean)
      let path = ''
      parts.forEach(part => {
        path += '/' + part
        folderSet.add(path)
      })
    }
  })
  
  const folders = Array.from(folderSet).sort()
  
  return c.json({ files: allFiles, folders })
})

files.get('/preview/:key', async (c) => {
  const key = c.req.param('key')
  const object = await c.env.FILES.get(key)
  
  if (!object) {
    return c.json({ error: 'File not found' }, 404)
  }
  
  const filename = sanitizeFilename(getMetadata(object.customMetadata, 'originalName') || key)
  const headers = new Headers()
  headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream')
  headers.set('Content-Disposition', `inline; filename="${filename}"`)
  headers.set('Cache-Control', 'private, max-age=3600')
  
  return new Response(object.body, { headers })
})

files.get('/download/:key', async (c) => {
  const key = c.req.param('key')
  const object = await c.env.FILES.get(key)
  
  if (!object) {
    return c.json({ error: 'File not found' }, 404)
  }
  
  const filename = sanitizeFilename(getMetadata(object.customMetadata, 'originalName') || key)
  const headers = new Headers()
  headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream')
  headers.set('Content-Disposition', `attachment; filename="${filename}"`)
  
  return new Response(object.body, { headers })
})

files.patch('/rename/:key', async (c) => {
  const key = c.req.param('key')
  const { name } = await c.req.json()
  
  // Validate name: only alphanumeric, dashes, underscores, dots, spaces
  const validName = /^[\w\-. ]+$/
  if (!name || !validName.test(name)) {
    return c.json({ error: 'Invalid name. Use only letters, numbers, dashes, underscores, dots, and spaces.' }, 400)
  }
  
  if (name.length > 200) {
    return c.json({ error: 'Name too long. Max 200 characters.' }, 400)
  }
  
  // Check for duplicate names
  const objects = await c.env.FILES.list()
  for (const obj of objects.objects) {
    if (obj.key === key) continue
    const head = await c.env.FILES.head(obj.key)
    const existingName = getMetadata(head?.customMetadata, 'originalName')
    if (existingName?.toLowerCase() === name.toLowerCase()) {
      return c.json({ error: 'A file with this name already exists.' }, 400)
    }
  }
  
  // Get existing object
  const object = await c.env.FILES.get(key)
  if (!object) {
    return c.json({ error: 'File not found' }, 404)
  }
  
  // Re-upload with new name (R2 doesn't support metadata updates)
  await c.env.FILES.put(key, object.body, {
    httpMetadata: object.httpMetadata,
    customMetadata: {
      ...object.customMetadata,
      originalName: name,
    },
  })
  
  return c.json({ success: true, name })
})

files.patch('/share/:key', async (c) => {
  const key = c.req.param('key')
  const { shared } = await c.req.json()
  
  const object = await c.env.FILES.get(key)
  if (!object) {
    return c.json({ error: 'File not found' }, 404)
  }
  
  await c.env.FILES.put(key, object.body, {
    httpMetadata: object.httpMetadata,
    customMetadata: {
      ...object.customMetadata,
      shared: shared ? 'true' : 'false',
    },
  })
  
  return c.json({ success: true, shared })
})

files.patch('/move/:key', async (c) => {
  const key = c.req.param('key')
  const { folder } = await c.req.json()
  
  // Validate folder name
  if (folder !== '/' && !/^(\/[\w\-. ]+)+$/.test(folder)) {
    return c.json({ error: 'Invalid folder path' }, 400)
  }
  
  const object = await c.env.FILES.get(key)
  if (!object) {
    return c.json({ error: 'File not found' }, 404)
  }
  
  await c.env.FILES.put(key, object.body, {
    httpMetadata: object.httpMetadata,
    customMetadata: {
      ...object.customMetadata,
      folder: folder,
    },
  })
  
  return c.json({ success: true, folder })
})

files.delete('/:key', async (c) => {
  const key = c.req.param('key')
  await c.env.FILES.delete(key)
  return c.json({ success: true })
})

// Move folder and all its contents to a new location
files.patch('/folders/move', async (c) => {
  const { oldPath, newPath } = await c.req.json()
  
  // Validate paths
  if (!oldPath || oldPath === '/') {
    return c.json({ error: 'Cannot move root folder' }, 400)
  }
  
  if (newPath !== '/' && !/^(\/[\w\-. ]+)+$/.test(newPath)) {
    return c.json({ error: 'Invalid destination path' }, 400)
  }
  
  // Prevent moving a folder into itself
  if (newPath.startsWith(oldPath + '/')) {
    return c.json({ error: 'Cannot move folder into itself' }, 400)
  }
  
  const objects = await c.env.FILES.list()
  const filesToMove: { key: string; currentFolder: string; newFolder: string }[] = []
  
  for (const obj of objects.objects) {
    const head = await c.env.FILES.head(obj.key)
    const folder = getMetadata(head?.customMetadata, 'folder') || '/'
    
    // Check if file is in the folder being moved or a subfolder
    if (folder === oldPath || folder.startsWith(oldPath + '/')) {
      // Calculate new folder path
      const relativePath = folder === oldPath ? '' : folder.substring(oldPath.length)
      const folderName = oldPath.split('/').filter(Boolean).pop() || ''
      const newFolder = newPath === '/' 
        ? '/' + folderName + relativePath 
        : newPath + '/' + folderName + relativePath
      
      filesToMove.push({ key: obj.key, currentFolder: folder, newFolder })
    }
  }
  
  // Move all files
  for (const file of filesToMove) {
    const object = await c.env.FILES.get(file.key)
    if (object) {
      await c.env.FILES.put(file.key, object.body, {
        httpMetadata: object.httpMetadata,
        customMetadata: {
          ...object.customMetadata,
          folder: file.newFolder,
        },
      })
    }
  }
  
  return c.json({ success: true, movedFiles: filesToMove.length })
})

// Delete folder and all its contents
files.delete('/folders/*', async (c) => {
  // Get the folder path from the URL (everything after /folders)
  const url = new URL(c.req.url)
  const fullPath = decodeURIComponent(url.pathname)
  const folderPath = fullPath.replace('/api/files/folders', '')
  
  console.log('[delete-folder] Full path:', fullPath)
  console.log('[delete-folder] Folder path:', folderPath)
  
  if (folderPath === '/') {
    return c.json({ error: 'Cannot delete root folder' }, 400)
  }
  
  const objects = await c.env.FILES.list()
  const keysToDelete: string[] = []
  
  console.log('[delete-folder] Total objects in bucket:', objects.objects.length)
  
  for (const obj of objects.objects) {
    const head = await c.env.FILES.head(obj.key)
    const folder = getMetadata(head?.customMetadata, 'folder') || '/'
    
    // Check if file is in the folder being deleted or a subfolder
    if (folder === folderPath || folder.startsWith(folderPath + '/')) {
      console.log('[delete-folder] Will delete:', obj.key, 'in folder:', folder)
      keysToDelete.push(obj.key)
    }
  }
  
  console.log('[delete-folder] Files to delete:', keysToDelete.length)
  
  // Delete all files
  for (const key of keysToDelete) {
    await c.env.FILES.delete(key)
  }
  
  return c.json({ success: true, deletedFiles: keysToDelete.length })
})

export default files

