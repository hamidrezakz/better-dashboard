import type { Prisma } from "@/generated/prisma/client";
import { FAKE_USER_COUNT, fakeUserEmail, fakeUserId } from "../config";

const PERSIAN_FIRST = [
  "علی",
  "زهرا",
  "محمد",
  "فاطمه",
  "رضا",
  "مریم",
  "حسین",
  "سارا",
  "امیر",
  "نرگس",
  "مهدی",
  "لیلا",
  "کامران",
  "پریسا",
  "سینا",
  "آرین",
  "بهنام",
  "دانیال",
  "الهام",
  "شیدا",
  "پویا",
  "نیما",
  "آیدا",
  "فرهاد",
  "سمیرا",
  "کیوان",
  "مینا",
  "بهرام",
  "شهرزاد",
  "یاسین",
];

const PERSIAN_LAST = [
  "احمدی",
  "محمدی",
  "رضایی",
  "حسینی",
  "کریمی",
  "موسوی",
  "جعفری",
  "نوری",
  "صادقی",
  "اکبری",
  "رحیمی",
  "قاسمی",
  "ملکی",
  "زارعی",
  "باقری",
  "شریفی",
  "فرهادی",
  "نجفی",
  "طاهری",
  "یوسفی",
];

function displayName(index: number) {
  const first = PERSIAN_FIRST[index % PERSIAN_FIRST.length];
  const last =
    PERSIAN_LAST[
      Math.floor(index / PERSIAN_FIRST.length) % PERSIAN_LAST.length
    ];
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
