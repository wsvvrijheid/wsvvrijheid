import { Box, HStack, Skeleton, SkeletonCircle, Stack } from '@chakra-ui/react'

export const ArtCardSkeleton = ({ isMasonry }) => {
  const height = isMasonry ? Math.floor(Math.random() * (400 - 200 + 1)) + 200 : '300px'

  return (
    <Box w='full' pos='relative'>
      <Skeleton h={height} />
      <HStack pos='absolute' top={2} right={2}>
        <SkeletonCircle size={8} />
        <SkeletonCircle size={8} />
      </HStack>
      <Stack pos='absolute' left={2} bottom={2} w='50%'>
        <Skeleton h={4} />
        <HStack>
          <SkeletonCircle flexShrink={0} size={8} />
          <Skeleton rounded='full' h={8} w='full' />
        </HStack>
      </Stack>
    </Box>
  )
}
