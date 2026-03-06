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

export function performSearch(query: string, nodes: INode[] | null): SearchResult[] {
  if (!query || query.length < 2) return [];
  if (!nodes) return [];

  const operatorMatch = query.match(/^(tag|file|line):(.*)/i);
  const operator = operatorMatch ? operatorMatch[1].toLowerCase() : null;
  const searchTerm = (operatorMatch ? operatorMatch[2] : query).trim();

  if (!searchTerm && operator !== 'file') return [];

  return nodes.reduce((results: SearchResult[], node) => {
    const content = node.content || '';
    const matches: SearchMatch[] = [];

    if (operator === 'file') {
      if (node.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({ nodeId: node._id, title: node.title, matches: [] });
      }
      return results;
    }

    let regex: RegExp;
    if (operator === 'tag') {
      const cleanTerm = searchTerm.replace(/^#/, '');
      regex = new RegExp(`#(?!\\s)(${cleanTerm})(\\s|$)`, 'gi');
    } else if (operator === 'line') {
      const keywords = searchTerm.split(/\s+/).filter(k => k.length > 0);
      if (keywords.length === 0) return results;
      const lookaheads = keywords.map(k => `(?=.*${k})`).join('');
      regex = new RegExp(`^${lookaheads}.*$`, 'gim');
    } else {
      regex = new RegExp(`(${searchTerm})`, 'gi');
    }

    let match;
    while ((match = regex.exec(content)) !== null) {
      const lineStart = content.lastIndexOf('\n', match.index) + 1;
      const lineEnd = content.indexOf('\n', match.index);
      const end = lineEnd === -1 ? content.length : lineEnd;

      const matchedText = operator === 'line' ? content.substring(match.index, end) : match[1];
      const matchLen = operator === 'line' ? matchedText.length : match[1].length;
      const offset = operator === 'tag' ? 1 : 0;

      matches.push({
        text: operator === 'tag' ? `#${match[1]}` : matchedText,
        before: operator === 'line' ? '' : content.substring(lineStart, match.index),
        after: operator === 'line' ? '' : content.substring(match.index + matchLen + offset, end),
        index: match.index,
      });
    }

    const hasMatches = matches.length > 0;
    const isTextSearchMatch = !operator && node.title.toLowerCase().includes(searchTerm.toLowerCase());

    if (hasMatches || isTextSearchMatch) {
      results.push({ nodeId: node._id, title: node.title, matches });
    }

    return results;
  }, []);
}
