import { BlogPost } from '../blog-post';
import { DefaultBlogPostLayout } from '../default-blog-post-layout';
import { useMediaUtils } from '@/shared/MediaUtils';
import { cn } from '@/shared/utils';
import { useVyuh } from '@vyuh/react-core';
import React, { useEffect, useState } from 'react';
import { BlogPostHero } from './BlogPostHero';
import { BlogPostHeader } from './BlogPostHeader';
import { BlogPostContent } from './BlogPostContent';
import { BlogPostTags } from './BlogPostTags';
import { RelatedPosts } from './RelatedPosts';
import { BlogPostAuthor } from './BlogPostAuthor';

interface BlogPostComponentProps {
  content: BlogPost;
  layout: DefaultBlogPostLayout;
  className?: string;
}

// Utility function for formatting dates - moved to a separate function to be reused across components
export const formatDate = (dateString: string) => {
  if (!dateString || dateString.trim() === '') {
    return null;
  }

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const BlogPostComponent: React.FC<BlogPostComponentProps> = ({
  content,
  layout,
  className,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Add a fade-in effect when the component mounts
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={cn(
        'bg-base-100 min-h-screen transition-opacity duration-500',
        isLoaded ? 'opacity-100' : 'opacity-0',
      )}
    >
      {/* Hero section with featured image */}
      {content.featuredImage && (
        <BlogPostHero content={content} layout={layout} />
      )}

      {/* Main content */}
      <article
        className={cn(
          'container mx-auto px-4 py-10',
          !content.featuredImage && 'pt-20',
          className,
        )}
      >
        {/* If no featured image, show title here */}
        {!content.featuredImage && (
          <BlogPostHeader content={content} layout={layout} />
        )}

        {content.content && <BlogPostContent content={content} />}

        {/* Author bio */}
        {content.author && (
          <div className="border-base-200 mt-10 border-t pt-6">
            <h3 className="mb-4 text-lg font-semibold">About the Author</h3>
            <BlogPostAuthor
              author={{
                ...content.author,
                featured: content.author.featured || content.featured,
              }}
            />
          </div>
        )}
      </article>
    </div>
  );
};
