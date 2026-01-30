import axios from "axios";

export const axiosInstance = axios.create({
  // 1. baseURL을 "/"로 수정 
  baseURL: "/", 
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. 인증 토큰 자동 삽입 
/*
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
*/