import { http, HttpResponse } from "msw";
import { endpoint } from "@/shared/api/config";
import type { User } from "@/entities/user/types";

const baseURL = "http://localhost:3000";

const mockUsers: User[] = [
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
    profile_created_date: new Date().toISOString(),
    last_login_date: new Date().toISOString(),
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
    profile_created_date: new Date().toISOString(),
    last_login_date: new Date().toISOString(),
    posts_count: 10,
    id: 2,
  },
];

export const handlers = [
  http.get("http://localhost:3000/usersLong", ({ request }) => {
    console.log("[MSW] Intercepted GET request:", request.url);
    const url = new URL(request.url);
    const _start = Number(url.searchParams.get("_start")) || 0;
    const _limit = Number(url.searchParams.get("_limit")) || 10;

    const paginatedData = mockUsers.slice(_start, _start + _limit);

    console.log("[MSW] Responding with data (array):", paginatedData);
    return HttpResponse.json(paginatedData, {
      headers: {
        "x-total-count": String(mockUsers.length),
      },
    });
  }),

  http.post(`${baseURL}/${endpoint}`, async ({ request }) => {
    const newUserPayload = (await request.json()) as Omit<User, "id">;
    const newUser: User = {
      id: Math.floor(Math.random() * 1000) + 3,
      ...newUserPayload,
    };
    mockUsers.push(newUser);
    return HttpResponse.json(newUser, { status: 201 });
  }),
];
