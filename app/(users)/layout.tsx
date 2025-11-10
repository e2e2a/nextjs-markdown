export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <div className="overflow-y-hidden">{children}</div>;
}
