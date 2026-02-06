export type AttachmentType = "IMAGE" | "FILE";
export type AttachmentUsage = "CHAT" | "PUBLIC";

export interface ChatAttachmentUploadResponse {
  attachmentId: number;
  attachmentType: "IMAGE" | "FILE";
  contentType: string;
  originalName: string;
  fileSize: number;
  accessUrl: string; // presigned (TTL)
  status: "READY";
  createdAt: string;
}

export interface ChatAttachment {
  attachmentId: number;
  attachmentType: "IMAGE" | "FILE";
  contentType: string;
  originalName: string;
  fileSize: number;
  accessUrl: string; // 서버가 메시지 응답에 주는 경우에만
}

/**
 * 주의:
 * - fetch를 쓸 때 Content-Type을 직접 multipart/form-data로 세팅하지 마세요.
 *   브라우저가 boundary 포함해서 자동으로 잡아줘야 합니다.
 */
export async function uploadAttachment(params: {
  token: string;
  file: File;
  attachmentType: AttachmentType;
  usage: AttachmentUsage; // 보통 "CHAT"
  baseUrl: string; // 예: import.meta.env.VITE_API_BASE_URL
}): Promise<ChatAttachmentUploadResponse> {
  const { token, file, attachmentType, usage, baseUrl } = params;

  const form = new FormData();
  form.append("attachmentType", attachmentType);
  form.append("usage", usage);
  form.append("file", file, file.name);

  const res = await fetch(`${baseUrl}/api/v1/attachments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Content-Type 넣지 말기!
    },
    body: form,
  });

  // 실패시 throw
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Attachment upload failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as ChatAttachmentUploadResponse;
  return data;
}