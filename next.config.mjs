/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    distDir: process.env.PORTFOLIO_BUILD_DIR || '.next',
};

export default nextConfig;

