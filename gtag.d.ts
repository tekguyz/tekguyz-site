interface Window {
  gtag?: (command: 'event', name: string, params?: Record<string, string>) => void;
}
