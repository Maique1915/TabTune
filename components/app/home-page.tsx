
import { LibraryPanel } from "./library-panel";
import { MainStage } from "./main-stage";
import { SelectedChordsPanel } from "./selected-chords-panel";
import { SettingsPanel } from "./settings-panel";

export function HomePage() {
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <LibraryPanel />
        <main className="flex flex-1 flex-col overflow-hidden">
          <MainStage />
          <SelectedChordsPanel />
        </main>
        <SettingsPanel />
      </div>
    </div>
  );
}
