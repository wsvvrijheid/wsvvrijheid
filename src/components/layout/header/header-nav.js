import { HStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { HEADER_MENU } from './header-menu'
import { HeaderNavItem } from './header-nav-item'

export const HeaderNav = () => {
  const { locale } = useRouter()
  return (
    <HStack>
      {HEADER_MENU.map((item, i) => {
        return <HeaderNavItem key={i} label={item[locale]} link={item.link} submenu={item.children} />
      })}
    </HStack>
  )
}
