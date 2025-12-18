
"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function EditorPage() {
    return (
        <div className="h-screen w-full bg-background overflow-hidden flex flex-col">
            {/* Top Menu Bar would go here */}
            <header className="h-12 border-b flex items-center px-4 shrink-0">
                <span className="font-bold">TabTune Editor</span>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <ResizablePanelGroup direction="horizontal">

                    {/* Left Sidebar: Assets / Inspector */}
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="border-r">
                        <div className="p-4 h-full">
                            <h2 className="font-semibold mb-2">Assets</h2>
                            {/* Asset Browser Component */}
                        </div>
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* Center: Viewport */}
                    <ResizablePanel defaultSize={60}>
                        <ResizablePanelGroup direction="vertical">
                            {/* Canvas Area */}
                            <ResizablePanel defaultSize={70} className="bg-neutral-900 relative">
                                <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
                                    Animation Viewport
                                </div>
                            </ResizablePanel>

                            <ResizableHandle />

                            {/* Bottom: Timeline */}
                            <ResizablePanel defaultSize={30} className="bg-background border-t">
                                <div className="p-2 h-full">
                                    <h2 className="text-xs font-semibold mb-1 uppercase text-muted-foreground">Timeline</h2>
                                    {/* Timeline Component */}
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* Right Sidebar: Properties */}
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="border-l">
                        <div className="p-4 h-full">
                            <h2 className="font-semibold mb-2">Properties</h2>
                            {/* Properties Panel */}
                        </div>
                    </ResizablePanel>

                </ResizablePanelGroup>
            </div>
        </div>
    );
}
