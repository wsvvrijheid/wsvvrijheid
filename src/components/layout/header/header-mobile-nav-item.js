import { Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { ChildMenuItem } from './header-nav-item'

export const HeaderMobileNavItem = ({ label, link, submenu }) => {
  const { locale } = useRouter()

  return (
    <>
      <ChildMenuItem label={label} link={link} />
      {submenu?.map((child, index) => (
        <Flex key={index}>
          <ChildMenuItem label={child[locale]} link={child.link} pl={6} py={2} />
        </Flex>
      ))}
    </>
  )
}
