import { useQuery } from 'react-query'

import { request } from '~lib'

export const getBlogs = async locale =>
  await request({
    url: 'api/blogs',
    locale,
    sort: ['publishedAt:desc'],
  })

export const useGetBlogs = locale =>
  useQuery({
    queryKey: 'blogs',
    queryFn: () => getBlogs(locale),
  })
