import { fromImage } from 'imtool'

export const resizeImage = async ({ file, maxSize }) => {
  const image = await fromImage(file)
  const thumbnail = image.thumbnail(maxSize || 1920)

  const result = await thumbnail.toFile(file.name)

  return result
}
