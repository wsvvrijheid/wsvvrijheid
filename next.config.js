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
      'samenvvv.nl',
      'media.istockphoto.com',
      'pbs.twimg.com',
      'unsplash.it',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/tr/hakkimizda',
        destination: '/tr/about-us',
        locale: false,
      },
      {
        source: '/nl/over-ons',
        destination: '/nl/about-us',
        locale: false,
      },
      {
        source: '/tr/gonulluler',
        destination: '/tr/volunteers',
        locale: false,
      },
      {
        source: '/nl/vrijwilligers',
        destination: '/en/volunteers',
        locale: false,
      },
      {
        source: '/tr/aktiviteler',
        destination: '/tr/activities',
        locale: false,
      },
      {
        source: '/nl/activiteiten',
        destination: '/en/activities',
        locale: false,
      },
      {
        source: '/tr/kulup',
        destination: '/tr/club',
        locale: false,
      },
      {
        source: '/tr/gizlilik',
        destination: '/tr/privacy',
        locale: false,
      },
      {
        source: '/tr/kullanim-sartlari',
        destination: '/tr/terms',
        locale: false,
      },
      {
        source: '/nl/voorwaarden',
        destination: '/nl/terms',
        locale: false,
      },
      {
        source: '/tr/iletisim',
        destination: '/tr/contact',
        locale: false,
      },
      {
        source: '/nl/projecten',
        destination: '/nl/projects',
        locale: false,
      },
      {
        source: '/tr/projeler',
        destination: '/tr/projects',
        locale: false,
      },
      {
        source: '/nl/doneren',
        destination: '/nl/donate',
        locale: false,
      },
      {
        source: '/tr/bagis',
        destination: '/tr/donate',
        locale: false,
      },
      {
        source: '/nl/activiteiten',
        destination: '/nl/activities',
        locale: false,
      },
      {
        source: '/tr/faaliyetler',
        destination: '/tr/activities',
        locale: false,
      },
      {
        source: '/tr/uye-ol',
        destination: '/tr/sign-up',
        locale: false,
      },
      {
        source: '/nl/aanmelden',
        destination: '/nl/sign-up',
        locale: false,
      },
      {
        source: '/tr/giris-yap',
        destination: '/tr/giris-yap',
        locale: false,
      },
      {
        source: '/nl/log-in',
        destination: '/nl/log-in',
        locale: false,
      },
    ]
  },
}

module.exports = nextConfig
