import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import React from 'react'
import { FaBars } from 'react-icons/fa'

import { useScroll } from '~hooks'

import { ProfileMenu } from '../profile-menu'
import { HeaderMobileNav } from './header-mobile-nav'

const LocaleSwitcher = dynamic(() => import('../locale-switcher'), { ssr: false })

export const HeaderMobile = ({ isDark, auth }) => {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const isScrolled = useScroll()

  return (
    <HStack display={{ base: 'flex', lg: 'none' }}>
      <Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <HeaderMobileNav />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <LocaleSwitcher isDark={isDark} />
      <ProfileMenu isDark={isDark} auth={auth} />
      <IconButton
        variant='outline'
        color={!isScrolled & isDark ? 'white' : 'initial'}
        colorScheme={!isScrolled & isDark ? 'blackAlpha' : 'whiteAlpha'}
        onClick={onToggle}
        aria-label='menu'
        icon={<FaBars />}
      />
    </HStack>
  )
}
