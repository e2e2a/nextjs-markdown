/**
 * Maps markdown language IDs to display labels.
 * If not in the map, returns the word capitalized or as-is.
 */
export function getLanguageLabel(lang: string): string {
  const match = lang.match(/[a-zA-Z0-9+\-]+/);
  if (!match) return 'Copy';

  const normalized = match[0].toLowerCase();

  const map: Record<string, string> = {
    js: 'JavaScript',
    ts: 'TypeScript',
    py: 'Python',
    rs: 'Rust',
    rb: 'Ruby',
    cs: 'C-Sharp',
    cpp: 'C++',
    md: 'Markdown',
    sh: 'Shell',
    yml: 'YAML',
  };

  return map[normalized] || normalized;
}
