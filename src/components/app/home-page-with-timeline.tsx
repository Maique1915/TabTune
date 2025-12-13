"use client";

import React, { useState } from "react";
import { LibraryPanel } from "./library-panel";
import { MainStage } from "./main-stage";
import { TimelinePanel } from "./timeline-panel";
import { SettingsPanel } from "./settings-panel";

/**
 * HomePage com Timeline integrada
 * Esta é a nova versão que usa a timeline ao invés do SelectedChordsPanel
 */
export function HomePageWithTimeline() {
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <LibraryPanel />
        <main className="flex flex-1 flex-col overflow-hidden">
          <MainStage />
          {/* Timeline substitui o SelectedChordsPanel */}
          <TimelinePanel />
        </main>
        <SettingsPanel />
      </div>
    </div>
  );
}
