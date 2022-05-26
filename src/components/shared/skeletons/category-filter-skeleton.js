import { SimpleGrid, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import React from 'react'

export const CategoryFilterSkeleton = () => {
  return (
    <SimpleGrid display={'flex'} flexDirection={'row'} mt={3}>
      <SkeletonCircle size='8' />
      <SkeletonText mt='4' noOfLines={1} spacing='4' w={'60%'} ml={2} />
    </SimpleGrid>
  )
}
