import { Button, ButtonGroup, DarkMode } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { useScroll } from '~hooks'

export const LocaleSwitcher = ({ isDark }) => {
  const { locales, push, pathname, locale, asPath, components, query } = useRouter()
  const isScrolled = useScroll()

  const slugs = components?.[pathname].props.pageProps?.slugs

  // TODO: Redirect to localized path for static pages
  const handleChangeLanguage = async locale => {
    await push(pathname, slugs?.[locale] || asPath, { locale })
  }

  return (
    <ButtonGroup spacing={0} size='sm' alignItems='center'>
      {locales.map(code => {
        if (query.slug && !slugs?.[code]) return null

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
