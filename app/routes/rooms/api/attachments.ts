export type AttachmentType = "IMAGE" | "FILE";
export type AttachmentUsage = "CHAT" | "PUBLIC";

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export interface ChatAttachmentUploadResponse {
  attachmentId: number;
  attachmentType: "IMAGE" | "FILE";
  contentType: string;
  originalName: string;
  fileSize: number;
  accessUrl: string; 
  status: "READY";
  createdAt: string;
}

export interface ChatAttachment {
  attachmentId: number;
  attachmentType: "IMAGE" | "FILE";
  contentType: string;
  originalName: string;
  fileSize: number;
  accessUrl: string; 
}

export async function uploadAttachment(params: {
  token: string;
  file: File;
  attachmentType: AttachmentType;
  usage: AttachmentUsage; 
  baseUrl: string; 
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

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`서버 에러: ${res.status} ${text}`);
  }

  // ApiResponse 파싱
  const data = (await res.json()) as ApiResponse<ChatAttachmentUploadResponse>;

  // isSuccess: false
  if (!data.isSuccess) {
    throw new Error(data.message || "파일 업로드 중 에러 발생");
  }

  return data.result;
}
