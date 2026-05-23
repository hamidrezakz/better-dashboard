import type { Prisma } from "@/generated/prisma/client";
import { FAKE_USER_COUNT, fakeUserEmail, fakeUserId } from "../config";

const FIRST_NAMES = [
  "Alex",
  "Jordan",
  "Sam",
  "Taylor",
  "Casey",
  "Riley",
  "Morgan",
  "Quinn",
  "Avery",
  "Blake",
  "Cameron",
  "Dakota",
  "Emery",
  "Finley",
  "Harper",
  "Jamie",
  "Kai",
  "Logan",
  "Noah",
  "Parker",
  "Reese",
  "Sage",
  "Skyler",
  "Tatum",
  "River",
  "Rowan",
  "Phoenix",
  "Eden",
  "Ash",
  "Gray",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Thompson",
  "White",
];

function displayName(index: number) {
  const first = FIRST_NAMES[index % FIRST_NAMES.length];
  const last =
    LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length];
  return `${first} ${last} ${index + 1}`;
}

export function buildSeedUsers(): Prisma.UserCreateManyInput[] {
  const now = new Date();
  const rows: Prisma.UserCreateManyInput[] = [];

  for (let i = 0; i < FAKE_USER_COUNT; i++) {
    rows.push({
      id: fakeUserId(i),
      name: displayName(i),
      email: fakeUserEmail(i),
      emailVerified: i % 4 !== 0,
      createdAt: new Date(now.getTime() - (FAKE_USER_COUNT - i) * 86_400_000),
      updatedAt: now,
      metadata: { seed: true, index: i },
    });
  }

  return rows;
}
