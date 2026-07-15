export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="sanity-studio-shell">{children}</main>;
}
