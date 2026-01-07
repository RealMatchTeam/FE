import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/layout/Header";

export const Route = createFileRoute("/_main/chat")({
  component: ChatPage,
});

function ChatPage() {
  return (
    <div>
      <Header title="채팅" />
      <main className="p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 text-text-gray4 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
          <h3 className="text-title text-text-gray2 mb-2">채팅방이 없어요</h3>
          <p className="text-body1 text-text-gray3 text-center">
            매칭이 성사되면 채팅을 시작할 수 있어요
          </p>
        </div>
      </main>
    </div>
  );
}
