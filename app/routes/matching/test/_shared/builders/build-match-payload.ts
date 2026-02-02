import { useMatchingTestStore } from "../../../../../stores/matching-test";
import type { MatchesRequest } from "../types/matches.types";

function mustMany(v: number[] | null | undefined): number[] {
  if (!v || v.length < 1) throw new Error();
  return v;
}

function mustOne(v: number | null | undefined): number {
  if (v == null) throw new Error();
  return v;
}

export function buildMatchPayload(): MatchesRequest {
  const s = useMatchingTestStore.getState();

  return {
    beauty: {
      interestStyleTags: mustMany(s.selected.style),
      prefferedFunctionTags: mustMany(s.selected.function),
      skinTypeTags: mustMany(s.selected.skinType),
      skinToneTags: mustMany(s.selected.skinTone),
      makeupStyleTags: mustMany(s.selected.makeupStyle),
    },

    fashion: {
      interestStyleTags: mustMany(s.step2Selected.fashionStyle),
      preferredItemTags: mustMany(s.step2Selected.interestItem),
      preferredBrandTags: mustMany(s.step2Selected.brandType),
      heightTag: mustOne(s.fashionBody.heightTag),
      weightTypeTag: mustOne(s.fashionBody.weightTypeTag),
      topSizeTag: mustOne(s.fashionBody.topSizeTag),
      bottomSizeTag: mustOne(s.fashionBody.bottomSizeTag),
    },

    content: {
      sns: {
        url: s.snsUrl,
        mainAudience: {
          genderTags: mustMany(s.step3Selected.gender),
          ageTags: mustMany(s.step3Selected.ageGroup),
        },
        averageAudience: {
          videoLengthTags: mustMany(s.step3Selected.videoLength),
          videoViewsTags: mustMany(s.step3Selected.views),
        },
      },

      typeTags: mustMany(s.step3Chips.contentType),
      toneTags: mustMany(s.step3Chips.contentTone),
      prefferedInvolvementTags: mustMany(s.step3Chips.contentHardness),
      prefferedCoverageTags: mustMany(s.step3Chips.editingRange),
    },
  };
}
