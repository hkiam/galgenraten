// Extend Vitest's expect with @testing-library/jest-dom matchers
import '@testing-library/jest-dom/vitest';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock PWA virtual module to avoid issues in tests
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    offlineReady: [false, () => {}] as const,
    needRefresh: [false, () => {}] as const,
    updateServiceWorker: () => {},
  }),
}));

// Mock CanvasRenderingContext2D for jsdom
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => ({
    clearRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    arc: () => {},
  })),
});

afterEach(() => {
  cleanup();
});
