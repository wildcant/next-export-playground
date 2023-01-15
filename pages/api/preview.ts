import {getPostBySlug} from '../../lib/api'

const PREVIEW_TOKEN =
  process.env.PREVIEW_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMjVmZmYzNTRiYmQ4YWIwNmFjYzZhMTY4NzJlMjA0YzRkNjBlMTVkOGIwMzI2MGUxYWEzYjJjNzY0YzIzNzY3ZmU0ZmI5N2EzODMxNDVhOWYyM2YxYjE3Mjk1YmYzNWY3NDVkMDM4M2VlODZmYTJlZmY2YjliNjliMzY3M2QwNjU4N2IyNWI5YzU5YTNhYjU3YTk0YmJjY2ZkZDU2ZTc1ZTViNjYyMzU5YThiYjgyMGM5MzE5NWQ4ZGVlNDUyNmZiODQxOCIsImlhdCI6MTY3MzcxODUyOH0.SvGYMPlBln0PNcK6mWtka6afj-FczcU0nXSACt67gJA'
export default async function handler(req, res) {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (
    (process.env.NODE_ENV !== 'development' &&
      req.query.secret !== PREVIEW_TOKEN) ||
    !req.query.slug
  ) {
    return res.status(401).json({message: 'Invalid token'})
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  // getPostBySlug would implement the required fetching logic to the headless CMS
  const post = await getPostBySlug({slug: req.query.slug, fields: ['slug']})

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!post) {
    return res.status(401).json({message: 'Invalid slug'})
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.redirect(`/posts/${post.slug}`)
}

// http://localhost:3000/api/preview?secret=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMjVmZmYzNTRiYmQ4YWIwNmFjYzZhMTY4NzJlMjA0YzRkNjBlMTVkOGIwMzI2MGUxYWEzYjJjNzY0YzIzNzY3ZmU0ZmI5N2EzODMxNDVhOWYyM2YxYjE3Mjk1YmYzNWY3NDVkMDM4M2VlODZmYTJlZmY2YjliNjliMzY3M2QwNjU4N2IyNWI5YzU5YTNhYjU3YTk0YmJjY2ZkZDU2ZTc1ZTViNjYyMzU5YThiYjgyMGM5MzE5NWQ4ZGVlNDUyNmZiODQxOCIsImlhdCI6MTY3MzcxODUyOH0.SvGYMPlBln0PNcK6mWtka6afj-FczcU0nXSACt67gJA&slug=/posts/hello-world
