import { useMenuBar } from "@/context/MenuBarContext";
import { ReactNode } from "react";

export default function ContentWrapper({ children }: { children: ReactNode }) {
  const { isCollapsed, isHidden } = useMenuBar(); // Destructure isHidden

  return (
    <div
      className={`transition-all duration-300 flex-1 mt-16 ${
        isHidden
          ? '' 
          : isCollapsed
          ? 'ml-20'
          : 'ml-[275px]' 
      }`}
    >
      {children}
    </div>
  );
}
