import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function withCatalogToken(requestUrl: string, token: string): string {
  const qIndex = requestUrl.indexOf('?')
  const pathname = qIndex === -1 ? requestUrl : requestUrl.slice(0, qIndex)
  const search = qIndex === -1 ? '' : requestUrl.slice(qIndex + 1)
  const rest = pathname.replace(/^\/api\/site-catalog\/?/, '')
  const crmPath = rest
    ? `/api/feed-services/site/catalog/${rest}`
    : '/api/feed-services/site/catalog'
  const params = new URLSearchParams(search)
  if (token) params.set('token', token)
  const qs = params.toString()
  return qs ? `${crmPath}?${qs}` : crmPath
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const catalogToken = env.CRM_SITE_TOKEN || ''

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/api/site-catalog': {
          target: 'https://vkrysha-crm.ru',
          changeOrigin: true,
          secure: true,
          rewrite: (requestUrl) => withCatalogToken(requestUrl, catalogToken),
        },
        '/api': {
          target: 'https://vkrysha-crm.ru',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
