import type Author from './author'

type PostType = {
  slug: string
  title: string
  date: string
  coverImage: {
    blurDataURL: string
    src: string
    height: number
    width: number
    type?: string
  }
  author: Author
  excerpt: string
  ogImage: {
    url: string
  }
  content: string
}

export default PostType
