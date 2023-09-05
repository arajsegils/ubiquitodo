import { FlatItem, Item, ItemContent } from "@/types/sortableTree";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Flat } from "lodash";

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

export function getProjection(
  items: FlatItem[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;
  const maxDepth = getMaxDepth({
    previousItem,
  });
  const minDepth = getMinDepth({ nextItem });
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() };

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId;

    return newParent ?? null;
  }
}

function getMaxDepth({ previousItem }: { previousItem: FlatItem }) {
  if (previousItem) {
    return previousItem.depth + 1;
  }

  return 0;
}

function getMinDepth({ nextItem }: { nextItem: FlatItem }) {
  if (nextItem) {
    return nextItem.depth;
  }

  return 0;
}

function flatten(
  items: Item[],
  parentId: UniqueIdentifier | null = null,
  depth = 0
): FlatItem[] {
  return items.reduce<FlatItem[]>((acc, item, index) => {
    return [
      ...acc,
      { ...item, parentId, depth, index },
      ...flatten(item.children, item.id, depth + 1),
    ];
  }, []);
}

export function flattenTree(items: Item[]): FlatItem[] {
  return flatten(items);
}
export function buildTree(flattenedItems: FlatItem[]): Item[] {
  const root: Item = {
    id: 0,
    content: { title: "root", done: false },
    children: [],
  };
  const nodes: Record<string, Item> = { [root.id]: root };
  const items = flattenedItems.map((item) => ({ ...item, children: [] }));

  for (const item of items) {
    const { id, children, content } = item;
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? findItem(items, parentId);

    nodes[id] = { id, children, content };
    parent.children.push(item);
  }

  return root.children;
}

export function findItem(items: Item[], itemId: UniqueIdentifier) {
  return items.find(({ id }) => id === itemId);
}

export function removeItem(items: Item[], id: UniqueIdentifier) {
  const newItems = [];

  for (const item of items) {
    if (item.id === id) {
      continue;
    }

    if (item.children.length) {
      item.children = removeItem(item.children, id);
    }

    newItems.push(item);
  }

  return newItems;
}

export function removeItemInFlatList(items: FlatItem[], id: UniqueIdentifier) {
  return items.filter((item) => item.id !== id);
}

export function setProperty<T extends keyof Item>(
  items: Item[],
  id: UniqueIdentifier,
  property: T,
  setter: (value: Item[T]) => Item[T]
) {
  for (const item of items) {
    if (item.id === id) {
      item[property] = setter(item[property]);
      continue;
    }

    if (item.children.length) {
      item.children = setProperty(item.children, id, property, setter);
    }
  }

  return [...items];
}

export function setPropertyInFlatList<T extends keyof FlatItem>(
  items: FlatItem[],
  id: UniqueIdentifier,
  property: T,
  setter: (value: FlatItem[T]) => FlatItem[T]
) {
  return items.map((item) => {
    if (item.id === id) {
      return { ...item, [property]: setter(item[property]) };
    }
    return item;
  });
}

export function updateContentById(
  items: Item[],
  id: UniqueIdentifier,
  content: Partial<ItemContent>
) {
  return setProperty(items, id, "content", (itemContent) => ({
    ...itemContent,
    ...content,
  }));
}

export function updateContentByIdInFlatList(
  items: FlatItem[],
  id: UniqueIdentifier,
  content: Partial<ItemContent>
): FlatItem[] {
  // if there is no matching item, add it
  if (!items.find((item) => item.id === id)) {
    return [
      ...items,
      {
        id,
        parentId: null,
        depth: 0,
        index: 0,
        children: [],
        content: {
          title: "",
          done: false,
          ...content,
        },
      },
    ];
  }
  return setPropertyInFlatList(items, id, "content", (itemContent) => ({
    ...itemContent,
    ...content,
  }));
}

export function filterOutCompletedTasks(items: Item[]): Item[] {
  return items
    .filter((item) => !item.content.done)
    .map((item) => ({
      ...item,
      children: filterOutCompletedTasks(item.children || []),
    }));
}
