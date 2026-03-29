import React from 'react';
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from '@/components/ui/responsive-modal';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SearchModal({ children, data = [], onSelectItem }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (item) => {
    setOpen(false);
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>{children}</ResponsiveModalTrigger>
      <ResponsiveModalContent className="p-1">
        <ResponsiveModalTitle className="sr-only">Search</ResponsiveModalTitle>
        <Command className="bg-background md:bg-card rounded-md md:border">
          <CommandInput
            className={cn(
              'placeholder:text-muted-foreground flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
            )}
            placeholder="Search menu..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-[380px] min-h-[380px] px-2 md:px-0">
            <CommandEmpty className="flex min-h-[280px] flex-col items-center justify-center">
              <SearchIcon className="text-muted-foreground mb-2 size-6" />
              <p className="text-muted-foreground mb-1 text-xs">
                No items found for "{query}"
              </p>
            </CommandEmpty>
            <CommandGroup>
              {data.map((item, i) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.id || i}
                    className="flex cursor-pointer items-center gap-3"
                    value={item.name}
                    onSelect={() => handleSelect(item)}
                  >
                    {Icon && <Icon className="size-5" />}
                    <div className="flex flex-col">
                      <p className="max-w-[250px] truncate text-sm font-medium">
                        {item.name}
                      </p>
                      {item.description && (
                        <p className="text-muted-foreground text-xs line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <p className="text-muted-foreground ml-auto text-xs">
                      ${item.price}
                    </p>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
