/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img1.mukewang.com'],
  }, 
}


const removeImports = require('next-remove-imports')();

module.exports = removeImports(nextConfig);
