
import { Box, HStack, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import { Navigate } from '~components'

 

export const PagePagination = ({ subpage, header}) => {
  const { t } = useTranslation()
  const pageTitle=header.toLowerCase();
 
  const currentIndex = + subpage?.pagination.page
  const pageCount= +subpage?.pagination.pageCount
  
  let prevPage = currentIndex-1 >> 0
  let nextPage = (currentIndex+1)<=pageCount
 

  return (
    <Stack justify="space-between" direction={{ base: 'column', lg: 'row' }}>
  
      {prevPage && (
        <Navigate mr="auto" href={`/${pageTitle}?page=${prevPage}`}>
          <HStack
            transition="all 0.3s ease-in-out"
            borderWidth={1}
            borderColor="transparent"
            _hover={{ borderColor: 'primary.400', color: 'primary.400' }}
            rounded="lg"
            p={4}
          >
            <Box fontSize="xl" as={FaChevronLeft} />
            <Box>
              <Text fontSize="xs">
                {t`prev`} {t(subpage.type)}
              </Text>
              <Text maxW="300px" isTruncated>
                {prevPage?.title}
              </Text>
            </Box>
          </HStack>
        </Navigate>
      )}
      {nextPage && (
        <Navigate ml="auto" href={`/${pageTitle}?page=${currentIndex+1}`}>
          <HStack
            transition="all 0.3s ease-in-out"
            borderWidth={1}
            borderColor="transparent"
            _hover={{ borderColor: 'primary.400', color: 'primary.400' }}
            rounded="lg"
            p={4}
            justify="end"
          >
            <Box>
              <Text fontSize="xs">
                {t`next`} {t(subpage.type)}
              </Text>
              <Text maxW="300px" isTruncated>
                {nextPage?.title}
              </Text>
            </Box>
            <Box fontSize="xl" as={FaChevronRight} />
          </HStack>
        </Navigate>
      )}
    </Stack>
  )
}
