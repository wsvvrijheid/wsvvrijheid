import { Center, HStack, IconButton, Image, Text, VStack } from '@chakra-ui/react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { FaRegHeart } from 'react-icons/fa'

import { ShareButtons } from '~components'

const ArtImage = ({ image, alt }) => (
  <Image maxH={500} src={`${process.env.NEXT_PUBLIC_API_URL}${image.url}`} alt={alt} />
)

export const ArtDetail = ({ art, slug, locale }) => {
  return (
    <VStack bg='white' spacing={4} padding={4} boxShadow='base'>
      {art?.images.length > 1 ? (
        <Splide>
          {art?.images.map(image => (
            <Center as={SplideSlide} key={image.id}>
              <ArtImage image={image} alt={art.title} />
            </Center>
          ))}
        </Splide>
      ) : (
        <ArtImage image={art?.images[0]} alt={art.title} />
      )}

      <HStack bg='white'>
        <Text>{art?.likes}</Text>{' '}
        <IconButton
          as='span'
          isRound
          size='sm'
          aria-label='Like'
          icon={<FaRegHeart />}
          variant='ghost'
          colorScheme='red'
          // TODO Add like functionality
          onClick={() => console.log('like', art?.id)}
          borderWidth={1}
          borderColor='gray.200'
        />
        {/* TODO when I change size of the SharedButtons as shown in Figma, 
                    it will affect other SharedButtons component. Customize it to have different sizes
                    or create a new component for here */}
        <ShareButtons title={art?.title} url={`${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/club/art/${slug}`} />
      </HStack>
    </VStack>
  )
}
