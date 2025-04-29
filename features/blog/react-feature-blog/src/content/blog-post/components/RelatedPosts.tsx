import React from 'react';
import { formatDate } from './BlogPostComponent';
import { cn } from '@/shared/utils';
import { BlogPost } from '../blog-post';
import { MiniBlogPostLayout } from '../mini-blog-post-layout';
import { useVyuh } from '@vyuh/react-core';

// We can use either the full BlogPost type or a simpler RelatedPost type
type RelatedPost =
  | BlogPost
  | {
      title: string;
      publishedAt: string;
      // Add other properties as needed
    };

interface RelatedPostsProps {
  posts: RelatedPost[];
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  const { plugins } = useVyuh();

  // Create a mini layout for related posts
  const miniLayout = new MiniBlogPostLayout();

  return (
    <div className="border-base-300 mt-10 border-t pt-6">
      <h3 className="text-primary mb-4 text-lg font-semibold">Related Posts</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => {
          // Check if post is a full BlogPost object with _type property
          if ('_type' in post && post._type === 'blog.post') {
            // Use the MiniBlogPostLayout for full BlogPost objects
            return (
              <div
                key={index}
                className="card bg-base-200 border-base-300/50 border transition-all duration-300 hover:shadow-lg"
              >
                {plugins.content.render(post, { layout: miniLayout })}
              </div>
            );
          } else {
            // Fallback for simple RelatedPost objects
            return (
              <div
                key={index}
                className={cn(
                  'card bg-base-200 transition-all duration-300',
                  'hover:bg-base-200/80 hover:scale-[1.02] hover:shadow-lg',
                  'border-base-300/50 border',
                )}
              >
                <div className="card-body">
                  <h4 className="card-title text-base">{post.title}</h4>
                  <p className="text-base-content/70 text-sm">
                    {formatDate(post.publishedAt)}
                  </p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
