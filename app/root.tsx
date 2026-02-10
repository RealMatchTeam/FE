import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import MobileContainer from "./components/layout/MobileContainer";
import "./globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {

  registerServiceWorker();

  return (
    <QueryClientProvider client={queryClient}>
      <MobileContainer>
        <Outlet />
      </MobileContainer>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
