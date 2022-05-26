import { ROUTES } from '~config'

const { activity, about, contact, donate, lotus, artStop, samenvvv, academy, terms, privacy, volunteer } = ROUTES

export const FOOTER_MENU = [
  {
    en: {
      label: 'Projects',
      children: [lotus.en, artStop.en, samenvvv.en, academy.en],
    },
    nl: {
      label: 'Projecten',
      children: [lotus.nl, artStop.nl, samenvvv.nl, academy.nl],
    },
    tr: {
      label: 'Projeler',
      children: [lotus.tr, artStop.tr, samenvvv.tr, academy.tr],
    },
  },
  {
    en: {
      label: 'Foundation',
      children: [about.en, contact.en, donate.en],
    },
    nl: {
      label: 'Stichting',
      children: [about.nl, contact.nl, donate.nl],
    },
    tr: {
      label: 'Vakıf',
      children: [about.tr, contact.tr, donate.tr],
    },
  },
  {
    en: {
      label: 'Menu',
      children: [activity.en, volunteer.en],
    },
    nl: {
      label: 'Menu',
      children: [activity.nl, volunteer.nl],
    },
    tr: {
      label: 'Menu',
      children: [activity.tr, volunteer.tr],
    },
  },
  {
    en: {
      label: 'Support',
      children: [terms.en, privacy.en],
    },
    nl: {
      label: 'Steun',
      children: [terms.nl, privacy.nl],
    },
    tr: {
      label: 'Destek',
      children: [terms.tr, privacy.tr],
    },
  },
]
