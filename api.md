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
      "name": "Brand-Campain",
      "description": "브랜드의 캠페인 API"
    },
    {
      "name": "Chat",
      "description": "채팅 REST API"
    },
    {
      "name": "Business",
      "description": "비즈니스 API"
    },
    {
      "name": "Authentication",
      "description": "사용자 인증 API"
    },
    {
      "name": "Attachment",
      "description": "첨부파일 REST API"
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
        "description": "크리에이터 정보를 기반으로 매칭 분석 결과와 추천 브랜드 목록을 반환합니다.\nuserType, typeTag, highMatchingBrandList를 포함합니다.\n",
        "operationId": "match",
        "requestBody": {
          "description": "크리에이터 매칭 요청 정보",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MatchRequestDto"
              },
              "examples": {
                "뷰티 크리에이터 예시": {
                  "summary": "뷰티 중심 크리에이터",
                  "description": "뷰티 크리에이터 예시",
                  "value": {
                    "beauty": {
                      "interestStyleTags": [1, 2],
                      "prefferedFunctionTags": [6, 7],
                      "skinTypeTags": 12,
                      "skinToneTags": 13,
                      "makeupStyleTags": 2
                    },
                    "fashion": {
                      "interestStyleTags": [16, 17],
                      "preferredItemTags": [22, 23],
                      "preferredBrandTags": [27, 28],
                      "heightTag": 72,
                      "weightTypeTag": 94,
                      "topSizeTag": 108,
                      "bottomSizeTag": 178
                    },
                    "content": {
                      "sns": {
                        "url": "https://www.instagram.com/vivi",
                        "mainAudience": {
                          "genderTags": [221, 222],
                          "ageTags": [223, 224]
                        },
                        "averageAudience": {
                          "videoLengthTags": [228, 229],
                          "videoViewsTags": [232, 233]
                        }
                      },
                      "typeTags": [236, 237],
                      "toneTags": [245, 246],
                      "prefferedInvolvementTags": [251, 252],
                      "prefferedCoverageTags": [255, 256]
                    }
                  }
                }
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
          "Chat"
        ],
        "summary": "채팅방 목록 조회 API By 여채현",
        "description": "status 기준으로 채팅방 목록을 조회합니다.\nsearch가 있으면 상대방 이름(닉네임) 또는 메시지 내용으로 검색합니다 (부분 일치, 대소문자 무시).\n정렬은 항상 lastMessageAt desc, roomId desc 기준입니다.\ncursor는 lastMessageAt|roomId 포맷을 그대로 재사용하세요.\n메시지가 없는 방은 목록에서 제외됩니다.\n",
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
          },
          {
            "name": "search",
            "in": "query",
            "description": "검색어 (상대방 이름 또는 메시지 내용, 미입력 시 전체 목록)",
            "required": false,
            "schema": {
              "type": "string"
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
          "Chat"
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
    "/api/v1/campaigns/{campaignId}/apply": {
      "post": {
        "tags": [
          "Business"
        ],
        "summary": "캠페인 지원 API by 박지영",
        "description": "해당 캠페인을 지원합니다.\n같은 캠페인에 중복으로 지원할 수 없습니다.\n",
        "operationId": "applyCampaign",
        "parameters": [
          {
            "name": "campaignId",
            "in": "path",
            "description": "캠페인 ID",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            },
            "example": 1
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
    "/api/v1/campaigns/proposal/{campaignProposalID}/re-request": {
      "post": {
        "tags": [
          "Business"
        ],
        "summary": "캠페인 제안 수정(다시 제안하기) API by 박지영",
        "description": "내가 제안했던 것을 다시 제안하는 API 입니다.\n/api/v1/campaigns/proposal/request에서 생성했던 제안을 수정해서 다시 제안할 때, 해당 API를 사용해주세요.\n\ncampaignProposalId는 /api/v1/campaigns/collaborations/me에서 확인해주세요.\n(masterJWT로 조회 불가능 API, 크리에이터/브랜드 계정으로 로그인 필요)\n",
        "operationId": "modifyCampaignProposal",
        "parameters": [
          {
            "name": "campaignProposalID",
            "in": "path",
            "description": "캠페인 Proposal ID",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            },
            "example": 1
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CampaignProposalRequestDto"
              },
              "examples": {
                "CampaignProposalRequestExample": {
                  "summary": "캠페인 수정 요청 예시",
                  "description": "CampaignProposalRequestExample",
                  "value": {
                    "brandId": 1,
                    "creatorId": 1,
                    "campaignId": null,
                    "campaignName": "비플레인 선크림 리뷰 캠페인",
                    "description": "비플레인 선크림을 체험하고 솔직한 리뷰 콘텐츠를 제작해주세요.",
                    "formats": [
                      {
                        "id": 1
                      }
                    ],
                    "categories": [
                      {
                        "id": 11,
                        "customValue": "성분 분석 리뷰"
                      },
                      {
                        "id": 5
                      }
                    ],
                    "tones": [
                      {
                        "id": 12
                      }
                    ],
                    "involvements": [
                      {
                        "id": 21
                      }
                    ],
                    "usageRanges": [
                      {
                        "id": 26
                      }
                    ],
                    "rewardAmount": 100000,
                    "productId": 5,
                    "startDate": "2025-03-29",
                    "endDate": "2025-04-01"
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
    "/api/v1/campaigns/proposal/request": {
      "post": {
        "tags": [
          "Business"
        ],
        "summary": "캠페인 제안 생성 API by 박지영",
        "description": "크리에이터가 브랜드에 캠페인을 제안합니다.\n\n신규 캠페인인 경우 campaignId null 을 보내주세요.\n기존 캠페인인 경우 campaignId을 보내주세요.\n\n기타인 경우 customValue를 포함해서 보내주세요.\n",
        "operationId": "createCampaignProposal",
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
                    "creatorId": 1,
                    "campaignId": null,
                    "campaignName": "비플레인 선크림 리뷰 캠페인",
                    "description": "비플레인 선크림을 체험하고 솔직한 리뷰 콘텐츠를 제작해주세요.",
                    "formats": [
                      {
                        "id": 1
                      }
                    ],
                    "categories": [
                      {
                        "id": 11,
                        "customValue": "성분 분석 리뷰"
                      }
                    ],
                    "tones": [
                      {
                        "id": 12
                      },
                      {
                        "id": 13
                      }
                    ],
                    "involvements": [
                      {
                        "id": 20
                      }
                    ],
                    "usageRanges": [
                      {
                        "id": 25
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
    "/api/v1/attachments": {
      "post": {
        "tags": [
          "Attachment"
        ],
        "summary": "첨부파일 업로드 API",
        "description": "첨부 파일을 업로드하고 메타 정보를 반환합니다.\n- IMAGE: png, jpeg(jpg)만 허용\n- FILE: pdf, doc, docx만 허용\n",
        "operationId": "uploadAttachment",
        "parameters": [
          {
            "name": "attachmentType",
            "in": "query",
            "description": "첨부 파일 타입 (IMAGE 또는 FILE)",
            "required": true,
            "schema": {
              "type": "string",
              "enum": [
                "IMAGE",
                "FILE"
              ]
            }
          },
          {
            "name": "usage",
            "in": "query",
            "description": "용도 (CHAT: 채팅첨부, PUBLIC: 브랜드/캠페인 등 공개자산)",
            "required": true,
            "schema": {
              "type": "string",
              "enum": [
                "CHAT",
                "PUBLIC"
              ]
            }
          }
        ],
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "file": {
                    "type": "string",
                    "format": "binary",
                    "description": "업로드할 파일"
                  }
                },
                "required": [
                  "file"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "첨부파일 업로드 성공",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseAttachmentUploadResponse"
                }
              }
            }
          },
          "COMMON400_1": {
            "description": "잘못된 요청입니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseAttachmentUploadResponse"
                }
              }
            }
          },
          "COMMON401_1": {
            "description": "인증이 필요합니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseAttachmentUploadResponse"
                }
              }
            }
          },
          "ATTACHMENT400_1": {
            "description": "유효하지 않은 파일입니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseAttachmentUploadResponse"
                }
              }
            }
          },
          "ATTACHMENT400_2": {
            "description": "유효하지 않은 파일명입니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseAttachmentUploadResponse"
                }
              }
            }
          },
          "ATTACHMENT400_3": {
            "description": "유효하지 않은 파일 크기입니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseAttachmentUploadResponse"
                }
              }
            }
          },
          "ATTACHMENT400_4": {
            "description": "파일 크기가 제한을 초과했습니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseAttachmentUploadResponse"
                }
              }
            }
          },
          "ATTACHMENT400_5": {
            "description": "지원하지 않는 이미지 형식입니다. (png, jpeg만 허용)",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseAttachmentUploadResponse"
                }
              }
            }
          },
          "ATTACHMENT400_7": {
            "description": "지원하지 않는 첨부파일 형식입니다. (pdf, doc, docx만 허용)",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseAttachmentUploadResponse"
                }
              }
            }
          },
          "ATTACHMENT500_1": {
            "description": "파일 업로드에 실패했습니다.",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseAttachmentUploadResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/users/me/feature": {
      "get": {
        "tags": [
          "user"
        ],
        "summary": "내 특성 조회 API By 고경수",
        "description": "로그인한 사용자의 특성 정보를 조회합니다. (하드코딩)",
        "operationId": "getMyFeature",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseMyFeatureResponseDto"
                }
              }
            }
          }
        }
      },
      "patch": {
        "tags": [
          "user"
        ],
        "summary": "내 특성 수정 API By 고경수",
        "description": "로그인한 사용자의 특성 정보를 수정합니다. (하드코딩)",
        "operationId": "updateMyFeature",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MyFeatureUpdateRequestDto"
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
                  "$ref": "#/components/schemas/CustomResponseVoid"
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
    "/api/v1/tags/{tagType}": {
      "get": {
        "tags": [
          "Tag"
        ],
        "summary": "태그 타입별 조회",
        "description": "지정된 태그 타입의 목록을 카테고리별로 조회합니다.",
        "operationId": "getTagsByType",
        "parameters": [
          {
            "name": "tagType",
            "in": "path",
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
                  "$ref": "#/components/schemas/CustomResponseTagResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/tags/fashion": {
      "get": {
        "tags": [
          "Tag"
        ],
        "summary": "패션 태그 조회",
        "description": "패션 태그 목록을 카테고리별로 조회합니다.",
        "operationId": "getFashionTags",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseTagResponse"
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
    "/api/v1/tags/beauty": {
      "get": {
        "tags": [
          "Tag"
        ],
        "summary": "뷰티 태그 조회",
        "description": "뷰티 태그 목록을 카테고리별로 조회합니다.",
        "operationId": "getBeautyTags",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseTagResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/matches/campaigns": {
      "get": {
        "tags": [
          "Match"
        ],
        "summary": "매칭 캠페인 목록 조회 및 검색",
        "description": "JWT 토큰의 사용자 ID를 기반으로 매칭 캠페인 목록을 검색하거나 매칭 캠페인 목록을 조회합니다.\n\n**검색**: keyword를 입력하면 캠페인명(title)만 검색합니다. (브랜드명, 설명 등은 검색 대상 제외)\n\n**정렬 옵션**:\n- MATCH_SCORE: 매칭률 순 (동점 시 인기순 우선)\n- POPULARITY: 인기 순 (좋아요 수)\n- REWARD_AMOUNT: 금액 순 (원고료 높은 순)\n- D_DAY: 마감 순 (마감 임박순)\n\n**카테고리 필터**: ALL(전체), FASHION(패션), BEAUTY(뷰티)\n\n**페이지네이션**: page(0부터 시작), size(기본 20)\n",
        "operationId": "getMatchingCampaigns",
        "parameters": [
          {
            "name": "keyword",
            "in": "query",
            "description": "캠페인명 검색어 (캠페인 title만 검색)",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sortBy",
            "in": "query",
            "description": "정렬 기준 (MATCH_SCORE, POPULARITY, REWARD_AMOUNT, D_DAY)",
            "required": false,
            "schema": {
              "type": "string",
              "default": "MATCH_SCORE",
              "enum": [
                "MATCH_SCORE",
                "POPULARITY",
                "REWARD_AMOUNT",
                "D_DAY"
              ]
            }
          },
          {
            "name": "category",
            "in": "query",
            "description": "카테고리 필터 (ALL, FASHION, BEAUTY)",
            "required": false,
            "schema": {
              "type": "string",
              "default": "ALL",
              "enum": [
                "ALL",
                "FASHION",
                "BEAUTY"
              ]
            }
          },
          {
            "name": "tags",
            "in": "query",
            "description": "태그 필터 (예: 스킨케어, 미니멀)",
            "required": false,
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "페이지 번호 (0부터 시작)",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 0
            }
          },
          {
            "name": "size",
            "in": "query",
            "description": "페이지 크기 (기본 20, 최대 50)",
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
            "description": "캠페인 목록 조회 및 검색 성공",
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
    "/api/v1/matches/brands": {
      "get": {
        "tags": [
          "Match"
        ],
        "summary": "매칭 브랜드 목록 조회",
        "description": "JWT 토큰의 사용자 ID를 기반으로 매칭률이 높은 브랜드 목록을 조회합니다.\n정렬 옵션: MATCH_SCORE(매칭률 순), POPULARITY(인기순), NEWEST(신규순)\n카테고리 필터: ALL(전체), FASHION(패션), BEAUTY(뷰티)\n태그 필터: 뷰티/패션 관련 태그로 필터링\n",
        "operationId": "getMatchingBrands",
        "parameters": [
          {
            "name": "sortBy",
            "in": "query",
            "description": "정렬 기준 (MATCH_SCORE, POPULARITY, NEWEST)",
            "required": false,
            "schema": {
              "type": "string",
              "default": "MATCH_SCORE",
              "enum": [
                "MATCH_SCORE",
                "POPULARITY",
                "NEWEST"
              ]
            }
          },
          {
            "name": "category",
            "in": "query",
            "description": "카테고리 필터 (ALL, FASHION, BEAUTY)",
            "required": false,
            "schema": {
              "type": "string",
              "default": "ALL",
              "enum": [
                "ALL",
                "FASHION",
                "BEAUTY"
              ]
            }
          },
          {
            "name": "tags",
            "in": "query",
            "description": "태그 필터 (예: 스킨케어, 미니멀)",
            "required": false,
            "schema": {
              "type": "array",
              "items": {
                "type": "string"
              }
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
          "Chat"
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
          "Chat"
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
    "/api/v1/campaigns/{campaignId}/apply/me": {
      "get": {
        "tags": [
          "Business"
        ],
        "summary": "내가 지원한 캠페인 상세 조회 API by 박지영",
        "description": "내가 지원한 캠페인의 상세 조회입니다.\ncampaign_ID를 보내주세요.\n\nREVIEWING : 검토중\nMATCHED : 수락\nREJECTED : 거절\n",
        "operationId": "getMyApplyCampaignDetails",
        "parameters": [
          {
            "name": "campaignId",
            "in": "path",
            "description": "캠페인 ID",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            },
            "example": 1
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CampaignApplyDetailResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/campaigns/proposal/{campaignProposalId}": {
      "get": {
        "tags": [
          "Business"
        ],
        "summary": "캠페인 제안 상세 조회 API by 박지영",
        "description": "한 건의 캠페인 제안 상세 정보를 조회합니다.\n\ncampaignProposalId는 /api/v1/campaigns/collaborations/me에서 확인해주세요.\n(masterJWT로 조회 불가능 API, 크리에이터/브랜드 계정으로 로그인 필요)\n\n\u003C태그\u003E\nformats : 형식\ncategories : 종류\ntones : 톤\ninvolvements : 관여도\nusageRanges : 활용 범위\n",
        "operationId": "getProposalDetail",
        "parameters": [
          {
            "name": "campaignProposalId",
            "in": "path",
            "description": "캠페인 Proposal ID",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            },
            "example": 1
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseCampaignProposalDetailResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/campaigns/collaborations/me": {
      "get": {
        "tags": [
          "Business"
        ],
        "summary": "나의 캠페인 조회 API by 박지영",
        "description": "내가 지원, 제안 보냄, 제안 받음을 한 모든 캠페인 내역을 조회합니다.\n사용자와 연관된 캠페인을 조회할 때는 해당 api를 사용해주세요. (부족한 정보가 있다면 말해주세요. 응답에 추가하겠습니다.\n쿼리 스트링으로 아래의 옵션들을 선택할 수 있습니다.\n\n1) 참여 타입\n- APPLIED : 지원\n- SENT : 제안 보냄\n- RECEIVED : 제안 받음\n\n* 지원은 proposalId가 null입니다.\n* 신규 캠페인에 제안하거나/받은 경우 campaignId가 null이고, 기존 캠페인에 제안하거나/받은 경우 campaignId가 존재합니다.\n\n2) 상태\nREVIEWING : 검토중\nMATCHED : 매칭됨\nREJECTED : 거절\n\n3) 날짜\nstartDate : 제작 시작 날짜\nendDate : 제작 마감 날짜\n",
        "operationId": "getMyCollaborations",
        "parameters": [
          {
            "name": "type",
            "in": "query",
            "description": "참여 타입 (APPLIED, SENT, RECEIVED)",
            "required": false,
            "schema": {
              "type": "string",
              "enum": [
                "APPLIED",
                "SENT",
                "RECEIVED"
              ]
            }
          },
          {
            "name": "status",
            "in": "query",
            "description": "상태 (REVIEWING, MATCHED, REJECTED)",
            "required": false,
            "schema": {
              "type": "string",
              "enum": [
                "NONE",
                "REVIEWING",
                "MATCHED",
                "REJECTED"
              ]
            }
          },
          {
            "name": "startDate",
            "in": "query",
            "description": "제작 시작 날짜",
            "required": false,
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "endDate",
            "in": "query",
            "description": "제작 마감 날짜",
            "required": false,
            "schema": {
              "type": "string",
              "format": "date"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseListCollaborationResponse"
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
    "/api/v1/brands/{brandId}/sponsor-products": {
      "get": {
        "tags": [
          "Brand"
        ],
        "summary": "브랜드 협찬 가능 제품 리스트 조회",
        "description": "특정 브랜드의 협찬 가능 제품 목록을 조회합니다.",
        "operationId": "getSponsorProducts",
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
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseListSponsorProductListResponseDto"
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
    "/api/v1/brands/{brandId}/existing-campaigns": {
      "get": {
        "tags": [
          "Brand-Campain"
        ],
        "summary": "브랜드의 기존 캠페인 제안 목록 조회 API by 박지영",
        "description": "브랜드의 기존 캠페인 목록을 조회합니다.\n\n캠페인 제안(기존 캠페인 선택) 시 사용되는 API입니다.\n",
        "operationId": "getExistingCampaigns",
        "parameters": [
          {
            "name": "brandId",
            "in": "path",
            "description": "브랜드 ID",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            },
            "example": 1
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseBrandExistingCampaignResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/brands/{brandId}/campaigns": {
      "get": {
        "tags": [
          "Brand-Campain"
        ],
        "summary": "브랜드의 캠페인 내역 조회 API by 박지영",
        "description": "브랜드의 캠페인을 조회합니다.\n\n마지막으로 조회된 캠페인의 id를 cursor로 사용하는 페이징 방식입니다.\n- 최초 조회 시 cursor 없이 요청합니다.\n- 이후 조회 시 응답으로 받은 nextCursor 값을 cursor로 전달합니다.\n- 정렬 조건 : UPCOMING /RECRUITING → 모집 시작 날짜 기준, CLOSED → 모집 끝나는 날짜 기준\n\n캠페인 모집 상태는 다음 중 하나로 응답됩니다.\n- UPCOMING   : 모집 예정\n- CLOSED     : 완료\n❗️ (수정사항 260201 : 진행중은 따로 조회한다고 PM 님께 답변 받아서, 진행 중 상태를 제외했습니다.  ❗️\n",
        "operationId": "getBrandCampaigns",
        "parameters": [
          {
            "name": "brandId",
            "in": "path",
            "description": "브랜드 ID",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            },
            "example": 1
          },
          {
            "name": "cursor",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          },
          {
            "name": "size",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 5
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseBrandCampaignSliceResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/brands/{brandId}/campaigns/recruiting": {
      "get": {
        "tags": [
          "Brand-Campain"
        ],
        "summary": "브랜드의 진행 중인 캠페인 조회 API by 박지영",
        "description": "해당 브랜드의 현재 모집 중인 캠페인 목록을 조회합니다. (Day 남은 일수 포함)\n\n- 모집 상태가 RECRUITING 인 캠페인만 조회됩니다.\n- 브랜드 홈 상단 '진행 중인 캠페인' 영역에 사용됩니다.\n",
        "operationId": "getRecruitingCampaigns",
        "parameters": [
          {
            "name": "brandId",
            "in": "path",
            "description": "브랜드 ID",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            },
            "example": 1
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CustomResponseBrandRecruitingCampaignResponse"
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
      "AverageAudienceDto": {
        "type": "object",
        "properties": {
          "videoLengthTags": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            }
          },
          "videoViewsTags": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            }
          }
        }
      },
      "BeautyDto": {
        "type": "object",
        "properties": {
          "interestStyleTags": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            }
          },
          "prefferedFunctionTags": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            }
          },
          "skinTypeTags": {
            "type": "integer",
            "format": "int32"
          },
          "skinToneTags": {
            "type": "integer",
            "format": "int32"
          },
          "makeupStyleTags": {
            "type": "integer",
            "format": "int32"
          }
        }
      },
      "ContentDto": {
        "type": "object",
        "properties": {
          "sns": {
            "$ref": "#/components/schemas/SnsDto"
          },
          "typeTags": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            }
          },
          "toneTags": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            }
          },
          "prefferedInvolvementTags": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            }
          },
          "prefferedCoverageTags": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            }
          }
        }
      },
      "FashionDto": {
        "type": "object",
        "properties": {
          "interestStyleTags": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            }
          },
          "preferredItemTags": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            }
          },
          "preferredBrandTags": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            }
          },
          "heightTag": {
            "type": "integer",
            "format": "int32"
          },
          "weightTypeTag": {
            "type": "integer",
            "format": "int32"
          },
          "topSizeTag": {
            "type": "integer",
            "format": "int32"
          },
          "bottomSizeTag": {
            "type": "integer",
            "format": "int32"
          }
        }
      },
      "MainAudienceDto": {
        "type": "object",
        "properties": {
          "genderTags": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            }
          },
          "ageTags": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            }
          }
        }
      },
      "MatchRequestDto": {
        "type": "object",
        "properties": {
          "beauty": {
            "$ref": "#/components/schemas/BeautyDto"
          },
          "fashion": {
            "$ref": "#/components/schemas/FashionDto"
          },
          "content": {
            "$ref": "#/components/schemas/ContentDto"
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
          "averageAudience": {
            "$ref": "#/components/schemas/AverageAudienceDto"
          }
        }
      },
      "BrandDto": {
        "type": "object",
        "properties": {
          "brandId": {
            "type": "integer",
            "format": "int64"
          },
          "brandName": {
            "type": "string"
          },
          "logoUrl": {
            "type": "string"
          },
          "matchingRatio": {
            "type": "integer",
            "format": "int32"
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
      "MatchResponseDto": {
        "type": "object",
        "properties": {
          "userType": {
            "type": "string"
          },
          "typeTag": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "highMatchingBrandList": {
            "$ref": "#/components/schemas/HighMatchingBrandListDto"
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
            "type": "integer",
            "format": "int64"
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
          "creatorId": {
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
          "creatorId",
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
            "type": "string",
            "description": "닉네임",
            "example": "홍길동"
          },
          "birth": {
            "type": "string",
            "format": "date",
            "description": "생년월일",
            "example": "1995-05-20"
          },
          "gender": {
            "type": "string",
            "description": "성별",
            "enum": [
              "MALE",
              "FEMALE",
              "NONE"
            ],
            "example": "MALE"
          },
          "role": {
            "type": "string",
            "description": "회원 역할",
            "enum": [
              "ADMIN",
              "GUEST",
              "BRAND",
              "CREATOR"
            ],
            "example": "CREATOR"
          },
          "terms": {
            "type": "array",
            "example": [
              {
                "type": "AGE",
                "agreed": true
              },
              {
                "type": "SERVICE_TERMS",
                "agreed": true
              },
              {
                "type": "PRIVACY_COLLECTION",
                "agreed": true
              },
              {
                "type": "PRIVACY_THIRD_PARTY",
                "agreed": true
              }
            ],
            "items": {
              "$ref": "#/components/schemas/TermAgreementDto",
              "description": "약관 동의 상세"
            }
          },
          "signupPurposeIds": {
            "type": "array",
            "description": "가입 목적 ID 리스트",
            "example": [1, 2, 3, 6],
            "items": {
              "type": "integer",
              "format": "int64"
            }
          },
          "contentCategoryIds": {
            "type": "array",
            "description": "관심 콘텐츠 카테고리 ID 리스트",
            "example": [1, 2],
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
            "description": "약관 이름",
            "enum": [
              "AGE",
              "SERVICE_TERMS",
              "PRIVACY_COLLECTION",
              "PRIVACY_THIRD_PARTY",
              "MARKETING_PRIVACY_COLLECTION",
              "MARKETING_NOTIFICATION"
            ],
            "example": "AGE"
          },
          "agreed": {
            "type": "boolean",
            "description": "동의 여부",
            "example": true
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
      "AttachmentUploadResponse": {
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
              "FAILED",
              "DELETE_PENDING"
            ]
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "CustomResponseAttachmentUploadResponse": {
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
            "$ref": "#/components/schemas/AttachmentUploadResponse"
          }
        }
      },
      "BeautyTypeUpdate": {
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
          },
          "interestCategories": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "interestFunctions": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "ContentsTypeUpdate": {
        "type": "object",
        "properties": {
          "viewerGender": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "viewerAge": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "avgVideoLength": {
            "type": "string"
          },
          "avgViews": {
            "type": "string"
          },
          "contentFormats": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "contentTones": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "desiredInvolvement": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "desiredUsageScope": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "FashionTypeUpdate": {
        "type": "object",
        "properties": {
          "bodyStats": {
            "type": "string"
          },
          "bodyShape": {
            "type": "string"
          },
          "topSize": {
            "type": "string"
          },
          "bottomSize": {
            "type": "string"
          },
          "interestFields": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "interestStyles": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "interestBrands": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "MyFeatureUpdateRequestDto": {
        "type": "object",
        "properties": {
          "beautyType": {
            "$ref": "#/components/schemas/BeautyTypeUpdate"
          },
          "fashionType": {
            "$ref": "#/components/schemas/FashionTypeUpdate"
          },
          "contentsType": {
            "$ref": "#/components/schemas/ContentsTypeUpdate"
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
      "CustomResponseMyFeatureResponseDto": {
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
            "$ref": "#/components/schemas/MyFeatureResponseDto"
          }
        }
      },
      "MyFeatureResponseDto": {
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
      "CustomResponseTagResponse": {
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
            "$ref": "#/components/schemas/TagResponse"
          }
        }
      },
      "TagItem": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          }
        }
      },
      "TagResponse": {
        "type": "object",
        "properties": {
          "tagType": {
            "type": "string"
          },
          "categories": {
            "type": "object",
            "additionalProperties": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/TagItem"
              }
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
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          }
        }
      },
      "CampaignDto": {
        "type": "object",
        "properties": {
          "brandId": {
            "type": "integer",
            "format": "int64"
          },
          "brandName": {
            "type": "string"
          },
          "brandLogoUrl": {
            "type": "string"
          },
          "brandMatchingRatio": {
            "type": "integer",
            "format": "int32"
          },
          "brandIsLiked": {
            "type": "boolean"
          },
          "brandIsRecruiting": {
            "type": "boolean"
          },
          "campaignManuscriptFee": {
            "type": "integer",
            "format": "int32"
          },
          "campaignName": {
            "type": "string"
          },
          "campaignDDay": {
            "type": "integer",
            "format": "int32"
          },
          "campaignTotalRecruit": {
            "type": "integer",
            "format": "int32"
          },
          "campaignTotalCurrentRecruit": {
            "type": "integer",
            "format": "int32"
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
          "brands": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CampaignDto"
            }
          },
          "count": {
            "type": "integer",
            "format": "int32"
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
      "AttachmentInfoResponse": {
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
              "FAILED",
              "DELETE_PENDING"
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
            "$ref": "#/components/schemas/AttachmentInfoResponse"
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
      "CampaignApplyDetailResponse": {
        "type": "object",
        "properties": {
          "campaignId": {
            "type": "integer",
            "format": "int64"
          },
          "campaignTitle": {
            "type": "string"
          },
          "campaignReason": {
            "type": "string"
          },
          "proposalStatus": {
            "type": "string",
            "enum": [
              "NONE",
              "REVIEWING",
              "MATCHED",
              "REJECTED"
            ]
          }
        }
      },
      "CampaignProposalDetailResponse": {
        "type": "object",
        "properties": {
          "proposalId": {
            "type": "integer",
            "format": "int64"
          },
          "brandId": {
            "type": "integer",
            "format": "int64"
          },
          "creatorId": {
            "type": "integer",
            "format": "int64"
          },
          "title": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "rewardAmount": {
            "type": "integer",
            "format": "int64"
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
          },
          "status": {
            "type": "string"
          },
          "refusalReason": {
            "type": "string"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "contentTags": {
            "$ref": "#/components/schemas/ContentTagResponse"
          }
        }
      },
      "CustomResponseCampaignProposalDetailResponse": {
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
            "$ref": "#/components/schemas/CampaignProposalDetailResponse"
          }
        }
      },
      "CollaborationResponse": {
        "type": "object",
        "properties": {
          "campaignId": {
            "type": "integer",
            "format": "int64"
          },
          "proposalId": {
            "type": "integer",
            "format": "int64"
          },
          "brandName": {
            "type": "string"
          },
          "thumbnailUrl": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "status": {
            "type": "string",
            "enum": [
              "NONE",
              "REVIEWING",
              "MATCHED",
              "REJECTED"
            ]
          },
          "startDate": {
            "type": "string",
            "format": "date"
          },
          "endDate": {
            "type": "string",
            "format": "date"
          },
          "type": {
            "type": "string",
            "enum": [
              "APPLIED",
              "SENT",
              "RECEIVED"
            ]
          }
        }
      },
      "CustomResponseListCollaborationResponse": {
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
              "$ref": "#/components/schemas/CollaborationResponse"
            }
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
          "campaginDescription": {
            "type": "string"
          },
          "campaginManuscriptFee": {
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
      "CustomResponseListSponsorProductListResponseDto": {
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
              "$ref": "#/components/schemas/SponsorProductListResponseDto"
            }
          }
        }
      },
      "SponsorProductListResponseDto": {
        "type": "object",
        "description": "협찬 가능 제품 리스트 응답 DTO",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64",
            "description": "협찬 제품 ID"
          },
          "name": {
            "type": "string",
            "description": "제품명"
          },
          "thumbnailImageUrl": {
            "type": "string",
            "description": "제품 대표 이미지 URL"
          },
          "totalCount": {
            "type": "integer",
            "format": "int32",
            "description": "총 모집 인원 (또는 제공 가능 수량)"
          },
          "currentCount": {
            "type": "integer",
            "format": "int32",
            "description": "현재 신청 인원 (또는 소진 수량)"
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
      "BrandExistingCampaignResponse": {
        "type": "object",
        "properties": {
          "campaigns": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CampaignItem"
            }
          }
        }
      },
      "CampaignItem": {
        "type": "object",
        "properties": {
          "campaignId": {
            "type": "integer",
            "format": "int64"
          },
          "title": {
            "type": "string"
          }
        }
      },
      "CustomResponseBrandExistingCampaignResponse": {
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
            "$ref": "#/components/schemas/BrandExistingCampaignResponse"
          }
        }
      },
      "BrandCampaignResponseDto": {
        "type": "object",
        "properties": {
          "campaignId": {
            "type": "integer",
            "format": "int64"
          },
          "title": {
            "type": "string"
          },
          "recruitStartDate": {
            "type": "string",
            "format": "date"
          },
          "recruitEndDate": {
            "type": "string",
            "format": "date"
          },
          "status": {
            "type": "string",
            "enum": [
              "UPCOMING",
              "RECRUITING",
              "CLOSED"
            ]
          }
        }
      },
      "BrandCampaignSliceResponse": {
        "type": "object",
        "properties": {
          "campaigns": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/BrandCampaignResponseDto"
            }
          },
          "hasNext": {
            "type": "boolean"
          }
        }
      },
      "CustomResponseBrandCampaignSliceResponse": {
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
            "$ref": "#/components/schemas/BrandCampaignSliceResponse"
          }
        }
      },
      "BrandRecruitingCampaignResponse": {
        "type": "object",
        "properties": {
          "campaigns": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CampaignCard"
            }
          }
        }
      },
      "CampaignCard": {
        "type": "object",
        "properties": {
          "campaignId": {
            "type": "integer",
            "format": "int64"
          },
          "brandName": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "recruitQuota": {
            "type": "integer",
            "format": "int32"
          },
          "rewardAmount": {
            "type": "integer",
            "format": "int64"
          },
          "imageUrl": {
            "type": "string"
          },
          "dday": {
            "type": "integer",
            "format": "int32"
          }
        }
      },
      "CustomResponseBrandRecruitingCampaignResponse": {
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
            "$ref": "#/components/schemas/BrandRecruitingCampaignResponse"
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