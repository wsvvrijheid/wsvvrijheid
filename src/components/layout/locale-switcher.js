import { Button, ButtonGroup, DarkMode } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { useScroll } from '~hooks'

export const LocaleSwitcher = ({ isDark }) => {
  const { locales, push, pathname, locale, asPath, components } = useRouter()
  const isScrolled = useScroll()

  const slug =
    components?.[pathname]?.props?.pageProps?.pageData?.slugs || components?.[pathname]?.props?.pageProps?.slug

  // TODO: Redirect to localized path for static pages
  const handleChangeLanguage = async locale => {
    await push(pathname, slug?.[locale]?.join('/') || asPath, { locale })
  }

  return (
    <ButtonGroup spacing={0} size='sm' alignItems='center'>
      {locales.map(code => {
        if (slug && (!slug?.[code] || !slug?.[code]?.[0])) return null

        let variant = 'ghost'
        if (locale === code) {
          if (!isScrolled && isDark) variant = 'solid'
          else variant = 'outline'
        }

        return !isScrolled && isDark ? (
          <DarkMode key={code}>
            <Button
              px={2}
              onClick={() => handleChangeLanguage(code)}
              colorScheme={locale === code ? 'blue' : !isScrolled && isDark ? 'gray' : 'blackAlpha'}
              variant={variant}
            >
              {code.toUpperCase()}
            </Button>
          </DarkMode>
        ) : (
          <Button
            key={code}
            px={2}
            onClick={() => handleChangeLanguage(code)}
            colorScheme={locale === code ? 'blue' : !isScrolled && isDark ? 'gray' : 'blackAlpha'}
            variant={variant}
          >
            {code.toUpperCase()}
          </Button>
        )
      })}
    </ButtonGroup>
  )
}
