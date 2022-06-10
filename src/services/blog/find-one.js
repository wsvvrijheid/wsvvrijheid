import { useQuery } from 'react-query'

import { request } from '~lib'
import { getReadingTime } from '~utils'

import { getAuthorBlogs } from './find'

export const getBlog = async (locale, slug) => {
  const response = await request({
    url: 'api/blogs',
    populate: ['author.volunteer', 'image'],
    filters: { slug: { $eq: slug } },
    locale,
  })

  const blog = response.result?.[0]

  if (!blog) return null

  const readingTime = getReadingTime(blog.content, locale)

  const authorBlogs = (await getAuthorBlogs(locale, blog.author.id, blog.id)) || []

  return { ...blog, blogs: authorBlogs, readingTime }
}

export const useGetBlog = (locale, slug) =>
  useQuery({
    queryKey: ['blog', locale, slug],
    queryFn: () => getBlog(locale, slug),
  })
