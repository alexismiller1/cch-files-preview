import type { ComponentType } from "react";

export interface PreviewProps {
  onToggleTheme?: () => void;
}

export interface Layout {
  id: string;
  name: string;
  description: string;
  prompt: string;
  preview?: ComponentType<PreviewProps>;
  tags: string[];
}
