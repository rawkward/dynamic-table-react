import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { server } from "./mocks/server";
import { queryClient } from "@/shared/api/query-client";

beforeAll(() => {
  server.listen({
    onUnhandledRequest(req, print) {
      console.log(
        `[MSW] Found an unhandled ${req.method} request to ${req.url}`,
      );
      print.error();
    },
  });

  // Mock matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  server.resetHandlers();
  queryClient.clear();
});

afterAll(() => server.close());
