'use client';
import { useEffect, useState } from 'react';

import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import DashboardCommand from './dashboard-command';
import { useSidebar } from '@/components/ui/sidebar';

const DashboardNavbar = () => {
  const [commandOpen, setCommandOpen] = useState(false);
  const { state, toggleSidebar, isMobile } = useSidebar();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />

      <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
        <Button className="size-9" variant="outline" onClick={toggleSidebar}>
          {state === 'collapsed' || isMobile ? (
            <PanelLeftIcon className="size-4" />
          ) : (
            <PanelLeftCloseIcon className="size-4" />
          )}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setCommandOpen((prev) => !prev)}
          className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground"
        >
          <SearchIcon />
          Search
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">&#8984;</span>K
          </kbd>
        </Button>
      </nav>
    </>
  );
};

export default DashboardNavbar;
