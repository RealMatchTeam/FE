import {
  type RouteConfig,
  route,
  layout,
  index,
} from "@react-router/dev/routes";

export default [
  // Auth routes
  route("auth", "routes/auth/route.tsx", [
    route("login", "routes/auth/login/route.tsx"),
    route("callback", "routes/auth/callback/route.tsx", [
      route("google", "routes/auth/callback/google/route.tsx"),
      route("kakao", "routes/auth/callback/kakao/route.tsx"),
      route("naver", "routes/auth/callback/naver/route.tsx"),
    ]),
    route("signup", "routes/auth/signup/route.tsx", [
      route("terms", "routes/auth/signup/terms/route.tsx"),
      route("type", "routes/auth/signup/type/route.tsx"),
      route("info", "routes/auth/signup/info/route.tsx"),
      route("info-more", "routes/auth/signup/info-more/route.tsx"),
      route("purpose", "routes/auth/signup/purpose/route.tsx"),
      route("success", "routes/auth/signup/success/route.tsx"),
    ]),
  ]),

  // Main layout routes
  layout("routes/_main.tsx", [
    index("routes/home/index.tsx"),

    route("matching", "routes/matching/route.tsx", [
      route("brand", "routes/matching/brand/route.tsx"),
      route("campaign", "routes/matching/campaign/route.tsx"),
    ]),

    route("matching/suggest", "routes/matching/suggest/route.tsx", [
      index("routes/matching/suggest/index.tsx"),
      route("create", "routes/matching/suggest/create/route.tsx"),
    ]),

    route("matching/test", "routes/matching/test/route.tsx", [
      route("step1", "routes/matching/test/step1/route.tsx"),
      route("step2", "routes/matching/test/step2/route.tsx"),
      route("step3", "routes/matching/test/step3/route.tsx"),
      route("result", "routes/matching/test/result/route.tsx"),
    ]),

    route("business", "routes/business/route.tsx", [
      route("calendar", "routes/business/calendar/route.tsx"),
      route("proposal", "routes/business/proposal/route.tsx"),
      route("rejection", "routes/business/rejection/route.tsx"),
    ]),

    route("chat", "routes/chat/route.tsx"),

    route("rooms", "routes/rooms/route.tsx", [
      route("brand/:brandId", "routes/rooms/$brandId.tsx"),
      route(":roomId", "routes/rooms/$roomId.tsx"),
    ]),

    route("mypage", "routes/mypage/route.tsx", [
      index("routes/mypage/mypage/route.tsx"),
      route("profileCard", "routes/mypage/profileCard/route.tsx"),
      route("traits", "routes/mypage/traits/route.tsx"),
      route("notification", "routes/mypage/notification/route.tsx", [
        index("routes/mypage/notification/index.tsx"),
        route("marketing", "routes/mypage/notification/marketing/route.tsx"),
      ]),
      route("edit", "routes/mypage/edit/route.tsx"),
      route("likes", "routes/mypage/likes/route.tsx"),
      route("privacy", "routes/mypage/privacy/route.tsx"),
      route("terms", "routes/mypage/terms/route.tsx"),
    ]),

    route("brand", "routes/brand-detail/route.tsx"),
    route("campaign", "routes/campaign-detail/route.tsx"),
  ]),

  // Campaign detail route (without main layout)
  route(
    "business/campaign/:campaignId",
    "routes/business/campaign/$campaignId.tsx",
  ),

  // 404 Catch-all
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
