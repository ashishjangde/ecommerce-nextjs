import { useMenuBar } from "@/context/MenuBarContext";
import { ReactNode } from "react";

export default function ContentWrapper({ children }: { children: ReactNode }) {
    const { isCollapsed } = useMenuBar();
  
    return (
      <div
        className={`transition-all duration-300 flex-1 ${
          isCollapsed ? 'ml-20' : 'ml-[275px]'
        }`}
      >
        {children}
      </div>
    );
  }
  