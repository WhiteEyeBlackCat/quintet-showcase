import type { TeamMember } from "@/types/content";

// PLACEHOLDER — 虛構成員資料，請以實際成員資訊替換。
export const team: TeamMember[] = [
  {
    id: "member-a",
    name: "成員 A",
    nameEn: "Member A",
    role: "AI 應用開發",
    projectSlug: "ai-learning-assistant",
    avatar: "/team/member-a.svg",
    bio: "專注於以大型語言模型打造學習輔助工具，喜歡把零散的學習資料整理成清楚的脈絡。",
    isPlaceholder: true,
  },
  {
    id: "member-b",
    name: "成員 B",
    nameEn: "Member B",
    role: "房價資料分析",
    projectSlug: "taiwan-housing",
    avatar: "/team/member-b.svg",
    // 待補：姓名與自我介紹（目前只有作品資訊，姓名仍為範例）
    bio: "台灣房價分析作者，以實價登錄資料建立可驗證、會說明自己誤差的估價模型。",
    isPlaceholder: true,
  },
  {
    id: "member-c",
    name: "Wen Bo Hao",
    nameEn: "Wen Bo Hao",
    role: "資料探索工具開發",
    projectSlug: "vizpilot",
    avatar: "/team/member-c.svg",
    bio: "VizPilot 開發者。關注如何讓 AI 輔助資料分析既實用又誠實：結論交給統計，AI 負責提出假設與說明。",
    isPlaceholder: false,
  },
  {
    id: "member-d",
    name: "成員 D",
    nameEn: "Member D",
    role: "桌面應用開發",
    projectSlug: "desktop-productivity",
    avatar: "/team/member-d.svg",
    bio: "對日常效率工具有濃厚興趣，致力於讓桌面軟體介面簡潔、操作直覺。",
    isPlaceholder: true,
  },
  {
    id: "member-e",
    name: "成員 E",
    nameEn: "Member E",
    role: "AI 模型研究",
    projectSlug: "ai-model-research",
    avatar: "/team/member-e.svg",
    bio: "以實驗為核心探索影像分類模型，重視每一次實驗設定的可重現性與紀錄。",
    isPlaceholder: true,
  },
];
