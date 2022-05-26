import { request } from '~lib'

export const getArtPaths = async locales =>
  (
    await Promise.all(
      locales.flatMap(async locale => {
        const responses = await request({
          url: 'api/arts',
          locale,
        })

        const arts = responses?.result

        return arts.map(({ slug }) => ({
          params: { slug },
          locale,
        }))
      }),
    )
  ).flat()
