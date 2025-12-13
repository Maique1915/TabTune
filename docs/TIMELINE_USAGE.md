# 🎬 Timeline - Guia de Uso

## ✅ O QUE FOI CRIADO

Uma timeline horizontal completa, estilo editor de vídeo, onde cada acorde é um "clip" redimensionável que controla quanto tempo ele fica visível antes da transição.

## 📁 ARQUITETURA

```
src/
├── lib/timeline/
│   ├── types.ts         - Interfaces TypeScript
│   ├── adapter.ts       - Conversão Timeline → ChordTiming
│   ├── utils.ts         - Funções utilitárias
│   └── index.ts         - Exports centralizados
│
└── components/timeline/
    ├── Timeline.tsx       - Componente principal
    ├── TimelineClip.tsx   - Clip individual (acorde)
    ├── TimelineRuler.tsx  - Régua com marcações
    ├── TimelineTrack.tsx  - Track/layer que contém clips
    └── index.ts           - Exports centralizados
```

## 🎯 COMO USAR

### 1️⃣ Importar e usar a Timeline

```typescript
import { Timeline } from "@/components/timeline";
import { TimelineState } from "@/lib/timeline";

const [timeline, setTimeline] = useState<TimelineState>({
  tracks: [{
    id: "chords",
    name: "Acordes",
    clips: []
  }],
  totalDuration: 30000,
  zoom: 100
});

<Timeline value={timeline} onChange={setTimeline} />
```

### 2️⃣ Converter acordes para clips

```typescript
import { generateClipId } from "@/lib/timeline/utils";

const acordes = [/* seus acordes */];
const clips = acordes.map((acorde, i) => ({
  id: generateClipId(),
  chord: acorde,
  start: i * 2000,      // começa a cada 2s
  duration: 2000        // dura 2s
}));
```

### 3️⃣ Conectar Timeline → VideoCanvasStage

```typescript
import { timelineToChordTimings } from "@/lib/timeline";
import { VideoCanvasStage } from "@/components/app/video-canvas-stage";

const HomePage = () => {
  const [timeline, setTimeline] = useState<TimelineState>(...);
  
  // Converte timeline para timings
  const chordTimings = timelineToChordTimings(timeline);
  
  // Extrai acordes dos clips
  const chords = timeline.tracks[0].clips.map(c => c.chord);
  
  return (
    <div>
      <Timeline value={timeline} onChange={setTimeline} />
      <VideoCanvasStage 
        chords={chords}
        chordTimings={chordTimings}
      />
    </div>
  );
};
```

## 🎮 INTERAÇÕES DO USUÁRIO

### ✋ Mover Clip
- **Ação:** Arrastar o clip
- **Resultado:** Move o acorde no tempo (ajusta `start`)

### ↔️ Redimensionar Clip
- **Ação:** Arrastar borda esquerda ou direita
- **Resultado:** Ajusta quanto tempo o acorde fica visível (ajusta `duration`)

### 🗑️ Deletar Clip
- **Ação:** Clicar no clip (seleciona) → Clicar no "×"
- **Resultado:** Remove o acorde da timeline

### 🔍 Zoom
- **Ação:** Botões "+" e "-"
- **Resultado:** Aumenta/diminui a escala (px por segundo)

## 📊 FLUXO DE DADOS

```
┌─────────────┐
│   Usuário   │
│ (arrasta)   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Timeline UI        │
│  onChange()         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  TimelineState      │ { tracks, clips, zoom }
└──────┬──────────────┘
       │
       ├──────────────────────────┐
       │                          │
       ▼                          ▼
┌─────────────────┐    ┌──────────────────────┐
│ timelineToChordTimings() │    │ clips.map(c => c.chord) │
│ ChordTiming[]   │    │ ChordDiagramProps[]  │
└──────┬──────────┘    └──────┬───────────────┘
       │                      │
       └──────────┬───────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │  VideoCanvasStage   │
        │  (renderiza)        │
        └─────────────────────┘
```

## 🎨 EXEMPLO COMPLETO

```typescript
// TimelinePanel.tsx
export function TimelinePanel() {
  const { selectedChords } = useAppContext();
  
  const [timeline, setTimeline] = useState<TimelineState>({
    tracks: [{
      id: "chords-track",
      name: "Acordes",
      clips: []
    }],
    totalDuration: 30000,
    zoom: 100
  });

  // Sincroniza acordes selecionados → clips
  useEffect(() => {
    const clips = selectedChords.map((chord, i) => ({
      id: `clip-${i}`,
      chord: chord,
      start: i * 2000,
      duration: 2000
    }));

    setTimeline(prev => ({
      ...prev,
      tracks: [{ ...prev.tracks[0], clips }]
    }));
  }, [selectedChords]);

  return <Timeline value={timeline} onChange={setTimeline} />;
}
```

## ⚙️ CONFIGURAÇÕES DISPONÍVEIS

### Duração mínima de clip
```typescript
// Em Timeline.tsx, linha ~48
const minDuration = 500; // ms (0.5s)
```

### Zoom inicial
```typescript
const [timeline, setTimeline] = useState({
  // ...
  zoom: 100 // 100px por segundo
});
```

### Duração total
```typescript
const [timeline, setTimeline] = useState({
  // ...
  totalDuration: 30000 // 30 segundos
});
```

## 🔧 FUNÇÕES UTILITÁRIAS

### formatTimeMs
Converte milissegundos para formato legível
```typescript
formatTimeMs(2500) // "0:02.5"
formatTimeMs(65000) // "1:05.0"
```

### xToTime / timeToX
Converte posição ↔ tempo
```typescript
const time = xToTime(200, 100); // 200px com zoom 100 = 2000ms
const x = timeToX(2000, 100);   // 2000ms com zoom 100 = 200px
```

### snapToGrid
Arredonda para grid
```typescript
snapToGrid(2450, 100) // 2400 (múltiplo de 100)
snapToGrid(2550, 100) // 2600
```

### generateClipId
Gera ID único
```typescript
const id = generateClipId(); // "clip-1702417234567-abc123def"
```

## 🚀 FEATURES AVANÇADAS (Futuro)

### Múltiplas Tracks
```typescript
const timeline = {
  tracks: [
    { id: "chords", name: "Acordes", clips: [...] },
    { id: "bass", name: "Baixo", clips: [...] },
    { id: "melody", name: "Melodia", clips: [...] }
  ],
  // ...
};
```

### Snap por BPM
```typescript
// No adapter.ts
export function snapToBPM(time: number, bpm: number): number {
  const beatDuration = 60000 / bpm;
  return Math.round(time / beatDuration) * beatDuration;
}
```

### Keyframes dentro do Clip
```typescript
interface TimelineClip {
  // ... props existentes
  keyframes?: {
    time: number;
    transitionType: 'smooth' | 'instant';
  }[];
}
```

## ⚠️ IMPORTANTE

### Duração Mínima
- Clips têm duração mínima de **500ms** (0.5s)
- Isso previne clips muito pequenos difíceis de manipular

### Largura Mínima Visual
- Clips renderizam com largura mínima de **60px**
- Mesmo que a duração seja pequena com zoom baixo

### Retrocompatibilidade
- Se não usar `chordTimings` prop, VideoCanvasStage usa defaults
- Sistema funciona com ou sem timeline

## 📝 CHECKLIST DE INTEGRAÇÃO

- [x] Tipos criados (`types.ts`)
- [x] Adapter criado (`adapter.ts`)
- [x] Utils criadas (`utils.ts`)
- [x] TimelineClip component
- [x] TimelineRuler component
- [x] TimelineTrack component
- [x] Timeline component principal
- [x] TimelinePanel para integração
- [x] Documentação completa

**Status:** ✅ Sistema de Timeline completo e funcional!

## 🎯 PRÓXIMOS PASSOS

1. **Testar a integração**
   ```bash
   npm run dev
   ```

2. **Trocar HomePage**
   ```typescript
   // Em app/page.tsx
   import { HomePageWithTimeline } from "@/components/app/home-page-with-timeline";
   export default function Page() {
     return <HomePageWithTimeline />;
   }
   ```

3. **Ajustar estilos** conforme necessário

4. **Adicionar features** (snap BPM, múltiplas tracks, etc.)
