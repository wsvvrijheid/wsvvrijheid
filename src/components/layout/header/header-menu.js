import { ROUTES } from '~config'

const { activity, platform, lotus, artStop, samenvvv, academy, blog, club, donate, volunteer, about, contact } = ROUTES

export const HEADER_MENU = [
  activity,
  {
    link: platform.link,
    en: platform.en,
    nl: platform.nl,
    tr: platform.tr,
    children: [lotus, artStop, samenvvv, academy],
  },
  blog,
  club,
  donate,
  {
    link: '/',
    en: 'Wsvvrijheid',
    nl: 'Wsvvrijheid',
    tr: 'Wsvvrijheid',
    children: [volunteer, about, contact],
  },
]
