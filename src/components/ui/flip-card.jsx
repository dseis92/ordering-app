import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function FlipCard({
  frontContent,
  backContent,
  className,
  color = '#0a4f39' // Hilltop green default
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      style={{
        ['--primary']: color,
      }}
      className={cn("group relative h-full w-full [perspective:2000px]", className)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          'relative h-full w-full',
          '[transform-style:preserve-3d]',
          'transition-all duration-700',
          isFlipped
            ? '[transform:rotateY(180deg)]'
            : '[transform:rotateY(0deg)]',
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[transform:rotateY(0deg)] [backface-visibility:hidden]',
            'overflow-hidden rounded-xl',
            'bg-white',
            'border-2 border-gray-200',
            'shadow-lg',
            'transition-all duration-700',
            'group-hover:shadow-xl group-hover:border-hilltop-green',
            isFlipped ? 'opacity-0' : 'opacity-100',
          )}
        >
          {frontContent}
        </div>

        {/* Back of card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[transform:rotateY(180deg)] [backface-visibility:hidden]',
            'rounded-xl',
            'bg-white',
            'border-2 border-hilltop-green',
            'shadow-lg',
            'flex flex-col',
            'transition-all duration-700',
            'group-hover:shadow-xl',
            !isFlipped ? 'opacity-0' : 'opacity-100',
          )}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
}
