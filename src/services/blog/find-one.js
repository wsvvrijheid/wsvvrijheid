import { useQuery } from 'react-query'

import { request } from '~lib'

export const getBlog = async (locale, slug) => {
  const response = await request({
    url: 'api/blogs',
    filters: { slug: { $eq: slug } },
    locale,
  })

  return response.result?.[0] || null
}

export const useGetBlog = (locale, slug) =>
  useQuery({
    queryKey: ['blog', locale, slug],
    queryFn: () => getBlog(locale, slug),
  })
