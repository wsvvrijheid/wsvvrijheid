import { useMutation, useQueryClient } from 'react-query'

import { useLocalStorage } from '~hooks'
import { mutation } from '~lib'

const useLikeArtByUserMutation = () => {
  return useMutation({
    mutationKey: 'likeArtByUser',
    mutationFn: ({ art, likers }) =>
      mutation.put('api/arts', art.id, {
        data: { likers },
      }),
  })
}

const useLikeArtPublicMutation = () => {
  return useMutation({
    mutationKey: ['likeArtPublic'],
    mutationFn: ({ art, likes }) =>
      mutation.put('api/arts', art.id, {
        data: { likes },
      }),
  })
}

export const useLikeArt = (art, user, queryKey) => {
  const queryClient = useQueryClient()

  const [likersStorage, setLikersStorage] = useLocalStorage('like-art', [])

  const isLikedStorage = likersStorage.some(id => id === art.id)
  const isLikedByUser = user && art.likers?.length > 0 && art.likers?.some(({ id }) => id === user.id)

  const likeArtByUserMutation = useLikeArtByUserMutation()
  const likeArtPublicMutation = useLikeArtPublicMutation()

  const likers = user && (isLikedByUser ? art.likers?.filter(liker => liker?.id !== user.id) : [...art.likers, user.id])
  const likes = isLikedStorage ? art.likes - 1 : art.likes + 1

  const invalidateQueries = (updatedData, isSinglePage) => {
    if (isSinglePage) {
      // Invalidate only the current art in the page
      return queryClient.invalidateQueries(queryKey)
    }

    // Update the art from the art list
    const artsQuery = queryClient.getQueryData(queryKey)
    const updatedArts = artsQuery.result.map(art => {
      if (art.id === updatedData.id) {
        return { ...art, likes: updatedData.likes }
      }
      return art
    })
    queryClient.setQueryData(queryKey, { ...artsQuery, result: updatedArts })
  }

  const toggleLike = async isSinglePage => {
    if (user) {
      return likeArtByUserMutation.mutate(
        { art, likers },
        {
          onSuccess: data => invalidateQueries(data, isSinglePage),
        },
      )
    }

    likeArtPublicMutation.mutate(
      { art, likes },
      {
        onSuccess: async data => {
          invalidateQueries(data, isSinglePage)
          // TODO Find a better way of getting updated storage
          const storage = JSON.parse(window.localStorage.getItem('like-art') || '[]')
          const isLiked = storage.some(id => id === art.id)
          const updatedStorage = isLiked ? storage.filter(id => id !== data.id) : [...storage, data.id]

          setLikersStorage(updatedStorage)
        },
      },
    )
  }

  return {
    toggleLike,
    isLiked: user ? isLikedByUser : isLikedStorage,
    isLoading: likeArtByUserMutation.isLoading || likeArtPublicMutation.isLoading,
  }
}
