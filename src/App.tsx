import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

// Router 인스턴스 생성
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    // 여기에 context 추가 가능 (auth 등)
  },
});

// TypeScript 타입 안전성을 위한 등록
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
