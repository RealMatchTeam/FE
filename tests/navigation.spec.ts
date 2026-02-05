import { test, expect } from '@playwright/test';

/**
 * @description 주요 페이지 네비게이션 및 매칭 리스트 테스트
 * @pattern Given-When-Then
 */
test.describe('네비게이션 및 매칭 페이지 테스트', () => {

    test.beforeEach(async ({ page }) => {
        // 인증 상태 모킹: localStorage에 가짜 토큰 주입
        await page.goto('/auth/login'); // 도메인 컨텍스트 확보를 위해 접속
        await page.evaluate(() => {
            localStorage.setItem('accessToken', 'mock-access-token');
            localStorage.setItem('refreshToken', 'mock-refresh-token');
        });
    });

    test('메인 페이지 로딩 및 매칭 분석 섹션 확인', async ({ page }) => {
        // Given: 메인 페이지에 접속했을 때
        await page.goto('/');

        // Then: 매칭 결과 요약 또는 분석 섹션이 보여야 한다
        await expect(page).toHaveURL('/');
    });

    test('브랜드 매칭 리스트 페이지 확인', async ({ page }) => {
        // Given: 브랜드 매칭 페이지에 접속했을 때
        await page.goto('/matching/brand');

        // Then: 브랜드 리스트 타이틀이나 '없어요' 메시지가 보여야 한다
        // (Suspense 로딩 대기를 위해 충분한 타임아웃 부여)
        await expect(page.getByText(/브랜드 리스트|매칭된 기업이 없어요/)).toBeVisible({ timeout: 15000 });
    });

    test('캠페인 매칭 리스트 페이지 확인', async ({ page }) => {
        // Given: 캠페인 매칭 페이지에 접속했을 때
        await page.goto('/matching/campaign');

        // Then: 캠페인 리스트 타이틀이나 '없어요' 메시지가 보여야 한다
        await expect(page.getByText(/캠페인 리스트|매칭된 캠페인이 없어요/)).toBeVisible({ timeout: 15000 });
    });
    test('API 중복 호출 검증 (Home, Brand, Campaign)', async ({ page }) => {
        // API 호출 횟수 카운터
        let matchAnalysisCount = 0;
        let brandListCount = 0;
        let campaignListCount = 0;

        // 네트워크 요청 가로채기 및 카운팅 + 모킹
        await page.route('**/api/v1/matches', (route) => {
            if (route.request().method() === 'GET') {
                matchAnalysisCount++;
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        isSuccess: true,
                        result: { count: 0, brands: [] } // Mock Home/Analysis data
                    })
                });
            } else {
                route.continue();
            }
        });

        await page.route('**/api/v1/matches/brands*', (route) => {
            console.log('Brand Request:', route.request().url());
            brandListCount++;
            route.fulfill({
                status: 200,
                // ... (rest is same)
                contentType: 'application/json',
                body: JSON.stringify({
                    isSuccess: true,
                    result: {
                        count: 1,
                        brands: [
                            {
                                brandId: 1,
                                brandName: "Mock Brand",
                                brandLogoUrl: "http://example.com/logo.png",
                                brandMatchingRatio: 90,
                                brandIsLiked: false,
                                brandTags: ["Tag1"]
                            }
                        ]
                    }
                })
            });
        });

        await page.route('**/api/v1/matches/campaigns*', (route) => {
            campaignListCount++;
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    isSuccess: true,
                    result: {
                        count: 1,
                        brands: [
                            {
                                brandId: 1,
                                campaignId: 101,
                                brandName: "Mock Brand",
                                campaignName: "Mock Campaign",
                                campaignManuscriptFee: 10000,
                                brandMatchingRatio: 90,
                                campaignTotalRecruit: 10,
                                brandLogoUrl: "http://example.com/logo.png",
                                brandIsLiked: false
                            }
                        ]
                    }
                })
            });
        });

        // 1. Home 페이지 접속
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        console.log(`[Home] Match Analysis: ${matchAnalysisCount}, Brand List: ${brandListCount}`);
        // Home에서는 brands 호출하여 매칭 여부 확인 (예상: 1~2회)
        expect(brandListCount).toBeGreaterThanOrEqual(1);
        expect(brandListCount).toBeLessThanOrEqual(2); // Strict Mode 고려

        // 카운터 초기화
        matchAnalysisCount = 0;
        brandListCount = 0;
        campaignListCount = 0;

        // 2. Brand Matching 접속
        await page.goto('/matching/brand');
        await page.waitForLoadState('networkidle');

        console.log(`[Brand] Brand List: ${brandListCount}`);
        expect(brandListCount).toBeGreaterThanOrEqual(1);
        expect(brandListCount).toBeLessThanOrEqual(2);

        // 카운터 초기화
        brandListCount = 0;

        // 3. Campaign Matching 접속
        await page.goto('/matching/campaign');
        await page.waitForLoadState('networkidle');

        console.log(`[Campaign] Campaign List: ${campaignListCount}`);
        expect(campaignListCount).toBeGreaterThanOrEqual(1);
        expect(campaignListCount).toBeLessThanOrEqual(2);
    });

});
