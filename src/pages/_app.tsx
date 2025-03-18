import "@/styles/globals.css";
import "@/styles/app.scss";
import type { AppProps } from "next/app";

import { SessionProvider } from "next-auth/react";
import { EventsProvider } from "@/context/events";
import { HistoryProvider } from "@/context/history";
// pages/_app.js
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import Layout from "@/components/layout/layout";

if (typeof window !== "undefined") {
  // checks that we are client-side
  // if (process.env.ENV === "prod" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  console.log("ENV LOADING AND CHECKING", process.env.ENV);
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    loaded: (posthog) => {
      if (process.env.ENV === "development") posthog.debug(); // debug mode in development
    },
  });
  // }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PostHogProvider client={posthog}>
      <SessionProvider session={pageProps.session}>
        <EventsProvider>
          <HistoryProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </HistoryProvider>
        </EventsProvider>
      </SessionProvider>
    </PostHogProvider>
  );
}
