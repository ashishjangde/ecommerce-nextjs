'use client';

import { ReactNode } from 'react';
import MenuBar from '@/components/menuBar/MenuBar';
import { MenuBarProvider } from '@/context/MenuBarContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ContentWrapper from './_wrapper/ContentWrapper';
import { Home, Tag, Folder, Users, Settings } from 'lucide-react'; // Corrected icon names
import { MenuItems } from '@/components/menuBar/MenuBar'

const menuItems: MenuItems[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: <Home strokeWidth={1.5} /> }, 
  { name: 'Banners', href: '/admin/banners', icon: <Tag strokeWidth={1.5} /> }, 
  { name: 'Categories', href: '/admin/categories', icon: <Folder strokeWidth={1.5} /> }, 
  { name: 'Sellers', href: '/admin/sellers-request', icon: <Users strokeWidth={1.5} /> }, 
  { name: 'Users', href: '/admin/users', icon: <Users strokeWidth={1.5} /> }, 
  { name: 'Settings', href: '/admin/settings', icon: <Settings strokeWidth={1.5} /> }, 
];

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MenuBarProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="flex">
          <MenuBar menuItems={menuItems} />
          <ContentWrapper>{children}</ContentWrapper>
        </div>
      </DndProvider>
    </MenuBarProvider>
  );
}
