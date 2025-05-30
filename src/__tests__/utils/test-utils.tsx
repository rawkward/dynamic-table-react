import React, { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createFreshTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0, // Для тестов можно установить в 0, чтобы не было долгого кеширования
        staleTime: 0,
      },
      mutations: { // Добавим для мутаций на всякий случай
        retry: false,
      }
    },
  });

const renderWithFreshClient = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => {
  const queryClient = createFreshTestQueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};


export * from "@testing-library/react";
export { renderWithFreshClient as renderWithProviders };