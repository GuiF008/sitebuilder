/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    // Limite 1MB par défaut : trop petit pour les images (on autorise 10MB)
    serverActions: { bodySizeLimit: '10mb' },
  },
  async rewrites() {
    return [
      { source: '/uploads/:path*', destination: '/api/uploads/:path*' },
    ]
  },
}

module.exports = nextConfig
