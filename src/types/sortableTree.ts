import { UniqueIdentifier } from "@dnd-kit/core";

export interface ItemContent {
  done: boolean;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  deadline?: Date | null;
}

export interface Item {
  id: UniqueIdentifier;
  children: Item[];
  content: ItemContent;
  isPlaceholder?: boolean;
}

export interface FlatItem extends Item {
  parentId: UniqueIdentifier | null;
  depth: number;
  index: number;
  collapsed?: boolean;
}

export type FlatItemOptionalId = Omit<FlatItem, "id"> &
  Partial<Pick<FlatItem, "id">>;
