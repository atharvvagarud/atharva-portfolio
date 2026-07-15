import { RouteFade } from "@/components/motion/route-fade";

export default function Template({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RouteFade>{children}</RouteFade>;
}
