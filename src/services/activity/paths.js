import { request } from '~lib'

export const getActivityPaths = async locales =>
  (
    await Promise.all(
      locales.flatMap(async locale => {
        const responses = await request({
          url: 'api/activities',
          locale,
        })

        const activities = responses?.result

        return activities.map(({ slug }) => ({
          params: { slug },
          locale,
        }))
      }),
    )
  ).flat()
