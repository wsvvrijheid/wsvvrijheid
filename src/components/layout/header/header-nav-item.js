import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { Navigate } from '~components'

const ChildMenuItem = ({ label, link }) => {
  const { asPath } = useRouter()

  return (
    <Navigate
      className='header-menu-item'
      href={link}
      fontWeight={600}
      px={2}
      py={{ base: 2, lg: 0 }}
      color={link !== '/' && asPath.includes(link) ? 'blue.500' : 'gray.700'}
      _hover={{ color: 'blue.500' }}
    >
      {label}
    </Navigate>
  )
}

const ParentMenuItem = ({ label, link, submenu }) => {
  const { locale } = useRouter()

  return (
    <Popover trigger='hover' arrowSize={16}>
      <PopoverTrigger>
        <Navigate className='header-menu-item' href={link} fontWeight={600}>
          {label}
        </Navigate>
      </PopoverTrigger>
      <Portal>
        <PopoverContent mt={2}>
          <PopoverArrow />
          <PopoverBody>
            <Stack spacing={4} py={4}>
              {submenu.map(item => (
                <ChildMenuItem key={item.link} link={item.link} label={item[locale]} />
              ))}
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export const HeaderNavItem = ({ label, link, submenu }) => {
  const isMobile = useBreakpointValue({ base: true, lg: false })

  if (submenu) {
    if (isMobile) return submenu.map(child => <ChildMenuItem key={child.link} item={child} />)
    return <ParentMenuItem label={label} link={link} submenu={submenu} />
  }

  return <ChildMenuItem label={label} link={link} />
}
