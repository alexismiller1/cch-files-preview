import type { ComponentType } from "react";

export interface Layout {
  id: string;
  name: string;
  description: string;
  prompt: string;
  preview?: ComponentType;
  tags: string[];
}
