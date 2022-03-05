import ROUTES from 'config/routes.json'

const { project, volunteer, donate, about, contact } = ROUTES

export const HEADER_MENU = [
  project,
  volunteer,
  donate,
  {
    en: {
      label: 'WSVV',
      children: [about.en, contact.en],
    },
    nl: {
      label: 'WSVV',
      children: [about.nl, contact.nl],
    },
    tr: {
      label: 'WSVV',
      children: [about.tr, contact.tr],
    },
  },
]
