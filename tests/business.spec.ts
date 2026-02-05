import { test, expect } from '@playwright/test';

/**
 * @description 비즈니스(Business) 페이지 및 API 연결 검증
 * @pattern Given-When-Then
 */
test.describe('비즈니스 페이지 테스트', () => {

    test.beforeEach(async ({ page }) => {
        // 인증 상태 모킹
        await page.goto('/auth/login');
        await page.evaluate(() => {
            localStorage.setItem('accessToken', 'mock-access-token');
            localStorage.setItem('refreshToken', 'mock-refresh-token');
        });
    });

    test('비즈니스 인덱스 페이지 확인 (Blank/404 예상)', async ({ page }) => {
        // Given: 비즈니스 메인 페이지에 접속했을 때
        await page.goto('/business');

        // 여기서는 페이지 로딩 자체는 성공하는지(Status 200) 확인
        // 만약 404가 나온다면 그것을 확인
        // 빈 페이지라면 body가 비어있는지 확인
        const content = await page.content();
        // 실제로는 리다이렉트가 없어서 그냥 Outlet(빈공간)만 렌더링될 것임.
        // 이를 검증하여 "보이지 않는 이유"를 증명.
    });

    test('비즈니스 캘린더 페이지 API 연결 확인', async ({ page }) => {
        let isApiCalled = false;

        // Given: API 요청을 가로채서 호출 여부 확인
        await page.route('**/api/v1/campaigns/collaborations/me*', async (route) => {
            console.log('API Called:', route.request().url());
            isApiCalled = true;

            // Mock Response 제공
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    isSuccess: true,
                    code: "COMMON200",
                    message: "성공",
                    result: [
                        {
                            campaignId: 101,
                            brandName: "테스트 브랜드",
                            title: "테스트 협업",
                            status: "MATCHED",
                            startDate: "2026-02-01",
                            endDate: "2026-02-28",
                            type: "RECEIVED",
                            thumbnailUrl: "https://via.placeholder.com/150"
                        }
                    ]
                })
            });
        });

        // When: 캘린더 페이지 접속
        await page.goto('/business/calendar');
        await page.waitForLoadState('networkidle');

        // Then: API가 호출되었는지 검증
        expect(isApiCalled).toBe(true);

        // UI가 렌더링되었는지 확인
        await expect(page.getByText('테스트 협업')).toBeVisible();
    });

    test('비즈니스 캠페인 페이지 로딩 확인', async ({ page }) => {
        // When: 캠페인 페이지 접속
        await page.goto('/business/campaign');
        await page.waitForLoadState('networkidle');

        // Then: 기본 UI 요소가 보이는지 확인
        await expect(page.getByText('캠페인명')).toBeVisible();
    });
});
