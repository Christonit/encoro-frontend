/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'encoro.app',
      'encoro-assets.s3.amazonaws.com',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com'
    ],
  },
  // ... existing code ...
}

module.exports = nextConfig 