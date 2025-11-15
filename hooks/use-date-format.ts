export const dateFormatted = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    // "Nov 14, 2025"
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};
