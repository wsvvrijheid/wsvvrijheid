import { Stack } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { HEADER_MENU } from './header-menu'
import { HeaderMobileNavItem } from './header-mobile-nav-item'

export const HeaderMobileNav = () => {
  const { locale } = useRouter()
  return (
    <Stack spacing={0}>
      {HEADER_MENU.map((item, i) => {
        return <HeaderMobileNavItem key={i} label={item[locale]} link={item.link} submenu={item.children} />
      })}
    </Stack>
  )
}
