import { cn } from '@repo/design-system/lib/utils';
import { getDictionary } from '@repo/internationalization';
import type { Blog, WithContext } from '@repo/seo/json-ld';
import { JsonLd } from '@repo/seo/json-ld';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

type BlogProps = {
  params: Promise<{
    locale: string;
  }>;
};

type BlogData = {
  blog: {
    posts: {
      items: Array<{
        _slug: string;
        _title: string;
        date: string;
        description: string;
        image: {
          url: string;
          alt?: string;
          width: number;
          height: number;
        };
      }>;
    };
  };
};

type CMSModule = {
  blog: {
    postsQuery: unknown;
  };
};

type FeedComponent = (props: {
  queries: unknown[];
  children: (data: [BlogData]) => Promise<ReactNode>;
}) => ReactNode;

type ImageComponent = (props: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) => ReactNode;

export const generateMetadata = async ({
  params,
}: BlogProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.blog.meta);
};

const BlogIndex = async ({ params }: BlogProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  const jsonLd: WithContext<Blog> = {
    '@type': 'Blog',
    '@context': 'https://schema.org',
  };

  // CMS removed - using placeholder content

  return (
    <>
      <JsonLd code={jsonLd} />
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto flex flex-col gap-14">
          <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="max-w-xl font-regular text-3xl tracking-tighter md:text-5xl">
              {dictionary.web.blog.meta.title}
            </h4>
          </div>
          <div className="col-span-full py-20 text-center">
            <h3 className="mb-4 font-semibold text-2xl">
              Blog Coming Soon
            </h3>
            <p className="text-muted-foreground">
              Our blog is currently being set up. Please check back later!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogIndex;
