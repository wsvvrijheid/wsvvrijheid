import { request } from '~lib'

export const getProjectPaths = async () => {
  const response = await request({
    url: 'api/projects',
    populate: '',
  })

  const paths = response.result.map(({ code }) => ({ params: { code } }))

  return paths
}
