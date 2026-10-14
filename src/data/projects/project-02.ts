import type { Project } from "@/types/content";

// PLACEHOLDER — 虛構範例專案，請以實際專案內容替換。
const base = "/projects/project-02";

export const project02: Project = {
  id: "project-02",
  slug: "image-generator",
  number: 2,

  title: "影像生成工具",
  subtitle: "Image Generator",

  category: "生成式 AI",
  categoryEn: "Generative AI",

  developer: "成員 B",
  developerId: "member-b",

  summary: "以開源擴散模型為基礎的本機影像生成工具，協助創作者快速產出概念草圖與分鏡參考。",
  motivation:
    "概念設計與分鏡階段需要大量快速的視覺草稿，但每次都從頭描述與調整參數十分耗時。這個專案希望把常用的提示詞與風格整理成可重複使用的工具，讓創作者把精力放在構圖與故事上。",
  audience: "需要快速產出視覺草稿的插畫師、遊戲與動畫前期設計人員，以及學習生成式影像的學生。",
  problem: "提示詞寫法不一致、風格難以延續，且生成結果散落各處，難以比較與回溯。",
  description:
    "使用者可以選擇提示詞範本與風格預設，輸入主題後一次批次產生多張候選圖像。所有生成紀錄都保存於本機，方便比較參數，並重現喜歡的結果。",

  thumbnail: `${base}/cover.svg`,
  heroImage: `${base}/screenshot-01.svg`,

  accentColor: "#E879D0",
  accentColorSecondary: "#FFB86B",

  technologies: ["Python", "Stable Diffusion", "Gradio", "Claude Code"],
  techStack: [
    { group: "語言", groupEn: "Languages", items: ["Python 3.11"] },
    { group: "框架", groupEn: "Frameworks", items: ["Gradio"] },
    { group: "AI 模型", groupEn: "AI Models", items: ["Stable Diffusion（開源擴散模型，範例）"] },
    { group: "函式庫", groupEn: "Libraries", items: ["Diffusers", "Pillow"] },
    { group: "開發工具", groupEn: "Dev Tools", items: ["Claude Code", "Git", "VS Code"] },
  ],
  architecture: {
    summary: "以 Gradio 建立操作介面，後端負責提示詞組裝與批次任務管理，再透過 Diffusers 載入模型產生影像。",
    layers: [
      { name: "介面層", description: "Gradio 操作頁面，包含範本選擇、參數設定與結果瀏覽。", items: ["提示詞表單", "結果瀏覽"] },
      { name: "處理層", description: "提示詞組裝、風格套用與批次任務排程。", items: ["範本引擎", "批次佇列"] },
      { name: "模型層", description: "以 Diffusers 載入開源擴散模型並執行推論。", items: ["模型載入", "推論設定"] },
    ],
  },

  features: [
    {
      id: "templates",
      title: "提示詞範本",
      titleEn: "Prompt Templates",
      description: "將常用的角色、場景與鏡頭描述整理成範本，填入關鍵字即可組成完整提示詞。",
      highlights: ["角色與場景範本", "關鍵字填入"],
      media: { type: "image", src: `${base}/screenshot-01.svg`, alt: "提示詞範本介面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
    {
      id: "styles",
      title: "風格預設",
      titleEn: "Style Presets",
      description: "提供多組風格預設，讓同一個主題能快速切換不同的畫風。",
      highlights: ["畫風切換", "預設可自訂"],
      media: { type: "image", src: `${base}/screenshot-02.svg`, alt: "風格預設介面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
    {
      id: "batch",
      title: "批次生成",
      titleEn: "Batch Generation",
      description: "一次送出多個變體，批次產生候選圖像，並依序顯示於結果區。",
      highlights: ["多張變體", "依序預覽"],
      media: { type: "image", src: `${base}/screenshot-03.svg`, alt: "批次生成結果示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
    {
      id: "history",
      title: "生成紀錄",
      titleEn: "Generation History",
      description: "每次生成的提示詞、參數與圖像都會保存於本機，方便回溯與重現。",
      highlights: ["參數紀錄", "本機保存"],
      media: { type: "image", src: `${base}/screenshot-04.svg`, alt: "生成紀錄介面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
  ],

  developmentStages: [
    {
      key: "idea",
      label: "IDEA",
      title: "發想與需求定義",
      description: "整理概念設計流程中最耗時的步驟，定義範本、風格、批次與紀錄四項核心需求。",
      claudeAssist: "與 Claude Code 討論工具範圍，並將需求拆解成可逐步完成的任務。",
    },
    {
      key: "prototype",
      label: "PROTOTYPE",
      title: "快速建立原型",
      description: "以 Gradio 建立最小介面，先打通輸入提示詞到顯示影像的流程。",
      claudeAssist: "由 Claude Code 產生初版介面與模型呼叫程式碼。",
    },
    {
      key: "build",
      label: "BUILD",
      title: "迭代開發功能",
      description: "加入範本引擎、風格預設與批次佇列，逐步擴充功能。",
      claudeAssist: "請 Claude Code 協助抽出共用模組，並為每個函式補上說明。",
    },
    {
      key: "debug",
      label: "DEBUG",
      title: "測試與問題排除",
      description: "處理顯示記憶體不足、生成逾時與批次中斷等問題。",
      claudeAssist: "將錯誤紀錄交給 Claude Code，協助定位原因並提出修正方案。",
    },
    {
      key: "final",
      label: "FINAL PRODUCT",
      title: "完成最終版本",
      description: "整理介面版面與操作說明，完成可展示的本機版本。",
      claudeAssist: "協助撰寫安裝步驟與使用說明文件。",
    },
  ],

  challenges: [
    {
      title: "模型執行所需記憶體偏高",
      problem: "在一般個人電腦上執行擴散模型時，記憶體與顯示記憶體容量容易不足。",
      approach: "調整推論精度與批次大小，並提供較小的預設設定作為起點。",
      lesson: "工具的預設值應優先考慮一般硬體，進階設定再交由使用者調整。",
    },
    {
      title: "同一提示詞的結果不穩定",
      problem: "相同提示詞每次生成的構圖差異很大，不利於比較。",
      approach: "在生成紀錄中保存隨機種子與所有參數，讓結果可以重現。",
      lesson: "可重現性比單次結果的品質更能支撐創作流程。",
    },
  ],

  results: [
    { label: "核心功能", value: "4 項", description: "完成範本、風格、批次生成與生成紀錄四項功能（範例內容，待實際成果替換）。" },
    { label: "成果說明", description: "完成可操作的本機展示版本，實際使用成效待實際專案內容替換。" },
  ],

  gallery: [
    { type: "image", src: `${base}/screenshot-01.svg`, alt: "主畫面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    { type: "image", src: `${base}/screenshot-02.svg`, alt: "風格預設示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    { type: "image", src: `${base}/screenshot-03.svg`, alt: "批次結果示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
  ],

  // 尚無實際連結 — 有網址時再填入，按鈕會自動顯示。
  links: {},

  isPlaceholder: true,
};
