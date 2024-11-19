'use client';

import { ReactNode } from 'react';
import MenuBar from '@/components/menuBar/MenuBar';
import { MenuBarProvider } from '@/context/MenuBarContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ContentWrapper from '../(seller)/_wrapper/ContentWrapper';
import { LayoutDashboard, ShoppingBag, Package, List } from 'lucide-react';
import { MenuItems } from '@/components/menuBar/MenuBar'

const menuItems: MenuItems[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard strokeWidth={1.5} /> },
  { name: 'Banners', href: '/admin/banners', icon: <ShoppingBag strokeWidth={1.5} /> },
  { name: 'Categories', href: '/admin/categories', icon: <Package strokeWidth={1.5} /> },
  { name: 'Sellers', href: '/admin/sellers-request', icon: <List strokeWidth={1.5} /> },
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

