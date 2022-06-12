import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

import { request } from '~lib'

import { getArtComments } from './comments'

export const getArtsByCategories = async (locale, categories, id) => {
  const response = await request({
    url: 'api/arts',
    locale,
    filters: {
      categories: { code: { $in: categories } },
      id: { $ne: id },
    },
    populate: ['artist.user.avatar', 'categories', 'images', 'likers'],
    sort: 'publishedAt:desc',
    pageSize: 4,
  })

  return response?.result || []
}

export const getArt = async (locale, slug) => {
  const response = await request({
    url: 'api/arts',
    filters: { slug: { $eq: slug } },
    populate: ['artist.user.avatar', 'categories', 'images', 'localizations'],
    locale,
  })

  const art = response.result?.[0]

  if (!art) return null

  const arts = await getArtsByCategories(
    locale,
    art.categories?.map(c => c.code),
    art.id,
  )

  const comments = await getArtComments(art.id)
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/club/art/${art.slug}`

  return { ...art, arts, comments, url }
}

export const useGetArt = () => {
  const {
    locale,
    query: { slug },
  } = useRouter()
  return useQuery({
    queryKey: ['art', locale, slug],
    queryFn: () => getArt(locale, slug),
  })
}
