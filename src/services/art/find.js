import qs from 'qs'
import { useQuery } from 'react-query'

import { request } from '~lib'

export const getArts = async ({
  categories,
  populate = ['artist.user.avatar', 'categories', 'images', 'likers'],
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

  const statusFilter = {
    status: {
      $eq: 'approved',
    },
  }

  const searchFilter = username
    ? userFilter
    : searchTerm && {
        $or: [userFilter, titleFilter],
      }

  const categoryObj = qs.parse(categories)

  const filters = {
    ...(searchFilter || {}),
    categories: { code: { $in: Object.values(categoryObj) } },
    ...(statusFilter || {}),
  }
  return request({
    url: 'api/arts',
    filters,
    page,
    pageSize,
    sort: sort || ['publishedAt:desc'],
    locale,
    populate,
  })
}

export const useArts = (queryKey, args) =>
  useQuery({
    queryKey,
    queryFn: () => getArts(args),
  })
