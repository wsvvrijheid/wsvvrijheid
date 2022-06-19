import { Center, Heading, Image, Stack, Text, VStack } from '@chakra-ui/react'
import TinyColor from '@ctrl/tinycolor'
import dynamic from 'next/dynamic'
import { useTranslation } from 'next-i18next'
import { forwardRef, Fragment } from 'react'

const FlipBook = dynamic(() => import('./flip-book'), { ssr: false })

const Page = forwardRef(function Page(props, ref) {
  return (
    <Center ref={ref} rounded='md' p={8} overflow='auto' {...props}>
      {props.children}
    </Center>
  )
})

const CollectionPages = forwardRef(function CollectionPages(props, ref) {
  return props.collection.arts.map((art, index) => (
    <Fragment key={index}>
      <Page ref={ref} p={8} bgGradient={props.pageBgGdarient}>
        <VStack justify='center' w='full' h='full' spacing={2}>
          <Heading color='red.500' fontFamily='club' textAlign='center'>
            {art.title}
          </Heading>

          <Image rounded='sm' maxH='80%' src={process.env.NEXT_PUBLIC_API_URL + art.images[0].url} alt={art.title} />

          <Text fontFamily='club'>{art.description}</Text>
        </VStack>
      </Page>
      <Page ref={ref} bgGradient={props.pageBgGdarient}>
        <Stack w='full' h='full' justify='center' fontFamily='club'>
          <Text fontFamily='club' textAlign='center'>
            {art.content}
          </Text>
          <Text fontFamily='club' textAlign='right'>
            {art.artist?.name}
          </Text>
        </Stack>
        <Text fontFamily='club' pos='absolute' bottom={4} right={6}>
          {index + 1}
        </Text>
      </Page>
    </Fragment>
  ))
})

const defaultFlipboxProps = {
  width: 500,
  height: 600,
  size: 'stretch',
  minWidth: 315,
  maxWidth: 1000,
  minHeight: 600,
  maxHeight: 600,
  maxShadowOpacity: 0.3,
  showCover: true,
}

export const Collection = ({ collection, coverBg = '#F5F3EB', bg: pageBg = '#F5F3EB', flipboxProps }) => {
  const { t } = useTranslation()
  const shadowColor = TinyColor(pageBg).darken(5).toHexString()
  const coverShadow = TinyColor(coverBg).darken(5).toHexString()
  const pageBgGdarient = `linear(to-r, ${shadowColor} 0%, ${pageBg} 5%, ${pageBg} 95%, ${shadowColor} 100%)`
  const coverBgGdarient = `linear(to-r, ${coverShadow} 0%, ${coverBg} 5%, ${coverBg} 95%, ${coverShadow} 100%)`
  const flipboxOverrideProps = { ...defaultFlipboxProps, ...flipboxProps }

  return (
    <FlipBook {...flipboxOverrideProps}>
      {/* Cover */}
      <Page bgGradient={coverBgGdarient}>
        <VStack h='full' justify='center' p={8} textAlign='center'>
          <Heading color='red.500' fontFamily='club'>{t`art-stop`}</Heading>
          <Image maxH={300} src='/images/kunsthalte.svg' alt='kunsthalte' />
          <Heading color='red.500' fontFamily='club'>
            {collection.title}
          </Heading>
        </VStack>
      </Page>

      {/* Pages */}
      <CollectionPages collection={collection} pageBgGdarient={pageBgGdarient} />

      {/* Back */}
      <Page bgGradient={coverBgGdarient}>
        <Image maxH='300' mx='auto' src='/images/kunsthalte.svg' alt='kunsthalte' />
      </Page>
    </FlipBook>
  )
}
