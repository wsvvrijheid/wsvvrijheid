import { useMutation, useQueryClient } from 'react-query'

import { mutation } from '~lib'

export const useLikeArt = queryKey => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: 'like-art',
    mutationFn: ({ art }) => mutation.put('api/arts', art.id, { data: { likes: art.likes + 1 } }),
    onSuccess: () => {
      // It's difficult to invalidate cache for paginated or filtering queries
      // Cache invalidation strategy might differ depending on where the mutation is called
      // If there would be no filters, sort, pages for fetching data,
      // we could just invalidate the cache as `queryClient.invalidateQueries('arts')`
      //
      // We fetch queries on `Club` page, so we can invalidate cache by using the same queryKey
      // That's why we give the current queryKey comes from `Club` page
      queryClient.invalidateQueries(queryKey)
    },
    onError: e => {
      console.error('EEEE', e.response)
    },
  })
}
