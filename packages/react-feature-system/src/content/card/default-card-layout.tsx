import { Card, CARD_SCHEMA_TYPE } from '@/content/card/card';
import { Button } from '@/ui/components/button';
import {
  Card as ShadcnCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/components/card';
import { cn } from '@/ui/lib/utils';
import {
  executeAction,
  LayoutConfiguration,
  TypeDescriptor,
  useVyuh,
} from '@vyuh/react-core';
import React from 'react';

/**
 * Default layout for card content items using Shadcn UI components
 *
 * Features:
 * - Responsive design
 * - Support for title, description, and image
 * - Action handling
 * - Themed presentation
 */
export class DefaultCardLayout extends LayoutConfiguration<Card> {
  static readonly schemaName = `${CARD_SCHEMA_TYPE}.layout.default`;
  static typeDescriptor = new TypeDescriptor(this.schemaName, this);

  constructor() {
    super({
      schemaType: DefaultCardLayout.schemaName,
      title: 'Default Card Layout',
    });
  }

  /**
   * Render the card content with Shadcn styling
   */
  render(content: Card): React.ReactNode {
    return <CardView content={content} />;
  }
}

/**
 * CardRenderer component for rendering card content with Shadcn styling
 */
interface CardRendererProps {
  content: Card;
}

const CardView: React.FC<CardRendererProps> = ({ content }) => {
  const { plugins } = useVyuh();

  // Get image URL from either direct URL or ImageReference
  let imageUrl = content.imageUrl;
  if (!imageUrl && content.image) {
    imageUrl = plugins.content.provider.image(content.image);
  }

  // Determine if we have an image to show
  const hasImage = !!imageUrl;

  // Check if image is the only content
  const hasOnlyImage =
    hasImage &&
    !content.title &&
    !content.description &&
    !content.content?.blocks &&
    !content.secondaryAction &&
    !content.tertiaryAction;

  // If we only have an image, render a simplified card with full-height image
  if (hasOnlyImage) {
    return (
      <ShadcnCard
        className={cn('vfs:overflow-hidden vfs:border-neutral-300 vfs:p-0', {
          'vfs:cursor-pointer': content.action,
        })}
        onClick={() => content.action && executeAction(content.action)}
      >
        <img
          src={imageUrl}
          alt="Card image"
          className="vfs:max-h-[400px] vfs:w-full vfs:object-cover"
        />
      </ShadcnCard>
    );
  }

  // Otherwise render the standard card layout
  return (
    <ShadcnCard
      className={cn('vfs:border-[6px] vfs:border-neutral-100', {
        'vfs:cursor-pointer': content.action,
      })}
      onClick={() => content.action && executeAction(content.action)}
    >
      <CardHeader>
        {hasImage && (
          <div className="vfs:h-48 vfs:w-full vfs:overflow-hidden">
            <img
              src={imageUrl}
              alt={content.title || 'Card image'}
              className="vfs:h-full vfs:w-full vfs:object-cover"
            />
          </div>
        )}

        {content.title && <CardTitle>{content.title}</CardTitle>}
        {content.description && (
          <CardDescription>{content.description}</CardDescription>
        )}
      </CardHeader>

      {content.content && (
        <CardContent>{plugins.content.render(content.content)}</CardContent>
      )}

      {(content.secondaryAction || content.tertiaryAction) && (
        <CardFooter className="vfs:flex vfs:flex-wrap vfs:gap-2">
          {content.secondaryAction && (
            <Button
              onClick={() => executeAction(content.secondaryAction)}
              variant="outline"
            >
              {content.secondaryAction.label || 'Secondary'}
            </Button>
          )}

          {content.tertiaryAction && (
            <Button
              onClick={() => executeAction(content.tertiaryAction)}
              variant="link"
            >
              {content.tertiaryAction.label || 'Tertiary'}
            </Button>
          )}
        </CardFooter>
      )}
    </ShadcnCard>
  );
};
