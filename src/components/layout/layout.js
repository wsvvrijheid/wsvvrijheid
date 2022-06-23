import { Box, Center, Flex, Spinner } from '@chakra-ui/react'
import { NextSeo } from 'next-seo'
import React from 'react'

import { useAuth, useScroll } from '~hooks'

import { Footer } from './footer/footer'
import { Header } from './header/header'

export const Layout = ({ children, seo, isLoading = false, isDark }) => {
  const isScrolled = useScroll()
  const auth = useAuth()

  const minH = isDark ? 'calc(100vh - 300px)' : { base: 'calc(100vh - 64px)', lg: 'calc(100vh - 100px)' }

  return (
    <>
      {seo && <NextSeo {...seo} />}
      <Flex flexDir='column' minHeight='100vh' overflowX='hidden'>
        <Header isScrolled={isScrolled} isDark={isDark} auth={auth} />
        {isLoading ? (
          <Center minH={minH}>
            <Spinner colorScheme='blue' />
          </Center>
        ) : (
          <Box minH={minH}>{children}</Box>
        )}
        <Footer />
      </Flex>
    </>
  )
}
