import { Box, Center, Flex, Spinner } from '@chakra-ui/react'
import { NextSeo } from 'next-seo'
import React from 'react'

import { useScroll } from '~hooks'

import { Footer } from './footer/footer'
import { Header } from './header/header'

export const Layout = ({ children, seo, isLoading = false, isDark }) => {
  const isScrolled = useScroll()

  return (
    <>
      {seo && <NextSeo {...seo} />}
      <Flex flexDir='column' minHeight='100vh'>
        <Header isScrolled={isScrolled} isDark={isDark} />
        {isLoading ? (
          <Center minH={{ base: 'calc(100vh - 64px)', lg: 'calc(100vh - 100px)' }}>
            <Spinner colorScheme='blue' />
          </Center>
        ) : (
          <Box minH={{ base: 'calc(100vh - 64px)', lg: 'calc(100vh - 100px)' }}>{children}</Box>
        )}
        <Footer />
      </Flex>
    </>
  )
}
