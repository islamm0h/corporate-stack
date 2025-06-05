/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  serverExternalPackages: ['@prisma/client', 'prisma']
}

module.exports = nextConfig
