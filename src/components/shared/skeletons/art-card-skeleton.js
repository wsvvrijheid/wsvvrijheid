import { HStack, Skeleton, SkeletonCircle, Spacer, Stack } from '@chakra-ui/react'

export const ArtCardSkeleton = ({ isMasonry }) => {
  const height = isMasonry ? Math.floor(Math.random() * (400 - 200 + 1)) + 200 : '300px'

  return (
    <Stack w='full'>
      <Skeleton height={height} />
      <HStack>
        <SkeletonCircle size={8} />
        <Skeleton rounded='full' h={4} noOfLines={1} w='50%' />
        <Spacer />
        <SkeletonCircle size={8} />
      </HStack>
    </Stack>
  )
}
