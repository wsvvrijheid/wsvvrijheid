import { fromImage } from 'imtool'

export const resizeImage = async ({ file, maxSize }) => {
  const image = await fromImage(file)
  const thumbnail = image.thumbnail(maxSize || 1920)

  return thumbnail.toBlob()
}
