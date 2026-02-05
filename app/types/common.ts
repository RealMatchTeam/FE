/**
 * 서버 공통 응답 규격
 */
export interface ApiResponse<T> {
    isSuccess: boolean;
    code: string;
    message: string;
    result: T;
}

/**
 * 페이지네이션 공통 규격
 */
export interface PaginatedResponse {
    count: number;
    [key: string]: any; // 도메인에 따라 brands, campaigns 등으로 내려옴
}
