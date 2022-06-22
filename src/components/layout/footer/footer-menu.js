import { ROUTES } from '~config'

const { activity, platform, about, club, contact, lotus, artStop, samenvvv, academy, terms, privacy, volunteer } =
  ROUTES

export const FOOTER_MENU = [
  {
    children: [lotus, artStop, samenvvv, academy],
    en: platform.en,
    nl: platform.nl,
    tr: platform.tr,
  },
  {
    children: [about, contact],
    en: 'Foundation',
    nl: 'Stichting',
    tr: 'Vakıf',
  },
  {
    children: [club, activity, volunteer],
    en: 'Menu',
    nl: 'Menu',
    tr: 'Menu',
  },
  {
    children: [terms, privacy],
    en: 'Support',
    nl: 'Steun',
    tr: 'Destek',
  },
]
