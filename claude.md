{
  "openapi": "3.1.0",
  "info": {
    "title": "🔗 RealMatch API",
    "description": "RealMatch API 명세서입니다.",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://api.realmatch.co.kr/"
    }
  ],
  "security": [
    {
      "JWT Authentication": []
    }
  ],
  "tags": [
    {
      "name": "Business",
      "description": "비즈니스 API"
    },
    {
      "name": "Authentication",
      "description": "사용자 인증 API"
    },
    {
      "name": "chat",
      "description": "채팅 REST API"
    },
    {
      "name": "Campaign",
      "description": "캠페인 API"
    },
    {
      "name": "test",
      "description": "테스트용 API"
    },
    {
      "name": "Tag",
      "description": "태그 조회 API"
    },
    {
      "name": "Match",
      "description": "크리에이터-브랜드 매칭 API"
    },
    {
      "name": "Brand",
      "description": "브랜드 API"
    },
    {
      "name": "user",
      "description": "유저 관련 API"
    }
  ],
  "paths": {
    "/api/v1/users/me/edit": {
      "get": {
        "tags": [
          "user"
        ],
        "summary": "회원 정보 변경 기본 조회 API By 고경수",
        "description": "내 정보 수정에 필요한 정보를 조회합니다.",
        "operationId": "getMyEditInfo",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseMyEditInfoResponseDto"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "user"
        ],
        "summary": "회원정보 변경 API By 고경수",
        "description": "사용자의 닉네임, 주소, 상세주소를 수정합니다.",
        "operationId": "updateMyInfo",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MyEditInfoRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "수정 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseVoid"
                }
              }
            }
          },
          "400": {
            "description": "잘못된 요청",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseVoid"
                }
              }
            }
          },
          "404": {
            "description": "유저를 찾을 수 없음",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseVoid"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/matches": {
      "post": {
        "tags": [
          "Match"
        ],
        "summary": "크리에이터 매칭 분석",
        "description": "크리에이터 정보를 기반으로 매칭 분석 결과와 추천 브랜드/캠페인 목록을 반환합니다.\ncreatorAnalysis, highMatchingBrandList, highMatchingCampaignList를 포함합니다.\n",
        "operationId": "matchBrand",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MatchRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "매칭 분석 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseMatchResponseDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/chat/rooms": {
      "get": {
        "tags": [
          "chat"
        ],
        "summary": "채팅방 목록 조회 API By 여채현",
        "description": "status 기준으로 채팅방 목록을 조회합니다.\n정렬은 항상 lastMessageAt desc, roomId desc 기준입니다.\ncursor는 lastMessageAt|roomId 포맷을 그대로 재사용하세요.\n메시지가 없는 방은 목록에서 제외됩니다.\n",
        "operationId": "getRoomList",
        "parameters": [
          {
            "name": "status",
            "in": "query",
            "description": "채팅방 필터 상태 (LATEST: 최신순, COLLABORATING: 협업중)",
            "required": false,
            "schema": {
              "type": "string",
              "enum": [
                "LATEST",
                "COLLABORATING"
              ]
            }
          },
          {
            "name": "cursor",
            "in": "query",
            "description": "페이지네이션 커서 (lastMessageAt|roomId 형식)",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "size",
            "in": "query",
            "description": "페이지 크기 (기본값: 20)",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 20
            }
          }
        ],
        "responses": {
          "200": {
            "description": "채팅방 목록 조회 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatRoomListResponse"
                }
              }
            }
          },
          "COMMON401_1": {
            "description": "인증이 필요합니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatRoomListResponse"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "chat"
        ],
        "summary": "채팅방 생성/조회 API By 여채현",
        "description": "brandId, creatorId 기준으로 1:1 채팅방을 생성하거나 기존 방을 반환합니다.\n생성 직후 방 정보를 내려주며, 필요 시 상세 헤더는 별도 조회로 보완합니다.\n",
        "operationId": "createOrGetRoom",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ChatRoomCreateRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "채팅방 생성/조회 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatRoomCreateResponse"
                }
              }
            }
          },
          "COMMON400_1": {
            "description": "잘못된 요청입니다. (요청 데이터 검증 실패)",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatRoomCreateResponse"
                }
              }
            }
          },
          "COMMON401_1": {
            "description": "인증이 필요합니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatRoomCreateResponse"
                }
              }
            }
          },
          "CHAT400_2": {
            "description": "채팅방 생성 요청이 올바르지 않습니다. (brandId/creatorId가 null이거나 동일한 경우)",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatRoomCreateResponse"
                }
              }
            }
          },
          "CHAT403_2": {
            "description": "채팅방 멤버가 아닙니다. (요청한 사용자가 brandId나 creatorId가 아닌 경우)",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatRoomCreateResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/chat/attachments": {
      "post": {
        "tags": [
          "chat"
        ],
        "summary": "첨부 업로드 API By 여채현",
        "description": "첨부 파일을 업로드하고 메타 정보를 반환합니다.\nUPLOADED 상태여도 accessUrl을 즉시 사용할 수 있습니다.\nREADY는 내부 상태값입니다.\n",
        "operationId": "uploadAttachment",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "request": {
                    "$ref": "#/components/schemas/ChatAttachmentUploadRequest"
                  },
                  "file": {
                    "type": "string",
                    "format": "binary",
                    "description": "업로드할 파일"
                  }
                },
                "required": [
                  "file",
                  "request"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "첨부 업로드 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatAttachmentUploadResponse"
                }
              }
            }
          },
          "COMMON400_1": {
            "description": "잘못된 요청입니다. (요청 데이터 검증 실패)",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatAttachmentUploadResponse"
                }
              }
            }
          },
          "COMMON401_1": {
            "description": "인증이 필요합니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatAttachmentUploadResponse"
                }
              }
            }
          },
          "CHAT404_2": {
            "description": "첨부 파일을 찾을 수 없습니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatAttachmentUploadResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/campaigns/{campaignId}/apply": {
      "post": {
        "tags": [
          "Business"
        ],
        "summary": "캠페인 지원 API by 박지영",
        "description": "해당 캠페인을 지원합니다.\n(아직 제출 프로필을 받지 않습니다. 우선은 지원 이유만 응답에 포함시켜주세요.\n추후 제출 프로필을 받는 것도 추가하겠습니다.)\n",
        "operationId": "applyCampaign",
        "parameters": [
          {
            "name": "campaignId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CampaignApplyRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseString"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/campaigns/request": {
      "post": {
        "tags": [
          "Business"
        ],
        "summary": "캠페인 제안 생성 API by 박지영",
        "description": "크리에이터가 브랜드에 캠페인을 제안합니다.\n\n신규 캠페인인 경우 campaignId null을 보내주세요.\n기존 캠페인인 경우 campaignId을 보내주세요.\n\n기타인 경우 customValue를 포함해서 보내주세요.\n\n태그 ID는 api/v1/tags/content에서 확인할 수 있습니다.\n",
        "operationId": "requestCampaignProposal",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CampaignProposalRequestDto"
              },
              "examples": {
                "CampaignProposalRequestExample": {
                  "summary": "캠페인 제안 요청 예시",
                  "description": "CampaignProposalRequestExample",
                  "value": {
                    "brandId": 1,
                    "campaignId": null,
                    "campaignName": "비플레인 선크림 리뷰 캠페인",
                    "description": "비플레인 선크림을 체험하고 솔직한 리뷰 콘텐츠를 제작해주세요.",
                    "formats": [
                      {
                        "id": "32000000-0000-0000-0000-000000000000"
                      }
                    ],
                    "categories": [
                      {
                        "id": "31310000-0000-0000-0000-000000000000",
                        "customValue": "성분 분석 리뷰"
                      }
                    ],
                    "tones": [
                      {
                        "id": "31360000-0000-0000-0000-000000000000"
                      },
                      {
                        "id": "31330000-0000-0000-0000-000000000000"
                      }
                    ],
                    "involvements": [
                      {
                        "id": "32320000-0000-0000-0000-000000000000"
                      }
                    ],
                    "usageRanges": [
                      {
                        "id": "32350000-0000-0000-0000-000000000000"
                      }
                    ],
                    "rewardAmount": 200000,
                    "productId": 5,
                    "startDate": "2025-03-01",
                    "endDate": "2025-03-15"
                  }
                }
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseString"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/brands/{brandId}/like": {
      "post": {
        "tags": [
          "Brand"
        ],
        "summary": "브랜드 좋아요 토글",
        "description": "브랜드 ID로 좋아요를 추가하거나 취소합니다.",
        "operationId": "likeBrand",
        "parameters": [
          {
            "name": "brandId",
            "in": "path",
            "description": "좋아요 토글할 브랜드의 ID",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "토글 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseListBrandLikeResponseDto"
                }
              }
            }
          },
          "404": {
            "description": "존재하지 않는 브랜드",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/auth/signup": {
      "post": {
        "tags": [
          "Authentication"
        ],
        "summary": "추가 정보 회원가입 API By 고경수",
        "description": "소셜 로그인 후, 닉네임, 생년월일, 역할(CREATOR/BRAND), 약관 동의 등 필수 정보를 입력하여 최종적으로 서비스를 이용할 수 있는 권한을 부여하는 API입니다.",
        "operationId": "signup",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SignupCompleteRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseOAuthTokenResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/auth/refresh": {
      "post": {
        "tags": [
          "Authentication"
        ],
        "summary": "액세스 토큰 재발급 API By 고경수",
        "description": "리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.",
        "operationId": "refresh",
        "parameters": [
          {
            "name": "RefreshToken",
            "in": "header",
            "description": "Bearer {RefreshToken}",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseOAuthTokenResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/users/me": {
      "get": {
        "tags": [
          "user"
        ],
        "summary": "마이페이지 메인 조회 API By 고경수",
        "description": "로그인한 사용자의 마이페이지 정보를 조회합니다.",
        "operationId": "getMyPage",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseMyPageResponseDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/users/me/social-login": {
      "get": {
        "tags": [
          "user"
        ],
        "summary": "소셜 로그인 연동 정보 조회 API By 고경수",
        "description": "현재 사용자의 소셜 로그인 연동 상태를 조회합니다. 카카오, 네이버, 구글 계정의 연동 여부를 확인할 수 있습니다.",
        "operationId": "getSocialLoginInfo",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseMyLoginResponseDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/users/me/scrap": {
      "get": {
        "tags": [
          "user"
        ],
        "summary": "내 찜 목록 조회 API By 고경수",
        "description": "찜한 브랜드 또는 캠페인 목록을 조회합니다. GUEST 권한이거나 매칭 테스트 기록이 없으면 접근할 수 없습니다. (하드코딩)",
        "operationId": "getMyScrap",
        "parameters": [
          {
            "name": "type",
            "in": "query",
            "description": "찜 타입 (brand 또는 campaign)",
            "required": true,
            "schema": {
              "type": "string"
            },
            "example": "brand"
          },
          {
            "name": "sort",
            "in": "query",
            "description": "정렬 기준",
            "required": false,
            "schema": {
              "type": "string",
              "default": "matchingRate"
            },
            "example": "matchingRate"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseMyScrapResponseDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/users/me/profile-card": {
      "get": {
        "tags": [
          "user"
        ],
        "summary": "마이페이지 프로필 카드 조회 API By 고경수",
        "description": "로그인한 사용자의 마이페이지 프로필 카드 정보를 조회합니다. (하드코딩 - 프로필 카드 데이터 삽입 안했습니다!!)",
        "operationId": "getMyProfileCard",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseMyProfileCardResponseDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/tags/content": {
      "get": {
        "tags": [
          "Tag"
        ],
        "summary": "컨텐츠 태그 조회",
        "description": "컨텐츠 태그 목록을 조회합니다.",
        "operationId": "getContentTags",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseContentTagResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/matches/campaigns/{userId}": {
      "get": {
        "tags": [
          "Match"
        ],
        "summary": "매칭 캠페인 목록 조회",
        "description": "사용자 ID를 기반으로 매칭률이 높은 캠페인 목록을 조회합니다.\n캠페인 정보, 원고료, 모집 현황 등을 포함합니다.\n",
        "operationId": "getMatchingCampaigns",
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "description": "사용자 ID",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "캠페인 목록 조회 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseMatchCampaignResponseDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/matches/brands/{userId}": {
      "get": {
        "tags": [
          "Match"
        ],
        "summary": "매칭 브랜드 목록 조회",
        "description": "사용자 ID를 기반으로 매칭률이 높은 브랜드 목록을 조회합니다.\n브랜드 정보와 매칭률, 태그 등을 포함합니다.\n",
        "operationId": "getMatchingBrands",
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "description": "사용자 ID",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "브랜드 목록 조회 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseMatchBrandResponseDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/chat/rooms/{roomId}": {
      "get": {
        "tags": [
          "chat"
        ],
        "summary": "채팅방 헤더 조회 API By 여채현",
        "description": "채팅방 헤더에 필요한 상대 정보와 상태 값을 반환합니다.\n협업중 여부, 협업 요약 바 등 UI 구성에 필요한 필드를 포함합니다.\n",
        "operationId": "getChatRoomDetailWithOpponent",
        "parameters": [
          {
            "name": "roomId",
            "in": "path",
            "description": "채팅방 ID",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "채팅방 헤더 조회 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatRoomDetailResponse"
                }
              }
            }
          },
          "COMMON401_1": {
            "description": "인증이 필요합니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatRoomDetailResponse"
                }
              }
            }
          },
          "CHAT404_1": {
            "description": "채팅방을 찾을 수 없습니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatRoomDetailResponse"
                }
              }
            }
          },
          "CHAT403_2": {
            "description": "채팅방 멤버가 아닙니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatRoomDetailResponse"
                }
              }
            }
          },
          "CHAT403_3": {
            "description": "이미 나간 채팅방입니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatRoomDetailResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/chat/rooms/{roomId}/messages": {
      "get": {
        "tags": [
          "chat"
        ],
        "summary": "채팅 메시지 조회 API By 여채현",
        "description": "messageId desc 기준으로 메시지를 조회합니다.\ncursor는 해당 id보다 작은 메시지를 조회하는 기준입니다.\n렌더링 기준은 messageType이며, 타입별 필드는 배타적으로 사용됩니다.\n",
        "operationId": "getMessages",
        "parameters": [
          {
            "name": "roomId",
            "in": "path",
            "description": "채팅방 ID",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          },
          {
            "name": "cursor",
            "in": "query",
            "description": "페이지네이션 커서 (messageId 형식)",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "size",
            "in": "query",
            "description": "페이지 크기 (기본값: 20)",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 20
            }
          }
        ],
        "responses": {
          "200": {
            "description": "채팅 메시지 조회 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatMessageListResponse"
                }
              }
            }
          },
          "COMMON401_1": {
            "description": "인증이 필요합니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatMessageListResponse"
                }
              }
            }
          },
          "CHAT404_1": {
            "description": "채팅방을 찾을 수 없습니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatMessageListResponse"
                }
              }
            }
          },
          "CHAT403_2": {
            "description": "채팅방 멤버가 아닙니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatMessageListResponse"
                }
              }
            }
          },
          "CHAT403_3": {
            "description": "이미 나간 채팅방입니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseChatMessageListResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/campaigns/{campaignId}": {
      "get": {
        "tags": [
          "Campaign"
        ],
        "summary": "캠페인 상세 정보 조회 API by 박지영",
        "description": "캠페인 상세 정보를 조회합니다.\n\nformats : 형식,\ncategories : 종류,\ntones : 톤,\ninvolvements : 관여도,\nusageRanges : 활용 범위 ,\n",
        "operationId": "getCampaignDetail",
        "parameters": [
          {
            "name": "campaignId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseCampaignDetailResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/brands/{brandId}": {
      "get": {
        "tags": [
          "Brand"
        ],
        "summary": "브랜드 상세 조회",
        "description": "브랜드 ID로 상세 정보를 조회합니다.",
        "operationId": "getBrandDetail",
        "parameters": [
          {
            "name": "brandId",
            "in": "path",
            "description": "조회할 브랜드의 ID",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "조회 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseListBrandDetailResponseDto"
                }
              }
            }
          },
          "404": {
            "description": "존재하지 않는 브랜드",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/brands/{brandId}/sponsor-products/{productId}": {
      "get": {
        "tags": [
          "Brand"
        ],
        "summary": "협찬 가능 제품 상세 조회",
        "description": "브랜드의 특정 협찬 가능 제품 상세 정보를 조회합니다.",
        "operationId": "getSponsorProductDetail",
        "parameters": [
          {
            "name": "brandId",
            "in": "path",
            "description": "브랜드 ID",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          },
          {
            "name": "productId",
            "in": "path",
            "description": "제품 ID",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "조회 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseSponsorProductDetailResponseDto"
                }
              }
            }
          },
          "400": {
            "description": "잘못된 요청",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponse"
                }
              }
            }
          },
          "404": {
            "description": "리소스를 찾을 수 없음",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/brands/filters": {
      "get": {
        "tags": [
          "Brand"
        ],
        "summary": "브랜드 필터 옵션 조회",
        "description": "브랜드 필터링에 사용될 옵션들을 조회합니다.",
        "operationId": "getBrandFilters",
        "responses": {
          "200": {
            "description": "조회 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseListBrandFilterResponseDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/test": {
      "get": {
        "tags": [
          "test"
        ],
        "summary": "api 테스트 확인",
        "description": "테스트용 api입니다.\n만약 이 api가 통과하지 않는다면, SecurityConfig에 url을 추가해야합니다.\n\n인증이 필요없다면, PERMIT_ALL_URL_ARRAY에 추가하고,\n인증이 필요하다면, REQUEST_AUTHENTICATED_ARRAY에 추가해주세요.\n",
        "operationId": "test",
        "responses": {
          "200": {
            "description": "테스트 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseString"
                }
              }
            }
          }
        }
      }
    },
    "/api/test-auth": {
      "get": {
        "tags": [
          "test"
        ],
        "summary": "api 권한 테스트 확인",
        "description": "테스트용 api입니다.\nSwagger에서 Authorize에 토큰을 입력한 후 사용해야 정상 작동합니다.\n",
        "operationId": "testAuth",
        "responses": {
          "200": {
            "description": "테스트 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseString"
                }
              }
            }
          },
          "COMMON401_1": {
            "description": "인증이 필요합니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseString"
                }
              }
            }
          }
        }
      }
    },
    "/api/login/success": {
      "get": {
        "tags": [
          "test"
        ],
        "operationId": "loginSuccess",
        "parameters": [
          {
            "name": "accessToken",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "refreshToken",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseMapStringString"
                }
              }
            }
          }
        }
      }
    },
    "/api/api/user/info": {
      "get": {
        "tags": [
          "test"
        ],
        "summary": "마스터 jwt 인증 확인",
        "description": "마스터 jwt 테스트용 api입니다.\nSwagger에서 Authorize에 마스터 Jwt를 입력한 후 사용해야 정상 작동합니다.\n",
        "operationId": "getUserInfo",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "MyEditInfoRequestDto": {
        "type": "object",
        "properties": {
          "nickname": {
            "type": "string",
            "minLength": 1
          },
          "address": {
            "type": "string",
            "minLength": 1
          },
          "detailAddress": {
            "type": "string",
            "minLength": 1
          }
        },
        "required": [
          "address",
          "detailAddress",
          "nickname"
        ]
      },
      "CustomResponseVoid": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {

          }
        }
      },
      "BeautyDto": {
        "type": "object",
        "properties": {
          "interests": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "functions": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "skinType": {
            "type": "string"
          },
          "skinTone": {
            "type": "string"
          },
          "makeupStyle": {
            "type": "string"
          }
        }
      },
      "ContentStyleDto": {
        "type": "object",
        "properties": {
          "avgVideoLength": {
            "type": "string"
          },
          "avgViews": {
            "type": "string"
          },
          "format": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "contributionLevel": {
            "type": "string"
          },
          "usageCoverage": {
            "type": "string"
          }
        }
      },
      "FashionDto": {
        "type": "object",
        "properties": {
          "styles": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "items": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "preferredBrands": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "MainAudienceDto": {
        "type": "object",
        "properties": {
          "sex": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "age": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "MatchRequestDto": {
        "type": "object",
        "properties": {
          "userId": {
            "type": "string"
          },
          "brandId": {
            "type": "string"
          },
          "sex": {
            "type": "string"
          },
          "age": {
            "type": "integer",
            "format": "int32"
          },
          "height": {
            "type": "integer",
            "format": "int32"
          },
          "weight": {
            "type": "integer",
            "format": "int32"
          },
          "size": {
            "$ref": "#/components/schemas/SizeDto"
          },
          "beauty": {
            "$ref": "#/components/schemas/BeautyDto"
          },
          "fashion": {
            "$ref": "#/components/schemas/FashionDto"
          },
          "sns": {
            "$ref": "#/components/schemas/SnsDto"
          }
        }
      },
      "SizeDto": {
        "type": "object",
        "properties": {
          "upper": {
            "type": "integer",
            "format": "int32"
          },
          "bottom": {
            "type": "integer",
            "format": "int32"
          }
        }
      },
      "SnsDto": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string"
          },
          "mainAudience": {
            "$ref": "#/components/schemas/MainAudienceDto"
          },
          "contentStyle": {
            "$ref": "#/components/schemas/ContentStyleDto"
          }
        }
      },
      "BrandDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          },
          "matchingRatio": {
            "type": "integer",
            "format": "int32"
          },
          "isLiked": {
            "type": "boolean"
          },
          "isRecruiting": {
            "type": "boolean"
          },
          "tags": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "CampaignDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          },
          "matchingRatio": {
            "type": "integer",
            "format": "int32"
          },
          "isLiked": {
            "type": "boolean"
          },
          "isRecruiting": {
            "type": "boolean"
          },
          "manuscriptFee": {
            "type": "integer",
            "format": "int32"
          },
          "detail": {
            "type": "string"
          },
          "totalRecruit": {
            "type": "integer",
            "format": "int32"
          },
          "currentRecruit": {
            "type": "integer",
            "format": "int32"
          },
          "dday": {
            "type": "integer",
            "format": "int32"
          }
        }
      },
      "CreatorAnalysisDto": {
        "type": "object",
        "properties": {
          "creatorType": {
            "type": "string"
          },
          "beautyStyle": {
            "type": "string"
          },
          "fashionStyle": {
            "type": "string"
          },
          "contentStyle": {
            "type": "string"
          },
          "bestFitBrand": {
            "type": "string"
          }
        }
      },
      "CustomResponseMatchResponseDto": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/MatchResponseDto"
          }
        }
      },
      "HighMatchingBrandListDto": {
        "type": "object",
        "properties": {
          "count": {
            "type": "integer",
            "format": "int32"
          },
          "brands": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/BrandDto"
            }
          }
        }
      },
      "HighMatchingCampaignListDto": {
        "type": "object",
        "properties": {
          "count": {
            "type": "integer",
            "format": "int32"
          },
          "brands": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CampaignDto"
            }
          }
        }
      },
      "MatchResponseDto": {
        "type": "object",
        "properties": {
          "creatorAnalysis": {
            "$ref": "#/components/schemas/CreatorAnalysisDto"
          },
          "highMatchingBrandList": {
            "$ref": "#/components/schemas/HighMatchingBrandListDto"
          },
          "highMatchingCampaignList": {
            "$ref": "#/components/schemas/HighMatchingCampaignListDto"
          }
        }
      },
      "ChatRoomCreateRequest": {
        "type": "object",
        "properties": {
          "brandId": {
            "type": "integer",
            "format": "int64"
          },
          "creatorId": {
            "type": "integer",
            "format": "int64"
          }
        },
        "required": [
          "brandId",
          "creatorId"
        ]
      },
      "ChatRoomCreateResponse": {
        "type": "object",
        "properties": {
          "roomId": {
            "type": "integer",
            "format": "int64"
          },
          "roomKey": {
            "type": "string"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "CustomResponseChatRoomCreateResponse": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/ChatRoomCreateResponse"
          }
        }
      },
      "ChatAttachmentUploadRequest": {
        "type": "object",
        "description": "첨부 파일 업로드 요청 정보",
        "properties": {
          "attachmentType": {
            "type": "string",
            "enum": [
              "IMAGE",
              "FILE"
            ]
          }
        },
        "required": [
          "attachmentType"
        ]
      },
      "ChatAttachmentUploadResponse": {
        "type": "object",
        "properties": {
          "attachmentId": {
            "type": "integer",
            "format": "int64"
          },
          "attachmentType": {
            "type": "string",
            "enum": [
              "IMAGE",
              "FILE"
            ]
          },
          "contentType": {
            "type": "string"
          },
          "originalName": {
            "type": "string"
          },
          "fileSize": {
            "type": "integer",
            "format": "int64"
          },
          "accessUrl": {
            "type": "string"
          },
          "status": {
            "type": "string",
            "enum": [
              "UPLOADED",
              "READY",
              "FAILED"
            ]
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "CustomResponseChatAttachmentUploadResponse": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/ChatAttachmentUploadResponse"
          }
        }
      },
      "CampaignApplyRequest": {
        "type": "object",
        "properties": {
          "reason": {
            "type": "string",
            "maxLength": 1000,
            "minLength": 0
          }
        },
        "required": [
          "reason"
        ]
      },
      "CustomResponseString": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "type": "string"
          }
        }
      },
      "CampaignContentTagRequest": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "customValue": {
            "type": "string"
          }
        },
        "required": [
          "id"
        ]
      },
      "CampaignProposalRequestDto": {
        "type": "object",
        "properties": {
          "brandId": {
            "type": "integer",
            "format": "int64"
          },
          "campaignId": {
            "type": "integer",
            "format": "int64"
          },
          "campaignName": {
            "type": "string",
            "minLength": 1
          },
          "description": {
            "type": "string",
            "minLength": 1
          },
          "formats": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CampaignContentTagRequest"
            },
            "minItems": 1
          },
          "categories": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CampaignContentTagRequest"
            },
            "minItems": 1
          },
          "tones": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CampaignContentTagRequest"
            },
            "minItems": 1
          },
          "involvements": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CampaignContentTagRequest"
            },
            "minItems": 1
          },
          "usageRanges": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CampaignContentTagRequest"
            },
            "minItems": 1
          },
          "rewardAmount": {
            "type": "integer",
            "format": "int32"
          },
          "productId": {
            "type": "integer",
            "format": "int64"
          },
          "startDate": {
            "type": "string",
            "format": "date"
          },
          "endDate": {
            "type": "string",
            "format": "date"
          }
        },
        "required": [
          "brandId",
          "campaignName",
          "categories",
          "description",
          "endDate",
          "formats",
          "involvements",
          "productId",
          "rewardAmount",
          "startDate",
          "tones",
          "usageRanges"
        ]
      },
      "CustomResponse": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {

          }
        }
      },
      "BrandLikeResponseDto": {
        "type": "object",
        "properties": {
          "brandIsLiked": {
            "type": "boolean"
          }
        }
      },
      "CustomResponseListBrandLikeResponseDto": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/BrandLikeResponseDto"
            }
          }
        }
      },
      "SignupCompleteRequest": {
        "type": "object",
        "properties": {
          "nickname": {
            "type": "string"
          },
          "birth": {
            "type": "string",
            "format": "date"
          },
          "gender": {
            "type": "string",
            "enum": [
              "MALE",
              "FEMALE",
              "NONE"
            ]
          },
          "role": {
            "type": "string",
            "enum": [
              "ADMIN",
              "GUEST",
              "BRAND",
              "CREATOR"
            ]
          },
          "terms": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/TermAgreementDto"
            }
          },
          "signupPurposeIds": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int64"
            }
          },
          "contentCategoryIds": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int64"
            }
          }
        }
      },
      "TermAgreementDto": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "AGE",
              "SERVICE_TERMS",
              "PRIVACY_COLLECTION",
              "PRIVACY_THIRD_PARTY",
              "MARKETING_PRIVACY_COLLECTION",
              "MARKETING_NOTIFICATION"
            ]
          },
          "agreed": {
            "type": "boolean"
          }
        }
      },
      "CustomResponseOAuthTokenResponse": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/OAuthTokenResponse"
          }
        }
      },
      "OAuthTokenResponse": {
        "type": "object",
        "properties": {
          "accessToken": {
            "type": "string"
          },
          "refreshToken": {
            "type": "string"
          }
        }
      },
      "CustomResponseMyPageResponseDto": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/MyPageResponseDto"
          }
        }
      },
      "MyPageResponseDto": {
        "type": "object",
        "properties": {
          "nickname": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "profileImageUrl": {
            "type": "string"
          },
          "hasMatchingTest": {
            "type": "boolean"
          }
        }
      },
      "CustomResponseMyLoginResponseDto": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/MyLoginResponseDto"
          }
        }
      },
      "MyLoginResponseDto": {
        "type": "object",
        "properties": {
          "result": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SocialLoginInfo"
            }
          }
        }
      },
      "SocialLoginInfo": {
        "type": "object",
        "properties": {
          "provider": {
            "type": "string",
            "enum": [
              "KAKAO",
              "NAVER",
              "GOOGLE"
            ]
          },
          "isLinked": {
            "type": "boolean"
          }
        }
      },
      "BrandScrap": {
        "type": "object",
        "properties": {
          "brandId": {
            "type": "integer",
            "format": "int64"
          },
          "brandName": {
            "type": "string"
          },
          "brandLogo": {
            "type": "string"
          },
          "matchingRate": {
            "type": "integer",
            "format": "int32"
          },
          "hashtags": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "isScraped": {
            "type": "boolean"
          }
        }
      },
      "CampaignScrap": {
        "type": "object",
        "properties": {
          "campaignId": {
            "type": "integer",
            "format": "int64"
          },
          "brandName": {
            "type": "string"
          },
          "campaignTitle": {
            "type": "string"
          },
          "brandLogo": {
            "type": "string"
          },
          "matchingRate": {
            "type": "integer",
            "format": "int32"
          },
          "reward": {
            "type": "integer",
            "format": "int32"
          },
          "dDay": {
            "type": "integer",
            "format": "int32"
          },
          "currentApplicants": {
            "type": "integer",
            "format": "int32"
          },
          "totalRecruits": {
            "type": "integer",
            "format": "int32"
          },
          "isScraped": {
            "type": "boolean"
          }
        }
      },
      "CustomResponseMyScrapResponseDto": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/MyScrapResponseDto"
          }
        }
      },
      "MyScrapResponseDto": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string"
          },
          "totalCount": {
            "type": "integer",
            "format": "int32"
          },
          "brandList": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/BrandScrap"
            }
          },
          "campaignList": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CampaignScrap"
            }
          }
        }
      },
      "BeautyType": {
        "type": "object",
        "properties": {
          "skinType": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "skinBrightness": {
            "type": "string"
          },
          "makeupStyle": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "ContentsType": {
        "type": "object",
        "properties": {
          "gender": {
            "type": "string"
          },
          "age": {
            "type": "string"
          },
          "averageLength": {
            "type": "string"
          },
          "averageView": {
            "type": "string"
          }
        }
      },
      "CustomResponseMyProfileCardResponseDto": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/MyProfileCardResponseDto"
          }
        }
      },
      "FashionType": {
        "type": "object",
        "properties": {
          "height": {
            "type": "integer",
            "format": "int32"
          },
          "bodyType": {
            "type": "string"
          },
          "upperSize": {
            "type": "string"
          },
          "bottomSize": {
            "type": "integer",
            "format": "int32"
          }
        }
      },
      "MatchingResult": {
        "type": "object",
        "properties": {
          "creatorType": {
            "type": "string"
          },
          "fitBrand": {
            "type": "string"
          }
        }
      },
      "MyProfileCardResponseDto": {
        "type": "object",
        "properties": {
          "nickname": {
            "type": "string"
          },
          "gender": {
            "type": "string"
          },
          "age": {
            "type": "integer",
            "format": "int32"
          },
          "interests": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "snsAccount": {
            "type": "string"
          },
          "matchingResult": {
            "$ref": "#/components/schemas/MatchingResult"
          },
          "myType": {
            "$ref": "#/components/schemas/MyType"
          }
        }
      },
      "MyType": {
        "type": "object",
        "properties": {
          "beautyType": {
            "$ref": "#/components/schemas/BeautyType"
          },
          "fashionType": {
            "$ref": "#/components/schemas/FashionType"
          },
          "contentsType": {
            "$ref": "#/components/schemas/ContentsType"
          }
        }
      },
      "CustomResponseMyEditInfoResponseDto": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/MyEditInfoResponseDto"
          }
        }
      },
      "MyEditInfoResponseDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "nickname": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "detailAddress": {
            "type": "string"
          },
          "socialType": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "ContentTagResponse": {
        "type": "object",
        "properties": {
          "formats": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/TagItemResponse"
            }
          },
          "categories": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/TagItemResponse"
            }
          },
          "tones": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/TagItemResponse"
            }
          },
          "involvements": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/TagItemResponse"
            }
          },
          "usageRanges": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/TagItemResponse"
            }
          }
        }
      },
      "CustomResponseContentTagResponse": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/ContentTagResponse"
          }
        }
      },
      "TagItemResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string"
          }
        }
      },
      "CustomResponseMatchCampaignResponseDto": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/MatchCampaignResponseDto"
          }
        }
      },
      "MatchCampaignResponseDto": {
        "type": "object",
        "properties": {
          "count": {
            "type": "integer",
            "format": "int32"
          },
          "brands": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CampaignDto"
            }
          }
        }
      },
      "CustomResponseMatchBrandResponseDto": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/MatchBrandResponseDto"
          }
        }
      },
      "MatchBrandResponseDto": {
        "type": "object",
        "properties": {
          "count": {
            "type": "integer",
            "format": "int32"
          },
          "brands": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/BrandDto"
            }
          }
        }
      },
      "ChatRoomCardResponse": {
        "type": "object",
        "properties": {
          "roomId": {
            "type": "integer",
            "format": "int64"
          },
          "opponentUserId": {
            "type": "integer",
            "format": "int64"
          },
          "opponentName": {
            "type": "string"
          },
          "opponentProfileImageUrl": {
            "type": "string"
          },
          "isCollaborating": {
            "type": "boolean"
          },
          "lastMessagePreview": {
            "type": "string"
          },
          "lastMessageType": {
            "type": "string",
            "enum": [
              "TEXT",
              "IMAGE",
              "FILE",
              "SYSTEM"
            ]
          },
          "lastMessageAt": {
            "type": "string",
            "format": "date-time"
          },
          "unreadCount": {
            "type": "integer",
            "format": "int64"
          }
        }
      },
      "ChatRoomListResponse": {
        "type": "object",
        "properties": {
          "totalUnreadCount": {
            "type": "integer",
            "format": "int64"
          },
          "rooms": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ChatRoomCardResponse"
            }
          },
          "nextCursor": {
            "type": "string"
          },
          "hasNext": {
            "type": "boolean"
          }
        }
      },
      "CustomResponseChatRoomListResponse": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/ChatRoomListResponse"
          }
        }
      },
      "CampaignSummaryResponse": {
        "type": "object",
        "properties": {
          "campaignId": {
            "type": "integer",
            "format": "int64"
          },
          "campaignImageUrl": {
            "type": "string"
          },
          "brandName": {
            "type": "string"
          },
          "campaignTitle": {
            "type": "string"
          }
        }
      },
      "ChatRoomDetailResponse": {
        "type": "object",
        "properties": {
          "roomId": {
            "type": "integer",
            "format": "int64"
          },
          "opponentUserId": {
            "type": "integer",
            "format": "int64"
          },
          "opponentName": {
            "type": "string"
          },
          "opponentProfileImageUrl": {
            "type": "string"
          },
          "isCollaborating": {
            "type": "boolean"
          },
          "campaignSummary": {
            "$ref": "#/components/schemas/CampaignSummaryResponse"
          }
        }
      },
      "CustomResponseChatRoomDetailResponse": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/ChatRoomDetailResponse"
          }
        }
      },
      "ChatAttachmentInfoResponse": {
        "type": "object",
        "properties": {
          "attachmentId": {
            "type": "integer",
            "format": "int64"
          },
          "attachmentType": {
            "type": "string",
            "enum": [
              "IMAGE",
              "FILE"
            ]
          },
          "contentType": {
            "type": "string"
          },
          "originalName": {
            "type": "string"
          },
          "fileSize": {
            "type": "integer",
            "format": "int64"
          },
          "accessUrl": {
            "type": "string"
          },
          "status": {
            "type": "string",
            "enum": [
              "UPLOADED",
              "READY",
              "FAILED"
            ]
          }
        }
      },
      "ChatMessageListResponse": {
        "type": "object",
        "properties": {
          "messages": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ChatMessageResponse"
            }
          },
          "nextCursor": {
            "type": "string"
          },
          "hasNext": {
            "type": "boolean"
          }
        }
      },
      "ChatMessageResponse": {
        "type": "object",
        "properties": {
          "messageId": {
            "type": "integer",
            "format": "int64"
          },
          "roomId": {
            "type": "integer",
            "format": "int64"
          },
          "senderId": {
            "type": "integer",
            "format": "int64"
          },
          "senderType": {
            "type": "string",
            "enum": [
              "USER",
              "SYSTEM"
            ]
          },
          "messageType": {
            "type": "string",
            "enum": [
              "TEXT",
              "IMAGE",
              "FILE",
              "SYSTEM"
            ]
          },
          "content": {
            "type": "string"
          },
          "attachment": {
            "$ref": "#/components/schemas/ChatAttachmentInfoResponse"
          },
          "systemMessage": {
            "$ref": "#/components/schemas/ChatSystemMessageResponse"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "clientMessageId": {
            "type": "string"
          }
        }
      },
      "ChatSystemMessagePayload": {

      },
      "ChatSystemMessageResponse": {
        "type": "object",
        "properties": {
          "schemaVersion": {
            "type": "integer",
            "format": "int32"
          },
          "kind": {
            "type": "string",
            "enum": [
              "PROPOSAL_CARD",
              "PROPOSAL_STATUS_NOTICE",
              "MATCHED_CAMPAIGN_CARD"
            ]
          },
          "payload": {
            "$ref": "#/components/schemas/ChatSystemMessagePayload"
          }
        }
      },
      "CustomResponseChatMessageListResponse": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/ChatMessageListResponse"
          }
        }
      },
      "CampaignDetailResponse": {
        "type": "object",
        "properties": {
          "campaignId": {
            "type": "integer",
            "format": "int64"
          },
          "title": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "preferredSkills": {
            "type": "string"
          },
          "schedule": {
            "type": "string"
          },
          "videoSpec": {
            "type": "string"
          },
          "product": {
            "type": "string"
          },
          "rewardAmount": {
            "type": "integer",
            "format": "int64"
          },
          "startDate": {
            "type": "string",
            "format": "date"
          },
          "endDate": {
            "type": "string",
            "format": "date"
          },
          "recruitStartDate": {
            "type": "string",
            "format": "date-time"
          },
          "recruitEndDate": {
            "type": "string",
            "format": "date-time"
          },
          "quota": {
            "type": "integer",
            "format": "int32"
          },
          "contentTags": {
            "$ref": "#/components/schemas/ContentTagResponse"
          }
        }
      },
      "CustomResponseCampaignDetailResponse": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/CampaignDetailResponse"
          }
        }
      },
      "AvailableSponsorProdDto": {
        "type": "object",
        "properties": {
          "productId": {
            "type": "integer",
            "format": "int64"
          },
          "productName": {
            "type": "string"
          },
          "availableType": {
            "type": "string"
          },
          "availableQuantity": {
            "type": "integer",
            "format": "int32"
          },
          "availableSize": {
            "type": "integer",
            "format": "int32"
          }
        }
      },
      "BrandDetailResponseDto": {
        "type": "object",
        "properties": {
          "brandName": {
            "type": "string"
          },
          "brandTag": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "brandDescription": {
            "type": "string"
          },
          "brandMatchingRatio": {
            "type": "integer",
            "format": "int32"
          },
          "brandIsLiked": {
            "type": "boolean"
          },
          "brandCategory": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "brandSkinCareTag": {
            "$ref": "#/components/schemas/BrandSkinCareTagDto"
          },
          "brandMakeUpTag": {
            "$ref": "#/components/schemas/BrandMakeUpTagDto"
          },
          "brandOnGoingCampaign": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/BrandOnGoingCampaignDto"
            }
          },
          "availableSponsorProd": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/AvailableSponsorProdDto"
            }
          },
          "campaignHistory": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CampaignHistoryDto"
            }
          }
        }
      },
      "BrandMakeUpTagDto": {
        "type": "object",
        "properties": {
          "brandSkinType": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "brandMakeUpStyle": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "BrandOnGoingCampaignDto": {
        "type": "object",
        "properties": {
          "brandId": {
            "type": "integer",
            "format": "int64"
          },
          "brandName": {
            "type": "string"
          },
          "recruitingTotalNumber": {
            "type": "integer",
            "format": "int32"
          },
          "recruitedNumber": {
            "type": "integer",
            "format": "int32"
          },
          "campaignDescription": {
            "type": "string"
          },
          "campaignManuscriptFee": {
            "type": "string"
          }
        }
      },
      "BrandSkinCareTagDto": {
        "type": "object",
        "properties": {
          "brandSkinType": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "brandMainFunction": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "CampaignHistoryDto": {
        "type": "object",
        "properties": {
          "campaignId": {
            "type": "integer",
            "format": "int64"
          },
          "campaignTitle": {
            "type": "string"
          },
          "startDate": {
            "type": "string"
          },
          "endDate": {
            "type": "string"
          }
        }
      },
      "CustomResponseListBrandDetailResponseDto": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/BrandDetailResponseDto"
            }
          }
        }
      },
      "ActionDto": {
        "type": "object",
        "properties": {
          "canProposeCampaign": {
            "type": "boolean"
          },
          "proposeCampaignCtaText": {
            "type": "string"
          }
        }
      },
      "CustomResponseSponsorProductDetailResponseDto": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "$ref": "#/components/schemas/SponsorProductDetailResponseDto"
          }
        }
      },
      "SponsorInfoDto": {
        "type": "object",
        "properties": {
          "items": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SponsorItemDto"
            }
          },
          "shippingType": {
            "type": "string"
          }
        }
      },
      "SponsorItemDto": {
        "type": "object",
        "properties": {
          "itemId": {
            "type": "integer",
            "format": "int64"
          },
          "availableType": {
            "type": "string"
          },
          "availableQuantity": {
            "type": "integer",
            "format": "int32"
          },
          "availableSize": {
            "type": "integer",
            "format": "int32"
          },
          "sizeUnit": {
            "type": "string"
          }
        }
      },
      "SponsorProductDetailResponseDto": {
        "type": "object",
        "properties": {
          "brandId": {
            "type": "integer",
            "format": "int64"
          },
          "brandName": {
            "type": "string"
          },
          "productId": {
            "type": "integer",
            "format": "int64"
          },
          "productName": {
            "type": "string"
          },
          "productDescription": {
            "type": "string"
          },
          "productImageUrls": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "categories": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "sponsorInfo": {
            "$ref": "#/components/schemas/SponsorInfoDto"
          },
          "action": {
            "$ref": "#/components/schemas/ActionDto"
          }
        }
      },
      "BeautyFilterDto": {
        "type": "object",
        "properties": {
          "category": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CategoryDto"
            }
          },
          "function": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/FunctionDto"
            }
          },
          "skinType": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SkinTypeDto"
            }
          },
          "makeUpStyle": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/MakeUpStyleDto"
            }
          }
        }
      },
      "BrandFilterResponseDto": {
        "type": "object",
        "properties": {
          "beautyFilter": {
            "$ref": "#/components/schemas/BeautyFilterDto"
          }
        }
      },
      "CategoryDto": {
        "type": "object",
        "properties": {
          "categoryId": {
            "type": "integer",
            "format": "int32"
          },
          "categoryName": {
            "type": "string"
          }
        }
      },
      "CustomResponseListBrandFilterResponseDto": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/BrandFilterResponseDto"
            }
          }
        }
      },
      "FunctionDto": {
        "type": "object",
        "properties": {
          "functionId": {
            "type": "integer",
            "format": "int32"
          },
          "functionName": {
            "type": "string"
          }
        }
      },
      "MakeUpStyleDto": {
        "type": "object",
        "properties": {
          "makeUpId": {
            "type": "integer",
            "format": "int32"
          },
          "makeUpName": {
            "type": "string"
          }
        }
      },
      "SkinTypeDto": {
        "type": "object",
        "properties": {
          "skinId": {
            "type": "integer",
            "format": "int32"
          },
          "skinName": {
            "type": "string"
          }
        }
      },
      "CustomResponseMapStringString": {
        "type": "object",
        "properties": {
          "isSuccess": {
            "type": "boolean"
          },
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "result": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            }
          }
        }
      }
    },
    "securitySchemes": {
      "JWT Authentication": {
        "type": "http",
        "name": "Authorization",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  }
}