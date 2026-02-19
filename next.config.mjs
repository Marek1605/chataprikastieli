import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chataprikastieli.sk',
      },
    ],
    // Fallback for missing images
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Suppress hydration warnings from browser extensions
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
