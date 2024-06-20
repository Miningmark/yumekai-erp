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
  //console.log("session from layout: ", session);
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
