// utils/search-utils.ts

import { INode } from '@/types';

export interface SearchMatch {
  text: string;
  before: string;
  after: string;
  index: number;
}

export interface SearchResult {
  nodeId: string;
  title: string;
  matches: SearchMatch[];
}

export function performSearch(
  query: string,
  nodes: INode[] | null,
  contextLen = 80 // <--- 1. EDIT THIS for text length (characters)
): SearchResult[] {
  if (!query || query.length < 2) return [];
  if (!nodes || nodes.length <= 0) return [];
  const results: SearchResult[] = [];
  const regex = new RegExp(`(${query})`, 'gi');

  nodes.forEach(node => {
    const content = node.content || ''; // Ensure you have a plain-text field
    const matches: SearchMatch[] = [];
    let match;

    // Find all occurrences in the content
    while ((match = regex.exec(content)) !== null) {
      const start = Math.max(0, match.index - contextLen);
      const end = Math.min(content.length, match.index + match[0].length + contextLen);

      matches.push({
        text: match[0],
        before: content.substring(start, match.index),
        after: content.substring(match.index + match[0].length, end),
        index: match.index,
      });

      // Limit matches per file to keep it clean (Obsidian style)
      // if (matches.length >= 10) break;
    }

    if (matches.length > 0 || node.title.toLowerCase().includes(query.toLowerCase())) {
      results.push({ nodeId: node._id, title: node.title, matches });
    }
  });

  return results;
}
