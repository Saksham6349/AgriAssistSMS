import { Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="py-4 px-6 bg-card border-b shadow-sm">
      <div className="container mx-auto flex items-center gap-3">
        <Leaf className="text-primary" size={32} />
        <h1 className="text-2xl font-bold font-headline text-foreground tracking-tight">
          AgriAssist SMS
        </h1>
      </div>
    </header>
  );
}
