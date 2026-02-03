// chatMessageMapper.ts
import { type ChatMessage } from "../../api/rooms";
import { type ChatMessage_UI } from "./ChatMessage_UI";

function getFileExt(name: string): string | undefined {
  const idx = name.lastIndexOf(".");
  if (idx <= 0 || idx === name.length - 1) return undefined;
  return name.slice(idx + 1).toLowerCase();
}

function removeExt(name: string): string {
  const idx = name.lastIndexOf(".");
  if (idx <= 0) return name;
  return name.slice(0, idx);
}

/**
 * systemMessage.payload가 any라서,
 * 여기서는 "있을 수도 있는 필드"를 조심스럽게 접근하는 방식으로 작성.
 */
function mapSystemMessage(api: ChatMessage): Pick<ChatMessage_UI, "type" | "content" | "campaignName" | "campaignContent" | "price" | "orderId"> {
  const sys = api.systemMessage;
  if (!sys) {
    return { type: "SYSTEM_MATCHED" }; // fallback (원하는 기본값으로 바꿔도 됨)
  }

  switch (sys.kind) {
    case "MATCHED_CAMPAIGN_CARD": {
      // 예: payload에 price/orderId/campaignName 등이 있다고 가정
      const p = sys.payload as any;
      return {
        type: "MATCHED_CAMPAIGN",
        campaignName: p?.brandName ?? p?.campaignName,
        campaignContent: p?.campaignTitle ?? p?.campaignContent,
        price: typeof p?.price === "number" ? p.price : undefined,
        orderId: typeof p?.orderId === "string" ? p.orderId : undefined,
      };
    }

    case "PROPOSAL_CARD": {
      const p = sys.payload as any;

      // re-proposal 여부를 payload로 구분 가능할 때만!
      const isReProposal = p?.isReProposal === true || p?.proposalType === "RE_PROPOSAL";

      return {
        type: isReProposal ? "RE_PROPOSAL" : "PROPOSAL",
        campaignName: p?.brandName ?? p?.campaignName,
        campaignContent: p?.campaignTitle ?? p?.campaignContent,
      };
    }

    case "PROPOSAL_STATUS_NOTICE": {
      const p = sys.payload as any;

      // accepted/rejected를 payload로 구분할 수 있어야 확정 가능
      // 예: p.status === "ACCEPTED" | "REJECTED"
      if (p?.status === "ACCEPTED") return { type: "SYSTEM_ACCEPTED", content: p?.text };
      if (p?.status === "REJECTED") return { type: "SYSTEM_REJECTED", content: p?.text };

      // 구분 불가하면 그냥 시스템 안내로 떨어뜨림
      return { type: "SYSTEM_MATCHED", content: p?.text };
    }

    default:
      return { type: "SYSTEM_MATCHED" };
  }
}

export function mapChatMessageToUI(api: ChatMessage, myUserId: number): ChatMessage_UI {
  // side
  const side: ChatMessage_UI["side"] =
    api.senderType === "SYSTEM" ? "system" : api.senderId === myUserId ? "me" : "other";

  // base
  const base: ChatMessage_UI = {
    id: String(api.messageId),
    side,
    type: "TEXT", // 임시, 아래에서 덮어씀
    time: api.createdAt, // 여기서 formatKoreanDateTime 쓰는 방식도 가능
    status: "sent", // API에 status가 없으니 기본 sent로 두고, sending/failed는 별도 로컬상태로 관리 추천
  };

  // type별 매핑
  if (api.messageType === "TEXT") {
    return {
      ...base,
      type: "TEXT",
      content: api.content ?? "",
    };
  }

  if (api.messageType === "IMAGE") {
    // UI 타입에 url 필드가 없어서 일단 content에 넣거나,
    // 렌더러에서 api.attachment.accessUrl을 직접 쓰도록 구조를 바꾸는 게 베스트
    return {
      ...base,
      type: "IMAGE",
      content: api.attachment?.accessUrl ?? "", // 임시 처리
    };
  }

  if (api.messageType === "FILE") {
    const originalName = api.attachment?.originalName ?? "file";
    return {
      ...base,
      type: "FILE",
      fileName: removeExt(originalName),
      ext: getFileExt(originalName),
      content: api.attachment?.accessUrl ?? "", // 다운로드 링크로 쓰고 싶으면
    };
  }

  // SYSTEM
  return {
    ...base,
    side: "system",
    ...mapSystemMessage(api),
  };
}

export function mapChatMessagesToUI(list: ChatMessage[], myUserId: number): ChatMessage_UI[] {
  return list.map((m) => mapChatMessageToUI(m, myUserId));
}
