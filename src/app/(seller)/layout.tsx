'use client';

import { ReactNode } from 'react';
import MenuBar from '@/components/menuBar/MenuBar';
import { MenuBarProvider } from '@/context/MenuBarContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ContentWrapper from './_wrapper/ContentWrapper';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MenuBarProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="flex">
          <MenuBar />
          <ContentWrapper>{children}</ContentWrapper>
        </div>
      </DndProvider>
    </MenuBarProvider>
  );
}

