import { Box, Heading, HStack, Icon, IconButton, SimpleGrid, Stack, Text, Wrap } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { serialize } from 'next-mdx-remote/serialize'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { AiFillHeart } from 'react-icons/ai'
import { FaCalendarDay, FaClock, FaEye } from 'react-icons/fa'
import { dehydrate, QueryClient } from 'react-query'

import { BlogCard, ChakraNextImage, Container, Layout, Markdown, ShareButtons } from '~components'
import { useAuth } from '~hooks'
import { getAuthorBlogs, getBlog, getBlogPaths, useGetBlog, useLikeBlog, useViewBlog } from '~services'

const BlogInfo = () => {
  const {
    locale,
    query: { slug },
  } = useRouter()
  const { user } = useAuth()

  const { data: blog } = useGetBlog(locale, slug)
  const { isLiked, toggleLike } = useLikeBlog(user)

  const link = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blog/${slug}`

  useViewBlog()

  return (
    <Wrap fontSize='md' justify={{ base: 'center', md: 'space-between' }} color='gray.500' spacing={4}>
      <Wrap spacing={4} justify='center'>
        <Box>
          <HStack>
            <Icon as={FaCalendarDay} />
            <Text>{blog.formattedDate}</Text>
          </HStack>
          <HStack>
            <Icon as={FaClock} />
            <Text>{blog.readingTime}</Text>
          </HStack>
        </Box>
        <Box>
          <HStack>
            <Box as={FaEye} />
            <Text>{blog.views} views</Text>
          </HStack>
          <HStack>
            <Box as={AiFillHeart} />
            <Text>{(blog.likes || 0) + (blog.likers.length || 0)} likes</Text>
          </HStack>
        </Box>
      </Wrap>

      <ShareButtons title={blog.title} url={link} quote={blog.description}>
        <IconButton
          rounded='full'
          aria-label='like post'
          color={isLiked ? 'red.400' : 'gray.400'}
          icon={<AiFillHeart />}
          onClick={toggleLike}
        />
      </ShareButtons>
    </Wrap>
  )
}

const BlogImage = memo(function BlogImage({ image }) {
  return <ChakraNextImage ratio='twitter' rounded='lg' image={image} />
})

const Blog = ({ source, seo, authorBlogs }) => {
  const { t } = useTranslation()

  const { data: blog } = useGetBlog()
  if (!blog) return null

  return (
    <Layout seo={seo}>
      <Container maxW='container.md'>
        <Stack py={8} spacing={8}>
          <BlogImage image={blog.image} />
          <Heading as='h1' textAlign='center'>
            {blog.title}
          </Heading>
          <BlogInfo />

          <Box textAlign={{ base: 'left', lg: 'justify' }}>
            <Markdown source={source} />
            <Text>
              {t('author')}: {blog.author.volunteer.name}
            </Text>
          </Box>
          <SimpleGrid m={4} gap={8} columns={{ base: 1, md: 2 }}>
            {authorBlogs.map((blog, idx) => (
              <BlogCard key={idx} post={blog} featured={true}></BlogCard>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Layout>
  )
}

export default Blog

export const getStaticPaths = async context => {
  const paths = await getBlogPaths(context.locales)

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async context => {
  const queryClient = new QueryClient()
  const locale = context.locale

  const slug = context.params?.slug

  await queryClient.prefetchQuery({
    queryKey: ['blog', locale, slug],
    queryFn: () => getBlog(locale, slug),
  })

  const blog = queryClient.getQueryData(['blog', locale, slug])

  if (!blog) return { notFound: true }

  const title = blog.title || null
  const description = blog.description || null
  const adminUrl = process.env.NEXT_PUBLIC_API_URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const image = blog.image
  const url = `${siteUrl}/${locale}/blog/${slug}`

  const authorBlogs = (await getAuthorBlogs(locale, blog.author.id, blog.id)) || []

  const seo = {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      article: {
        publishedTime: blog.publishedAt,
        modifiedTime: blog.updatedAt,
        authors: [blog.author.volunteer.name || blog.author.volunteer.username],
        // TODO add tags
      },
      images: image
        ? [
            {
              url: adminUrl + image?.url,
              secureUrl: adminUrl + image?.url,
              type: image?.mime,
              width: image?.width,
              height: image?.height,
              alt: title,
            },
          ]
        : [],
    },
  }

  const source = await serialize(blog.content || '')

  return {
    props: {
      source,
      authorBlogs,
      seo,
      dehydratedState: dehydrate(queryClient),
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 1,
  }
}
