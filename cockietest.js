"use server";

import { cookies } from "next/headers";

export default async function cockietest() {
  console.log("set Cockie from cockietest");

  const expires = new Date(Date.now() + 10 * 1000);
  cookies().set("session", "testcockie", { expires, httpOnly: true });
}
