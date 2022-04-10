import { Flex, HStack, Image, Link, Stack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Headroom from 'react-headroom'

import { useUser } from '~hooks'

import { Container } from '../container'
import { LocaleSwitcher } from '../locale-switcher'
import { ProfileMenu } from '../profile-menu'
import { HeaderMobile } from './header-mobile'
import { HeaderNav } from './header-nav'

export const Header = () => {
  const { user } = useUser()

  return (
    <Headroom style={{ zIndex: 999 }}>
      <Flex
        bg='white'
        borderBottomWidth={1}
        borderBottomColor='blackAlpha.300'
        transition='all 0.3s ease-in-out'
        align='center'
        h={{ base: '64px', lg: '100px' }}
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
            <HStack display={{ base: 'none', lg: 'flex' }} align='center'>
              <Stack spacing={1}>
                <HStack justify='end'>
                  <LocaleSwitcher />
                  {!user?.isLoggedIn && <ProfileMenu />}
                </HStack>
                <HeaderNav />
              </Stack>
              {user?.isLoggedIn && <ProfileMenu />}
            </HStack>
            <HeaderMobile />
          </Flex>
        </Container>
      </Flex>
    </Headroom>
  )
}
