import {useRouter} from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import {getPostBySlug, getAllPosts} from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import {CMS_NAME} from '../../lib/constants'
import markdownToHtml from '../../lib/markdownToHtml'
import {getPlaiceholder} from 'plaiceholder'
import {InferGetStaticPropsType} from 'next'

export default function Post({
  post,
  preview,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={post.ogImage.url} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

type Params = {
  preview?: boolean
  params: {
    slug: string
  }
}

export async function getStaticProps({params, preview = false}: Params) {
  const post = getPostBySlug({
    slug: params.slug,
    fields: [
      'title',
      'date',
      'slug',
      'author',
      'content',
      'ogImage',
      'coverImage',
      'draft',
    ],
  })

  if (!post || (post.draft && !preview)) {
    return {
      props: {
        notFound: true,
        post: null,
        preview,
        plaiceholderReturn: null,
      },
    }
  }

  const content = await markdownToHtml(post.content || '')
  const {img, base64} = await getPlaiceholder(post.coverImage)

  return {
    props: {
      post: {
        ...post,
        content,
        coverImage: {...img, blurDataURL: base64},
      },
      preview,
    },
  }
}

export async function getStaticPaths(context) {
  // TODO: Check how we can exclude when is not preview. should we use fallback?
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map(post => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: true,
  }
}
