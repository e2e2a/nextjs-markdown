// helpers/linkParser.ts
import path from 'path';

export interface ParsedLink {
  path: string;
  heading?: string;
  alias?: string;
}

/**
 * Normalize paths: decode %20, convert backslashes to slashes, remove .md, trim spaces
 */
export function normalizeFilePath(filePath: string) {
  return decodeURIComponent(filePath).replace(/\\/g, '/').replace(/\.md$/i, '').trim();
}

/**
 * Parse a Markdown link like:
 * - [Alias](File.md#Heading)
 * - [[Internal#Heading|Alias]]
 */
export function parseLink(rawLink: string): ParsedLink {
  let alias: string | undefined;
  let heading: string | undefined;
  let filePath = rawLink;

  // Split alias with pipe (|) for internal-style [[...|Alias]]
  if (rawLink.includes('|')) {
    [filePath, alias] = rawLink.split('|');
  }

  // Split heading (#Heading)
  if (filePath.includes('#')) {
    const parts = filePath.split('#');
    filePath = parts[0];
    heading = parts[1];
  }

  return {
    path: normalizeFilePath(filePath),
    heading,
    alias,
  };
}

/**
 * Resolve relative Markdown paths based on parent folder
 */
export function resolveRelativePath(basePath: string, linkPath: string) {
  const baseFolder = path.dirname(basePath).replace(/\\/g, '/');
  const joined = path.normalize(path.join(baseFolder, decodeURIComponent(linkPath))).replace(/\\/g, '/');
  return normalizeFilePath(joined);
}
