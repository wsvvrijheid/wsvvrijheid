import { useQuery } from 'react-query'

import { request } from '~lib'

export const getArtComments = async ({ id }) => {
  const response = await request({
    url: `api/api::art.art:${id}`,
  })

  return response.result
}

export const useArtComments = ({ id }) => {
  return useQuery({
    queryKey: ['art-comments', id],
    queryFn: () => getArtComments({ id }),
  })
}
