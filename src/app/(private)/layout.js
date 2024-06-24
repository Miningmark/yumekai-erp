import MenuLayout from "@/components/menu/MenuLayout";

export default async function LayoutLogin({ children }) {
  return (
    <>
      <MenuLayout>{children}</MenuLayout>
    </>
  );
}
