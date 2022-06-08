import { Box, Heading, HStack, Icon, IconButton, SimpleGrid, SkeletonText, Stack, Text, Wrap } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { serialize } from 'next-mdx-remote/serialize'
import { useTranslation } from 'react-i18next'
import { AiFillHeart } from 'react-icons/ai'
import { FaCalendarDay, FaClock, FaEye } from 'react-icons/fa'

import { BlogCard, ChakraNextImage, Container, Layout, Markdown, ShareButtons } from '~components'
import { useLocaleTimeFormat } from '~hooks'
import { getBlog, getBlogPaths, useBlog, useGetBlog } from '~services'

const BlogInfo = ({ blog, isLoading, link }) => {
  const { isLiked, likes, views, toggleLike } = useBlog(blog)

  const { formattedDate } = useLocaleTimeFormat(blog?.publishedAt)

  return (
    <Wrap fontSize='md' justify={{ base: 'center', md: 'space-between' }} color='gray.500' spacing={4}>
      {isLoading ? (
        <SkeletonText w='48' noOfLines={2} />
      ) : (
        <Wrap spacing={4} justify='center'>
          <Box>
            <HStack>
              <Icon as={FaCalendarDay} />
              <Text>{formattedDate}</Text>
            </HStack>
            <HStack>
              <Icon as={FaClock} />
              <Text>{blog.readingTime}</Text>
            </HStack>
          </Box>
          <Box>
            <HStack>
              <Box as={FaEye} />
              <Text>{views} views</Text>
            </HStack>
            <HStack>
              <Box as={AiFillHeart} />
              <Text>{likes} likes</Text>
            </HStack>
          </Box>
        </Wrap>
      )}

      <ShareButtons title={blog?.title} url={link} quote={blog?.description}>
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

const Blog = ({ source, seo, link, blog }) => {
  const { t } = useTranslation()
  const { locale } = useRouter()

  const { data, isLoading } = useGetBlog(locale, blog?.slug)

  // FIXME Why blog is undefined on the first render?
  if (!blog) return null

  return (
    <Layout seo={seo}>
      <Container maxW='container.md'>
        <Stack py={8} spacing={8}>
          <ChakraNextImage ratio='twitter' image={blog.image} rounded='lg' />
          <Heading as='h1' textAlign='center'>
            {blog.title}
          </Heading>
          <BlogInfo blog={data} isLoading={isLoading} link={link} />

          <Box textAlign={{ base: 'left', lg: 'justify' }}>
            <Markdown source={source} />
            <Text>
              {t('author')}: {blog.author.volunteer.name}
            </Text>
          </Box>
          <SimpleGrid m={4} gap={8} columns={{ base: 1, md: 2 }}>
            {blog.blogs.map((blog, idx) => (
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
  const locale = context.locale

  const slug = context.params?.slug

  const blog = await getBlog(locale, slug)

  if (!blog) return { notFound: true }

  const title = blog.title || null
  const description = blog.description || null
  const adminUrl = process.env.NEXT_PUBLIC_API_URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const image = blog.image
  const url = `${siteUrl}/${locale}/blog/${blog.slug}`

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
      link: url,
      blog,
      seo,
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 120,
  }
}
