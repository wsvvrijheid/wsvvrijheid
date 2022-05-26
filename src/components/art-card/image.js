import { Image } from '@chakra-ui/react'
import { Splide, SplideSlide } from '@splidejs/react-splide'

const CardImage = ({ art, isMasonry, image }) => (
  <Image
    pos='relative'
    zIndex={-1}
    h={isMasonry ? undefined : 300}
    w='full'
    objectFit='cover'
    src={process.env.NEXT_PUBLIC_API_URL + image.url}
    alt={art.title}
    rounded='md'
    userSelect='none'
  />
)

export const ArtCardImage = ({ art, isMasonry }) => {
  if (art.images?.length < 2) return <CardImage art={art} isMasonry={isMasonry} image={art.images[0]} />

  return (
    <Splide>
      {art.images?.map((image, index) => (
        <SplideSlide key={index}>
          <CardImage art={art} isMasonry={isMasonry} image={image} />
        </SplideSlide>
      ))}
    </Splide>
  )
}
