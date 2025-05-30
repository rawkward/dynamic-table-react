import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "@/app/App.tsx";
import { AppProviders } from "@/app/providers.tsx";

describe("App Component", () => {
  it("should render the main title and DynamicTable component", () => {
    render(
      <AppProviders>
        <App />
      </AppProviders>,
    );

    expect(
      screen.getByRole("heading", {
        name: /Dynamic Table/i,
        level: 1,
      }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("dynamic-table")).toBeInTheDocument();
  });
});
