import type { Project } from "@/types/content";

// PLACEHOLDER — 虛構範例專案，請以實際專案內容替換。
const base = "/projects/project-01";

export const project01: Project = {
  id: "project-01",
  slug: "ai-learning-assistant",
  number: 1,

  title: "AI 學習助手",
  subtitle: "AI Learning Assistant",

  category: "AI 應用",
  categoryEn: "AI Application",

  developer: "成員 A",
  developerId: "member-a",

  summary: "結合大型語言模型的個人化學習輔助工具，協助使用者整理筆記、即時問答並規劃學習進度。",
  motivation:
    "在自學過程中，資料往往分散在講義、網頁與筆記之間，難以快速找到重點。這個專案希望以 AI 作為學習夥伴，降低整理資料的時間成本。",
  audience: "需要整理大量學習資料的學生與自學者。",
  problem: "學習資料零散、複習缺乏方向，且遇到問題時無法即時獲得解釋。",
  description:
    "使用者可以上傳文字、PDF 或圖片形式的學習資料，系統會自動擷取重點並產生結構化筆記。透過對話介面，使用者能針對內容提問，並依據學習紀錄獲得下一步的複習建議。",

  thumbnail: `${base}/cover.svg`,
  heroImage: `${base}/screenshot-01.svg`,

  accentColor: "#8B7CFF",
  accentColorSecondary: "#4D8DFF",

  technologies: ["Python", "LLM", "Streamlit", "Claude Code"],
  techStack: [
    { group: "語言", groupEn: "Languages", items: ["Python 3.11"] },
    { group: "框架", groupEn: "Frameworks", items: ["Streamlit"] },
    { group: "AI 模型", groupEn: "AI Models", items: ["大型語言模型 API（範例）"] },
    { group: "開發工具", groupEn: "Dev Tools", items: ["Claude Code", "Git", "VS Code"] },
    { group: "函式庫", groupEn: "Libraries", items: ["pypdf", "pandas"] },
  ],
  architecture: {
    summary: "以 Streamlit 建立前端介面，後端負責文件解析與提示詞組裝，再呼叫語言模型產生回應。",
    layers: [
      { name: "介面層", description: "Streamlit 對話與筆記檢視介面。", items: ["對話視窗", "筆記面板"] },
      { name: "處理層", description: "文件解析、分段與提示詞組裝。", items: ["PDF 解析", "文字分段"] },
      { name: "模型層", description: "呼叫語言模型產生摘要與回答。", items: ["LLM API"] },
    ],
  },

  features: [
    {
      id: "qa",
      title: "智慧問答",
      titleEn: "Smart Q&A",
      description: "針對上傳的學習資料提問，系統會引用原文段落回答，方便回頭查證。",
      highlights: ["引用原文段落", "支援追問"],
      media: { type: "image", src: `${base}/screenshot-01.svg`, alt: "智慧問答介面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
    {
      id: "notes",
      title: "知識整理",
      titleEn: "Knowledge Notes",
      description: "自動將長篇內容整理成條列式重點筆記，並依主題分類。",
      highlights: ["自動摘要", "主題分類"],
      media: { type: "image", src: `${base}/screenshot-02.svg`, alt: "知識整理筆記介面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
    {
      id: "personal",
      title: "個人化學習",
      titleEn: "Personalized Path",
      description: "根據提問紀錄與複習狀況，提供下一步的學習建議。",
      highlights: ["學習紀錄", "複習提醒"],
      media: { type: "image", src: `${base}/screenshot-03.svg`, alt: "個人化學習建議介面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
    {
      id: "formats",
      title: "多格式支援",
      titleEn: "Multi-format Input",
      description: "支援文字、PDF 與圖片等多種格式的學習資料匯入。",
      highlights: ["文字", "PDF", "圖片"],
      media: { type: "image", src: `${base}/screenshot-04.svg`, alt: "多格式匯入介面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
  ],

  developmentStages: [
    {
      key: "idea",
      label: "IDEA",
      title: "發想與需求定義",
      description: "整理自學時遇到的痛點，定義「整理」、「問答」、「建議」三項核心需求。",
      claudeAssist: "與 Claude Code 討論功能範圍，拆解成可逐步完成的任務清單。",
    },
    {
      key: "prototype",
      label: "PROTOTYPE",
      title: "快速建立原型",
      description: "以 Streamlit 建立最小可行介面，先打通上傳與問答流程。",
      claudeAssist: "由 Claude Code 產生初版介面與文件解析程式碼。",
    },
    {
      key: "build",
      label: "BUILD",
      title: "迭代開發功能",
      description: "逐步加入筆記整理、學習紀錄與建議功能。",
      claudeAssist: "在每次迭代中請 Claude Code 重構模組並補上說明。",
    },
    {
      key: "debug",
      label: "DEBUG",
      title: "測試與問題排除",
      description: "處理長文件分段、編碼錯誤與回應格式不一致等問題。",
      claudeAssist: "提供錯誤訊息給 Claude Code，協助定位原因並提出修正方案。",
    },
    {
      key: "final",
      label: "FINAL PRODUCT",
      title: "完成最終版本",
      description: "整理介面細節與使用說明，完成可展示的版本。",
      claudeAssist: "協助撰寫 README 與使用說明文件。",
    },
  ],

  challenges: [
    {
      title: "長篇文件超出模型輸入限制",
      problem: "上傳的講義過長時，無法一次送入模型處理。",
      approach: "將文件依段落切分，並只挑選與問題最相關的段落送入模型。",
      lesson: "資料前處理的品質，直接影響 AI 回答的品質。",
    },
    {
      title: "回應格式不穩定",
      problem: "模型輸出的筆記格式時常不一致，難以在介面上呈現。",
      approach: "在提示詞中明確指定輸出結構，並加入格式檢查與重試。",
      lesson: "與 AI 協作時，清楚的規格比冗長的說明更有效。",
    },
  ],

  results: [
    { label: "核心功能", value: "4 項", description: "完成問答、筆記整理、學習建議與多格式匯入四項功能（範例內容，待實際成果替換）。" },
    { label: "成果說明", description: "完成可操作的展示版本（範例內容，待實際成果替換）。" },
  ],

  gallery: [
    { type: "image", src: `${base}/screenshot-01.svg`, alt: "主畫面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    { type: "image", src: `${base}/screenshot-02.svg`, alt: "筆記畫面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    { type: "image", src: `${base}/screenshot-03.svg`, alt: "建議畫面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
  ],

  // 尚無實際連結 — 有網址時再填入，按鈕會自動顯示。
  links: {},

  isPlaceholder: true,
};
