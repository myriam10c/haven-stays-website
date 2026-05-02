/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: '**.muscache.com' },
      { protocol: 'https', hostname: '**.airbnb.com' },
    ],
  },
}
module.exports = nextConfig
