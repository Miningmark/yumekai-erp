import { GlobalStyles } from "@/lib/global-styles";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import MenuLayout from "@/components/menu/MenuLayout";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "YumeKai Planungsboard",
  description: "Wilkommen beim YumeKai Planungsboard",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  if (session) {
    console.log("session from menu: ", session);
  } else {
    console.log("session from menu: No Session");
  }

  return (
    <html lang="de">
      <body>
        <GlobalStyles />
        <StyledComponentsRegistry>
          <SessionProvider session={session}>
            <MenuLayout session={session}>{children}</MenuLayout>
          </SessionProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
