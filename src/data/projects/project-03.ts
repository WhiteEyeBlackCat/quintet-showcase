import type { Project } from "@/types/content";

// 實際專案：VizPilot。內容整理自 VizPilot repo 的 README、專案介紹 PDF、
// .claude/CURRENT_STATE.md、PROGRESS.md 與 git 紀錄；截圖皆為 Playwright 端對端測試的實際執行畫面。
const base = "/projects/project-03";

export const project03: Project = {
  id: "project-03",
  slug: "vizpilot",
  number: 3,

  title: "VizPilot",
  subtitle: "Local AI Data Exploration Assistant",

  category: "資料探索 · 本地 AI",
  categoryEn: "Data Exploration",

  developer: "Wen Bo Hao",
  developerId: "member-c",

  summary: "上傳一份表格資料，自動剖析、計算統計證據並推薦值得看的圖表——結論由統計決定，本地 LLM 只是可關閉的加分層。",
  motivation:
    "多數「AI 畫圖工具」把資料丟給語言模型，再把模型說的話當成結論。VizPilot 想反過來做：先用統計算出證據，再讓 AI 協助提出假設與說明，而每一句話背後的數字都必須由後端算出並驗證。",
  audience: "手上有 CSV、Excel 或 Parquet 資料，想快速知道「這份資料裡什麼值得看、該用哪種圖看」的人，特別是不方便把資料上傳到雲端的使用情境。",
  problem:
    "一般的自動化圖表推薦常把平凡或由公式算出的關係（例如營收＝單價 × 數量）當成發現，也可能讓語言模型編造數字；同時，把原始資料送到雲端服務也有隱私疑慮。",
  description:
    "VizPilot 在自己的電腦上執行。上傳 CSV、XLSX 或 Parquet 檔後，後端以 Polars 剖析欄位型別與品質，計算兩層統計證據，規則引擎再依證據分數把候選圖分成推薦重點、次要與探索三層。開啟本地 LLM 時，它只負責提出假設與措辭，所有說法都要通過後端的統計驗證與措辭閘門；原始資料列永遠不會送給 LLM。",

  thumbnail: `${base}/cover.png`,
  heroImage: `${base}/key-findings.png`,
  mediaPosition: "top",

  accentColor: "#5EE3F0",
  accentColorSecondary: "#4D8DFF",

  technologies: ["Python", "FastAPI", "Polars", "React", "TypeScript", "ECharts", "Ollama", "Claude Code"],
  techStack: [
    { group: "語言", groupEn: "Languages", items: ["Python 3", "TypeScript (strict)"] },
    { group: "後端", groupEn: "Backend", items: ["FastAPI", "Polars", "Pydantic"] },
    { group: "前端", groupEn: "Frontend", items: ["React 18", "Vite", "Tailwind CSS", "shadcn/ui", "Apache ECharts"] },
    { group: "AI 模型", groupEn: "AI Models", items: ["任何 OpenAI 相容本地端點", "實測 qwen2.5:14b（Ollama）"] },
    { group: "測試", groupEn: "Testing", items: ["pytest", "vitest", "Playwright（真實後端端對端）"] },
    { group: "開發工具", groupEn: "Dev Tools", items: ["Claude Code", "Git worktree", "VS Code"] },
  ],
  architecture: {
    summary:
      "資料只在本機流動：上傳後存成 Parquet 暫存檔，由後端完成所有剖析、統計與聚合；前端只負責把後端算好的結果畫出來。LLM 是可選的一層，只回傳經 Pydantic 驗證的結構化 JSON，不產生任何程式碼。",
    layers: [
      {
        name: "資料與剖析層",
        description: "上傳 CSV / XLSX / Parquet，存成 Parquet 暫存檔（無資料庫）；Polars 進行型別推斷、品質旗標與統計摘要。",
        items: ["型別推斷", "哨兵值與髒數值處理", "衍生欄位偵測"],
      },
      {
        name: "證據與推薦層",
        description: "兩層統計證據（相關、調整後 η²、離散度 F 檢定、交互作用、趨勢與變化點）；規則引擎依證據分數分層並控制多樣性。",
        items: ["Evidence L1 / L2", "11 種分析意圖", "18 種圖型閘門"],
      },
      {
        name: "本地 LLM 層（可關閉）",
        description: "兩階段工作流：LLM #1 提出假設 → 幻覺閘門與型別化探針驗證 → LLM #2 只做措辭，句中只能出現後端算出的數字。",
        items: ["幻覺閘門", "探針驗證", "措辭閘門"],
      },
      {
        name: "介面層",
        description: "React SPA：Overview、Insights、Explore、Workspace 四頁與共用分析面板；ECharts 轉接層把後端的 RenderResult 畫成互動圖表。",
        items: ["分析面板", "手動建圖", "PNG 匯出"],
      },
    ],
  },

  features: [
    {
      id: "profiling",
      title: "自動剖析與品質揭露",
      titleEn: "Profiling & Data Quality",
      description:
        "上傳後先看清楚資料：列數、欄數、缺失、型別與統計摘要一目了然。剖析器會處理帶單位或千分位的數值、看起來像 ID 的欄位與 -999 這類哨兵值，並列出由公式算出的衍生欄位與近似重複欄位。",
      highlights: ["型別推斷", "品質旗標", "衍生欄位"],
      media: { type: "image", src: `${base}/overview.png`, alt: "VizPilot Overview 頁：hour_like 資料集的欄位型別、缺失、統計摘要與衍生欄位", width: 1400, height: 1000, position: "top" },
    },
    {
      id: "honest",
      title: "誠實的推薦分層",
      titleEn: "Evidence-tiered Recommendations",
      description:
        "候選圖依「基礎分數 × 樣本量 × 完整度 × 穩健度」分成推薦重點、次要與探索三層。定義性關係、重複欄位與平凡關係會被主動降級；像 sales 由單價與數量算出的資料，推薦重點會誠實地留空。",
      highlights: ["三層推薦", "定義性關係降級", "0 個發現是合法答案"],
      media: { type: "image", src: `${base}/honest-empty.png`, alt: "VizPilot Insights 頁：sales_basic 的公式關係揭露在橫幅，推薦重點留空", width: 1400, height: 1000, position: "top" },
    },
    {
      id: "llm",
      title: "經過驗證的 AI 發現",
      titleEn: "Verified Key Findings",
      description:
        "開啟本地 LLM 時，Key Findings 只列出通過後端統計驗證的發現。範例中，LLM 提出的假設經兩樣本 KS 檢定探針驗證後才成為發現，證據列直接顯示後端算出的統計量與樣本數。",
      highlights: ["幻覺閘門", "探針驗證", "措辭閘門"],
      media: { type: "image", src: `${base}/key-findings.png`, alt: "VizPilot Key Findings：經 KS 檢定探針驗證的發現與分析面板（真實 qwen2.5:14b）", width: 1400, height: 1000, position: "top" },
    },
    {
      id: "panel",
      title: "看圖，也看為什麼",
      titleEn: "Analysis Panel",
      description:
        "點任何一張卡片，右側滑出分析面板：互動圖表、信心分數的分解、實際使用的列數，以及同一個問題的替代圖型（例如散佈圖 ↔ hexbin），並可 Save、Export 或放大檢視。",
      highlights: ["信心分解", "替代圖型", "Save / Export"],
      media: { type: "image", src: `${base}/analysis-panel.png`, alt: "VizPilot 分析面板：humidity vs temperature 散佈圖與 Supporting evidence", width: 1400, height: 1000, position: "top" },
    },
    {
      id: "charts",
      title: "從問題選圖，而非固定對照",
      titleEn: "Intent-driven Chart Selection",
      description:
        "系統先判定欄位的語意角色（週期、有序、時間…），再推出這個發現在回答哪一種分析問題，最後從合格圖型中選圖。18 種圖型各有閘門條件，例如組成永遠用堆疊長條而不是圓餅圖。",
      highlights: ["11 種分析意圖", "18 種圖型", "不推薦圓餅圖"],
      media: { type: "image", src: `${base}/stacked-bar.png`, alt: "VizPilot 堆疊長條圖：各地區營收由哪些通路組成", width: 1400, height: 1000, position: "top" },
    },
  ],

  developmentStages: [
    {
      key: "idea",
      label: "IDEA",
      title: "規格與原則先行",
      description:
        "先寫下完整規格與決策紀錄：資料不出門、LLM 可關閉、LLM 只回結構化 JSON、不畫誤導的圖。並把「型別推斷」列為最大風險。",
      claudeAssist: "與 Claude Code 討論產品定位與架構取捨，整理成 SPEC 與 DECISIONS 文件，之後每個階段都先對照這兩份文件再動手。",
    },
    {
      key: "prototype",
      label: "PROTOTYPE",
      title: "六個階段完成 MVP",
      description:
        "依序完成上傳、剖析器、規則推薦引擎、後端渲染、LLM 層與前端 SPA 六個階段，打通「上傳 → 推薦 → 畫圖」的完整流程。",
      claudeAssist: "每個階段都走「設計審查 → 實作 → 程式碼審查 → 獨立驗證」的流程，驗證通過才進入下一階段。",
    },
    {
      key: "build",
      label: "BUILD",
      title: "提升推薦品質與介面",
      description:
        "加入兩層統計證據與分層制度、衍生欄位偵測、近似重複抑制；前端從 Plotly 遷移到 ECharts 與 shadcn/ui，並建立兩階段 LLM 工作流。",
      claudeAssist: "以多個 Claude Code agent 在各自的 git worktree 平行開發，避免互相覆蓋檔案。",
    },
    {
      key: "debug",
      label: "DEBUG",
      title: "獨立驗證與攻擊測試",
      description:
        "兩階段 LLM 工作流經過四輪獨立驗證：前三輪都被找出問題（例如 LLM 自己編的數字溜進句子），修正後第四輪才通過。",
      claudeAssist: "實作與驗證交給不同的 agent：驗證 agent 用攻擊腳本與真實模型端對端測試，不採信實作方的自我回報。",
    },
    {
      key: "final",
      label: "FINAL PRODUCT",
      title: "18 種圖型與真實模型實測",
      description:
        "完成從分析意圖推導圖型的選圖流程、組成與流向圖，並以 qwen2.5:14b 實測完整的「假設 → 探針 → 措辭」路徑。",
      claudeAssist: "協助整理 README、架構與契約文件，以及以端對端測試截圖製作的專案介紹文件。",
    },
  ],

  challenges: [
    {
      title: "平凡關係被當成發現",
      problem: "以 sales_basic 實測時，系統把 sales 與 unit_price 的強相關列為重點——但 sales 本來就是 unit_price × quantity × (1 − discount) 算出來的。",
      approach: "加入衍生欄位偵測：辨識乘積、折扣、分級與近似複製等定義性關係，在推薦中降級並在介面上揭露公式。",
      lesson: "「沒有值得看的發現」也是合法答案；誠實比看起來有結論更重要。",
    },
    {
      title: "語言模型編造數字",
      problem: "LLM 產生的說明可能夾帶自己編的數字或日期，看起來像統計結果，實際上沒有任何根據。",
      approach: "建立措辭閘門：句子裡只能出現後端算出的數字與變化點日期，否則退回模板句；並區分欄位名稱（如 pm25）裡的數字與模型編的數字。",
      lesson: "AI 適合提出假設與溝通結果，驗證必須交給統計。",
    },
    {
      title: "圖表套件過大",
      problem: "原本使用 Plotly，前端打包約 5.7 MB，載入緩慢。",
      approach: "改用經 tree-shaking 的 Apache ECharts 並自寫 React 轉接層，以真實後端輸出的 fixture 測試轉換結果，打包降到約 1.0 MB。",
      lesson: "換掉核心套件前，先用真實資料建立測試，才能放心遷移。",
    },
    {
      title: "小樣本的假陽性",
      problem: "每組只有約 30 列時，組間離散度證據容易把隨機差異誤判成真實差異。",
      approach: "在效果量門檻之外加上 Brown–Forsythe F 檢定，並以固定亂數種子的模擬校正誤判率；過小的組別直接排除、不作為判斷依據。",
      lesson: "統計門檻要用模擬驗證，而不是憑直覺設定。",
    },
  ],

  results: [
    { label: "後端測試", value: "793", description: "pytest 全數通過（2026 年 10 月重新執行確認）。" },
    { label: "前端測試", value: "114", description: "vitest 全數通過，涵蓋 ECharts 轉接層與真實後端 fixture。" },
    { label: "支援圖型", value: "18 種", description: "每一種圖型在後端都有具名的閘門條件，資料不符合就不會被推薦。" },
    { label: "開發歷程", value: "20 階段", description: "63 次 commit，每個階段都經過獨立驗證後才合併。" },
  ],

  gallery: [
    { type: "image", src: `${base}/insights.png`, alt: "VizPilot Insights 頁：air_quality 資料集的分層推薦圖", width: 1400, height: 1000, position: "top" },
    { type: "image", src: `${base}/explore.png`, alt: "VizPilot Explore 頁：手動選擇圖型與欄位建圖", width: 1400, height: 1000, position: "top" },
    { type: "image", src: `${base}/workspace.png`, alt: "VizPilot Workspace 頁：保存的圖表集中管理", width: 1400, height: 1000, position: "top" },
    { type: "image", src: `${base}/cover.png`, alt: "VizPilot 流向圖（sankey）：from_hub → to_hub 的筆數流", width: 1400, height: 1000, position: "top" },
  ],

  links: {
    github: "https://github.com/WhiteEyeBlackCat/VizPilot",
  },

  isPlaceholder: false,
};
