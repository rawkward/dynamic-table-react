import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders} from "@/__tests__/utils/test-utils.tsx";
import App from "@/app/App";

describe("App Component", () => {
  it("should render the main heading and dynamic table title", async () => {
    renderWithProviders(<App />);

    expect(
      screen.getByRole("heading", { name: /Dynamic Table/i, level: 1 }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Users Table/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });
  });
});
