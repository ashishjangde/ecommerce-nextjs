'use client';

import { ReactNode } from 'react';
import MenuBar from '@/components/menuBar/MenuBar';
import { MenuBarProvider } from '@/context/MenuBarContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ContentWrapper from './_wrapper/ContentWrapper';
import { LayoutDashboard, ShoppingBag, Package, List, Grid, Users, Star } from 'lucide-react';
import { MenuItems } from '@/components/menuBar/MenuBar'
import SelllerAdminNav from '@/components/seller-admin-nav/SelllerAdminNav';

const menuItems: MenuItems[] = [
  { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard strokeWidth={1.5} /> },
  { name: 'Orders', href: '/seller/orders', icon: <ShoppingBag strokeWidth={1.5} /> },
  { name: 'Products', href: '/seller/products', icon: <Package strokeWidth={1.5} /> },
  { name: 'List Product', href: '/seller/list-product', icon: <List strokeWidth={1.5} /> },
  { name: 'Categories', href: '/seller/categories', icon: <Grid strokeWidth={1.5} /> },
  { name: 'Customers', href: '/seller/customers', icon: <Users strokeWidth={1.5} /> },
  { name: 'Reviews', href: '/seller/reviews', icon: <Star strokeWidth={1.5} /> },
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

