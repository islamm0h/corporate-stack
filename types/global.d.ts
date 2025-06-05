declare global {
  interface Window {
    particlesJS: (id: string, config: any) => void;
  }
}

export {};
