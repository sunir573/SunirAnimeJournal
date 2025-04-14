"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="bg-secondary p-4">
      <div className="container mx-auto flex justify-start space-x-4">
        <Link href="/" passHref>
          <Button variant="link" className="text-foreground">Search</Button>
        </Link>
        <Link href="/watched" passHref>
          <Button variant="link" className="text-foreground">Watched</Button>
        </Link>
        <Link href="/watchlist" passHref>
          <Button variant="link" className="text-foreground">Watchlist</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
