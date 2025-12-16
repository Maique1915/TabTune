let currentAudioSourceNode: AudioBufferSourceNode | null = null;
let audioContext: AudioContext | null = null;

export const extractWaveformData = (audioBuffer: AudioBuffer, targetPoints: number): number[] => {
  const rawData = audioBuffer.getChannelData(0);
  const samples = rawData.length;
  const blockSize = Math.floor(samples / targetPoints);
  const waveform = [];
  for (let i = 0; i < targetPoints; i++) {
    const blockStart = blockSize * i;
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(rawData[blockStart + j]);
    }
    waveform.push(sum / blockSize);
  }
  // Normalize the waveform
  const max = Math.max(...waveform);
  return waveform.map(v => v / max);
};

export const playAudio = async (audioUrl: string) => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Stop any currently playing audio
  if (currentAudioSourceNode) {
    currentAudioSourceNode.stop();
    currentAudioSourceNode.disconnect();
    currentAudioSourceNode = null;
  }

  try {
    const response = await fetch(audioUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);

    currentAudioSourceNode = source;

    source.onended = () => {
      if (currentAudioSourceNode === source) {
        currentAudioSourceNode = null;
      }
    };
  } catch (error) {
    console.error("Error playing audio:", error);
    currentAudioSourceNode = null;
  }
};

export const stopAudio = () => {
  if (currentAudioSourceNode) {
    currentAudioSourceNode.stop();
    currentAudioSourceNode.disconnect();
    currentAudioSourceNode = null;
  }
};