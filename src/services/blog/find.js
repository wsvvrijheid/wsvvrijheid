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

export const useGetBlogs = locale =>
  useQuery({
    queryKey: 'blogs',
    queryFn: () => getBlogs(locale),
  })
