import { describe, it, expect } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/__tests__/utils/test-utils.tsx";
import App from "@/app/App";
import { server } from "@/mocks/server.ts";
import { http, HttpResponse } from "msw";
import { endpoint } from "@/shared/api/config.ts";
import { mockUsers as globalMockUsers } from "@/mocks/handlers.ts";
import type {User} from "@/entities/user/types.ts";
import type {CreateUserPayload} from "@/features/users-form/api/create-user.ts";

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

  it("should submit the create user form and send data to the server", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    const createUserButtonPage = await screen.findByRole("button", {
      name: /Create User/i,
    });
    await waitFor(() => expect(createUserButtonPage).not.toBeDisabled());
    await user.click(createUserButtonPage);
    const dialog = await screen.findByRole("dialog");

    const newUserData = {
      first_name: "Testa",
      last_name: "Testova",
      email: "testova@example.com",
      age: "45",
      gender: "Female",
      country: "Testland",
      city: "Testville",
      interests: "Testing everything",
      relationship_status: "Married",
      education_level: "Master's Degree",
      job_title: "QA obviously",
    };

    await user.type(
      within(dialog).getByLabelText(/First Name/i),
      newUserData.first_name,
    );
    await user.type(
      within(dialog).getByLabelText(/Last Name/i),
      newUserData.last_name,
    );
    await user.type(within(dialog).getByLabelText(/Email/i), newUserData.email);
    await user.type(within(dialog).getByLabelText(/Age/i), newUserData.age);
    await user.type(
      within(dialog).getByLabelText(/Country/i),
      newUserData.country,
    );
    await user.type(within(dialog).getByLabelText(/City/i), newUserData.city);
    await user.type(
      within(dialog).getByLabelText(/Interests/i),
      newUserData.interests,
    );
    await user.type(
      within(dialog).getByLabelText(/Job Title/i),
      newUserData.job_title,
    );

    await user.click(within(dialog).getByRole("combobox", { name: /Gender/i }));
    await user.click(
      await screen.findByRole("option", {
        name: new RegExp(newUserData.gender, "i"),
      }),
    );

    await user.click(
      within(dialog).getByRole("combobox", { name: /Relationship Status/i }),
    );
    await user.click(
      await screen.findByRole("option", {
        name: new RegExp(newUserData.relationship_status, "i"),
      }),
    );

    await user.click(
      within(dialog).getByRole("combobox", { name: /Education Level/i }),
    );
    await user.click(
      await screen.findByRole("option", {
        name: new RegExp(newUserData.education_level, "i"),
      }),
    );

    const postSpy = vi.fn();
    server.use(
      http.post(`/${endpoint}`, async ({ request }) => {
        const requestBody = await request.json() as CreateUserPayload;

        postSpy(requestBody);

        const newUserForTable: User = {
          id: 999,
          ...requestBody,
        };

        globalMockUsers.push(newUserForTable);

        return HttpResponse.json(newUserForTable, { status: 201 });
      }),
    );

    const submitButton = within(dialog).getByRole("button", {
      name: /Create User/i,
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(1);
    });

    expect(postSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: newUserData.first_name,
        last_name: newUserData.last_name,
        email: newUserData.email,
        age: parseInt(newUserData.age, 10),
        gender: newUserData.gender,
        country: newUserData.country,
        city: newUserData.city,
        interests: newUserData.interests,
        relationship_status: newUserData.relationship_status,
        education_level: newUserData.education_level,
        job_title: newUserData.job_title,
        posts_count: 0,
        profile_created_date: expect.any(String),
        last_login_date: expect.any(String),
      }),
    );

    const tableElement = await screen.findByRole("table");
    await waitFor(
      () => {
        expect(
          within(tableElement).getByText(newUserData.first_name),
        ).toBeInTheDocument();
      },
      { timeout: 10000 },
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
