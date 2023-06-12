import React from 'react';
import './globals.css';
import '../styles/fonts.css';


export default function RootLayout({children}) {
  return (
    <>
      <html lang="en">
        <body suppressHydrationWarning={true}>{children}</body>
      </html>
    </>
  );
}
