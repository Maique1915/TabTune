
import React, { useState } from 'react';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import MainStage from './components/MainStage';
import Timeline from './components/Timeline';
import { Chord, TimelineEvent } from './types';

const App: React.FC = () => {
  const [selectedChords, setSelectedChords] = useState<Chord[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    { id: '1', chordId: 'e-maj', startTime: 1, duration: 1.5 },
    { id: '2', chordId: 'am7-b5', startTime: 3.5, duration: 1.5 },
    { id: '3', chordId: 'fm7', startTime: 6, duration: 1.5 },
    { id: '4', chordId: 'bm7-9', startTime: 8.5, duration: 1.5 },
  ]);

  const handleSelectChord = (chord: Chord) => {
    setSelectedChords((prev) => {
        // Limited to 2 for preview as in screenshot
        if (prev.length >= 2) return [prev[1], chord];
        return [...prev, chord];
    });

    // Add to timeline automatically for demo
    const lastEvent = timelineEvents[timelineEvents.length - 1];
    const nextStart = lastEvent ? lastEvent.startTime + lastEvent.duration + 0.5 : 0;
    
    if (nextStart < 10) {
      setTimelineEvents([...timelineEvents, {
        id: Math.random().toString(),
        chordId: chord.id,
        startTime: nextStart,
        duration: 1.5
      }]);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950">
      <div className="flex flex-1 overflow-hidden">
        <SidebarLeft onSelectChord={handleSelectChord} />
        
        <div className="flex-1 flex flex-col">
          <MainStage currentChords={selectedChords} />
          <Timeline events={timelineEvents} />
        </div>

        <SidebarRight />
      </div>
    </div>
  );
};

export default App;
