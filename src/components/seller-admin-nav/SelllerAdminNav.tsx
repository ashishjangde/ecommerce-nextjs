'use client'
import React, { useState} from 'react'
import Link from 'next/link'
import { AlignLeft, X,  FileText, User, LogOut, LogIn } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown"
import { Avatar } from '@nextui-org/avatar'
import { Button } from '../ui/button'

import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";


type MenuItemColor = 'default' | 'danger' | 'success'
interface MenuItem {
    key: string
    label: string
    icon: React.ReactNode
    color: MenuItemColor
    href?: string
    action?: () => void
}

export default function SelllerAdminNav() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const {  status } = useSession();
    const isLoggedIn =  status === "authenticated";
    const baseItems: MenuItem[] = [
        {
          key: "viewProfile",
          href: "/profile",
          label: "View Profile",
          icon: <User className="h-4 w-4" />,
          color: "default",
        },
        {
          key: "orders",
          href: "/orders",
          label: "Orders",
          icon: <FileText className="h-4 w-4" />,
          color: "default",
        },
      ];
      
      const conditionalItems: MenuItem[] = isLoggedIn
       ? [
           {
             key: "signOut",
             label: "Sign Out",
             icon: <LogOut className="h-4 w-4" />,
             color: "danger",
             action: () => signOut(),
           },
         ]
       : [
           {
             key: "login",
             href: "/login",
             label: "Login",
             icon: <LogIn className="h-4 w-4" />,
             color: "success",
           },
         ];
     
      
      const items: MenuItem[] = [...baseItems, ...conditionalItems];
  return (
    <nav className='md:px-10  px-4 py-4 flex top-0 fixed w-full items-center h-[70px] justify-between bg-white shadow '>
            <div className='flex justify-between items-center w-full'>
                <div className='flex items-center'>
                        
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="md:hidden p-2 rounded-lg text-black dark:text-gray-300"
                                >
                                    {isMobileMenuOpen ? <X size={24} /> : <AlignLeft size={24} />}
                                </button>
                            </div>
                            <div>
                                <Link href="/">
                                    <h1 className='text-3xl md:px-12 font-semibold text-gray-800 dark:text-gray-100'>NextStore</h1>
                                </Link>
                            </div>
                </div>
                <div className='flex items-center gap-4'>
                    <div className='flex flex-row items-center justify-center gap-4'>
                    
                     {/* dropdown */}
                     <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar 
          src={"https://i.pravatar.cc/300"}
          className="w-8 h-8 cursor-pointer"
          fallback="U"
        />
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="User Actions" 
        items={items}
        className="w-48"
      >
        {(item) => (
          <DropdownItem
            key={item.key}
            color={item.color === 'danger' ? 'danger' : item.color === 'success' ? 'success' : 'default'}
            className={`
              py-2
              ${item.color === 'danger' ? 'text-danger' : ''}
              ${item.color === 'success' ? 'text-success' : ''}
            `}
            onClick={item.action}
          >
            {item.href ? (
              <Link 
                href={item.href} 
                className="flex items-center w-full"
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ) : (
              <div className="flex items-center">
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </div>
            )}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
                    </div>
                </div>


                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetContent side={"left"} className="sm:hidden">
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                        <div className="px-4 py-2"> 
                            <ul>
                                {items.map(item => (
                                    <li key={item.key} className="p-2">
                                        <Link href={item.href || '#'}>{item.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <SheetFooter>
                            <Button variant="secondary" onClick={() => setIsMobileMenuOpen(false)}>Close</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
             
            </div>
        </nav>
  )
}
