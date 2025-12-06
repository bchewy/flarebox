import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, ViteClient } from 'vite-ssr-components/hono'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <title>Flarebox</title>
        <meta name="description" content="Simple file storage powered by Cloudflare" />
        <meta name="theme-color" content="#f97316" />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📦</text></svg>" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flarebox.bchewy.com" />
        <meta property="og:title" content="Flarebox" />
        <meta property="og:description" content="Simple file storage powered by Cloudflare" />
        <meta property="og:image" content="https://flarebox.bchewy.com/og-image.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Flarebox" />
        <meta name="twitter:description" content="Simple file storage powered by Cloudflare" />
        <ViteClient />
        <Link href="/src/style.css" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
})
