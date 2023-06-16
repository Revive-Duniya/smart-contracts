import React from 'react';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import '../styles/fonts.css';

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <body suppressHydrationWarning={true} className="overflow-x-hidden">
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </body>
      </html>
    </>
  );
}
