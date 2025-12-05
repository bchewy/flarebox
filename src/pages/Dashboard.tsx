export function Dashboard() {
  return (
    <div id="dashboard-layout">
      <script dangerouslySetInnerHTML={{ __html: `window.__PAGE__ = 'dashboard';` }} />
      <aside id="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-header-left">
            <h2>FlareBox</h2>
            <div id="storage-stats" className="storage-stats">Loading...</div>
          </div>
          <button id="logout-btn" title="Sign out">↗</button>
        </div>
        <div className="sidebar-folders">
          <div id="folder-tree"></div>
          <button id="new-folder-btn" className="btn-new-folder-sidebar">+ New Folder</button>
        </div>
      </aside>
      
      <div id="sidebar-backdrop"></div>
      
      <main id="main-content">
        <header>
          <button id="menu-toggle" title="Open menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
            </svg>
          </button>
          <nav id="breadcrumb" className="breadcrumb">
            <span className="breadcrumb-item active" data-path="/">Home</span>
          </nav>
        </header>
        
        <div id="upload-zone" className="upload-zone">
          <div className="upload-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 16V4m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 20h18" strokeLinecap="round"/>
            </svg>
            <p>Drop files here or tap to upload</p>
            <input type="file" id="file-input" multiple style={{ display: 'none' }} />
          </div>
          <div id="upload-progress" className="upload-progress" style={{ display: 'none' }}>
            <div className="upload-progress-text"></div>
            <div className="upload-progress-bar">
              <div className="upload-progress-fill"></div>
            </div>
          </div>
        </div>
        
        <div id="bulk-actions" className="bulk-actions" style={{ display: 'none' }}>
          <span id="bulk-count">0 selected</span>
          <button id="bulk-move" className="bulk-btn">📁 Move</button>
          <button id="bulk-download" className="bulk-btn">⬇ Download</button>
          <button id="bulk-delete" className="bulk-btn danger">🗑 Delete</button>
          <button id="bulk-clear" className="bulk-btn">✕ Clear</button>
        </div>
        <div id="files-list" className="files-list">
          <div className="loading">Loading...</div>
        </div>
      </main>
      
      <div id="toast" className="toast"></div>
      
      <nav id="bottom-nav" className="bottom-nav">
        <button className="bottom-nav-item" id="nav-folders">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
          </svg>
          <span>Folders</span>
        </button>
        <button className="bottom-nav-item" id="nav-home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Home</span>
        </button>
        <div className="bottom-nav-fab-container">
          <button className="bottom-nav-fab" id="nav-upload">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <button className="bottom-nav-item" id="nav-logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Logout</span>
        </button>
      </nav>
      
      <div id="mobile-drawer" className="mobile-drawer" style={{ display: 'none' }}>
        <div className="drawer-backdrop" id="drawer-backdrop"></div>
        <div className="drawer" id="drawer-panel">
          <div className="drawer-header">
            <div className="drawer-header-left">
              <h2>FlareBox</h2>
              <div id="drawer-stats" className="drawer-stats"></div>
            </div>
            <button className="drawer-close" id="drawer-close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="drawer-content" id="drawer-folders"></div>
          <div className="drawer-footer">
            <button className="drawer-new-folder" id="drawer-new-folder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
              </svg>
              <span>New Folder</span>
            </button>
          </div>
        </div>
      </div>
      
      <div id="preview-modal" className="preview-modal" style={{ display: 'none' }}>
        <div className="preview-backdrop"></div>
        <div className="preview-content">
          <button className="preview-close">&times;</button>
          <div id="preview-body"></div>
          <div className="preview-info">
            <div id="preview-name"></div>
            <div id="preview-meta"></div>
          </div>
          <div className="preview-actions">
            <a id="preview-download" href="#" download className="btn-download">Download</a>
          </div>
        </div>
      </div>
      
      <div id="move-modal" className="move-modal" style={{ display: 'none' }}>
        <div className="move-backdrop"></div>
        <div className="move-content">
          <h3>Move to folder</h3>
          <div id="move-folder-list" className="move-folder-list"></div>
          <div className="move-actions">
            <button id="move-cancel" className="btn-cancel">Cancel</button>
          </div>
        </div>
      </div>
      
      <div id="input-modal" className="input-modal" style={{ display: 'none' }}>
        <div className="input-backdrop"></div>
        <div className="input-content">
          <h3 id="input-title">Enter name</h3>
          <input type="text" id="input-field" placeholder="Name" />
          <div className="input-actions">
            <button id="input-cancel" className="btn-cancel">Cancel</button>
            <button id="input-confirm" className="btn-confirm">Create</button>
          </div>
        </div>
      </div>
      
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const sidebar = document.getElementById('sidebar');
          const folderTree = document.getElementById('folder-tree');
          const uploadZone = document.getElementById('upload-zone');
          const fileInput = document.getElementById('file-input');
          const uploadProgress = document.getElementById('upload-progress');
          const filesList = document.getElementById('files-list');
          const bulkActions = document.getElementById('bulk-actions');
          const bulkCount = document.getElementById('bulk-count');
          const logoutBtn = document.getElementById('logout-btn');
          const breadcrumb = document.getElementById('breadcrumb');
          const newFolderBtn = document.getElementById('new-folder-btn');
          const previewModal = document.getElementById('preview-modal');
          const previewBody = document.getElementById('preview-body');
          const previewName = document.getElementById('preview-name');
          const previewMeta = document.getElementById('preview-meta');
          const previewDownload = document.getElementById('preview-download');
          const previewClose = previewModal.querySelector('.preview-close');
          const previewBackdrop = previewModal.querySelector('.preview-backdrop');
          const moveModal = document.getElementById('move-modal');
          const moveFolderList = document.getElementById('move-folder-list');
          const moveCancel = document.getElementById('move-cancel');
          const moveBackdrop = moveModal.querySelector('.move-backdrop');
          const inputModal = document.getElementById('input-modal');
          const inputField = document.getElementById('input-field');
          const inputTitle = document.getElementById('input-title');
          const inputCancel = document.getElementById('input-cancel');
          const inputConfirm = document.getElementById('input-confirm');
          const inputBackdrop = inputModal.querySelector('.input-backdrop');
          let inputCallback = null;
          
          let uploadQueue = [];
          let uploading = false;
          let currentFolder = '/';
          let totalBytes = 0;
          let fileProgress = {};
          
          function updateProgress(file, loaded) {
            fileProgress[file.name] = loaded;
            var current = Object.values(fileProgress).reduce(function(a, b) { return a + b; }, 0);
            var pct = Math.round((current / totalBytes) * 100);
            uploadProgress.querySelector('.upload-progress-fill').style.width = pct + '%';
            uploadProgress.querySelector('.upload-progress-text').textContent = pct + '% - Uploading...';
          }
          let allFolders = ['/'];
          let emptyFolders = JSON.parse(localStorage.getItem('emptyFolders') || '[]');
          let movingFileKey = null;
          let selectedFiles = new Set();
          let draggedKeys = [];
          let draggedFolderPath = null;
          const toast = document.getElementById('toast');
          const storageStats = document.getElementById('storage-stats');
          
          function loadStats() {
            fetch('/api/files/stats').then(function(res) { return res.json(); }).then(function(data) {
              var sizeStr = formatBytes(data.totalSize);
              storageStats.textContent = data.totalFiles + ' files · ' + sizeStr;
            }).catch(function() {
              storageStats.textContent = '';
            });
          }
          
          function showToast(message) {
            toast.innerHTML = message;
            toast.classList.remove('loading');
            toast.classList.add('show');
            setTimeout(function() { toast.classList.remove('show'); }, 2500);
          }
          
          function showLoadingToast(message) {
            toast.innerHTML = '<span class="spinner"></span> ' + message;
            toast.classList.add('show', 'loading');
          }
          
          function showMoveToast(count) {
            var msg = count === 1 ? '1 file moved' : count + ' files moved';
            toast.innerHTML = '<span class="move-icon">📁</span><span>' + msg + '</span><span class="checkmark">✓</span>';
            toast.classList.remove('loading');
            toast.classList.add('show', 'move-success');
            setTimeout(function() { 
              toast.classList.remove('show', 'move-success'); 
            }, 2500);
          }
          
          function formatBytes(bytes) {
            if (bytes === 0) return '0 B';
            var k = 1024;
            var sizes = ['B', 'KB', 'MB', 'GB'];
            var i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 10) / 10 + ' ' + sizes[i];
          }
          
          function formatDate(dateString) {
            var date = new Date(dateString);
            var now = new Date();
            var diff = now - date;
            
            if (diff < 60000) return 'Just now';
            if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
            if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
            if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
            
            return date.toLocaleDateString();
          }
          
          function getFileIcon(contentType) {
            if (contentType.startsWith('image/')) return '🖼️';
            if (contentType.startsWith('video/')) return '🎬';
            if (contentType.startsWith('audio/')) return '🎵';
            if (contentType === 'application/pdf') return '📄';
            if (contentType.includes('spreadsheet') || contentType.includes('excel')) return '📊';
            if (contentType.includes('document') || contentType.includes('word')) return '📝';
            if (contentType.includes('zip') || contentType.includes('compressed')) return '📦';
            return '📎';
          }
          
          function getFileKind(contentType) {
            if (contentType.startsWith('image/')) return 'Image';
            if (contentType.startsWith('video/')) return 'Video';
            if (contentType.startsWith('audio/')) return 'Audio';
            if (contentType === 'application/pdf') return 'PDF';
            if (contentType.includes('spreadsheet') || contentType.includes('excel')) return 'Spreadsheet';
            if (contentType.includes('document') || contentType.includes('word')) return 'Document';
            if (contentType.includes('zip') || contentType.includes('compressed')) return 'Archive';
            if (contentType.includes('json')) return 'JSON';
            if (contentType.includes('javascript')) return 'JavaScript';
            if (contentType.includes('html')) return 'HTML';
            if (contentType.includes('css')) return 'CSS';
            if (contentType.startsWith('text/')) return 'Text';
            return 'File';
          }
          
          function buildFolderTree(folders) {
            var tree = { '/': { name: 'Home', children: {}, path: '/' } };
            
            folders.forEach(function(path) {
              if (path === '/') return;
              var parts = path.split('/').filter(Boolean);
              var current = tree['/'];
              var currentPath = '';
              
              parts.forEach(function(part) {
                currentPath += '/' + part;
                if (!current.children[part]) {
                  current.children[part] = { name: part, children: {}, path: currentPath };
                }
                current = current.children[part];
              });
            });
            
            return tree;
          }
          
          function renderFolderTree(node, depth) {
            var isActive = node.path === currentFolder;
            var hasChildren = Object.keys(node.children).length > 0;
            var indent = depth * 16;
            var isRoot = node.path === '/';
            
            var html = '<div class="folder-tree-item' + (isActive ? ' active' : '') + '" data-path="' + node.path + '" style="padding-left: ' + (12 + indent) + 'px;"' + (isRoot ? '' : ' draggable="true"') + '>';
            html += '<span class="folder-tree-icon">' + (hasChildren ? '📂' : '📁') + '</span>';
            html += '<span class="folder-tree-name" data-path="' + node.path + '">' + node.name + '</span>';
            if (!isRoot) {
              html += '<span class="folder-tree-actions">';
              html += '<button class="folder-action-btn" data-action="delete" data-path="' + node.path + '" title="Delete folder">🗑</button>';
              html += '</span>';
            }
            html += '</div>';
            
            Object.keys(node.children).sort().forEach(function(key) {
              html += renderFolderTree(node.children[key], depth + 1);
            });
            
            return html;
          }
          
          function updateFolderTree() {
            var allFoldersWithEmpty = allFolders.slice();
            emptyFolders.forEach(function(f) {
              if (allFoldersWithEmpty.indexOf(f) === -1) {
                allFoldersWithEmpty.push(f);
              }
            });
            allFoldersWithEmpty.sort();
            
            var tree = buildFolderTree(allFoldersWithEmpty);
            folderTree.innerHTML = renderFolderTree(tree['/'], 0);
            
            folderTree.querySelectorAll('.folder-tree-item').forEach(function(item) {
              var itemPath = item.dataset.path;
              var isRoot = itemPath === '/';
              
              item.onclick = function(e) {
                if (e.target.classList.contains('folder-tree-name')) return; // Let name handle its own click
                currentFolder = itemPath;
                loadFiles();
              };
              
              // Folder drag start (not root)
              if (!isRoot) {
                item.ondragstart = function(e) {
                  e.stopPropagation();
                  draggedFolderPath = itemPath;
                  draggedKeys = []; // Clear file drag
                  e.dataTransfer.setData('text/plain', 'folder:' + itemPath);
                  e.dataTransfer.effectAllowed = 'move';
                  item.classList.add('dragging');
                  
                  setTimeout(function() {
                    document.querySelectorAll('.folder-tree-item').forEach(function(f) {
                      var fPath = f.dataset.path;
                      // Can't drop onto itself or its children
                      if (fPath !== itemPath && !fPath.startsWith(itemPath + '/')) {
                        // Also can't drop into current parent
                        var parentPath = itemPath.substring(0, itemPath.lastIndexOf('/')) || '/';
                        if (fPath !== parentPath) {
                          f.classList.add('can-drop');
                        }
                      }
                    });
                  }, 0);
                };
                
                item.ondragend = function() {
                  item.classList.remove('dragging');
                  draggedFolderPath = null;
                  document.querySelectorAll('.folder-tree-item').forEach(function(f) {
                    f.classList.remove('can-drop');
                    f.classList.remove('drop-target');
                  });
                };
              }
              
              // Drop target for drag and drop
              item.ondragover = function(e) {
                e.preventDefault();
                var targetPath = item.dataset.path;
                
                // For folder drag, check valid drop target
                if (draggedFolderPath) {
                  var parentPath = draggedFolderPath.substring(0, draggedFolderPath.lastIndexOf('/')) || '/';
                  if (targetPath === draggedFolderPath || targetPath.startsWith(draggedFolderPath + '/') || targetPath === parentPath) {
                    return; // Invalid drop target
                  }
                }
                item.classList.add('drop-target');
              };
              item.ondragleave = function() {
                item.classList.remove('drop-target');
              };
              item.ondrop = function(e) {
                e.preventDefault();
                item.classList.remove('drop-target');
                var targetFolder = item.dataset.path;
                
                // Check if it's a folder drag
                if (draggedFolderPath) {
                  var parentPath = draggedFolderPath.substring(0, draggedFolderPath.lastIndexOf('/')) || '/';
                  if (targetFolder !== draggedFolderPath && !targetFolder.startsWith(draggedFolderPath + '/') && targetFolder !== parentPath) {
                    moveFolderToDestination(draggedFolderPath, targetFolder);
                  }
                  draggedFolderPath = null;
                } else if (draggedKeys.length > 0) {
                  // File drag
                  moveFilesToFolder(draggedKeys, targetFolder);
                }
              };
            });
            
            // Double-click on folder name to rename, single-click to navigate
            folderTree.querySelectorAll('.folder-tree-name').forEach(function(nameEl) {
              var folderPath = nameEl.getAttribute('data-path');
              var clickTimer = null;
              
              nameEl.onclick = function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                if (clickTimer) {
                  // Double click detected
                  clearTimeout(clickTimer);
                  clickTimer = null;
                  if (folderPath && folderPath !== '/') {
                    startFolderRename(nameEl, folderPath);
                  }
                } else {
                  // Wait to see if it's a double click
                  clickTimer = setTimeout(function() {
                    clickTimer = null;
                    if (folderPath) {
                      currentFolder = folderPath;
                      loadFiles();
                    }
                  }, 250);
                }
              };
            });
            
            // Folder action buttons (delete only)
            folderTree.querySelectorAll('.folder-action-btn').forEach(function(btn) {
              btn.onclick = function(e) {
                e.stopPropagation();
                e.preventDefault();
                var action = btn.dataset.action;
                var folderPath = btn.dataset.path;
                
                if (action === 'delete') {
                  deleteFolder(folderPath);
                }
              };
            });
          }
          
          function startFolderRename(nameEl, folderPath) {
            if (!folderPath || folderPath === '/') return;
            var currentName = folderPath.split('/').filter(Boolean).pop();
            if (!currentName) return;
            var parentPath = folderPath.substring(0, folderPath.lastIndexOf('/')) || '/';
            
            var input = document.createElement('input');
            input.type = 'text';
            input.className = 'folder-rename-input';
            input.value = currentName;
            
            nameEl.style.display = 'none';
            nameEl.parentNode.insertBefore(input, nameEl.nextSibling);
            input.focus();
            input.select();
            
            var saving = false;
            
            function save() {
              if (saving) return;
              var newName = input.value.trim();
              
              if (!newName || newName === currentName) {
                cancel();
                return;
              }
              
              var validName = /^[a-zA-Z0-9_ .-]+$/;
              if (!validName.test(newName)) {
                showToast('Invalid folder name');
                input.focus();
                return;
              }
              
              saving = true;
              input.disabled = true;
              
              var newPath = parentPath === '/' ? '/' + newName : parentPath + '/' + newName;
              
              // Check if folder already exists
              var allFoldersWithEmpty = allFolders.slice();
              emptyFolders.forEach(function(f) {
                if (allFoldersWithEmpty.indexOf(f) === -1) allFoldersWithEmpty.push(f);
              });
              
              if (allFoldersWithEmpty.indexOf(newPath) !== -1) {
                showToast('Folder already exists');
                saving = false;
                input.disabled = false;
                input.focus();
                return;
              }
              
              renameFolder(folderPath, newPath).then(function() {
                cancel();
                if (currentFolder === folderPath || currentFolder.startsWith(folderPath + '/')) {
                  currentFolder = currentFolder.replace(folderPath, newPath);
                }
                loadFiles();
                showToast('Folder renamed');
              }).catch(function() {
                showToast('Failed to rename folder');
                saving = false;
                input.disabled = false;
                input.focus();
              });
            }
            
            function cancel() {
              input.remove();
              nameEl.style.display = '';
            }
            
            input.onblur = function() {
              setTimeout(function() { 
                if (!saving && document.body.contains(input)) {
                  save();
                }
              }, 200);
            };
            
            input.onkeydown = function(e) {
              if (e.key === 'Enter') { e.preventDefault(); save(); }
              else if (e.key === 'Escape') { cancel(); }
            };
            
            input.onclick = function(e) { e.stopPropagation(); };
          }
          
          function renameFolder(oldPath, newPath) {
            // Update all files in this folder and subfolders
            var filesToUpdate = window._allFiles.filter(function(f) {
              return f.folder === oldPath || (f.folder && f.folder.startsWith(oldPath + '/'));
            });
            
            // Update empty folders list
            var idx = emptyFolders.indexOf(oldPath);
            if (idx !== -1) {
              emptyFolders[idx] = newPath;
              localStorage.setItem('emptyFolders', JSON.stringify(emptyFolders));
            }
            
            // Update subfolders in emptyFolders
            emptyFolders = emptyFolders.map(function(f) {
              if (f.startsWith(oldPath + '/')) {
                return f.replace(oldPath, newPath);
              }
              return f;
            });
            localStorage.setItem('emptyFolders', JSON.stringify(emptyFolders));
            
            if (filesToUpdate.length === 0) {
              return Promise.resolve();
            }
            
            var promises = filesToUpdate.map(function(file) {
              var newFolder = file.folder === oldPath ? newPath : file.folder.replace(oldPath, newPath);
              return fetch('/api/files/move/' + file.key, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder: newFolder })
              });
            });
            
            return Promise.all(promises);
          }
          
          function moveFolderToDestination(folderPath, destPath) {
            showLoadingToast('Moving folder...');
            
            fetch('/api/files/folders/move', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ oldPath: folderPath, newPath: destPath })
            }).then(function(res) {
              return res.json();
            }).then(function(data) {
              if (data.error) throw new Error(data.error);
              
              // Update empty folders in localStorage
              var folderName = folderPath.split('/').filter(Boolean).pop();
              var newFolderPath = destPath === '/' ? '/' + folderName : destPath + '/' + folderName;
              
              // Update emptyFolders
              emptyFolders = emptyFolders.map(function(f) {
                if (f === folderPath) {
                  return newFolderPath;
                }
                if (f.startsWith(folderPath + '/')) {
                  return f.replace(folderPath, newFolderPath);
                }
                return f;
              });
              localStorage.setItem('emptyFolders', JSON.stringify(emptyFolders));
              
              // Update currentFolder if we're in the moved folder
              if (currentFolder === folderPath) {
                currentFolder = newFolderPath;
              } else if (currentFolder.startsWith(folderPath + '/')) {
                currentFolder = currentFolder.replace(folderPath, newFolderPath);
              }
              
              showToast('Folder moved');
              loadFiles();
            }).catch(function(err) {
              showToast(err.message || 'Failed to move folder');
            });
          }
          
          function deleteFolder(folderPath) {
            if (folderPath === '/') {
              showToast('Cannot delete home folder');
              return;
            }
            
            var folderName = folderPath.split('/').filter(Boolean).pop();
            
            // Count files in folder
            var filesInFolder = (window._allFiles || []).filter(function(f) {
              return f.folder === folderPath || (f.folder && f.folder.startsWith(folderPath + '/'));
            });
            
            var msg = 'Delete folder "' + folderName + '"?';
            if (filesInFolder.length > 0) {
              msg += '\\n\\nThis will also delete ' + filesInFolder.length + ' file(s) inside.';
            }
            
            if (!window.confirm(msg)) return;
            
            showLoadingToast('Deleting folder...');
            
            // Encode each path segment to handle spaces/special chars
            var encodedPath = folderPath.split('/').map(function(seg) {
              return encodeURIComponent(seg);
            }).join('/');
            
            fetch('/api/files/folders' + encodedPath, {
              method: 'DELETE'
            }).then(function(res) {
              return res.json();
            }).then(function(data) {
              if (data.error) throw new Error(data.error);
              
              // Remove from emptyFolders
              emptyFolders = emptyFolders.filter(function(f) {
                return f !== folderPath && !f.startsWith(folderPath + '/');
              });
              localStorage.setItem('emptyFolders', JSON.stringify(emptyFolders));
              
              // Navigate away if we're in the deleted folder
              if (currentFolder === folderPath || currentFolder.startsWith(folderPath + '/')) {
                var parentPath = folderPath.substring(0, folderPath.lastIndexOf('/')) || '/';
                currentFolder = parentPath;
              }
              
              showToast('Folder deleted');
              loadFiles();
              loadStats();
            }).catch(function(err) {
              showToast(err.message || 'Failed to delete folder');
            });
          }
          
          function moveFilesToFolder(keys, targetFolder) {
            if (keys.length === 0) return;
            
            showLoadingToast('Moving ' + keys.length + ' file' + (keys.length > 1 ? 's' : '') + '...');
            
            var promises = keys.map(function(key) {
              return fetch('/api/files/move/' + key, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder: targetFolder })
              });
            });
            
            Promise.all(promises).then(function() {
              selectedFiles.clear();
              draggedKeys = [];
              showMoveToast(keys.length);
              loadFiles();
            }).catch(function() {
              showToast('Failed to move some files');
            });
          }
          
          function toggleSelect(key, e) {
            if (e && e.shiftKey && selectedFiles.size > 0) {
              // Shift-click: select range (simplified - just add to selection)
              if (selectedFiles.has(key)) {
                selectedFiles.delete(key);
              } else {
                selectedFiles.add(key);
              }
            } else if (e && (e.ctrlKey || e.metaKey)) {
              // Ctrl/Cmd-click: toggle selection
              if (selectedFiles.has(key)) {
                selectedFiles.delete(key);
              } else {
                selectedFiles.add(key);
              }
            } else {
              // Regular click: select only this one
              selectedFiles.clear();
              selectedFiles.add(key);
            }
            updateSelectionUI();
          }
          
          function updateSelectionUI() {
            var allChecked = true;
            var anyChecked = false;
            document.querySelectorAll('.file-item').forEach(function(item) {
              var key = item.dataset.key;
              var checkbox = item.querySelector('.file-select-checkbox input');
              if (selectedFiles.has(key)) {
                item.classList.add('selected');
                if (checkbox) checkbox.checked = true;
                anyChecked = true;
              } else {
                item.classList.remove('selected');
                if (checkbox) checkbox.checked = false;
                allChecked = false;
              }
            });
            
            var selectAllCheckbox = document.getElementById('select-all');
            if (selectAllCheckbox) {
              selectAllCheckbox.checked = anyChecked && allChecked;
              selectAllCheckbox.indeterminate = anyChecked && !allChecked;
            }
            
            // Show/hide bulk actions bar
            if (selectedFiles.size > 0) {
              bulkActions.style.display = 'flex';
              bulkCount.textContent = selectedFiles.size + ' selected';
            } else {
              bulkActions.style.display = 'none';
            }
          }
          
          function updateBreadcrumb() {
            var parts = currentFolder === '/' ? [] : currentFolder.split('/').filter(Boolean);
            var html = '<span class="breadcrumb-item' + (currentFolder === '/' ? ' active' : '') + '" data-path="/">Home</span>';
            var path = '';
            parts.forEach(function(part, i) {
              path += '/' + part;
              var isLast = i === parts.length - 1;
              html += '<span class="breadcrumb-sep">/</span>';
              html += '<span class="breadcrumb-item' + (isLast ? ' active' : '') + '" data-path="' + path + '">' + part + '</span>';
            });
            breadcrumb.innerHTML = html;
            
            breadcrumb.querySelectorAll('.breadcrumb-item:not(.active)').forEach(function(item) {
              item.onclick = function() {
                currentFolder = item.dataset.path;
                loadFiles();
              };
            });
          }
          
          function showPreview(file) {
            var url = '/api/files/preview/' + file.key;
            previewName.textContent = file.name;
            previewMeta.textContent = formatBytes(file.size) + ' · ' + file.contentType;
            previewDownload.href = '/api/files/download/' + file.key;
            
            if (file.contentType.startsWith('image/')) {
              previewBody.innerHTML = '<img src="' + url + '" alt="' + file.name + '" />';
            } else if (file.contentType === 'application/pdf') {
              previewBody.innerHTML = '<iframe src="' + url + '#toolbar=0"></iframe>';
            } else if (file.contentType.startsWith('video/')) {
              previewBody.innerHTML = '<video controls src="' + url + '"></video>';
            } else if (file.contentType.startsWith('audio/')) {
              previewBody.innerHTML = '<div class="audio-preview"><div class="audio-icon">🎵</div><audio controls src="' + url + '"></audio></div>';
            } else if (file.contentType.startsWith('text/')) {
              fetch(url).then(function(r) { return r.text(); }).then(function(text) {
                previewBody.innerHTML = '<pre>' + text.substring(0, 5000) + (text.length > 5000 ? '...' : '') + '</pre>';
              });
            } else {
              previewBody.innerHTML = '<div class="no-preview"><div class="file-icon">' + getFileIcon(file.contentType) + '</div><p>Preview not available</p></div>';
            }
            
            previewModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
          }
          
          function hidePreview() {
            previewModal.style.display = 'none';
            previewBody.innerHTML = '';
            document.body.style.overflow = '';
          }
          
          function showMoveModalMultiple(keys) {
            var allFoldersWithEmpty = allFolders.slice();
            emptyFolders.forEach(function(f) {
              if (allFoldersWithEmpty.indexOf(f) === -1) allFoldersWithEmpty.push(f);
            });
            
            moveFolderList.innerHTML = allFoldersWithEmpty.sort().map(function(f) {
              return '<div class="move-folder-item" data-folder="' + f + '">' +
                '<span class="folder-icon">📁</span>' + (f === '/' ? 'Home' : f) + '</div>';
            }).join('');
            
            moveFolderList.querySelectorAll('.move-folder-item').forEach(function(item) {
              item.onclick = function() {
                var targetFolder = item.dataset.folder;
                moveFilesToFolder(keys, targetFolder);
                hideMoveModal();
              };
            });
            
            moveModal.style.display = 'flex';
          }
          
          function hideMoveModal() {
            moveModal.style.display = 'none';
            movingFileKey = null;
          }
          
          function showInputModal(title, callback) {
            inputTitle.textContent = title;
            inputField.value = '';
            inputCallback = callback;
            inputModal.style.display = 'flex';
            setTimeout(function() { inputField.focus(); }, 100);
          }
          
          function hideInputModal() {
            inputModal.style.display = 'none';
            inputCallback = null;
          }
          
          inputCancel.onclick = hideInputModal;
          inputBackdrop.onclick = hideInputModal;
          inputConfirm.onclick = function() {
            if (inputCallback && inputField.value.trim()) {
              inputCallback(inputField.value.trim());
            }
            hideInputModal();
          };
          inputField.onkeydown = function(e) {
            if (e.key === 'Enter' && inputField.value.trim()) {
              if (inputCallback) inputCallback(inputField.value.trim());
              hideInputModal();
            } else if (e.key === 'Escape') {
              hideInputModal();
            }
          };
          
          previewClose.onclick = hidePreview;
          previewBackdrop.onclick = hidePreview;
          moveCancel.onclick = hideMoveModal;
          moveBackdrop.onclick = hideMoveModal;
          document.onkeydown = function(e) {
            if (e.key === 'Escape') {
              hidePreview();
              hideMoveModal();
              hideInputModal();
            }
          };
          
          function loadFiles() {
            updateBreadcrumb();
            
            // Clear selection when loading files (folder change or after actions)
            selectedFiles.clear();
            bulkActions.style.display = 'none';
            
            fetch('/api/files/list').then(function(res) { return res.json(); }).then(function(data) {
              allFolders = data.folders || ['/'];
              window._allFiles = data.files;
              
              // Clean up empty folders that now have files
              emptyFolders = emptyFolders.filter(function(f) {
                return allFolders.indexOf(f) === -1;
              });
              localStorage.setItem('emptyFolders', JSON.stringify(emptyFolders));
              
              updateFolderTree();
              
              // Get files in current folder only
              var filesInFolder = data.files.filter(function(f) { return (f.folder || '/') === currentFolder; });
              
              if (filesInFolder.length === 0) {
                filesList.innerHTML = '<div class="empty">This folder is empty</div>';
              } else {
                var html = '<div class="files-header">' +
                  '<span><input type="checkbox" id="select-all" title="Select all" /></span>' +
                  '<span>Name</span>' +
                  '<span>Kind</span>' +
                  '<span>Size</span>' +
                  '<span>Added</span>' +
                  '<span></span>' +
                  '</div>';
                filesInFolder.forEach(function(file) {
                  var globalIndex = data.files.indexOf(file);
                  var isSelected = selectedFiles.has(file.key);
                  html += '<div class="file-item' + (isSelected ? ' selected' : '') + '" data-index="' + globalIndex + '" data-key="' + file.key + '" draggable="true">' +
                    '<div class="file-select-checkbox"><input type="checkbox" ' + (isSelected ? 'checked' : '') + ' data-key="' + file.key + '" /></div>' +
                    '<div class="file-name-cell">' +
                    '<span class="file-icon">' + getFileIcon(file.contentType) + '</span>' +
                    '<span class="file-name" data-key="' + file.key + '" data-index="' + globalIndex + '" title="Click to rename">' + file.name + '</span>' +
                    (file.shared ? '<span class="shared-badge">Shared</span>' : '') +
                    '</div>' +
                    '<span class="file-kind">' + getFileKind(file.contentType) + '</span>' +
                    '<span class="file-size">' + formatBytes(file.size) + '</span>' +
                    '<span class="file-date">' + formatDate(file.uploadedAt) + '</span>' +
                    '<div class="file-actions">' +
                    '<button class="btn-action" data-key="' + file.key + '" data-action="move" title="Move">📁</button>' +
                    (file.shared 
                      ? '<button class="btn-action share" data-key="' + file.key + '" data-action="copy" title="Copy link">🔗</button><button class="btn-action delete" data-key="' + file.key + '" data-action="unshare" title="Stop sharing">✕</button>'
                      : '<button class="btn-action share" data-key="' + file.key + '" data-action="share" title="Share">↗</button>') +
                    '<a href="/api/files/download/' + file.key + '" download class="btn-action download" title="Download">⬇</a>' +
                    '<button class="btn-action delete" data-key="' + file.key + '" data-action="delete" title="Delete">🗑</button>' +
                    '</div></div>';
                });
                filesList.innerHTML = html;
              }
              
              window._files = data.files;
              
              // Event listeners - Drag and drop for files
              document.querySelectorAll('.file-item').forEach(function(item) {
                item.ondragstart = function(e) {
                  var key = item.dataset.key;
                  draggedFolderPath = null; // Clear folder drag
                  // If dragging a selected item, drag all selected. Otherwise just this one.
                  if (selectedFiles.has(key) && selectedFiles.size > 1) {
                    draggedKeys = Array.from(selectedFiles);
                  } else {
                    draggedKeys = [key];
                  }
                  e.dataTransfer.setData('text/plain', draggedKeys.join(','));
                  e.dataTransfer.effectAllowed = 'move';
                  item.classList.add('dragging');
                  
                  // Visual feedback
                  setTimeout(function() {
                    document.querySelectorAll('.folder-tree-item').forEach(function(f) {
                      f.classList.add('can-drop');
                    });
                  }, 0);
                };
                
                item.ondragend = function() {
                  item.classList.remove('dragging');
                  document.querySelectorAll('.folder-tree-item').forEach(function(f) {
                    f.classList.remove('can-drop');
                    f.classList.remove('drop-target');
                  });
                };
                
                // Click to select
                item.onclick = function(e) {
                  if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
                  if (e.target.classList.contains('file-name') || e.target.classList.contains('file-preview-thumb')) return;
                  toggleSelect(item.dataset.key, e);
                };
              });
              
              // Checkbox handling
              document.querySelectorAll('.file-select-checkbox input').forEach(function(cb) {
                cb.onclick = function(e) {
                  e.stopPropagation();
                  var key = cb.dataset.key;
                  if (cb.checked) {
                    selectedFiles.add(key);
                  } else {
                    selectedFiles.delete(key);
                  }
                  updateSelectionUI();
                };
              });
              
              // Click on file icon to preview
              document.querySelectorAll('.file-icon').forEach(function(el) {
                el.onclick = function(e) {
                  e.stopPropagation();
                  var item = el.closest('.file-item');
                  if (item) {
                    var index = parseInt(item.dataset.index);
                    showPreview(window._files[index]);
                  }
                };
                el.style.cursor = 'pointer';
              });
              
              document.querySelectorAll('.file-name').forEach(function(el) {
                el.onclick = function(e) {
                  e.stopPropagation();
                  startRename(el);
                };
              });
              
              // Select all checkbox
              var selectAllCheckbox = document.getElementById('select-all');
              if (selectAllCheckbox) {
                selectAllCheckbox.onclick = function(e) {
                  e.stopPropagation();
                  if (selectAllCheckbox.checked) {
                    filesInFolder.forEach(function(file) {
                      selectedFiles.add(file.key);
                    });
                  } else {
                    selectedFiles.clear();
                  }
                  updateSelectionUI();
                };
              }
              
              document.querySelectorAll('.btn-action').forEach(function(btn) {
                btn.onclick = function(e) {
                  e.stopPropagation();
                  var key = btn.dataset.key;
                  var action = btn.dataset.action;
                  
                  // Let download links work normally (they're <a> tags without data-action)
                  if (!action && btn.tagName === 'A') return;
                  e.preventDefault();
                  
                  if (action === 'move') {
                    if (selectedFiles.size > 0 && selectedFiles.has(key)) {
                      showMoveModalMultiple(Array.from(selectedFiles));
                    } else {
                      showMoveModalMultiple([key]);
                    }
                  } else if (action === 'share') {
                    showLoadingToast('Creating share link...');
                    fetch('/api/files/share/' + key, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ shared: true })
                    }).then(function(res) {
                      if (res.ok) {
                        var shareUrl = window.location.origin + '/s/' + key;
                        navigator.clipboard.writeText(shareUrl);
                        showToast('Link copied to clipboard');
                        loadFiles();
                      }
                    }).catch(function() { 
                      showToast('Failed to share'); 
                    });
                  } else if (action === 'copy') {
                    var shareUrl = window.location.origin + '/s/' + key;
                    navigator.clipboard.writeText(shareUrl);
                    showToast('Link copied to clipboard');
                  } else if (action === 'unshare') {
                    showLoadingToast('Disabling share link...');
                    fetch('/api/files/share/' + key, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ shared: false })
                    }).then(function() { 
                      loadFiles(); 
                      showToast('Sharing disabled');
                    }).catch(function() { showToast('Failed to unshare'); });
                  } else if (action === 'delete') {
                    if (!window.confirm('Delete this file?')) return;
                    fetch('/api/files/' + key, { method: 'DELETE' })
                      .then(function() { loadFiles(); loadStats(); })
                      .catch(function() { showToast('Failed to delete'); });
                  }
                };
              });
            }).catch(function() {
              filesList.innerHTML = '<div class="empty">Failed to load files</div>';
            });
          }
          
          function startRename(el) {
            var key = el.dataset.key;
            var index = parseInt(el.dataset.index);
            var currentName = window._files[index].name;
            
            var input = document.createElement('input');
            input.type = 'text';
            input.className = 'rename-input';
            input.value = currentName;
            
            el.style.display = 'none';
            el.parentNode.insertBefore(input, el);
            input.focus();
            input.select();
            
            var saving = false;
            
            function save() {
              if (saving) return;
              var newName = input.value.trim();
              
              if (!newName || newName === currentName) {
                cancel();
                return;
              }
              
              var validName = /^[a-zA-Z0-9_ .-]+$/;
              if (!validName.test(newName)) {
                showToast('Invalid name');
                input.focus();
                return;
              }
              
              saving = true;
              input.disabled = true;
              
              fetch('/api/files/rename/' + key, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName })
              }).then(function(res) { return res.json(); }).then(function(data) {
                if (data.error) throw new Error(data.error);
                window._files[index].name = newName;
                el.textContent = newName;
                cancel();
              }).catch(function(err) {
                showToast(err.message || 'Rename failed');
                saving = false;
                input.disabled = false;
                input.focus();
              });
            }
            
            function cancel() {
              input.remove();
              el.style.display = '';
            }
            
            input.onblur = function() {
              setTimeout(function() { if (!saving) save(); }, 100);
            };
            
            input.onkeydown = function(e) {
              if (e.key === 'Enter') { e.preventDefault(); save(); }
              else if (e.key === 'Escape') { cancel(); }
            };
          }
          
          newFolderBtn.onclick = function() {
            showInputModal('New folder name', function(name) {
              var validName = /^[a-zA-Z0-9_ .-]+$/;
              if (!validName.test(name)) {
                showToast('Invalid folder name');
                return;
              }
              
              var newPath = currentFolder === '/' ? '/' + name : currentFolder + '/' + name;
              
              var allFoldersWithEmpty = allFolders.slice();
              emptyFolders.forEach(function(f) {
                if (allFoldersWithEmpty.indexOf(f) === -1) allFoldersWithEmpty.push(f);
              });
              
              if (allFoldersWithEmpty.indexOf(newPath) !== -1) {
                showToast('Folder already exists');
                return;
              }
              
              emptyFolders.push(newPath);
              localStorage.setItem('emptyFolders', JSON.stringify(emptyFolders));
              currentFolder = newPath;
              loadFiles();
              showToast('Folder created: ' + name);
            });
          };
          
          // Bulk action handlers
          document.getElementById('bulk-move').onclick = function() {
            if (selectedFiles.size === 0) return;
            showMoveModalMultiple(Array.from(selectedFiles));
          };
          
          document.getElementById('bulk-download').onclick = async function() {
            if (selectedFiles.size === 0) return;
            var keys = Array.from(selectedFiles);
            
            // Single file - direct download
            if (keys.length === 1) {
              var a = document.createElement('a');
              a.href = '/api/files/download/' + keys[0];
              a.download = '';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              return;
            }
            
            // Multiple files - zip them
            showLoadingToast('Preparing ' + keys.length + ' files for download...');
            
            try {
              // Load JSZip if not loaded
              if (!window.JSZip) {
                await new Promise(function(resolve, reject) {
                  var script = document.createElement('script');
                  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
                  script.onload = resolve;
                  script.onerror = reject;
                  document.head.appendChild(script);
                });
              }
              
              // Get file info for selected keys
              var selectedFileInfo = keys.map(function(key) {
                return window._allFiles.find(function(f) { return f.key === key; });
              }).filter(Boolean);
              
              console.log('Creating zip for', selectedFileInfo.length, 'files');
              
              var zip = new window.JSZip();
              
              // Fetch all files and add to zip
              for (var i = 0; i < selectedFileInfo.length; i++) {
                var file = selectedFileInfo[i];
                console.log('Fetching:', file.name);
                var response = await fetch('/api/files/download/' + file.key);
                var blob = await response.blob();
                zip.file(file.name, blob);
                console.log('Added to zip:', file.name);
              }
              
              console.log('Generating zip...');
              var zipBlob = await zip.generateAsync({ type: 'blob' });
              console.log('Zip generated, size:', zipBlob.size);
              
              // Trigger download using saveAs pattern
              var url = URL.createObjectURL(zipBlob);
              
              // Try using msSaveBlob for IE/Edge, otherwise use link
              if (window.navigator && window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(zipBlob, 'flarebox-download.zip');
              } else {
                var a = document.createElement('a');
                a.href = url;
                a.download = 'flarebox-download.zip';
                // Use dispatchEvent instead of click() for better browser support
                var clickEvent = new MouseEvent('click', {
                  view: window,
                  bubbles: true,
                  cancelable: false
                });
                a.dispatchEvent(clickEvent);
              }
              
              showToast(keys.length + ' files downloaded as zip');
              
              // Cleanup after delay
              setTimeout(function() {
                URL.revokeObjectURL(url);
              }, 5000);
              
            } catch (err) {
              console.error('Zip error:', err);
              showToast('Failed to create zip: ' + err.message);
            }
          };
          
          document.getElementById('bulk-delete').onclick = function() {
            if (selectedFiles.size === 0) return;
            var count = selectedFiles.size;
            if (!window.confirm('Delete ' + count + ' file(s)? This cannot be undone.')) return;
            
            showLoadingToast('Deleting ' + count + ' file(s)...');
            var keys = Array.from(selectedFiles);
            Promise.all(keys.map(function(key) {
              return fetch('/api/files/' + key, { method: 'DELETE' });
            })).then(function() {
              selectedFiles.clear();
              showToast(count + ' file(s) deleted');
              loadFiles();
              loadStats();
            }).catch(function() {
              showToast('Some files failed to delete');
              loadFiles();
            });
          };
          
          document.getElementById('bulk-clear').onclick = function() {
            selectedFiles.clear();
            updateSelectionUI();
          };
          
          var DIRECT_UPLOAD_LIMIT = 50 * 1024 * 1024; // 50MB
          
          function uploadFile(file) {
            // Use presigned URL for large files
            if (file.size > DIRECT_UPLOAD_LIMIT) {
              return uploadLargeFile(file);
            }
            
            // Direct upload for small files
            return new Promise(function(resolve, reject) {
              var xhr = new XMLHttpRequest();
              var formData = new FormData();
              formData.append('file', file);
              formData.append('folder', currentFolder);
              
              xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                  updateProgress(file, e.loaded);
                }
              };
              
              xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                  resolve(JSON.parse(xhr.responseText));
                } else {
                  reject(new Error('Upload failed'));
                }
              };
              xhr.onerror = function() { reject(new Error('Upload failed')); };
              
              xhr.open('POST', '/api/files/upload');
              xhr.send(formData);
            });
          }
          
          function uploadLargeFile(file) {
            // Step 1: Get presigned URL (includes metadata headers)
            return fetch('/api/files/upload-url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                filename: file.name,
                contentType: file.type || 'application/octet-stream',
                folder: currentFolder
              })
            })
            .then(function(res) {
              if (!res.ok) throw new Error('Failed to get upload URL');
              return res.json();
            })
            .then(function(data) {
              // Step 2: Upload directly to R2 with metadata headers via XHR for progress
              return new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest();
                
                xhr.upload.onprogress = function(e) {
                  if (e.lengthComputable) {
                    updateProgress(file, e.loaded);
                  }
                };
                
                xhr.onload = function() {
                  if (xhr.status >= 200 && xhr.status < 300) {
                    resolve({ key: data.key, name: file.name, folder: data.folder });
                  } else {
                    reject(new Error('Direct upload failed'));
                  }
                };
                xhr.onerror = function() { reject(new Error('Direct upload failed')); };
                
                xhr.open('PUT', data.uploadUrl);
                // Set the required headers from presigned URL
                Object.keys(data.headers).forEach(function(key) {
                  xhr.setRequestHeader(key, data.headers[key]);
                });
                xhr.send(file);
              });
            });
          }
          
          function processUploadQueue() {
            if (uploading || uploadQueue.length === 0) return;
            
            uploading = true;
            
            // Initialize progress tracking
            totalBytes = uploadQueue.reduce(function(sum, file) { return sum + file.size; }, 0);
            fileProgress = {};
            
            uploadProgress.style.display = 'block';
            uploadProgress.querySelector('.upload-progress-fill').style.width = '0%';
            uploadProgress.querySelector('.upload-progress-text').textContent = '0% - Uploading ' + uploadQueue.length + ' file(s)...';
            
            Promise.all(uploadQueue.map(uploadFile)).then(function() {
              uploadQueue = [];
              // Remove from empty folders if we just uploaded
              var idx = emptyFolders.indexOf(currentFolder);
              if (idx !== -1) {
                emptyFolders.splice(idx, 1);
                localStorage.setItem('emptyFolders', JSON.stringify(emptyFolders));
              }
              loadFiles();
              loadStats();
            }).catch(function() {
              showToast('Some uploads failed');
            }).finally(function() {
              uploading = false;
              uploadProgress.style.display = 'none';
              // Reset progress tracking
              totalBytes = 0;
              fileProgress = {};
            });
          }
          
          uploadZone.onclick = function() { fileInput.click(); };
          
          uploadZone.ondragover = function(e) {
            e.preventDefault();
            uploadZone.classList.add('dragover');
          };
          
          uploadZone.ondragleave = function() {
            uploadZone.classList.remove('dragover');
          };
          
          uploadZone.ondrop = function(e) {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            uploadQueue.push.apply(uploadQueue, Array.from(e.dataTransfer.files));
            processUploadQueue();
          };
          
          fileInput.onchange = function() {
            uploadQueue.push.apply(uploadQueue, Array.from(fileInput.files));
            fileInput.value = '';
            processUploadQueue();
          };
          
          logoutBtn.onclick = function() {
            fetch('/api/auth/logout', { method: 'POST' }).then(function() {
              window.location.href = '/login';
            });
          };
          
          loadFiles();
          loadStats();
          
          // Mobile menu toggle
          var menuToggle = document.getElementById('menu-toggle');
          var sidebarBackdrop = document.getElementById('sidebar-backdrop');
          
          function openSidebar() {
            sidebar.classList.add('open');
            sidebarBackdrop.classList.add('show');
            document.body.style.overflow = 'hidden';
          }
          
          function closeSidebar() {
            sidebar.classList.remove('open');
            sidebarBackdrop.classList.remove('show');
            document.body.style.overflow = '';
          }
          
          menuToggle.onclick = openSidebar;
          sidebarBackdrop.onclick = closeSidebar;
          
          // Close sidebar when navigating on mobile
          var originalFolderTreeClick = folderTree.onclick;
          folderTree.onclick = function(e) {
            if (window.innerWidth <= 768) {
              closeSidebar();
            }
          };
          
          // Mobile nav handlers
          var mobileDrawer = document.getElementById('mobile-drawer');
          var drawerPanel = document.getElementById('drawer-panel');
          var drawerBackdrop = document.getElementById('drawer-backdrop');
          var drawerFolders = document.getElementById('drawer-folders');
          var drawerStats = document.getElementById('drawer-stats');
          var navFolders = document.getElementById('nav-folders');
          var navHome = document.getElementById('nav-home');
          var navUpload = document.getElementById('nav-upload');
          var navLogout = document.getElementById('nav-logout');
          var drawerClose = document.getElementById('drawer-close');
          var drawerNewFolder = document.getElementById('drawer-new-folder');
          
          function openDrawer() {
            mobileDrawer.style.display = 'block';
            setTimeout(function() {
              drawerBackdrop.style.opacity = '1';
              drawerPanel.style.transform = 'translateX(0)';
            }, 10);
            updateDrawerFolders();
            // Update drawer stats
            fetch('/api/files/stats').then(function(r) { return r.json(); }).then(function(data) {
              drawerStats.textContent = data.totalFiles + ' files · ' + formatBytes(data.totalSize);
            });
          }
          
          function closeDrawer() {
            drawerBackdrop.style.opacity = '0';
            drawerPanel.style.transform = 'translateX(-100%)';
            setTimeout(function() {
              mobileDrawer.style.display = 'none';
            }, 300);
          }
          
          function updateDrawerFolders() {
            var allFoldersWithEmpty = allFolders.slice();
            emptyFolders.forEach(function(f) {
              if (allFoldersWithEmpty.indexOf(f) === -1) allFoldersWithEmpty.push(f);
            });
            allFoldersWithEmpty.sort();
            
            drawerFolders.innerHTML = allFoldersWithEmpty.map(function(f) {
              var name = f === '/' ? 'Home' : f.split('/').filter(Boolean).pop();
              var isActive = f === currentFolder;
              return '<button class="drawer-folder-item' + (isActive ? ' active' : '') + '" data-path="' + f + '">' +
                '<span class="drawer-folder-icon">' + (f === '/' ? '🏠' : '📁') + '</span>' +
                '<span class="drawer-folder-name">' + name + '</span>' +
                (isActive ? '<span class="drawer-folder-active-indicator"></span>' : '') +
                '</button>';
            }).join('');
            
            drawerFolders.querySelectorAll('.drawer-folder-item').forEach(function(btn) {
              btn.onclick = function() {
                currentFolder = btn.dataset.path;
                closeDrawer();
                loadFiles();
              };
            });
          }
          
          navFolders.onclick = openDrawer;
          navHome.onclick = function() {
            currentFolder = '/';
            loadFiles();
          };
          navUpload.onclick = function() { fileInput.click(); };
          navLogout.onclick = function() { logoutBtn.click(); };
          drawerClose.onclick = closeDrawer;
          drawerBackdrop.onclick = closeDrawer;
          drawerNewFolder.onclick = function() {
            closeDrawer();
            newFolderBtn.click();
          };
        })();
      ` }} />
    </div>
  )
}
