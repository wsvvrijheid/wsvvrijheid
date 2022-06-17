import { AspectRatio, Box } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

import { getImageUrl, toBase64 } from '~utils'

const shimmer = (
  w,
  h,
) => `<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <linearGradient id="g">
            <stop stop-color="#ccc" offset="20%" />
            <stop stop-color="#eee" offset="50%" />
            <stop stop-color="#ccc" offset="70%" />
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="#E2E8F0" />
        <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
        <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
      </svg>`

export const ChakraNextImage = ({ image, format, nextImageProps, alt, ratio, ...rest }) => {
  const src = getImageUrl(image, format)
  const alternativeText = typeof image === 'string' ? alt || 'alternative text' : image?.alternativeText

  const ImageWrapper = props =>
    ratio ? (
      <AspectRatio ratio={ratio || (ratio === 'twitter' ? 1200 / 675 : 1)} {...props} />
    ) : (
      <Box pos='relative' {...props} />
    )

  return (
    <ImageWrapper overflow='hidden' {...rest}>
      <Image
        objectFit='cover'
        layout='fill'
        src={src}
        alt={alternativeText}
        placeholder='blur'
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(60, 60))}`}
        {...nextImageProps}
      />
    </ImageWrapper>
  )
}
