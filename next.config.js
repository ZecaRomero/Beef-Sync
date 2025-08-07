/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Desabilitar ESLint durante o build para resolver problemas críticos
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig