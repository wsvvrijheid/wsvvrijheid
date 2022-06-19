export const getDefaultSeo = locale => {
  const titleTemplate = {
    nl: '%s | Wees de Stem voor Vrijheid',
    tr: '%s | Wees de Stem voor Vrijheid',
    en: '%s | Wees de Stem voor Vrijheid',
  }

  const title = 'WSVVrijheid'

  const description = {
    nl: 'We werken eraan om ervoor te zorgen dat iedereen in gelijke mate profiteert van universele mensenrechten.',
    tr: 'Evrensel insan haklarından herkesin eşit şekilde faydalanması için çalışmalar yapıyoruz.',
    en: 'We work to ensure that everyone benefits from universal human rights equally.',
  }

  const twitter = {
    nl: '@wsvvrijheid',
    tr: '@wsvvrijheid',
    en: '@wsvvrijheid',
  }

  return {
    titleTemplate: titleTemplate[locale],
    description: description[locale],
    openGraph: {
      type: 'website',
      description: description[locale],
      locale: locale,
      url: 'https://wsvvrijheid.nl',
      site_name: 'wsvvrijheid.nl',
      images: [
        {
          url: process.env.NEXT_PUBLIC_SITE_URL + '/images/wsvvrijheid.jpg',
          width: 500,
          height: 500,
          alt: title,
          type: 'image/jpg',
          secureUrl: process.env.NEXT_PUBLIC_SITE_URL + '/images/wsvvrijheid.jpg',
        },
      ],
    },
    twitter: {
      handle: twitter[locale],
      site: twitter[locale],
      cardType: 'summary_large_image',
    },
  }
}
