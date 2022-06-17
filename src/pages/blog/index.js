import { Image, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { dehydrate, QueryClient } from 'react-query'

import { AnimatedBox, BlogCard, Container, Hero, Layout } from '~components'
import { getBlogs, useGetBlogs } from '~services'

// TODO: Implement author filter
const Blogs = ({ seo }) => {
  const { data: blogs } = useGetBlogs()

  return (
    <Layout seo={seo} isDark>
      <Hero title='Blog' image='/images/blog-bg.jpeg' />
      {blogs.result?.[0] ? (
        <>
          <Container maxW='container.lg'>
            <SimpleGrid gap={8} py={8} columns={{ base: 1, lg: 2 }}>
              {blogs.result?.map((blog, index) => (
                <AnimatedBox
                  key={index}
                  directing='to-down'
                  delay={index * 0.5}
                  gridColumn={{
                    base: undefined,
                    lg: index === 0 ? 'span 2' : undefined,
                  }}
                  h='full'
                >
                  <BlogCard isFeatured={index === 0} post={blog} />
                </AnimatedBox>
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
  const queryClient = new QueryClient()

  const locale = context.locale

  await queryClient.prefetchQuery({
    queryKey: ['blogs', locale],
    queryFn: () => getBlogs(locale),
  })

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
      dehydratedState: dehydrate(queryClient),
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 120,
  }
}
