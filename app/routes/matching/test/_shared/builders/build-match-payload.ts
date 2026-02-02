import { useMatchingTestStore } from "../../../../../stores/matching-test";
import type { MatchesRequest } from "../types/matches.types";

function mustOne(arr: number[], label: string): number {
  if (arr.length !== 1) throw new Error(`${label}은(는) 1개만 선택해야 해요.`);
  return arr[0];
}
function mustMany(arr: number[], label: string): number[] {
  if (arr.length < 1) throw new Error(`${label}을(를) 1개 이상 선택해야 해요.`);
  return arr;
}
function mustTag(v: number | null, label: string): number {
  if (v == null) throw new Error(`${label}을(를) 선택해야 해요.`);
  return v;
}

export function buildMatchPayload(): MatchesRequest {
  const s = useMatchingTestStore.getState();

  return {
    beauty: {
      interestStyleTags: mustMany(s.selected.style, "뷰티 관심 스타일"),
      prefferedFunctionTags: mustMany(s.selected.function, "뷰티 관심 기능"),
      skinTypeTags: mustOne(s.selected.skinType, "피부 타입"),
      skinToneTags: mustOne(s.selected.skinTone, "피부 톤"),
      makeupStyleTags: mustOne(s.selected.makeupStyle, "메이크업 스타일"),
    },
    fashion: {
      interestStyleTags: mustMany(
        s.step2Selected.fashionStyle,
        "패션 관심 스타일",
      ),
      preferredItemTags: mustMany(s.step2Selected.interestItem, "관심 아이템"),
      preferredBrandTags: mustMany(
        s.step2Selected.brandType,
        "관심 브랜드 종류",
      ),
      heightTags: mustTag(s.fashionBody.heightTagId, "키"),
      weightTypeTags: mustTag(s.fashionBody.weightTypeTagId, "체형"),
      topSizeTags: mustTag(s.fashionBody.topSizeTagId, "상의 사이즈"),
      bottomSizeTags: mustTag(s.fashionBody.bottomSizeTagId, "하의 사이즈"),
    },
    content: {
      sns: {
        url: s.snsUrl,
        mainAudience: {
          genderTags: mustMany(s.step3Selected.gender, "주 시청자 성별"),
          ageTags: mustMany(s.step3Selected.ageGroup, "주 시청자 나이대"),
        },
        averageAudience: {
          videoLengthTags: mustMany(
            s.step3Selected.videoLength,
            "평균 영상 길이",
          ),
          videoViewsTags: mustMany(s.step3Selected.views, "평균 조회수"),
        },
      },
      typeTags: mustMany(s.step3Chips.contentType, "콘텐츠 종류"),
      toneTags: mustMany(s.step3Chips.contentTone, "콘텐츠 톤"),
      prefferedInvolvementTags: mustMany(
        s.step3Chips.contentHardness,
        "콘텐츠 관여도",
      ),
      prefferedCoverageTags: mustMany(
        s.step3Chips.editingRange,
        "콘텐츠 활용 범위",
      ),
    },
  };
}
