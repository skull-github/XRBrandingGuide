// Audio utility functions for baseball-themed sounds
let globalAudioContext = null;
let audioEnabled = false;
let userHasInteracted = false;

export function initializeAudio() {
  if (!userHasInteracted) return false;
  
  if (!globalAudioContext && (window.AudioContext || window.webkitAudioContext)) {
    try {
      globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (globalAudioContext.state === 'suspended') {
        globalAudioContext.resume();
      }
      audioEnabled = true;
      return true;
    } catch (e) {
      audioEnabled = false;
      return false;
    }
  }
  return audioEnabled;
}

export function playClickSound() {
  if (!userHasInteracted) return;
  
  if (!audioEnabled || !globalAudioContext) {
    if (!initializeAudio()) return;
  }
  
  try {
    // Create a "bat hitting ball" crack sound
    const bufferSize = globalAudioContext.sampleRate * 0.2;
    const noiseBuffer = globalAudioContext.createBuffer(1, bufferSize, globalAudioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = globalAudioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    
    const bandpass = globalAudioContext.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 1000;
    
    const gainNode = globalAudioContext.createGain();
    
    whiteNoise.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(globalAudioContext.destination);
    
    gainNode.gain.setValueAtTime(0.3, globalAudioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, globalAudioContext.currentTime + 0.1);
    
    whiteNoise.start(globalAudioContext.currentTime);
    whiteNoise.stop(globalAudioContext.currentTime + 0.1);
  } catch (e) {
    // Fallback - no sound if Web Audio API not supported
  }
}

// Initialize audio on first user interaction
export function setupAudioInteraction() {
  const handleFirstInteraction = () => {
    userHasInteracted = true;
    initializeAudio();
    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('touchstart', handleFirstInteraction);
    document.removeEventListener('keydown', handleFirstInteraction);
  };
  
  document.addEventListener('click', handleFirstInteraction);
  document.addEventListener('touchstart', handleFirstInteraction);
  document.addEventListener('keydown', handleFirstInteraction);
  
  return () => {
    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('touchstart', handleFirstInteraction);
    document.removeEventListener('keydown', handleFirstInteraction);
  };
}
