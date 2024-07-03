import ThemeWrapper from "@/app/ThemeWrapper";

export const metadata = {
  title: "YumeKai Planungsboard",
  description: "Wilkommen beim YumeKai Planungsboard",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
