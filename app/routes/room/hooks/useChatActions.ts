import { useRef } from "react";
import { toast } from "sonner";
import type { Client } from "@stomp/stompjs";
import type { ChatMessage } from "../api/rooms";

type UploadFn = (args: {
  file: File;
  attachmentType: "IMAGE" | "FILE";
}) => Promise<{
  attachmentId: number;
  contentType: string;
  originalName: string;
  fileSize: number;
  accessUrl: string | null;
}>;

type Args = {
  roomId: number;
  myUserId: number;
  stompClient: React.MutableRefObject<Client | null>;
  sentMessageIds: React.MutableRefObject<Set<string>>;
  upload: UploadFn;

  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  text: string;
  setText: (v: string) => void;
  setIsSheetOpen: (v: boolean) => void;

  inputRef: React.RefObject<HTMLInputElement | null>;
};

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg"];
const ALLOWED_FILE_EXTENSIONS = [".pdf", ".doc", ".docx"];

function isAllowedImage(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.includes(file.type);
}

function isAllowedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return ALLOWED_FILE_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export default function useChatActions({
  roomId,
  myUserId,
  stompClient,
  sentMessageIds,
  upload,
  setMessages,
  text,
  setText,
  setIsSheetOpen,
  inputRef,
}: Args) {
  const isSending = useRef(false); // 중복 전송 방지

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !roomId || !stompClient.current?.connected) return;

    // 중복 전송 방지
    if (isSending.current) return;
    isSending.current = true;

    const clientId = crypto.randomUUID();
    sentMessageIds.current.add(clientId); // 보낸 ID 저장

    const payload = {
      roomId,
      messageType: "TEXT",
      content: trimmed,
      attachmentId: null,
      clientMessageId: clientId,
    };

    // 서버로 전송
    stompClient.current.publish({
      destination: "/app/v1/chat.send",
      body: JSON.stringify(payload),
    });

    const tempMessage: ChatMessage = {
      messageId: -Date.now(),
      roomId,
      senderId: myUserId,
      senderType: "USER",
      messageType: "TEXT",
      content: trimmed,
      attachment: null,
      systemMessage: null,
      createdAt: new Date().toISOString(),
      clientMessageId: clientId,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setText("");
    setIsSheetOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());

    // 짧은 딜레이 후 다시 전송 가능
    setTimeout(() => {
      isSending.current = false;
    }, 300);
  };

  const handlePickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!isAllowedImage(file)) {
      toast.error("PNG, JPEG 형식의 이미지만 첨부할 수 있습니다.");
      return;
    }

    const uploadingId = -Date.now();
    const uploadingMsg: ChatMessage = {
      messageId: uploadingId,
      roomId,
      senderId: myUserId,
      senderType: "USER",
      messageType: "IMAGE",
      content: null,
      attachment: null,
      systemMessage: null,
      createdAt: new Date().toISOString(),
      clientMessageId: null,
      _uploading: true,
      _uploadFileName: file.name,
    };

    setMessages((prev) => [...prev, uploadingMsg]);
    setIsSheetOpen(false);

    try {
      const uploaded = await upload({ file, attachmentType: "IMAGE" });

      const clientId = crypto.randomUUID();
      sentMessageIds.current.add(clientId);

      stompClient.current?.publish({
        destination: "/app/v1/chat.send",
        body: JSON.stringify({
          roomId,
          messageType: "IMAGE",
          content: null,
          attachmentId: uploaded.attachmentId,
          clientMessageId: clientId,
        }),
      });

      const tempMessage: ChatMessage = {
        messageId: -Date.now(),
        roomId,
        senderId: myUserId,
        senderType: "USER",
        messageType: "IMAGE",
        content: null,
        attachment: {
          attachmentId: uploaded.attachmentId,
          attachmentType: "IMAGE",
          contentType: uploaded.contentType,
          originalName: uploaded.originalName,
          fileSize: uploaded.fileSize,
          accessUrl: uploaded.accessUrl,
          status: "READY",
        },
        systemMessage: null,
        createdAt: new Date().toISOString(),
        clientMessageId: clientId,
      };

      setMessages((prev) =>
        prev.map((m) => (m.messageId === uploadingId ? tempMessage : m)),
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m.messageId !== uploadingId));
      const message =
        err instanceof Error ? err.message : "이미지 업로드에 실패했습니다.";
      if (message.includes("지원하지 않는")) {
        toast.error("지원하지 않는 파일 형식입니다.");
      } else {
        toast.error("이미지 업로드에 실패했습니다.");
      }
    }
  };

  const handlePickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!isAllowedFile(file)) {
      toast.error("PDF, DOC, DOCX 형식의 파일만 첨부할 수 있습니다.");
      return;
    }

    const uploadingId = -Date.now();
    const uploadingMsg: ChatMessage = {
      messageId: uploadingId,
      roomId,
      senderId: myUserId,
      senderType: "USER",
      messageType: "FILE",
      content: null,
      attachment: null,
      systemMessage: null,
      createdAt: new Date().toISOString(),
      clientMessageId: null,
      _uploading: true,
      _uploadFileName: file.name,
    };

    setMessages((prev) => [...prev, uploadingMsg]);
    setIsSheetOpen(false);

    try {
      const uploaded = await upload({ file, attachmentType: "FILE" });

      const clientId = crypto.randomUUID();
      sentMessageIds.current.add(clientId);

      stompClient.current?.publish({
        destination: "/app/v1/chat.send",
        body: JSON.stringify({
          roomId,
          messageType: "FILE",
          content: null,
          attachmentId: uploaded.attachmentId,
          clientMessageId: clientId,
        }),
      });

      const tempMessage: ChatMessage = {
        messageId: -Date.now(),
        roomId,
        senderId: myUserId,
        senderType: "USER",
        messageType: "FILE",
        content: null,
        attachment: {
          attachmentId: uploaded.attachmentId,
          attachmentType: "FILE",
          contentType: uploaded.contentType,
          originalName: uploaded.originalName,
          fileSize: uploaded.fileSize,
          accessUrl: uploaded.accessUrl,
          status: "READY",
        },
        systemMessage: null,
        createdAt: new Date().toISOString(),
        clientMessageId: clientId,
      };

      setMessages((prev) =>
        prev.map((m) => (m.messageId === uploadingId ? tempMessage : m)),
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m.messageId !== uploadingId));
      const message =
        err instanceof Error ? err.message : "파일 업로드에 실패했습니다.";
      if (message.includes("지원하지 않는")) {
        toast.error("지원하지 않는 파일 형식입니다.");
      } else {
        toast.error("파일 업로드에 실패했습니다.");
      }
    }
  };

  return { handleSend, handlePickImage, handlePickFile };
}