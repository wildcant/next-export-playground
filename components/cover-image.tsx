import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import {IGetPlaiceholderReturn} from 'plaiceholder'

type Props = {
  blurDataURL: string
  src: string
  height: number
  width: number
  type?: string
  title: string
  slug?: string
}

const CoverImage = ({title, src, slug, ...img}: Props) => {
  const image = (
    <Image
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn('shadow-sm w-full', {
        'hover:shadow-lg transition-shadow duration-200': slug,
      })}
      width={1300}
      height={630}
      placeholder="blur"
      {...img}
    />
  )
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]" aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}

export default CoverImage
