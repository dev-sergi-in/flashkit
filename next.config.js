/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'html2canvas': false,
      'dompurify': false,
      'canvg': false,
    }
    return config
  },
}

module.exports = nextConfig
