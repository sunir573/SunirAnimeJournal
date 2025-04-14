"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="bg-secondary p-4">
      <div className="container mx-auto flex justify-start space-x-4">
        <Link href="/" passHref>
          <Button variant="link">Search</Button>
        </Link>
        <Link href="/watched" passHref>
          <Button variant="link">Watched</Button>
        </Link>
        <Link href="/watchlist" passHref>
          <Button variant="link">Watchlist</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
