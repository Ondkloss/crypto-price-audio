/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  trailingSlash: true,
  
  // Handle GitHub Pages subdirectory if needed
  basePath: process.env.NODE_ENV === 'production' ? '/crypto-price-audio' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/crypto-price-audio/' : '',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  assetPrefix: './',
}

module.exports = nextConfig
