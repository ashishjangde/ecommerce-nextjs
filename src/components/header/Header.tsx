'use client';
import { Button } from '@nextui-org/button';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const suggestions = ['Laptops', 'Mobiles', 'Headphones', 'Smartwatches']; // Example suggestions
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Search Query:', searchQuery);
      setSelectedIndex(-1);
      setIsSuggestionsVisible(false); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchQuery) {
      setIsSuggestionsVisible(true);
    }

    if (isSuggestionsVisible) {
      if (e.key === 'ArrowDown') {
        e.preventDefault(); 
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev <= 0 ? suggestions.length - 1 : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0) {
          setSearchQuery(suggestions[selectedIndex]);
        }
        handleSearch(); // Trigger search without passing event
      } else if (e.key === 'Tab') {
        if (suggestions.length > 0) {
          setSearchQuery(suggestions[0]);
          setIsSuggestionsVisible(false);
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSuggestionsVisible(true); // Show suggestions when typing
    setSelectedIndex(-1); // Reset selection
  };

  useEffect(() => {
    if (selectedIndex >= 0 && inputRef.current) {
      inputRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <nav className="py-3.5 px-5 md:px-20 flex top-0 fixed w-full items-center justify-between bg-white bg-opacity-50 backdrop-blur-md shadow-md z-50">
      <img src="/logo.png" alt="Logo" className="h-7" />

      <form
        onSubmit={(e) => {
          e.preventDefault(); 
          handleSearch(); 
        }}
        className="relative flex-1 max-w-3xl mx-8 hidden md:flex"
      >
        <input
          type="text"
          ref={inputRef}
          placeholder="Search for products, brands, and more..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsSuggestionsVisible(true)}
          onBlur={() => setTimeout(() => setIsSuggestionsVisible(false), 100)}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-2.5 border border-gray-300 rounded-md focus:outline-none"
        />
        {isSuggestionsVisible && searchQuery && (
          <div className="absolute top-full left-0 w-full bg-white border rounded-md mt-1 shadow-lg z-50">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-3 hover:bg-gray-100 cursor-pointer ${
                  index === selectedIndex ? 'bg-blue-100' : ''
                }`}
                onMouseDown={() => {
                  setSearchQuery(suggestion);
                  setIsSuggestionsVisible(false); // Hide suggestions after selection
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </form>

      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
          className="text-2xl"
        >
          ☰
        </button>
      </div>

      <div
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } absolute top-full left-0 w-full bg-white shadow-md md:hidden`}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="p-4">
          <input
            type="text"
            placeholder="Search for products, brands, and more..."
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border rounded-md focus:outline-none"
          />
        </form>
        <Link href="/login">
          <Button className="w-full mt-3 text-white bg-blue-600 px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200">
            Sign in
          </Button>
        </Link>
      </div>

      <div className="hidden md:block">
        <Link href="/login">
          <Button className="text-white bg-blue-600 rounded-md px-5 py-2 hover:bg-blue-700 transition duration-200">
            Sign in
          </Button>
        </Link>
      </div>
    </nav>
  );
}
