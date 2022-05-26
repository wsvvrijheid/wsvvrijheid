import { useQuery } from 'react-query'

import { request } from '~lib'

export const getArt = async (locale, slug) => {
  const response = await request({
    url: 'api/arts',
    filters: { slug: { $eq: slug } },
    populate: ['artist.user.avatar', 'categories', 'images'],
    locale,
  })

  return response.result?.[0] || null
}

export const useGetArt = (locale, slug) =>
  useQuery({
    queryKey: ['art', locale, slug],
    queryFn: () => getArt(locale, slug),
  })
