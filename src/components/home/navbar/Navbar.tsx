'use client'
import React, { useState, useRef, useEffect} from 'react'
import Link from 'next/link'
import { AlignLeft, X, Search, Heart, ShoppingCart, Store, TrendingUp, FileText, User, LogOut, LogIn, MoveLeft } from 'lucide-react'
import { Input } from '../../ui/input'
import { signOut, useSession } from 'next-auth/react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown"
import { Avatar } from '@nextui-org/avatar'
import { Button } from '../../ui/button'

import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { UserRole } from '@prisma/client'


type MenuItemColor = 'default' | 'danger' | 'success'
interface MenuItem {
    key: string
    label: string
    icon: React.ReactNode
    color: MenuItemColor
    href?: string
    action?: () => void
}

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [searchIconClicked, setSearchIconClicked] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    const { data: session, status } = useSession();
    const isLoggedIn =  status === "authenticated";
    const isSeller = session?.user?.roles?.includes(UserRole.SELLER);
   
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | KeyboardEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
                setSelectedIndex(-1)
              
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

      

    const searchSuggestions = [
        "kanika mann",
        "rr 310 top speed",
        "duke 390",
        "rc 390",
        "rs 457",
        "aprilia rs 457",
        "cfmoto 675sr",
        "kanika mann",
    ].filter(suggestion =>
        searchQuery && suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleClearSearch = () => {
        setSearchQuery("")
        setShowSuggestions(false)
        setSelectedIndex(-1)
    }

    const handleSearchFocus = () => {
        if (searchQuery) {
            setShowSuggestions(true)
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        setSelectedIndex(-1)
        if (e.target.value) {
            setShowSuggestions(true)
        } else {
            setShowSuggestions(false)
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion)
        setShowSuggestions(false)
        setSelectedIndex(-1)

    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            if (selectedIndex < searchSuggestions.length - 1) {
                setSelectedIndex(selectedIndex + 1)
            }
        } else if (e.key === "ArrowUp") {
            if (selectedIndex > 0) {
                setSelectedIndex(selectedIndex - 1)
            }
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            const selectedSuggestion = searchSuggestions[selectedIndex]
            setSearchQuery(selectedSuggestion)
            setShowSuggestions(false)
            setSelectedIndex(-1)
        }
    }

    return (<>
        <nav className='md:px-10  px-4 py-4 flex top-0 fixed w-full items-center h-[70px] justify-between bg-white bg-opacity-80 backdrop-blur-md shadow-md z-50'>
            <div className='flex justify-between items-center w-full'>
                <div className='flex items-center'>
                    {searchIconClicked && (
                        <MoveLeft
                            size={24}
                            className="text-gray-600 mr-3 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer transition duration-200"
                            onClick={() => setSearchIconClicked(!searchIconClicked)}
                        />
                    )}
                    {!searchIconClicked && (
                        <>
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
                                    <h1 className='text-2xl font-semibold text-gray-800 dark:text-gray-100'>NextStore</h1>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
                <div className={`${!searchIconClicked && 'hidden'}  md:flex justify-center flex-grow`}>
                    <div className='relative w-full md:w-2/4' ref={searchRef}>
                        <div className="flex w-full">
                            <div className="relative flex-grow">
                                <Input
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={handleSearchFocus}
                                    onKeyDown={handleKeyDown}
                                    className={`rounded-l-full ${searchQuery ? 'pl-12' : 'pl-3'} text-base pr-10 h-10 focus-visible:ring-0 focus-visible:ring-offset-0 border-r-0 bg-gray-50`}
                                    placeholder="Search"
                                />
                                {searchQuery && (
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        <Search className="w-4 h-4 mr-3" />
                                    </div>
                                )}
                                {searchQuery && (
                                    <div
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    >
                                        <X className="w-8 h-8 text-gray-500" />
                                    </div>
                                )}
                            </div>
                            <button className="px-6 bg-gray-200 border border-l-0 rounded-r-full hover:bg-gray-250 transition-colors">
                                <Search className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {showSuggestions && searchQuery && searchSuggestions.length > 0 && (
                            <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-50">
                                {searchSuggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedIndex === index ? 'bg-blue-100' : ''}`}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <Search className="w-4 h-4 mr-3 text-gray-400" />
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex items-center gap-4'>
                    <div className="hidden md:flex items-center gap-6">
                        {!isSeller ? (
                            <Link href="/become-seller" className="flex gap-2 items-center hover:text-gray-600">
                                <Store strokeWidth={1} size={25} />
                                <span>Become Seller</span>
                            </Link>
                        ) : null}
                        {isSeller ? (
                            <Link href="/dashboard" className="flex gap-2 items-center hover:text-gray-600">
                                <TrendingUp strokeWidth={1} size={25} className='text-green-600' />
                                <p>Dashboard</p>
                            </Link>
                        ) : null}
                        <div className="flex items-center gap-4">
                            <Link href="/wishlist" className="text-pink-600 ">
                                <Heart strokeWidth={1} fill="none" size={25} />
                            </Link>
                            <Link href="/cart" className="hover:text-gray-600">
                                <div className="relative">
                                    <div className="absolute top-[-11px] right-[-4px] w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                                        25
                                    </div>
                                    <ShoppingCart strokeWidth={1} size={25} />
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-center gap-4'>
                        {!searchIconClicked && (
                            <div className='flex mx-1 md:hidden'>
                                <Search onClick={() => setSearchIconClicked(!searchIconClicked)} strokeWidth={1} size={25} />
                            </div>
                        )}
                        <div>
                            {!isLoggedIn && !searchIconClicked && (
                                <Link href={'/login'} className="flex  items-center">
                                    <Button
                                        variant="ghost"
                                        className="rounded-full border md:w-full  h-8 w-24 md:h-full border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                                    >
                                        <User strokeWidth={1} size={25} className="mr-2" />
                                        <p>Login</p>
                                    </Button>
                                </Link>
                            )}
                        </div>
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

                {/* Mobile Sheeet */}

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

    </>
    )
}



