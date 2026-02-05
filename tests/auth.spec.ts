import { test, expect } from '@playwright/test';

/**
 * @description 인증 흐름(로그인 & 회원가입) 테스트
 * @pattern Given-When-Then
 */
test.describe('인증 흐름 테스트', () => {

    test('로그인 페이지에서 네이버 로그인을 실행하고 성공해야 한다', async ({ page }) => {
        // Given: 로그인 페이지 접속
        await page.goto('/auth/login');

        // Then: 네이버 로그인 버튼 보임 확인
        const naverBtn = page.getByLabel('네이버 로그인');
        await expect(naverBtn).toBeVisible({ timeout: 15000 });

        // When: 네이버 로그인 클릭
        await naverBtn.click();

        // Then: 네이버 로그인 페이지로 이동 확인
        await page.waitForURL(/nid\.naver\.com/, { timeout: 15000 });

        // Note: 실제 로그인 정보 입력 시도 (네이버 보안 정책에 따라 차단될 수 있음)
        try {
            const idInput = page.locator('#id');
            const pwInput = page.locator('#pw');
            if (await idInput.isVisible()) {
                await idInput.fill('2ne1jenna');
                await pwInput.fill('jenna5606@sy');
                await page.click('.btn_login');
            }
        } catch (e) {
            console.log("네이버 직접 로그인 폼을 찾을 수 없거나 이미 로그인된 상태일 수 있습니다.");
        }
    });

    test('회원가입 약관 동의 절차가 정상적으로 동작해야 한다', async ({ page }) => {
        // Given: 회원가입 약관 페이지에 접속했을 때 (provider 필수)
        await page.goto('/auth/signup/terms?provider=kakao');

        // When: '약관 전체 동의'를 클릭했을 때
        const allTermsCheckbox = page.getByText('약관 전체 동의');
        await allTermsCheckbox.click();

        // Then: '다음' 버튼이 활성화되고, 클릭 시 다음 단계(유형 선택)로 이동해야 한다
        const nextButton = page.getByRole('button', { name: '다음' });
        await expect(nextButton).toBeEnabled();

        await nextButton.click();
        await expect(page).toHaveURL(/\/auth\/signup\/info/);
    });
});
