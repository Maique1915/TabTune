
import { LibraryPanel } from "./library-panel";
import { MainStage } from "./main-stage";
import { TimelinePanel } from "./timeline-panel";
import { SettingsPanel } from "./settings-panel";

export function HomePage() {
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <LibraryPanel />
        <main className="flex flex-1 flex-col overflow-hidden" style={{ display: 'grid', gridTemplateRows: '60% 40%' }}>
          <MainStage />
          <TimelinePanel />
        </main>
        <SettingsPanel />
      </div>
    </div>
  );
}
