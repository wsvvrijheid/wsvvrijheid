import '@splidejs/react-splide/css'

import { ChakraProvider } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { appWithTranslation } from 'next-i18next'
import { DefaultSeo } from 'next-seo'
import { useEffect, useRef } from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { theme } from '~theme'
import { getDefaultSeo, pageview } from '~utils'

function MyApp({ Component, pageProps }) {
  const queryClientRef = useRef()
  const { locale } = useRouter()
  const router = useRouter()

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient()
  }

  useEffect(() => {
    const handleRouteChange = url => pageview(url)

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider theme={theme}>
          <DefaultSeo {...getDefaultSeo(locale)} />
          <Component {...pageProps} />
        </ChakraProvider>
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default appWithTranslation(MyApp)
