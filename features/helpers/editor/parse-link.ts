export function normalizePath(filePath: string) {
  return decodeURIComponent(filePath).replace(/\\/g, '/').replace(/\.md$/i, '').trim();
}

export function resolveRelativePath(basePath: string, link: string) {
  const baseParts = basePath.split('/');
  baseParts.pop();
  const linkParts = decodeURIComponent(link).replace('.md', '').split('/');
  for (const part of linkParts) {
    if (part === '..') {
      baseParts.pop();
    } else if (part !== '.') {
      baseParts.push(part);
    }
  }

  const result = baseParts.join('/');
  return result;
}

export function parseLinkTarget(link: string, currentNodePath: string) {
  const decoded = decodeURIComponent(link);

  let filePath = '';
  let heading = '';

  if (decoded.startsWith('#')) {
    filePath = currentNodePath;
    heading = decoded.slice(1);
  } else if (decoded.includes('#')) {
    const parts = decoded.split('#');
    filePath = parts[0];
    heading = parts[1];
  } else {
    filePath = decoded;
  }

  filePath = normalizePath(filePath);

  return { filePath, heading };
}

export function classifyLink(link: string) {
  if (/^https?:\/\//i.test(link)) return 'external';
  if (link.startsWith('../') || link.startsWith('./')) return 'relative';
  if (link.endsWith('.md')) return 'relative';
  return 'internal';
}
