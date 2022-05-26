import { Flex, HStack, Image, Link, Stack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Headroom from 'react-headroom'

import { useScroll } from '~hooks'

import { Container } from '../container'
import { LocaleSwitcher } from '../locale-switcher'
import { ProfileMenu } from '../profile-menu'
import { HeaderMobile } from './header-mobile'
import { HeaderNav } from './header-nav'

export const Header = ({ isDark, auth }) => {
  const isScrolled = useScroll()

  return (
    <Headroom>
      <Flex
        bg={isScrolled ? 'white' : 'transparent'}
        borderBottomWidth={isScrolled ? 1 : 0}
        borderBottomColor='blackAlpha.300'
        transition='all 0.3s ease-in-out'
        align='center'
        h={{ base: '64px', lg: '100px' }}
        sx={{
          '& .header-menu-item': {
            color: !isScrolled && isDark ? 'white' : 'initial',
            _hover: {
              color: !isScrolled && isDark ? 'whiteAlpha.800' : 'blue.500',
            },
          },
        }}
      >
        <Container>
          <Flex justify='space-between' align='center' pos='relative'>
            <motion.div animate={{ rotate: -360 }} transition={{ ease: 'linear', repeat: Infinity, duration: 60 }}>
              <Link href='/'>
                <Image
                  width={{ base: '64px', lg: '92px' }}
                  height={{ base: '64px', lg: '92px' }}
                  objectFit='cover'
                  src='/images/logo.svg'
                  alt='Wsvv logo'
                />
              </Link>
            </motion.div>
            <HStack display={{ base: 'none', lg: 'flex' }} align='center' spacing={4}>
              <Stack spacing={1}>
                <HStack justify='end'>
                  <LocaleSwitcher isDark={isDark} />
                  {!auth?.isLoggedIn && <ProfileMenu isDark={isDark} auth={auth} />}
                </HStack>
                <HeaderNav />
              </Stack>
              {auth?.isLoggedIn && <ProfileMenu isDark={isDark} auth={auth} />}
            </HStack>
            <HeaderMobile isDark={isDark} auth={auth} />
          </Flex>
        </Container>
      </Flex>
    </Headroom>
  )
}
