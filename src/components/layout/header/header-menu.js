import { ROUTES } from '~config'

const { activity, lotus, artStop, samenvvv, academy, blog, club, donate, volunteer, about, contact } = ROUTES

export const HEADER_MENU = [
  activity,
  {
    en: {
      label: ' Platforms',
      link: '/platforms',
      children: [lotus.en, artStop.en, samenvvv.en, academy.en],
    },
    nl: {
      label: ' Platforms',
      link: '/platforms',
      children: [lotus.nl, artStop.nl, samenvvv.nl, academy.nl],
    },
    tr: {
      label: ' Platformlar',
      link: '/platforms',
      children: [lotus.tr, artStop.tr, samenvvv.tr, academy.tr],
    },
  },
  blog,
  club,
  donate,
  {
    en: {
      label: 'Wsvvrijheid',
      link: '/',
      children: [volunteer.en, about.en, contact.en],
    },
    nl: {
      label: 'Wsvvrijheid',
      link: '/',
      children: [volunteer.nl, about.nl, contact.nl],
    },
    tr: {
      label: 'Wsvvrijheid',
      link: '/',
      children: [volunteer.tr, about.tr, contact.tr],
    },
  },
]
