import { Button } from '@nextui-org/button'
import Link from 'next/link'
import React from 'react'


export default function Header() {
    const menuList = [
        {
            name: "Home",
            path: "/",
        },
        {
            name: "About",
            path: "/about",
        },
        {
            name: "Contact",
            path: "/contact",
        }

    ]
    return (
        <nav className="py-3.5 px-20 flex top-0 fixed w-full items-center justify-between bg-white bg-opacity-70 backdrop-blur-md shadow-md">
        <img src="/logo.png" alt="Logo" className="h-7" />
        <div className="flex items-center gap-6 font-semibold">
          {menuList?.map((item) => (
            <Link href={item?.path} key={item?.name}>
              <span className="transition-colors duration-200 text-gray-700 hover:text-blue-600 mx-4">{item?.name}</span>
            </Link>
          ))}
        </div>
        <Link href="/login">
          <Button className="text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-200">Sign in</Button>
        </Link>
      </nav>
    )
}
