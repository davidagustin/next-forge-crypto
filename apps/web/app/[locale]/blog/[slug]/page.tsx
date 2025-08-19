import { getDictionary } from '@repo/internationalization';
import { createMetadata } from '@repo/seo/metadata';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

type BlogPostProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: BlogPostProps): Promise<Metadata> => {
  const { locale, slug } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata({
    title: `${dictionary.web.blog.meta.title} - ${slug}`,
    description: dictionary.web.blog.meta.description,
  });
};

const BlogPost = async ({ params }: BlogPostProps) => {
  const { slug } = await params;

  return (
    <div className="container mx-auto py-16">
      <Link
        className="mb-4 inline-flex items-center gap-1 text-muted-foreground text-sm focus:underline focus:outline-none"
        href="/blog"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Blog
      </Link>
      <div className="mt-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog: {slug}</h1>
        <p className="text-muted-foreground">
          Blog content is currently being configured. Please check back later.
        </p>
      </div>
    </div>
  );
};

export default BlogPost;