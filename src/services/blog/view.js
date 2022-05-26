import { mutation } from '~lib'

export const viewBlogMutation = async blog =>
  mutation.put('api/blogs', blog.id, {
    data: { views: blog.views + 1 },
  })
