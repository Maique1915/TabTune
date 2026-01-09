
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
                src="https://cdnjs.cloudflare.com/ajax/libs/vexflow/4.2.2/vexflow-min.js"
                strategy="beforeInteractive"
            />

            <Script
                type="text/javascript"
                src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
                strategy="beforeInteractive"
            />

            {children}
        </>
    );
}
