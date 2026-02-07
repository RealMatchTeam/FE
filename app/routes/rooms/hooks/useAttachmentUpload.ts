import { useCallback, useState } from "react";
import { uploadAttachment, type ChatAttachmentUploadResponse, type AttachmentType, type AttachmentUsage } from "../api/attachments";

/**
 * 업로드 훅
 * - uploading / error / lastUploaded 상태 제공
 * - upload(file, options) 호출하면 attachment 업로드 수행
 */
export default function useAttachmentUpload(params: {
  baseUrl: string;
  token: string | null;
  defaultUsage?: AttachmentUsage; // 기본 "CHAT"
}) {
  const { baseUrl, token, defaultUsage = "CHAT" } = params;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUploaded, setLastUploaded] =
    useState<ChatAttachmentUploadResponse | null>(null);

  const upload = useCallback(
    async (args: {
      file: File;
      attachmentType?: AttachmentType; // 미지정 시 자동 판별
      usage?: AttachmentUsage;
    }) => {
      if (!token) {
        throw new Error("로그인이 필요합니다. (token이 없습니다)");
      }

      const { file } = args;
      const usage = args.usage ?? defaultUsage;

      const attachmentType: AttachmentType =
        args.attachmentType ??
        (file.type.startsWith("image/") ? "IMAGE" : "FILE");

      setUploading(true);
      setError(null);

      try {
        const uploaded = await uploadAttachment({
          token,
          file,
          attachmentType,
          usage,
          baseUrl,
        });

        setLastUploaded(uploaded);
        return uploaded;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "업로드 실패";
        setError(msg);
        throw e;
      } finally {
        setUploading(false);
      }
    },
    [token, baseUrl, defaultUsage]
  );

  const reset = useCallback(() => {
    setError(null);
    setLastUploaded(null);
    setUploading(false);
  }, []);

  return {
    uploading,
    error,
    lastUploaded,
    upload,
    reset,
  };
}