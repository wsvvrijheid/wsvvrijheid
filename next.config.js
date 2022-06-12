const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  images: {
    loader: 'default',
    domains: [
      'localhost',
      '127.0.0.1',
      'picsum.photos',
      'images.unsplash.com',
      'api.samenvvv.nl',
      'wsvvrijheid.nl',
      'vercel.app',
      'wsvvrijheid.vercel.app',
      'media.istockphoto.com',
      'pbs.twimg.com',
      'unsplash.it',
    ],
  },
}

module.exports = nextConfig
