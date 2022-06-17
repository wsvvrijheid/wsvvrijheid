import { request } from '~lib'

export const getCollectionPaths = async locales =>
  (
    await Promise.all(
      locales.flatMap(async locale => {
        const responses = await request({
          url: 'api/collections',
          locale,
        })

        const collections = responses?.result

        return collections.map(({ slug }) => ({
          params: { slug },
          locale,
        }))
      }),
    )
  ).flat()
