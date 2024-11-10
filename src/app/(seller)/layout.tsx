'use client';
import { useState } from 'react';
import MenuBar from '@/components/menuBar/MenuBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return (
    <div className="flex">
      <MenuBar onCollapse={handleCollapse} />

      <div
        className={`transition-all duration-300 flex-1 ${
          isCollapsed ? 'ml-20' : 'ml-[275px]'
        }`}
      >
        {children}
      </div>
    </div>
  );
}