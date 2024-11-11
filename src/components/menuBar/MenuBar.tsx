'use client';
import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  List,
  Grid,
  Users,
  Star,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useMenuBar } from '@/context/MenuBarContext';

interface MenuItems {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

const NavItem = ({
  item,
  isActive,
  isCollapsed,
}: {
  item: MenuItems;
  isActive: boolean;
  isCollapsed: boolean;
}) => (
  <Link
    href={item.href}
    className={`flex items-center rounded-lg transition-all duration-300 ease-in-out
      relative group cursor-pointer
      ${isCollapsed ? 'px-2 py-3 mx-2' : 'px-4 py-3 mx-3'}
      ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
    `}
  >
    <span
      className={`flex items-center justify-center min-w-[20px] h-5 ${
        isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-900'
      }`}
    >
      {item.icon}
    </span>
    {!isCollapsed && (
      <span className={`ml-3 text-sm font-medium ${isActive ? 'text-white' : ''}`}>
        {item.name}
      </span>
    )}
    {isCollapsed && (
      <div
        className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded
        opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50
        whitespace-nowrap"
      >
        {item.name}
      </div>
    )}
  </Link>
);

export default function MenuBar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useMenuBar(); // Use context instead of local state

  const menuItems: MenuItems[] = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard strokeWidth={1.5} /> },
    { name: 'Orders', href: '/seller/orders', icon: <ShoppingBag strokeWidth={1.5} /> },
    { name: 'Products', href: '/seller/products', icon: <Package strokeWidth={1.5} /> },
    { name: 'List Product', href: '/seller/list-product', icon: <List strokeWidth={1.5} /> },
    { name: 'Categories', href: '/seller/categories', icon: <Grid strokeWidth={1.5} /> },
    { name: 'Customers', href: '/seller/customers', icon: <Users strokeWidth={1.5} /> },
    { name: 'Reviews', href: '/seller/reviews', icon: <Star strokeWidth={1.5} /> },
  ];

  useEffect(() => {
    console.log('Navigated to:', pathname);
  }, [pathname]);

  return (
    <aside
      className={`h-screen flex flex-col fixed left-0 bg-white border-r border-gray-200
        transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="flex items-center justify-between border-b border-gray-200 h-16 px-6">
        {!isCollapsed && <h1 className="text-xl font-semibold text-gray-800">Seller</h1>}
        <button
          onClick={toggleCollapse} // Call toggleCollapse from context
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item, index) => (
          <NavItem
            key={index}
            item={item}
            isActive={pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <LogOut className="min-w-[20px] h-5" />
          {!isCollapsed && <span className="ml-3 text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
