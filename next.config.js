
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
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
};

export default nextConfig;
