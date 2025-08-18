import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock PWA virtual module to avoid issues in tests
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    offlineReady: [false, () => {}] as const,
    needRefresh: [false, () => {}] as const,
    updateServiceWorker: () => {},
  }),
}));

