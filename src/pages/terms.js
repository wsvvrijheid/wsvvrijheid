import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { serialize } from 'next-mdx-remote/serialize'

import { Container, Hero, Layout, Markdown } from '~components'
import { request } from '~lib'
import { truncateText } from '~utils'

const Terms = ({ term, seo, source }) => {
  return (
    <Layout seo={seo} isDark>
      <Hero title={term.title} isFullHeight={false} />
      <Container>
        <Markdown source={source} />
      </Container>
    </Layout>
  )
}

export default Terms

export const getStaticProps = async context => {
  const { locale } = context

  const data = await request({ url: 'api/term' })

  if (!data.result)
    return {
      notFound: true,
    }

  const source = await serialize(data.result.content ?? '')

  const seo = {
    title: data.result?.title,
    description: truncateText(data.result?.content || '', 200),
  }

  return {
    props: {
      term: data.result,
      source,
      seo,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
