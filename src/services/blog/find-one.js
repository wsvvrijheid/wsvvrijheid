import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

import { useLocaleTimeFormat } from '~hooks'
import { request } from '~lib'
import { getReadingTime } from '~utils'

export const getBlog = async (locale, slug) => {
  const response = await request({
    url: 'api/blogs',
    populate: ['author.volunteer', 'image', 'likers'],
    filters: { slug: { $eq: slug } },
    locale,
  })

  const blog = response.result?.[0]

  return blog || null
}

export const useGetBlog = () => {
  const {
    locale,
    query: { slug },
  } = useRouter()

  const { data, ...rest } = useQuery({
    queryKey: ['blog', locale, slug],
    queryFn: () => getBlog(locale, slug),
  })

  const { formattedDate } = useLocaleTimeFormat(data?.publishedAt)
  const readingTime = getReadingTime(data?.content, locale)

  const blog = data ? { ...data, formattedDate, readingTime } : null

  return { ...rest, data: blog }
}
