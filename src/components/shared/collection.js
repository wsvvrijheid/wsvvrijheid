import { Box, Heading, Image, Stack, Text } from '@chakra-ui/react'
import TinyColor from '@ctrl/tinycolor'
import dynamic from 'next/dynamic'
import { Children, forwardRef } from 'react'

const FlipBook = dynamic(() => import('./flip-book'), { ssr: false })

// eslint-disable-next-line react/display-name
const Page = forwardRef((props, ref) => {
  return (
    <Box ref={ref} rounded='md' p={8} overflow='auto' {...props}>
      {props.children}
    </Box>
  )
})

const defaultFlipboxProps = {
  width: 500,
  height: 500,
  size: 'stretch',
  minWidth: 315,
  maxWidth: 1000,
  minHeight: 420,
  maxHeight: 500,
  maxShadowOpacity: 0.3,
  showCover: true,
}

export const CollectionItem = ({ title, image, text }) => {
  return (
    <Stack textAlign='center' spacing={4}>
      <Heading size='lg' as='h2'>
        {title}
      </Heading>

      <Box>
        <Image maxH='full' w='full' objectFit='contain' src={image} alt={title} rounded='lg' />
      </Box>

      <Box>
        <Text noOfLines={3}>{text}</Text>
      </Box>
    </Stack>
  )
}

export const Collection = ({ cover, back, children, bg = '#F5F3EB', flipboxProps }) => {
  const shadowColor = TinyColor(bg).darken(5).toHexString()
  const coverBg = TinyColor(bg).darken(15).toHexString()
  const coverShadow = TinyColor(bg).darken(20).toHexString()
  const pageBgGdarient = `linear(to-r, ${shadowColor} 0%, ${bg} 5%, ${bg} 95%, ${shadowColor} 100%)`
  const coverBgGdarient = `linear(to-r, ${coverShadow} 0%, ${coverBg} 5%, ${coverBg} 95%, ${coverShadow} 100%)`

  const isOdd = Children.count % 2 !== 0

  const flipboxOverrideProps = { ...defaultFlipboxProps, ...flipboxProps }

  return (
    <FlipBook {...flipboxOverrideProps}>
      {cover && <Page bgGradient={coverBgGdarient}>{cover}</Page>}
      <Page p={8} bgGradient={coverBgGdarient} />
      {Children.map(children, (child, i) => (
        <Page key={i} bgGradient={pageBgGdarient}>
          {child}
        </Page>
      ))}
      {isOdd && <Page p={8} bgGradient={pageBgGdarient} />}
      <Page bgGradient={coverBgGdarient} p={8} />
      {back && <Page bgGradient={coverBgGdarient}>{back}</Page>}
    </FlipBook>
  )
}
