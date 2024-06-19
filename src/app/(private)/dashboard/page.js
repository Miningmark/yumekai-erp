import { auth } from "@/auth";

export default async function DashBoard() {
  const session = await auth();

  console.log("session: ", session);

  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
}
