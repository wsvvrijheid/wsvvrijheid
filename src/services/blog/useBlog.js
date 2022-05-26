import { useTimeout } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { useLocalStorage } from '~hooks'

import { likeBlogMutation, undoLikeBlogMutation } from './like'
import { viewBlogMutation } from './view'

const LOCAL_STORAGE_BLOG_KEY = 'blog'

export const useBlog = blog => {
  const [blogStorage, setBlogStorage] = useLocalStorage(LOCAL_STORAGE_BLOG_KEY, { views: [], likes: [] })
  const [isLiked, setIsLiked] = useState(false)
  const [isViewed, setIsViewed] = useState(false)
  const [views, setViews] = useState(blog?.views || 0)
  const [likes, setLikes] = useState(blog?.likes || 0)

  // Update local storage when blog is liked or viewed
  // Perform optimistic updates for views and likes
  useEffect(() => {
    if (blog) {
      setIsLiked(blogStorage.likes.some(id => id === blog.id))
      setIsViewed(blogStorage.views.some(id => id === blog.id))

      localStorage.setItem(LOCAL_STORAGE_BLOG_KEY, JSON.stringify(blogStorage))
    }
  }, [blogStorage, blog])

  // Update blog views count after a delay specified in `useTimeout`
  // if user has not viewed the blog before
  const viewBlog = async () => {
    if (blog && !isViewed) {
      const result = await viewBlogMutation(blog)
      setViews(prev => prev + 1)
      setBlogStorage({ ...blogStorage, views: [...blogStorage.views, result.id] })
      setIsViewed(true)
    }
  }

  useTimeout(viewBlog, 10 * 1000)

  const likeBlog = async () => {
    const result = await likeBlogMutation(blog)
    setLikes(prev => prev + 1)
    setBlogStorage({ ...blogStorage, likes: [...blogStorage.likes, result.id] })
  }

  const undoLikeBlog = async () => {
    const result = await undoLikeBlogMutation(blog)
    setLikes(prev => prev - 1)
    const filteredLikes = blogStorage.likes.filter(id => id !== result.id)
    setBlogStorage({ ...blogStorage, likes: filteredLikes })
  }

  const toggleLike = async () => {
    isLiked ? undoLikeBlog() : likeBlog()
  }

  return { hasLiked: isLiked, toggleLike, likes, views }
}
