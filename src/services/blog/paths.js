import { request } from '~lib'

export const getBlogPaths = async locales =>
  (
    await Promise.all(
      locales.flatMap(async locale => {
        const responses = await request({
          url: 'api/blogs',
          locale,
        })

        const blogs = responses?.result

        return blogs.map(({ slug }) => ({
          params: { slug },
          locale,
        }))
      }),
    )
  ).flat()
