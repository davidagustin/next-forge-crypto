import { createMetadata } from '@repo/seo/metadata';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

type LegalPageProperties = {
  readonly params: Promise<{
    slug: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: LegalPageProperties): Promise<Metadata> => {
  const { slug } = await params;

  return createMetadata({
    title: `Legal - ${slug}`,
    description: 'Legal information',
  });
};

const LegalPage = async ({ params }: LegalPageProperties) => {
  const { slug } = await params;

  return (
    <div className="container max-w-5xl py-16">
      <Link
        className="mb-4 inline-flex items-center gap-1 text-muted-foreground text-sm focus:underline focus:outline-none"
        href="/"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Home
      </Link>
      <h1 className="scroll-m-20 text-balance font-extrabold text-4xl tracking-tight lg:text-5xl">
        Legal: {slug}
      </h1>
      <p className="text-balance leading-7 [&:not(:first-child)]:mt-6">
        Legal content is currently being configured. Please check back later.
      </p>
    </div>
  );
};

export default LegalPage;