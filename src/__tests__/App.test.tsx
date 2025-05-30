import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/__tests__/utils/test-utils.tsx";
import App from "@/app/App";

describe("App Component", () => {
  it("should render the main heading and dynamic table title, then user data", async () => {
    renderWithProviders(<App />);

    expect(
      screen.getByRole("heading", { name: /Dynamic Table/i, level: 1 }),
    ).toBeInTheDocument();

    // Ждем заголовок таблицы
    await screen.findByText(/Users Table/i, {}, { timeout: 5000 }); // Увеличим таймаут

    // Отладочный вывод DOM перед поиском таблицы
    // screen.debug(undefined, Infinity);

    // Ждем именно появления таблицы
    const table = await screen.findByRole("table", {}, { timeout: 10000 }); // Даем больше времени
    expect(table).toBeInTheDocument();

    // Отладочный вывод DOM после нахождения таблицы
    // screen.debug(undefined, Infinity);

    // Ждем появления данных в таблице
    expect(
      await screen.findByText("Alice", {}, { container: table, timeout: 5000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Bob", {}, { container: table, timeout: 5000 }),
    ).toBeInTheDocument();
  });
});
