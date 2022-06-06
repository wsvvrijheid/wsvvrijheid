import { useQuery } from 'react-query'

import { request } from '~lib'

export const getArtist = async (locale, username) => {
  const artistResponse = await request({
    url: 'api/artists',
    filters: { user: { username: { $eq: username } } },
    populate: ['user.avatar'],
  })

  const artist = artistResponse.result[0]

  if (!artist) return null

  const artsResponse = await request({
    url: 'api/arts',
    filters: { artist: { id: { $eq: artist.id } } },
    locale,
  })

  const arts = artsResponse?.result || []

  return { ...artist, arts: arts.map(art => ({ ...art, artist })) }
}

export const useGetArtist = (locale, username) =>
  useQuery({
    queryKey: ['artists', locale, username],
    queryFn: () => getArtist(locale, username),
  })
