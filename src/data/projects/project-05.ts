import type { Project } from "@/types/content";

// PLACEHOLDER — 虛構範例專案，請以實際專案內容替換。
const base = "/projects/project-05";

export const project05: Project = {
  id: "project-05",
  slug: "ai-model-research",
  number: 5,

  title: "AI 模型研究",
  subtitle: "AI Model Research",

  category: "模型研究",
  categoryEn: "AI Model",

  developer: "成員 E",
  developerId: "member-e",

  summary: "以研究筆記本形式進行的影像分類實驗，在自建資料集上微調小型模型，並比較不同的資料擴增策略。",
  motivation:
    "許多模型效果的差異來自資料處理的細節，但實驗過程常缺乏系統化的紀錄。這個專案希望把每一次實驗的設定與結果整理成可回溯的研究流程。",
  audience: "正在學習深度學習的學生、研究助理，以及想了解資料擴增影響的實作者。",
  problem: "資料量有限時，模型容易過度擬合；不同擴增方式的效果難以單獨比較，實驗也難以重現。",
  description:
    "專案以自行蒐集的小型影像資料集為對象，微調一個輕量的預訓練影像分類模型。研究者可在筆記本中切換不同的資料擴增策略，每次實驗的設定、訓練曲線與混淆矩陣都會被記錄，方便並排比較。",

  thumbnail: `${base}/cover.svg`,
  heroImage: `${base}/screenshot-01.svg`,

  accentColor: "#7CF0B4",
  accentColorSecondary: "#5EE3F0",

  technologies: ["Python", "PyTorch", "Jupyter", "Matplotlib", "Claude Code"],
  techStack: [
    { group: "語言", groupEn: "Languages", items: ["Python 3.11"] },
    { group: "框架", groupEn: "Frameworks", items: ["PyTorch", "torchvision"] },
    { group: "函式庫", groupEn: "Libraries", items: ["NumPy", "Matplotlib", "scikit-learn（評估指標）"] },
    { group: "實驗紀錄", groupEn: "Experiment Tracking", items: ["CSV 實驗表（範例）"] },
    { group: "開發工具", groupEn: "Dev Tools", items: ["Jupyter Notebook", "Claude Code", "Git"] },
  ],
  architecture: {
    summary: "以 Jupyter 筆記本串接資料準備、模型訓練與結果評估三個階段，每個階段的輸出都會存成可重現的紀錄。",
    layers: [
      { name: "資料層", description: "自建影像資料集的整理、切分與標註檢查。", items: ["資料夾結構", "訓練與驗證切分"] },
      { name: "模型層", description: "載入預訓練的輕量分類模型，並進行微調。", items: ["預訓練權重", "分類頭微調"] },
      { name: "評估層", description: "以指標與圖表比較不同實驗設定的結果。", items: ["準確率曲線", "混淆矩陣"] },
    ],
  },

  features: [
    {
      id: "dataset",
      title: "自建資料集",
      titleEn: "Custom Dataset",
      description: "整理自行蒐集的影像，依類別建立資料夾，並切分訓練與驗證集。",
      highlights: ["類別整理", "資料切分"],
      media: { type: "image", src: `${base}/screenshot-01.svg`, alt: "自建資料集整理示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
    {
      id: "augment",
      title: "擴增策略比較",
      titleEn: "Augmentation Comparison",
      description: "並列測試翻轉、裁切與色彩調整等策略，觀察各自對驗證結果的影響。",
      highlights: ["策略切換", "並列比較"],
      media: { type: "image", src: `${base}/screenshot-02.svg`, alt: "擴增策略比較示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
    {
      id: "finetune",
      title: "模型微調",
      titleEn: "Fine-tuning",
      description: "以預訓練權重為起點，凍結部分層並微調分類頭，降低小資料集的過度擬合風險。",
      highlights: ["預訓練權重", "凍結與微調"],
      media: { type: "image", src: `${base}/screenshot-03.svg`, alt: "模型微調設定示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
    {
      id: "tracking",
      title: "實驗紀錄",
      titleEn: "Experiment Tracking",
      description: "每次實驗的設定、隨機種子、訓練曲線與混淆矩陣都會寫入紀錄表，便於重現與回顧。",
      highlights: ["設定紀錄", "曲線與矩陣"],
      media: { type: "image", src: `${base}/screenshot-04.svg`, alt: "實驗紀錄表示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    },
  ],

  developmentStages: [
    {
      key: "idea",
      label: "IDEA",
      title: "發想與研究問題",
      description: "釐清研究問題：在小型資料集上，哪些擴增策略較有助於分類？並定義資料、比較、微調與紀錄四項需求。",
      claudeAssist: "與 Claude Code 討論實驗設計，列出需要控制的變因。",
    },
    {
      key: "prototype",
      label: "PROTOTYPE",
      title: "快速建立原型",
      description: "在筆記本中以小批量資料跑通訓練與評估流程。",
      claudeAssist: "由 Claude Code 產生資料載入與訓練迴圈的初版程式碼。",
    },
    {
      key: "build",
      label: "BUILD",
      title: "迭代開發功能",
      description: "加入擴增策略切換、凍結設定與實驗紀錄表。",
      claudeAssist: "請 Claude Code 將重複的訓練程式抽成函式，讓每次實驗只需修改設定。",
    },
    {
      key: "debug",
      label: "DEBUG",
      title: "測試與問題排除",
      description: "處理資料標籤錯位、顯示記憶體不足與結果無法重現等問題。",
      claudeAssist: "提供錯誤訊息與設定檔，協助 Claude Code 定位原因。",
    },
    {
      key: "final",
      label: "FINAL PRODUCT",
      title: "完成最終版本",
      description: "整理筆記本的章節結構與研究說明，並保留完整的實驗紀錄。",
      claudeAssist: "協助撰寫研究說明與各章節的摘要文字。",
    },
  ],

  challenges: [
    {
      title: "小資料集容易過度擬合",
      problem: "資料量少時，模型在訓練集上表現良好，但在驗證集上明顯下降。",
      approach: "比較不同擴增策略、加入早停機制，並在紀錄中同時保留訓練與驗證曲線。",
      lesson: "只看單一指標容易誤判，曲線能提供更完整的線索。",
    },
    {
      title: "實驗結果難以重現",
      problem: "同樣的設定在不同時間執行，結果略有差異，難以確認改進是否真實。",
      approach: "固定隨機種子並將所有設定寫入實驗表，每次比較都使用相同的切分。",
      lesson: "重現性是研究結論可信的基礎。",
    },
  ],

  results: [
    { label: "核心功能", value: "4 項", description: "完成自建資料集、擴增策略比較、模型微調與實驗紀錄四項功能（範例內容，待實際成果替換）。" },
    { label: "研究結果", description: "目前為流程與方法的展示。各擴增策略的實際比較結果，待實驗完成後補上，本頁不提供任何數值。" },
  ],

  gallery: [
    { type: "image", src: `${base}/screenshot-01.svg`, alt: "主畫面示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    { type: "image", src: `${base}/screenshot-02.svg`, alt: "擴增比較示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
    { type: "image", src: `${base}/screenshot-03.svg`, alt: "微調設定示意圖（預留畫面）", placeholder: true, width: 1600, height: 1000 },
  ],

  // 尚無實際連結 — 有網址時再填入，按鈕會自動顯示。
  links: {},

  isPlaceholder: true,
};
