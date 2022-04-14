import { Image, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { BlogCard, Container, Hero, Layout } from '~components'
import { getBlogs } from '~lib'

// TODO: Implement author filter
const Blogs = ({ seo, blogs }) => {
  return (
    <Layout seo={seo}>
      {blogs?.[0] ? (
        <>
          <Hero title='Blog' isFullHeight={false} />
          <Container maxW='container.lg'>
            <SimpleGrid gap={8} py={8} columns={{ base: 1, lg: 2 }}>
              {blogs?.map((blog, index) => (
                <BlogCard key={index} isFeatured={index === 0} post={blog} />
              ))}
            </SimpleGrid>
          </Container>
        </>
      ) : (
        <Stack minH='inherit' justify='center' align='center' spacing={8}>
          <Image h={200} src='/images/no-blog.svg' alt='no blog' />
          <Text textAlign='center' fontSize='lg'>
            Sorry! No articles published in this language.
          </Text>
        </Stack>
      )}
    </Layout>
  )
}

export default Blogs

export const getStaticProps = async context => {
  const locale = context.locale
  const response = await getBlogs(locale)

  const blogSeo = {
    en: {
      title: 'Blog',
      description: 'Posts',
    },
    nl: {
      title: 'Blog',
      description: 'Posts',
    },
    tr: {
      title: 'Blog',
      description: 'Yazılar',
    },
  }

  const seo = blogSeo[locale]

  return {
    props: {
      seo,
      blogs: response?.result || null,
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 120,
  }
}
