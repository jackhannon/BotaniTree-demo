/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, afterEach, } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';


declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
  interface Global {
    ResizeObserver: typeof ResizeObserver;
  }}

beforeAll(() => {
  expect.extend(matchers)
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

