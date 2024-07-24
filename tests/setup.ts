/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, afterEach, } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';


Object.keys(matchers).forEach(matcher => {
  (expect as any)[matcher] = (matchers as any)[matcher];
});

declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
  interface Global {
    ResizeObserver: typeof ResizeObserver;
  }}

beforeAll(() => {

  class ResizeObserver {
    callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  global.ResizeObserver = ResizeObserver;
  window.ResizeObserver = ResizeObserver;
})

afterEach(() => {
  cleanup();
});

