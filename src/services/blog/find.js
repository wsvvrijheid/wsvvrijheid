import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

import { request } from '~lib'

export const getBlogs = async locale =>
  await request({
    url: 'api/blogs',
    locale,
    sort: ['publishedAt:desc'],
  })

export const getAuthorBlogs = async (locale, authorID, blogId) => {
  const response = await request({
    url: 'api/blogs',
    filters: {
      $and: [{ author: { id: { $eq: authorID } } }, { id: { $ne: blogId } }],
    },
    sort: ['publishedAt:desc'],
    pageSize: 2,
    locale,
  })

  return response?.result || null
}

export const useGetBlogs = () => {
  const { locale } = useRouter()

  return useQuery({
    queryKey: ['blogs', locale],
    queryFn: () => getBlogs(locale),
  })
}
