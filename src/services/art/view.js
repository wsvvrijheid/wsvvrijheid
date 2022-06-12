import { useTimeout } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useMutation, useQueryClient } from 'react-query'

import { useLocalStorage } from '~hooks'
import { mutation } from '~lib'

import { useGetArt } from './find-one'

export const viewArt = async art =>
  mutation.put('api/arts', art.id, {
    data: { views: art.views + 1 },
  })

export const useViewArt = async () => {
  const queryClient = useQueryClient()
  const {
    locale,
    query: { slug },
  } = useRouter()

  const { data: art } = useGetArt()

  const [artStorage, setArtStorage] = useLocalStorage('view-art', [])

  const { mutate } = useMutation({
    mutationKey: ['viewart', art?.id],
    mutationFn: () => viewArt(art),
    onSuccess: () => {
      setArtStorage([...artStorage, art?.id])
      queryClient.invalidateQueries(['art', locale, slug])
    },
  })

  useTimeout(() => {
    const isViewed = artStorage?.some(id => id === art?.id)

    if (art && !isViewed) {
      mutate(art)
    }
  }, 10 * 1000)
}
