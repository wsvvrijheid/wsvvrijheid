import { useQuery } from 'react-query'

import { request } from '~lib'

export const getArtsByCategories = async (locale, categories, id) => {
  console.log('categories', categories)
  try {
    const response = await request({
      url: 'api/arts',
      locale,
      filters: {
        categories: { code: { $in: categories } },
        id: { $ne: id },
      },
      populate: ['artist.user.avatar', 'categories', 'images', 'likes'],
      sort: 'publishedAt:desc',
      pageSize: 4,
    })

    return response?.result || []
  } catch (error) {
    console.log('error.respons', error.respons)
  }
}

export const getArt = async (locale, slug) => {
  const response = await request({
    url: 'api/arts',
    filters: { slug: { $eq: slug } },
    populate: ['artist.user.avatar', 'categories', 'images'],
    locale,
  })

  const art = response.result?.[0]

  if (!art) return null

  const arts = await getArtsByCategories(
    locale,
    art.categories?.map(c => c.code),
    art.id,
  )

  return { ...art, arts }
}

export const useGetArt = (locale, slug) =>
  useQuery({
    queryKey: ['art', locale, slug],
    queryFn: () => getArt(locale, slug),
  })
