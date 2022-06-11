import { useRouter } from 'next/router'
import { useMutation, useQueryClient } from 'react-query'

import { useLocalStorage } from '~hooks'
import { mutation } from '~lib'
import { useGetBlog } from '~services'

const likeBlogByUser = async (blog, user, likers) => {
  if (!user) return

  return mutation.put('api/blogs', blog.id, {
    data: { likers },
  })
}

const useLikeBlogByUserMutation = () => {
  const queryClient = useQueryClient()
  const {
    locale,
    query: { slug },
  } = useRouter()

  return useMutation({
    mutationKey: 'likeBlogByUser',
    mutationFn: ({ blog, user, likers }) => likeBlogByUser(blog, user, likers),
    onSettled: () => {
      queryClient.invalidateQueries(['blog', locale, slug])
    },
  })
}

const likeBlogPublic = async (blog, isLiked) => {
  const likes = isLiked ? blog.likes - 1 : blog.likes + 1

  return mutation.put('api/blogs', blog.id, {
    data: { likes },
  })
}

const useLikeBlogPublicMutation = () => {
  const queryClient = useQueryClient()

  const {
    locale,
    query: { slug },
  } = useRouter()

  return useMutation({
    mutationKey: ['likeBlogPublic'],
    mutationFn: ({ blog, isLikedStorage }) => likeBlogPublic(blog, isLikedStorage),
    onSettled: () => {
      queryClient.invalidateQueries(['blog', locale, slug])
    },
  })
}

export const useLikeBlog = user => {
  const queryClient = useQueryClient()
  const { data: blog } = useGetBlog()

  const [likersStorage, setLikersStorage] = useLocalStorage('like-blog', [])

  const isLikedStorage = likersStorage.some(id => id === blog?.id)
  const isLikedByUser = user && blog?.likers.length > 0 && blog?.likers?.some(({ id }) => id === user.id)

  const likeBlogByUserMutation = useLikeBlogByUserMutation()
  const likeBlogPublicMutation = useLikeBlogPublicMutation()

  const likers =
    user && (isLikedByUser ? blog?.likers?.filter(liker => liker?.id !== user.id) : [...(blog?.likers || []), user.id])

  const toggleLike = async () => {
    if (user) {
      return likeBlogByUserMutation.mutate(
        { blog, user, likers },
        {
          onSuccess: () => {
            const updatedStorage = isLikedStorage
              ? likersStorage.filter(id => id !== blog?.id)
              : [...likersStorage, blog?.id]
            setLikersStorage(updatedStorage)
            queryClient.invalidateQueries(['blog', blog.locale, blog.slug], { exact: true })
          },
        },
      )
    }

    likeBlogPublicMutation.mutate(
      { blog, isLikedStorage },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['blog', blog?.locale, blog?.slug])
        },
      },
    )
  }

  return { toggleLike, isLiked: user ? isLikedByUser : isLikedStorage }
}
