/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone', // Uncomment for production build only
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

module.exports = nextConfig
