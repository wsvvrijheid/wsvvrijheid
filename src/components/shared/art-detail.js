import { Box, Button, Center, HStack, Image, Text, VStack } from '@chakra-ui/react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { memo } from 'react'
import { AiFillHeart } from 'react-icons/ai'
import { FaEye } from 'react-icons/fa'

import { ShareButtons } from '~components'
import { useLikeArt } from '~services'

const ArtImage = memo(function ArtImage({ image, alt }) {
  return <Image maxH={500} src={`${process.env.NEXT_PUBLIC_API_URL}${image.url}`} alt={alt} />
})

export const ArtDetail = ({ art, user, queryKey }) => {
  const { toggleLike, isLiked, isLoading } = useLikeArt(art, user, queryKey)

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
        {art.views && (
          <HStack py={0.5} px={3} rounded='full' borderColor='gray.200' borderWidth={1}>
            <Text>{art.views}</Text>
            <Box as={FaEye} />
          </HStack>
        )}
        <Button
          rounded='full'
          colorScheme={isLiked ? 'red' : 'gray'}
          rightIcon={<AiFillHeart />}
          onClick={() => toggleLike(true)}
          size='sm'
          variant='outline'
          isLoading={isLoading}
        >
          {(art?.likes || 0) + (art.likers?.length || 0)}
        </Button>
        {/* TODO when I change size of the SharedButtons as shown in Figma, 
                    it will affect other SharedButtons component. Customize it to have different sizes
                    or create a new component for here */}
        <ShareButtons title={art?.title} url={art.url} quote={art?.description} />
      </HStack>
    </VStack>
  )
}
