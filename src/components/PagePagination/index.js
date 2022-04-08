import { Button, ButtonGroup, Stack } from '@chakra-ui/react'
import { useState } from 'react'

import { Navigate } from '~components'

export const PagePagination = ({ subpage, header }) => {
  const pageTitle = header.toLowerCase()

  const [isSelected, setIsSelected] = useState(1)

  const pageCount = +subpage?.pagination.pageCount

  const selectedPage = num => {
    setIsSelected(num + 1)
  }

  return (
    <Stack justify='space-between' direction={{ base: 'column', lg: 'row' }}>
      {pageCount > 1 && (
        <ButtonGroup size='sm' isAttached variant='outline'>
          {[...Array.from(Array(pageCount).keys())].map(num => (
            <>
              <Navigate mr='auto' href={`/${pageTitle}?page=${num + 1}`}>
                <Button
                  transition='all 0.3s ease-in-out'
                  p={4}
                  colorScheme='teal'
                  isActive={isSelected === num + 1}
                  onClick={() => selectedPage(num)}
                  mr='-px'
                >
                  {num + 1}
                </Button>
              </Navigate>
            </>
          ))}
        </ButtonGroup>
      )}
    </Stack>
  )
}
