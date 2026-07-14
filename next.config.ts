import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // ESLint прогоняется в CI и в pre-check перед деплоем — в Docker-сборке пропускаем,
  // чтобы не тратить время/память на 2GB-VPS. Типы Next проверяет как обычно.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Разрешаем SVG (логотипы спонсоров/партнёров часто в SVG). Санитайзим через
    // sandbox-CSP, чтобы SVG не выполнял скрипты.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    localPatterns: [
      { pathname: '/api/media/file/**' },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
