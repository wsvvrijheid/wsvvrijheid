import { Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { FOOTER_MENU } from './footer-menu'
import { FooterNavItem } from './footer-nav-item'

export const FooterNav = () => {
  const { locale } = useRouter()
  const { t } = useTranslation()
  return (
    <>
      {FOOTER_MENU.map((item, i) => {
        return (
          <Stack key={i} align='center' marginX={4} fontSize='lg' color={'blue.200'} py={4}>
            <Text fontWeight={600} fontSize={'lg'} mb={2} textTransform='uppercase'>
              {t(item[locale])}
            </Text>
            {item.children.map((item, j) => {
              return <FooterNavItem key={j} link={item.link} label={item[locale]} />
            })}
          </Stack>
        )
      })}
    </>
  )
}
