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
        <ViteClient />
        <Link href="/src/style.css" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
})
