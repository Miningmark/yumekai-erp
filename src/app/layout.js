import { GlobalStyles } from "@/lib/global-styles";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import MenuLayout from "@/components/menu/MenuLayout";
import Head from "next/head";

export const metadata = {
  title: "YumeKai Planungsboard",
  description: "Wilkommen beim YumeKai Planungsboard",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="de">
      <Head>
        <title>{metadata.title}</title>
        <meta name="referrer" content="no-referrer-when-downgrade" />
        {/* Weitere Meta-Tags und Header-Inhalte hier einfügen */}
      </Head>
      <body>
        <GlobalStyles />
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
