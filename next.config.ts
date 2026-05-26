import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/sobre-nosotros',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
