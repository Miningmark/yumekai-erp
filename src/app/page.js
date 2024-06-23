"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";
import { useSession, getSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import yumekaiLogo from "/public/assets/images/yumekai_512px.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  padding: 0 2rem;
  background-color: var(--light);
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const LoginButton = styled(StyledButton)`
  font-size: 22px;
  background-color: var(--secondary-color);
  margin-top: 30px;
`;

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <h1>Wilkommen beim YumeKai Planungsbord</h1>
      </Header>
      <Main>
        <Hero>
          <Image src={yumekaiLogo} alt="Hero Image" width={300} height={300} />
          <Link href="/login">
            <LoginButton>Login</LoginButton>
          </Link>
        </Hero>
      </Main>
    </Container>
  );
}
