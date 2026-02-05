import { axiosInstance } from "../../../api/axios";

export async function uploadAttachment(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post("/api/v1/attachments", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}