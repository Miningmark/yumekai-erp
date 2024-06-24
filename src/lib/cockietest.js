"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000))
    .sign(key);
}

export async function decrypt(input) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function login(data) {
  console.log("formdata from cockietest", data);

  const loginUrl = process.env.NEXTAUTH_URL + "/test/login";
  console.log("nextauth_url from cockietest: ", loginUrl);

  const response = await fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referrer-Policy": "no-referrer-when-downgrade",
    },
    body: JSON.stringify(data),
  });

  if (data.name == "damin" && data.password == "Admin123!") {
    // Create the session
    const expires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    const user = { name: "admin" };
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    cookies().set("session", session, { expires, httpOnly: true });

    return true;
  }

  if (response.ok) {
    console.log("Richtiger Login from cockietest");
    const user = await response.json();
    console.log("user from cockietest: ", user);

    // Create the session
    const expires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    cookies().set("session", session, { expires, httpOnly: true });

    return true;
  } else {
    console.log("response error from cockietest", response);
    return false;
  }
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
  return true;
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession() {
  const session = NextRequest.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  if (!parsed) return;

  parsed.expires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
