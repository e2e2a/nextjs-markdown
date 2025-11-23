const COLORS = ['#ff6b6b', '#4dabf7', '#51cf66', '#fcc419', '#845ef7', '#f06595'];

export function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}
