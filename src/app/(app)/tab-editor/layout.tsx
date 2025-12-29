
import React from 'react';
import Script from 'next/script';
import './tab-editor.css';

export default function TabEditorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Script
                type="text/javascript"
                src="https://unpkg.com/vexflow@4.2.2/build/cjs/vexflow.js"
                strategy="beforeInteractive"
            />

            {children}
        </>
    );
}
