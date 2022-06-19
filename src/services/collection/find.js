import { request } from '~lib'

export const getCollection = async (locale, slug) => {
  const response = await request({
    url: 'api/collections',
    filters: { slug: { $eq: slug } },
    populate: ['localizations', 'image', 'arts.images', 'arts.artist'],
    locale,
  })

  return response.result?.[0] || null
}
