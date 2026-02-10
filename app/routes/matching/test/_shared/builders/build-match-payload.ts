import { useMatchingTestStore } from "../../../../../stores/matching-test";
import type { MatchesRequest } from "../types/matches.types";

function requireOne(arr: number[], fieldName: string): number {
  const v = arr[0];
  if (typeof v !== "number") {
    throw new Error(`${fieldName} 값이 비어있습니다.`);
  }
  return v;
}

function requireNonEmpty(arr: number[], fieldName: string): number[] {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error(`${fieldName} 값이 비어있습니다.`);
  }
  return arr;
}

function requireNumber(v: number | null, fieldName: string): number {
  if (typeof v !== "number") {
    throw new Error(`${fieldName} 값이 비어있습니다.`);
  }
  return v;
}

export function buildMatchPayload(): MatchesRequest {
  const s = useMatchingTestStore.getState();

  const step1 = s.selected;
  const step2 = s.step2Selected;
  const body = s.fashionBody;

  const step3Sel = s.step3Selected;
  const step3Chips = s.step3Chips;

  const interestStyleTags = requireNonEmpty(
    step1.category,
    "beauty.interestStyleTags",
  );
  const prefferedFunctionTags = requireNonEmpty(
    step1.function,
    "beauty.prefferedFunctionTags",
  );

  const skinTypeTags = requireOne(step1.skinType, "beauty.skinTypeTags");
  const skinToneTags = requireOne(step1.skinTone, "beauty.skinToneTags");
  const makeupStyleTags = requireOne(
    step1.makeupStyle,
    "beauty.makeupStyleTags",
  );

  const heightTag = requireNumber(body.heightTag, "fashion.heightTag");
  const weightTypeTag = requireNumber(
    body.weightTypeTag,
    "fashion.weightTypeTag",
  );
  const topSizeTag = requireNumber(body.topSizeTag, "fashion.topSizeTag");
  const bottomSizeTag = requireNumber(
    body.bottomSizeTag,
    "fashion.bottomSizeTag",
  );

  const url = s.snsUrl.trim();
  if (!url) throw new Error("content.sns.url 값이 비어있습니다.");

  return {
    beauty: {
      interestStyleTags,
      prefferedFunctionTags,
      skinTypeTags,
      skinToneTags,
      makeupStyleTags,
    },
    fashion: {
      interestStyleTags: requireNonEmpty(
        step2.fashionStyle,
        "fashion.interestStyleTags",
      ),
      preferredItemTags: requireNonEmpty(
        step2.interestItem,
        "fashion.preferredItemTags",
      ),
      preferredBrandTags: requireNonEmpty(
        step2.brandType,
        "fashion.preferredBrandTags",
      ),
      heightTag,
      weightTypeTag,
      topSizeTag,
      bottomSizeTag,
    },
    content: {
      sns: {
        url,
        mainAudience: {
          genderTags: requireNonEmpty(
            step3Sel.gender,
            "content.sns.mainAudience.genderTags",
          ),
          ageTags: requireNonEmpty(
            step3Sel.ageGroup,
            "content.sns.mainAudience.ageTags",
          ),
        },
        averageAudience: {
          videoLengthTags: requireNonEmpty(
            step3Sel.videoLength,
            "content.sns.averageAudience.videoLengthTags",
          ),
          videoViewsTags: requireNonEmpty(
            step3Sel.views,
            "content.sns.averageAudience.videoViewsTags",
          ),
        },
      },
      typeTags: requireNonEmpty(step3Chips.contentType, "content.typeTags"),
      toneTags: requireNonEmpty(step3Chips.contentTone, "content.toneTags"),
      prefferedInvolvementTags: requireNonEmpty(
        step3Chips.contentHardness,
        "content.prefferedInvolvementTags",
      ),
      prefferedCoverageTags: requireNonEmpty(
        step3Chips.editingRange,
        "content.prefferedCoverageTags",
      ),
    },
  };
}
