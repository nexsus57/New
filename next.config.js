/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // CRITICAL: Generate a static site (HTML/CSS/JS) in the 'out' folder
  output: 'export',
  // CRITICAL: Disable server-side image optimization (requires a running server)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'file.garden',
      },
      {
        protocol: 'https',
        hostname: 'www.transparenttextures.com',
      },
    ],
  },
  env: {
    API_KEY: process.env.API_KEY,
  },
  trailingSlash: true,
};

export default nextConfig;