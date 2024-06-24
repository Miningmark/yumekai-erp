import { GlobalStyles } from "@/lib/global-styles";
import StyledComponentsRegistry from "@/lib/styled-components-registry";

export const metadata = {
  title: "YumeKai Planungsboard",
  description: "Wilkommen beim YumeKai Planungsboard",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <GlobalStyles />
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
