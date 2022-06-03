import axios from 'axios'
import { useQuery } from 'react-query'

export const getArtComments = async id => {
  const response = await axios(`https://api.samenvvv.nl/api/comments/api::art.art:${id}`)

  return response.data
}

export const useArtComments = id =>
  useQuery({
    queryKey: ['art-comments', id],
    queryFn: () => getArtComments(id),
  })
