/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    // Limite body (uploads images/vidéos/audio) — 250 Mo pour les vidéos
    serverActions: { bodySizeLimit: '250mb' },
  },
  async rewrites() {
    return [
      { source: '/uploads/:path*', destination: '/api/uploads/:path*' },
    ]
  },
}

module.exports = nextConfig
