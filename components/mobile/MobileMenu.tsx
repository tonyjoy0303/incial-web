'use client';

import { useState } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const menuItems = [
    { label: 'Branding', id: 'branding' },
    { label: 'Technology', id: 'technology' },
    { label: 'Experience', id: 'experience' },
    { label: 'Stats', id: 'stats' },
    { label: 'Clients', id: 'clients' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleMenuItemClick = (id: string) => {
    // Scroll to section will be implemented with slide system
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={onClose}
        />
      )}

      {/* Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-black z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white text-2xl"
        >
          ✕
        </button>

        {/* Menu items */}
        <nav className="pt-20 px-6">
          <ul className="space-y-6">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuItemClick(item.id)}
                  className="text-white text-lg font-medium hover:text-gray-300 transition-colors"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};
