import { request } from '~lib'

export const getActivity = async (locale, slug) => {
  const response = await request({
    url: 'api/activities',
    filters: { slug: { $eq: slug } },
    locale,
  })

  return response.result?.[0] || null
}
