import { useToast } from '@chakra-ui/react'
import { useMutation, useQueryClient } from 'react-query'

import { mutation } from '~lib'

export const publishArt = ({ id }) => mutation.put('api/arts', id, { data: { publishedAt: new Date() } })

export const usePublishArt = queryKey => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationKey: 'delete-art',
    mutationFn: publishArt,
    onSettled: () => {
      // It's difficult to invalidate cache for paginated or filtering queries
      // Cache invalidation strategy might differ depending on where the mutation is called
      // If there would be no filters, sort, pages for fetching data,
      // we could just invalidate the cache as `queryClient.invalidateQueries('arts')`
      //
      // We fetch queries on `Club` page, so we can invalidate cache by using the same queryKey
      // That's why we give the current queryKey comes from `Club` page
      queryClient.invalidateQueries(queryKey)
    },
    onSuccess: () => {
      // TODO Add translations
      toast({
        title: 'Art Published',
        description: 'Art has been published',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    },
  })
}
