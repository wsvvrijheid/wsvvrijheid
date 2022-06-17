import { Box, Heading, HStack, Icon, Stack, Text, useBreakpointValue, Wrap } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { memo } from 'react'
import { FaCalendarDay, FaClock, FaEye, FaHeart } from 'react-icons/fa'

import { ChakraNextImage, Navigate } from '~components'
import { getReadingTime } from '~utils'

const BlogCardImage = memo(function BlogCardImage({ featured, image }) {
  return <ChakraNextImage minH={featured ? 450 : 200} image={image} />
})

const FormattedDate = dynamic(() => import('../shared/formatted-date'), { ssr: false })

export const BlogCard = ({ post, isFeatured }) => {
  const { locale } = useRouter()
  const isMobile = useBreakpointValue({ base: true, lg: false })

  const featured = isFeatured && !isMobile
  const readingTime = getReadingTime(post.content, locale)

  return (
    <Navigate
      gridColumn={{
        base: undefined,
        lg: featured ? 'span 2' : undefined,
      }}
      href={`/blog/${post.slug}`}
    >
      <Box shadow='lg' pos='relative' bg='white' rounded='sm' overflow='hidden'>
        <BlogCardImage featured={featured} image={post.image?.url} />
        <Stack
          rounded='sm'
          mx={{ base: 4, lg: 8 }}
          mb={{ base: 4, lg: 8 }}
          mt={-8}
          maxW={600}
          pos='relative'
          bg='white'
          px={6}
          spacing={4}
          py={featured ? 6 : 4}
          {...(featured && {
            pos: 'absolute',
            bottom: 8,
            right: 0,
            m: 0,
          })}
        >
          <Wrap justify={{ base: 'center', md: 'space-between' }} fontSize='sm' color='gray.500'>
            <HStack>
              <HStack>
                <Icon as={FaCalendarDay} />
                <Text>
                  <FormattedDate date={post.publishedAt} />
                </Text>
              </HStack>
              <HStack>
                <Icon as={FaClock} />
                <Text>{readingTime}</Text>
              </HStack>
            </HStack>
            <HStack>
              {post.likes && (
                <HStack>
                  <Box as={FaHeart} />
                  <Text>{post.likes}</Text>
                </HStack>
              )}
              {post.views && (
                <HStack>
                  <Box as={FaEye} />
                  <Text>{post.views}</Text>
                </HStack>
              )}
            </HStack>
          </Wrap>
          <Heading as='h3' size='md'>
            {post.title}
          </Heading>
          <Text noOfLines={2}>{post.description}</Text>
        </Stack>
      </Box>
    </Navigate>
  )
}
