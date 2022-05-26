import { useQuery } from 'react-query'

import { request } from '~lib'

export const getArtCategories = async locale => {
  const response = await request({
    url: 'api/categories',
    pageSize: 100,
    locale,
    filters: {
      arts: {
        locale: {
          $eq: locale,
        },
      },
    },
  })

  return response.result
}

export const useGetArtCategories = locale => {
  return useQuery({
    queryKey: 'art-categories',
    queryFn: () => getArtCategories(locale),
  })
}
