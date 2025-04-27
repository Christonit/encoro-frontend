import { type ReactNode } from "react";
import { Header } from "@/components/navigation/header";
import { useRouter } from "next/router";
import Head from "next/head";
// import Footer from "./components/Footer";
import { useBackend } from "@/hooks";
import { cn } from "@/lib/utils";
const Layout = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const router = useRouter();
  const backend = useBackend();
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://encoro-media.imglab-cdn.net" />
      </Head>
      {router.pathname === "/login" ? (
        children
      ) : (
        <div
          className={cn("encoro-container", {
            "bg-slate-100": router.pathname === "/",
          })}
        >
          <Header />

          <main className="content-container">{children}</main>

          {/* <Footer /> */}
        </div>
      )}
    </>
  );
};

export default Layout;
