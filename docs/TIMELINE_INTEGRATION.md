# 🎬 Integração Timeline - Documentação Técnica

## ✅ O QUE FOI MODIFICADO

O arquivo `src/components/app/video-canvas-stage.tsx` foi preparado para receber tempos dinâmicos de cada acorde através de props, tornando-o "timeline-ready".

### Mudanças Realizadas:

#### 1️⃣ **Nova Interface: ChordTiming**
```typescript
export interface ChordTiming {
  holdDuration: number;      // Tempo que o acorde fica fixo (em segundos)
  transitionDuration: number; // Tempo da transição (em segundos)
  pauseDuration: number;      // Pausa entre transições (em segundos)
}
```

#### 2️⃣ **Nova Prop: chordTimings**
```typescript
interface VideoCanvasStageProps {
  // ... props existentes
  chordTimings?: ChordTiming[]; // Array de timings por acorde
}
```

#### 3️⃣ **Função Helper: getTimingForChord**
```typescript
const getTimingForChord = (index: number): ChordTiming => {
  if (chordTimings && chordTimings[index]) {
    return chordTimings[index];
  }
  // Defaults se não houver timing customizado
  return {
    holdDuration: 1.0,
    transitionDuration: animationType === "carousel" ? 1.0 : 0.8,
    pauseDuration: 0.5
  };
};
```

#### 4️⃣ **Substituição de Valores Hardcoded**

**ANTES:**
```typescript
const holdDuration = 1.0; // hardcoded ❌
const transitionDuration = 1.0;
const pauseDuration = 0.5;
```

**DEPOIS:**
```typescript
const firstTiming = getTimingForChord(0); // dinâmico ✅
const holdDuration = firstTiming.holdDuration;
const transitionDuration = firstTiming.transitionDuration;
const pauseDuration = firstTiming.pauseDuration;
```

#### 5️⃣ **Timing Individual por Acorde no Loop**

Agora cada acorde no loop de transição pode ter sua própria duração:

```typescript
for (let chordIndex = 0; chordIndex < chords.length - 1; chordIndex++) {
  const currentTiming = getTimingForChord(chordIndex); // 🎬 timing específico
  const currentFramesPerTransition = Math.ceil(fps * currentTiming.transitionDuration);
  const currentFramesPause = Math.ceil(fps * currentTiming.pauseDuration);
  
  // usa currentFramesPerTransition e currentFramesPause
}
```

---

## 🎯 COMO USAR (Exemplo)

### Sem Timeline (comportamento padrão mantido):
```typescript
<VideoCanvasStage chords={myChords} />
// Usa tempos default: 1.0s hold, 0.8s/1.0s transition, 0.5s pause
```

### Com Timeline (tempos customizados):
```typescript
const customTimings: ChordTiming[] = [
  { holdDuration: 2.5, transitionDuration: 1.2, pauseDuration: 0.3 }, // acorde 0
  { holdDuration: 1.8, transitionDuration: 0.9, pauseDuration: 0.4 }, // acorde 1
  { holdDuration: 3.0, transitionDuration: 1.0, pauseDuration: 0.5 }, // acorde 2
];

<VideoCanvasStage 
  chords={myChords} 
  chordTimings={customTimings} 
/>
```

**Resultado:** 
- Acorde 0 fica fixo por 2.5 segundos
- Transição para acorde 1 leva 1.2 segundos
- Acorde 1 fica fixo por 1.8 segundos
- etc.

---

## 🚀 PRÓXIMOS PASSOS

Agora que o `VideoCanvasStage` aceita tempos dinâmicos, você pode:

### 1️⃣ Criar o Componente de Timeline UI
- Timeline horizontal com clips redimensionáveis
- Drag & drop para mover acordes no tempo
- Resize das bordas dos clips para ajustar duração

### 2️⃣ Criar o Timeline Adapter
```typescript
// src/lib/timeline/adapter.ts
export function timelineToChordTimings(
  timeline: TimelineState
): ChordTiming[] {
  return timeline.tracks[0].clips.map(clip => ({
    holdDuration: clip.duration / 1000, // ms → s
    transitionDuration: 0.8, // pode vir do clip também
    pauseDuration: 0.3
  }));
}
```

### 3️⃣ Conectar Timeline → VideoCanvasStage
```typescript
const HomePage = () => {
  const [timeline, setTimeline] = useState<TimelineState>(...);
  const chordTimings = timelineToChordTimings(timeline);
  
  return (
    <div>
      <Timeline 
        value={timeline}
        onChange={setTimeline}
      />
      <VideoCanvasStage 
        chords={chords}
        chordTimings={chordTimings}
      />
    </div>
  );
};
```

---

## ⚠️ IMPORTANTE: RETROCOMPATIBILIDADE

✅ **O sistema continua funcionando sem passar `chordTimings`**
- Se não passar a prop, usa valores default
- Não quebra nenhum código existente
- 100% backward compatible

---

## 📊 DIAGRAMA DE FLUXO

```
┌──────────────────┐
│  Timeline UI     │ (usuário arrasta/redimensiona clips)
│  (horizontal)    │
└────────┬─────────┘
         │
         │ onChange(newTimeline)
         ▼
┌──────────────────┐
│ Timeline State   │ { tracks: [{ clips: [...] }] }
└────────┬─────────┘
         │
         │ timelineToChordTimings()
         ▼
┌──────────────────┐
│ ChordTiming[]    │ [{ holdDuration, transitionDuration, ... }]
└────────┬─────────┘
         │
         │ prop: chordTimings
         ▼
┌──────────────────┐
│ VideoCanvasStage │ getTimingForChord(index)
│                  │ → renderiza com tempos corretos
└──────────────────┘
```

---

## 🎨 VISUALIZAÇÃO DO CONCEITO

```
Timeline UI (horizontal):
┌─────────────────────────────────────────────────┐
│ [  C   ][    G    ][  Am  ][     F      ]      │
│  2.5s     1.8s      3.0s       4.2s             │
└─────────────────────────────────────────────────┘
         ↓ resize/drag
         ↓ muda duration do clip
         ↓
VideoCanvasStage usa esses tempos para:
- renderizar frames
- controlar animações
- gerar vídeo final
```

---

## 🔥 BENEFÍCIOS DESTA ABORDAGEM

✅ **Separação de responsabilidades**
- Timeline UI → controla QUANDO
- VideoCanvasStage → controla COMO renderizar

✅ **Flexibilidade**
- Cada acorde pode ter tempo diferente
- Fácil adicionar mais propriedades no futuro

✅ **Testabilidade**
- Pode testar renderização sem UI
- Pode testar UI sem renderização

✅ **Reutilizável**
- O mesmo VideoCanvasStage pode ser usado com qualquer fonte de timing

---

## 📝 CHECKLIST DE CONCLUSÃO

- [x] Interface `ChordTiming` criada
- [x] Prop `chordTimings` adicionada
- [x] Função `getTimingForChord` implementada
- [x] Valores hardcoded substituídos
- [x] Loop de transição usando timings individuais
- [x] Backward compatibility mantida
- [x] Documentação criada

**Status:** ✅ VideoCanvasStage está "timeline-ready"

**Próximo:** Criar Timeline UI + Adapter
