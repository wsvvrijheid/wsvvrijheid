import {
  Avatar,
  Button,
  DarkMode,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { FiLogIn, FiLogOut } from 'react-icons/fi'

import { Navigate } from '~components'

export const ProfileMenu = ({ isDark, isScrolled, auth }) => {
  const { t } = useTranslation()
  const router = useRouter()

  const logOut = async e => {
    e.preventDefault()
    axios.post('/api/auth/logout').then(() => {
      router.push('/user/login')
    })
  }

  if (!auth?.user)
    return !isScrolled && isDark ? (
      <DarkMode>
        <Navigate
          as={Button}
          size='sm'
          colorScheme='blue'
          variant={!isScrolled && isDark ? 'solid' : 'outline'}
          rightIcon={<FiLogIn />}
          href={'/user/login'}
        >
          {t('profile.sign-in')}
        </Navigate>
      </DarkMode>
    ) : (
      <Navigate
        as={Button}
        size='sm'
        colorScheme='blue'
        variant={!isScrolled && isDark ? 'solid' : 'outline'}
        rightIcon={<FiLogIn />}
        href={'/user/login'}
      >
        {t('profile.sign-in')}
      </Navigate>
    )

  return (
    <Menu>
      <MenuButton>
        <Avatar
          boxSize={{ base: 10, lg: 12 }}
          src={`${process.env.NEXT_PUBLIC_API_URL}${auth.user.avatar?.formats.thumbnail.url || auth.user.avatar?.url}`}
          name={auth.user.username}
        />
      </MenuButton>
      <MenuList>
        <MenuItem>{auth.user.username}</MenuItem>
        <MenuGroup title={t('profile.title')}>
          <MenuItem as={Navigate} href={'/profile'}>
            {t('profile.my-profile')}
          </MenuItem>
          <MenuItem>{t('profile.my-arts')}</MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuItem color='red.400' onClick={logOut}>
          <FiLogOut />
          <Text marginLeft={'10px'}>{t('profile.logout')}</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
