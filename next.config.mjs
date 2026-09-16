/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
