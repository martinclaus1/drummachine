declare global {
    interface Window {
      AudioContext?: AudioContext,
      webkitAudioContext?: AudioContext,
    }
  }

  export {}