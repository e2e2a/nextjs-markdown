import { BreadcrumbItem, DocumentTree } from '@/types';

function findDocumentPath(
  tree: DocumentTree[],
  targetId: string,
  path: DocumentTree[] = []
): DocumentTree[] | null {
  for (const node of tree) {
    const newPath = [...path, node];

    if (node.id === targetId) {
      return newPath;
    }

    if (node.children && node.children.length > 0) {
      const found = findDocumentPath(node.children, targetId, newPath);
      if (found) return found;
    }
  }

  return null;
}

export function generateBreadcrumbs(
  documentTree: DocumentTree[],
  currentDocument: DocumentTree
): BreadcrumbItem[] {
  let path: DocumentTree[] | null = [];
  if (currentDocument) {
    path = findDocumentPath(documentTree, currentDocument.id);

    if (!path) return [{ title: 'Dashboard', href: '/dashboard' }];
  } else {
    return [{ title: 'Dashboard', href: '/dashboard' }];
  }

  return [
    { title: 'Dashboard', href: '/dashboard' },
    ...path.map(doc => ({
      title: doc.title,
      href: `/dashboard/${doc.slug}`,
    })),
  ];
}
