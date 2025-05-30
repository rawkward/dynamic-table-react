import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { server } from "./mocks/server";
import { queryClient } from "@/shared/api/query-client";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const originalOffsetHeightDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "offsetHeight",
);
const originalOffsetWidthDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "offsetWidth",
);
const originalClientHeightDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "clientHeight",
);
const originalClientWidthDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "clientWidth",
);
const originalScrollHeightDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "scrollHeight",
);

// Нужно быо замокать эти свойства, чтобы тест не падал при работе виртуализатора
beforeAll(() => {
  server.listen({
    onUnhandledRequest(_, print) {
      print.error();
    },
  });

  try {
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      value: 600,
    });
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      value: 600,
    });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 600,
    });
  } catch (e) {
    console.warn(
      "Could not define HTMLElement prototype properties for testing:",
      e,
    );
  }
});

afterEach(() => {
  server.resetHandlers();
  queryClient.clear();
});

afterAll(() => {
  server.close();

  if (originalOffsetHeightDescriptor)
    Object.defineProperty(
      HTMLElement.prototype,
      "offsetHeight",
      originalOffsetHeightDescriptor,
    );
  if (originalOffsetWidthDescriptor)
    Object.defineProperty(
      HTMLElement.prototype,
      "offsetWidth",
      originalOffsetWidthDescriptor,
    );
  if (originalClientHeightDescriptor)
    Object.defineProperty(
      HTMLElement.prototype,
      "clientHeight",
      originalClientHeightDescriptor,
    );
  if (originalClientWidthDescriptor)
    Object.defineProperty(
      HTMLElement.prototype,
      "clientWidth",
      originalClientWidthDescriptor,
    );
  if (originalScrollHeightDescriptor)
    Object.defineProperty(
      HTMLElement.prototype,
      "scrollHeight",
      originalScrollHeightDescriptor,
    );
});
