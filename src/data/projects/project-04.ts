import type { Project } from "@/types/content";

// PLACEHOLDER — 虛構範例專案，請以實際專案內容替換。
const base = "/projects/project-04";

export const project04: Project = {
  id: "project-04",
  slug: "desktop-productivity",
  number: 4,

  title: "桌面效率工具",
  subtitle: "Desktop Productivity App",

  category: "桌面應用",
  categoryEn: "Desktop App",

  developer: "成員 D",
  developerId: "member-d",

  summary: "跨平台桌面應用程式，整合待辦任務、專注計時與每日回顧，資料儲存於本機 SQLite。",
  motivation:
    "待辦清單、番茄鐘與筆記常分散在不同工具中，切換成本高。這個專案希望把規劃、專注與回顧放在同一個地方，並保有資料的本機掌控權。",
  audience: "需要自我管理時間的學生、自由工作者與遠端工作者。",
  problem: "任務與專注紀錄分散，每天結束時難以回顧實際完成了什麼。",
  description:
    "使用者可以建立任務並設定優先順序，使用內建的專注計時器進行工作時段。每天結束時，系統會彙整當日的任務完成狀況與專注時數，協助進行簡短回顧。所有資料都儲存於本機 SQLite 資料庫。",

  thumbnail: `${base}/cover.svg`,
  heroImage: `${base}/screenshot-01.svg`,

  accentColor: "#6EA8FF",
  accentColorSecondary: "#A78BFA",

  technologies: ["Python", "PySide6", "SQLite", "Claude Code"],
  techStack: [
    { group: "語言", groupEn: "Languages", items: ["Python 3.11"] },
    { group: "框架", groupEn: "Frameworks", items: ["PySide6（Qt for Python）"] },
    { group: "資料儲存", groupEn: "Storage", items: ["SQLite"] },
    { group: "函式庫", groupEn: "Libraries", items: ["sqlite3（標準函式庫）", "pytest"] },
    { group: "開發工具", groupEn: "Dev Tools", items: ["Claude Code", "Git", "PyInstaller（打包範例）"] },
  ],
  architecture: {
    summary: "以 PySide6 建立視窗與互動元件，資料層以 SQLite 儲存任務與專注紀錄，商業邏輯與介面分離。",
    layers: [
      { name: "介面層", description: "PySide6 視窗，包含任務列表、計時器與每日回顧頁。", items: ["任務列表", "計時器", "回顧頁"] },
      { name: "邏輯層", description: "任務狀態、計時流程與每日統計的計算。", items: ["任務狀態", "統計計算"] },
      { name: "資料層", description: "以 SQLite 保存任務與專注紀錄，離線即可使用。", items: ["資料表", "本機檔案"] },
    ],
  },

  features: [
    {
      id: "tasks",
      title: "任務管理",
      titleEn: "Task Management",
      description: "建立、編輯與排序任務，並為每項任務設定優先順序與標籤。",
      highlights: ["優先順序", "標籤分類"],
      media: { type: "image", src: `${base}/screenshot-01.svg`, alt: "任務管理介面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
    {
      id: "focus",
      title: "專注計時",
      titleEn: "Focus Timer",
      description: "內建番茄鐘式的工作與休息時段，計時結束時以視窗提示。",
      highlights: ["工作與休息時段", "結束提示"],
      media: { type: "image", src: `${base}/screenshot-02.svg`, alt: "專注計時介面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
    {
      id: "review",
      title: "每日回顧",
      titleEn: "Daily Review",
      description: "彙整當日完成的任務與專注時數，並列出未完成項目，方便安排隔天的工作。",
      highlights: ["完成彙整", "未完成提醒"],
      media: { type: "image", src: `${base}/screenshot-03.svg`, alt: "每日回顧介面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
    {
      id: "local",
      title: "本機儲存",
      titleEn: "Local Storage",
      description: "資料以 SQLite 保存於本機，不需要網路即可使用，並可匯出備份檔。",
      highlights: ["離線使用", "備份匯出"],
      media: { type: "image", src: `${base}/screenshot-04.svg`, alt: "本機儲存設定示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
  ],

  developmentStages: [
    {
      key: "idea",
      label: "IDEA",
      title: "發想與需求定義",
      description: "整理日常自我管理的流程，定義任務、計時、回顧與本機儲存四項核心需求。",
      claudeAssist: "與 Claude Code 討論功能範圍與資料模型，決定先完成哪些功能。",
    },
    {
      key: "prototype",
      label: "PROTOTYPE",
      title: "快速建立原型",
      description: "以 PySide6 建立主視窗，先完成新增與顯示任務。",
      claudeAssist: "由 Claude Code 產生視窗骨架與 SQLite 初始化程式碼。",
    },
    {
      key: "build",
      label: "BUILD",
      title: "迭代開發功能",
      description: "加入計時器、每日回顧頁與設定面板。",
      claudeAssist: "請 Claude Code 將資料存取獨立成模組，並補上基本測試。",
    },
    {
      key: "debug",
      label: "DEBUG",
      title: "測試與問題排除",
      description: "處理計時器與介面更新不同步、跨平台字型差異等問題。",
      claudeAssist: "提供錯誤紀錄與重現步驟，協助 Claude Code 找出問題來源。",
    },
    {
      key: "final",
      label: "FINAL PRODUCT",
      title: "完成最終版本",
      description: "調整介面細節，並整理跨平台的安裝與使用說明。",
      claudeAssist: "協助撰寫安裝說明與使用指南。",
    },
  ],

  challenges: [
    {
      title: "計時器與介面不同步",
      problem: "計時器在背景執行時，介面數字偶爾會落後或停止更新。",
      approach: "以單一計時來源驅動介面更新，並在視窗重新顯示時同步目前時間。",
      lesson: "時間相關的狀態應集中管理，避免多處各自計算。",
    },
    {
      title: "跨平台外觀不一致",
      problem: "不同作業系統的字型與縮放比例差異，容易導致版面錯位。",
      approach: "使用彈性排版並測試常見的縮放比例，避免固定寬度。",
      lesson: "桌面應用的版面需要在多種環境下實際檢查。",
    },
  ],

  results: [
    { label: "核心功能", value: "4 項", description: "完成任務管理、專注計時、每日回顧與本機儲存四項功能（範例內容，待實際成果替換）。" },
    { label: "成果說明", description: "完成可操作的展示版本，跨平台的實際表現待實際測試後替換。" },
  ],

  gallery: [
    { type: "image", src: `${base}/screenshot-01.svg`, alt: "主畫面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    { type: "image", src: `${base}/screenshot-02.svg`, alt: "計時器示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    { type: "image", src: `${base}/screenshot-03.svg`, alt: "每日回顧示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
  ],

  // 尚無實際連結 — 有網址時再填入，按鈕會自動顯示。
  links: {},

  isPlaceholder: true,
};
