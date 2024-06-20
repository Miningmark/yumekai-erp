"use client";

import { z } from "zod";

import React, { useState, useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

const initialState = {
  message: "",
};

export default function Login() {
  const router = useRouter();
  const { data: session } = useSession();

  console.log("Session from login: ", session);

  const [errorMessage, setErrorMessage] = useState(null);
  const [modal, setModal] = useState(false);

  const handleAuth = (event) => {
    signIn(event.target.name, { callbackUrl: `${NEXTAUTH_URL}/dashboard` });
  };

  const handleCredentials = async (prevState, formData) => {
    const response = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });

    if (!!response.error) {
      setModal(true);
      setErrorMessage("Incorrect Username or Password");
      console.log(response.error);
    } else {
      router.push("/dashboard");
    }
  };

  const [state, formAction] = useFormState(handleCredentials, initialState);

  const [validUser, isUserValid] = useState(false);
  const [validPass, isPassValid] = useState(false);

  const [userMessage, setUserMessage] = useState("");
  const [passMessage, setPassMessage] = useState("");

  const setValue = (event) => {
    console.log(event.target.value);

    if (event.target.name == "username") {
      checkSchema(event.target.name, event.target.value);
    } else {
      checkSchema(event.target.name, event.target.value);
    }
  };

  const checkSchema = (field, value) => {
    const userSchema = z.string().min(5, { message: "Must be 5 or more characters long" });

    const passSchema = z
      .string()
      .min(8, { message: "Must be 8 or more characters long" })
      .regex(new RegExp(".*[A-Z].*"), { message: "Must conatain one uppercase character" })
      .regex(new RegExp(".*\\d.*"), { message: "Must contains one number" })
      .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"), {
        message: "Must contain one special character",
      });

    let res;

    if (field == "username") {
      res = userSchema.safeParse(value);
    } else {
      res = passSchema.safeParse(value);
    }

    if (res.error != undefined) {
      var obj = JSON.parse(res.error);

      console.log(value);

      if (field == "username") {
        isUserValid(false);
        setUserMessage(obj[0].message);
      } else {
        isPassValid(false);
        setPassMessage(obj[0].message);
      }
    } else {
      if (field == "username") {
        isUserValid(true);
        setUserMessage("");
      } else {
        isPassValid(true);
        setPassMessage("");
      }
    }
  };

  return (
    <>
      <h1>Login Page</h1>
      <form action={formAction}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" onChange={setValue} required />
          <p>{userMessage}</p>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" onChange={setValue} required />
          <p>{passMessage}</p>
        </div>

        {(() => {
          if (modal) {
            return (
              <div id="alert-2" role="alert">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span>Info</span>
                <div>{errorMessage}</div>
                <button
                  type="button"
                  onClick={() => {
                    setModal(false);
                  }}
                  data-dismiss-target="#alert-2"
                  aria-label="Close"
                >
                  <span>Close</span>
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
            );
          }
        })()}

        <button type="submit">Submit</button>
      </form>
    </>
  );
}
