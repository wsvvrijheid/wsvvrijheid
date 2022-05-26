import { request } from '~lib'

export const getProject = async code => {
  const response = await request({
    url: 'api/projects',
    filters: { code: { $eq: code } },
  })

  return response.result?.[0] || null
}
