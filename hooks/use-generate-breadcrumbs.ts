import { BreadcrumbItem, INode } from '@/types';

function findDocumentPath(tree: INode[], targetId: string, path: INode[] = []): INode[] | null {
  for (const node of tree) {
    const newPath = [...path, node];

    if (node._id === targetId) {
      return newPath;
    }

    if (node.children && node.children.length > 0) {
      const found = findDocumentPath(node.children as INode[], targetId, newPath);
      if (found) return found;
    }
  }

  return null;
}

export function generateBreadcrumbs(
  documentTree: INode[],
  currentDocument: INode
): BreadcrumbItem[] {
  let path: INode[] | null = [];
  if (currentDocument) {
    path = findDocumentPath(documentTree, currentDocument._id as string);

    if (!path) return [{ title: 'Project', _id: '', parentId: '' }];
  } else {
    return [{ title: 'Project', _id: '', parentId: '' }];
  }

  return [
    { title: 'Project', _id: '', parentId: '' },
    ...path.map(doc => ({
      title: doc.title!,
      _id: doc._id,
      parentId: doc.parentId,
    })),
  ];
}
