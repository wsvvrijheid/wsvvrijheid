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
import React from 'react'
import { FaBars } from 'react-icons/fa'

import { useScroll } from '~hooks'

import { LocaleSwitcher } from '../locale-switcher'
import { ProfileMenu } from '../profile-menu'
import { HeaderNav } from './header-nav'

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
            <HeaderNav direction='column' />
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
