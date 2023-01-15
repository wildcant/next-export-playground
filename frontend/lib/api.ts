import fs from 'fs'
import {join} from 'path'
import matter from 'gray-matter'

const postsDirectory = join(process.cwd(), 'content/posts')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

interface IGetPostBySlugArgs {
  slug: string
  fields?: string[]
}

export function getPostBySlug({slug, fields = []}: IGetPostBySlugArgs) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const {data, content} = matter(fileContents)

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach(field => {
    if (field === 'slug') {
      items[field] = realSlug
    }

    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }

    if (data[field] instanceof Date) {
      const date = data[field] as Date
      items[field] = date.toISOString()
    }
  })

  return items
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs()
  const posts = slugs
    .map(slug => getPostBySlug({slug, fields}))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}

export async function getAllPublishedPosts(fields: string[] = []) {
  const slugs = await getPostSlugs()
  const posts = await Promise.all(
    slugs.map(slug => getPostBySlug({slug, fields: [...fields]})),
  )

  // sort posts by date in descending order
  // .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  const publishedPosts = posts.filter(post => !!post)
  return publishedPosts
}
