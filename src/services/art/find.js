import qs from 'qs'
import { useQuery } from 'react-query'

import { request } from '~lib'

export const getArts = async ({
  categories,
  populate = ['artist.user.avatar', 'categories', 'images', 'likes'],
  page = 1,
  pageSize,
  searchTerm,
  username,
  sort,
  locale,
}) => {
  const userFilter = {
    artist: {
      user: {
        username: {
          $containsi: searchTerm || username,
        },
      },
    },
  }

  const titleFilter = {
    title: {
      $containsi: searchTerm,
    },
  }

  const searchFilter = username
    ? userFilter
    : searchTerm && {
        $or: [userFilter, titleFilter],
      }

  const categoryObj = qs.parse(categories)

  const filters = { ...(searchFilter || {}), categories: { code: { $in: Object.values(categoryObj) } } }
  return request({
    url: 'api/arts',
    filters,
    page,
    pageSize,
    sort,
    locale,
    populate,
  })
}

export const useArts = (queryKey, args) =>
  useQuery({
    queryKey,
    queryFn: () => getArts(args),
  })
