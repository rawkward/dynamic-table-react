import { http, HttpResponse } from "msw";
import { endpoint } from "@/shared/api/config";
import type { User } from "@/entities/user/types";
import type { CreateUserPayload } from "@/features/users-form/api/create-user";

export let mockUsers: User[] = [];

const initialMockUsers: User[] = [
  {
    first_name: "Alice",
    last_name: "Smith",
    email: "alice@example.com",
    age: 30,
    gender: "Female",
    country: "USA",
    city: "New York",
    interests: "Reading, Hiking",
    relationship_status: "Single",
    education_level: "Bachelor's Degree",
    job_title: "Software Engineer",
    profile_created_date: new Date(2025, 1, 1).toISOString(),
    last_login_date: new Date(2025, 1, 1).toISOString(),
    posts_count: 5,
    id: 1,
  },
  {
    first_name: "Bob",
    last_name: "Johnson",
    email: "bob@example.com",
    age: 24,
    gender: "Male",
    country: "Canada",
    city: "Toronto",
    interests: "Gaming, Coding",
    relationship_status: "In a relationship",
    education_level: "Master's Degree",
    job_title: "Frontend Developer",
    profile_created_date: new Date(2025, 1, 1).toISOString(),
    last_login_date: new Date(2025, 1, 1).toISOString(),
    posts_count: 10,
    id: 2,
  },
];

export const resetMockUsers = () => {
  mockUsers = JSON.parse(JSON.stringify(initialMockUsers));
};

resetMockUsers();

export const handlers = [
  http.get(`/${endpoint}`, ({ request }) => {
    const url = new URL(request.url);
    const _start = Number(url.searchParams.get("_start")) || 0;
    const _limit = Number(url.searchParams.get("_limit")) || 10;

    const paginatedData = mockUsers.slice(_start, _start + _limit);

    return HttpResponse.json(paginatedData, {
      headers: {
        "x-total-count": String(mockUsers.length),
        "Access-Control-Expose-Headers": "X-Total-Count",
      },
    });
  }),

  http.post(`/${endpoint}`, async ({ request }) => {
    try {
      const newUserPayload = (await request.json()) as CreateUserPayload;

      const newUser: User = {
        id: Math.floor(Math.random() * 100000),
        ...newUserPayload,
      };
      mockUsers.push(newUser);
      return HttpResponse.json(newUser, { status: 201 });
    } catch (e) {
      console.error("[MSW] Error processing POST request:", e);
      return HttpResponse.json(
        { message: "Error processing request" },
        { status: 500 },
      );
    }
  }),
];
