"use client";

export default async function test(data) {
  const loginUrl = process.env.NEXTAUTH_URL + "/api/login";
  console.log("nextauth_url from test: ", loginUrl);

  const response = await fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referrer-Policy": "no-referrer-when-downgrade",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    console.log("Richtiger Login from test");
    const user = await response.json();
    console.log("user from test: ", user);

    return { login: true, user: user };
  } else {
    console.log("response error from test", response);
    return { login: false, message: response };
  }
}
