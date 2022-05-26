/* eslint-disable react/display-name */
import { chakra } from '@chakra-ui/react'
import { MDXRemote } from 'next-mdx-remote'

import { Navigate } from '~components'

const MarkdownComponents = {
  h1: props => <chakra.h1 fontWeight='black' textAlign='center' fontSize='3xl' my={8} {...props} />,
  h2: props => <chakra.h2 fontWeight='black' fontSize='2xl' my={6} apply='mdx.h2' {...props} />,
  h3: props => <chakra.h3 fontWeight='black' fontSize='xl' my={4} as='h3' apply='mdx.h3' {...props} />,
  h4: props => <chakra.h4 fontWeight='black' fontSize='lg' my={4} as='h4' apply='mdx.h4' {...props} />,
  hr: props => <chakra.hr apply='mdx.hr' {...props} />,
  strong: props => <chakra.span fontWeight={600} {...props} />,
  a: props => (
    <Navigate {...props}>
      <chakra.a color='blue.500'>{props.children}</chakra.a>
    </Navigate>
  ),
  p: props => <chakra.p mb={4} {...props} />,
  ul: props => <chakra.ul mt={6} ml={4} {...props} />,
  ol: props => <chakra.ol apply='mdx.ul' {...props} />,
  li: props => <chakra.li {...props} />,
  blockquote: props => (
    <chakra.blockquote
      bg='blackAlpha.50'
      borderWidth={1}
      borderColor='blue.500'
      rounded='lg'
      px={6}
      py={4}
      my={6}
      {...props}
    />
  ),
}

export const Markdown = ({ source }) => (
  // TODO Might be extended with custom components
  <MDXRemote {...source} components={{ ...MarkdownComponents }} />
)
