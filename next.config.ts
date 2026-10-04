import type { NextConfig } from 'next'

const noindex = process.env.NEXT_PUBLIC_SITE_NOINDEX === 'true'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Next 16 exige declarar las calidades permitidas
    qualities: [60, 75, 85],
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  async headers() {
    if (!noindex) return []
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
  },
}

export default nextConfig
