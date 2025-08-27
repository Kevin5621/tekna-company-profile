"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // client-only UI
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9 rounded-full bg-muted" />;

  const ICON_SIZE = 16;

  const handleToggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <Button
      variant="default"
      size={"icon"}
      className="rounded-full"
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Sun key="light" size={ICON_SIZE} />
      ) : (
        <Moon key="dark" size={ICON_SIZE} />
      )}
    </Button>
  );
};

export { ThemeSwitcher };
