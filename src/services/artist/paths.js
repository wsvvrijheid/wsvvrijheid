import { request } from '~lib'

export const getArtistsPaths = async () => {
  const artists = await request({
    url: 'api/artists',
    populate: ['user'],
  })

  const paths = artists?.result.map(artist => ({
    params: { username: artist.user.username },
  }))

  return paths
}
