import { useTimeout } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useMutation, useQueryClient } from 'react-query'

import { useLocalStorage } from '~hooks'
import { mutation } from '~lib'

import { useGetBlog } from './find-one'

export const viewBlog = async blog =>
  mutation.put('api/blogs', blog.id, {
    data: { views: blog.views + 1 },
  })

export const useViewBlog = async () => {
  const queryClient = useQueryClient()
  const {
    locale,
    query: { slug },
  } = useRouter()

  const { data: blog } = useGetBlog()

  const [blogStorage, setBlogStorage] = useLocalStorage('view-blog', [])

  const { mutate } = useMutation({
    mutationKey: ['viewBlog', blog?.id],
    mutationFn: () => viewBlog(blog),
    onSuccess: () => {
      setBlogStorage([...blogStorage, blog?.id])
      queryClient.invalidateQueries(['blog', locale, slug])
    },
  })

  useTimeout(() => {
    const isViewed = blogStorage?.some(id => id === blog?.id)

    if (blog && !isViewed) {
      mutate(blog)
    }
  }, 5 * 1000)
}
