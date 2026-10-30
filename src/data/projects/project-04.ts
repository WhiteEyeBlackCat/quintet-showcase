import type { Project } from "@/types/content";

// 實際專案：SurveyVoiceAI 的訪員品質稽核（repo 內稱 Part 1）。文字定稿於 drafts/li-chi-yun.md，
// 內容整理自 SurveyVoiceAI 的 CLAUDE.md、.scratch/survey-voice-ai/STATUS.md 與 tickets 13–17。
// 專案處理的是可識別受訪者的電訪錄音，因此不放截圖、逐字稿、委託專案名稱、錄音或訪員編號；
// 配圖由 scripts/generate-diagrams.py 依 ticket 數字繪製。
const base = "/projects/project-04";

export const project04: Project = {
  id: "project-04",
  slug: "survey-voice-ai",
  number: 4,

  title: "SurveyVoiceAI",
  subtitle: "AI-Assisted Interviewer QA for Telephone Surveys",

  category: "語音 AI · 調查品質",
  categoryEn: "Survey QA",

  developer: "李祺允 LI CHI YUN",
  developerId: "member-d",

  summary: "自動比對電訪錄音和訪員登錄的答案，把最可能登錯的題目排在最前面，讓督導知道先聽哪裡。",
  motivation:
    "電訪品質靠督導抽聽，大部分通話從來沒有人聽過。但錄音庫裡早就有十萬通以上的完訪錄音，訪問系統也記下了訪員登錄的每一個答案；兩邊都在，就能讓每一題都被比對一次。",
  audience: "以電話問卷蒐集資料的調查研究單位，特別是需要督導訪員品質、但人力只夠抽聽少數通話的團隊。",
  problem:
    "訪員登錯答案、沒問就登、照自己的理解改寫題目，這些錯誤都會帶進最後發表的統計數字；人工抽聽成本高，多數錯誤事後才發現，甚至從來沒被發現。",
  description: [
    "審核每一通電訪，並找出最可疑的題目：SurveyVoiceAI 自動比對錄音裡受訪者的回答與訪員登錄的答案，把最可能登錯的題目排在最前面，最終判定仍由督導做，不必再只靠抽聽。",
    "",
    "敏感資料只在本機處理：整套系統在自己的機器上執行，受訪者錄音不送到任何外部服務。",
    "",
    "成果：已盤點出 108,597 通可直接使用的完訪錄音（完訪指完成整份問卷的訪問）；以其中 1,911 通完成第一階段模型訓練，在沒看過的問卷上與訪員答案的一致率達 86.9%；並找出 141 通無法判讀的錄音、查明原因。",
    "",
    "目標、構想與每一次取捨由開發者決定；Claude Code 擔任資深工程師，查證真實資料、提出技術選項並比較，在開發者拍板後實作與量測。",
  ].join("\n"),

  thumbnail: `${base}/cover.svg`,
  heroImage: `${base}/pipeline.svg`,

  accentColor: "#F5C451",
  accentColorSecondary: "#FF7A59",

  technologies: ["Python", "Breeze-ASR-26", "Kev-9B", "faster-whisper", "Claude Code"],
  techStack: [
    { group: "語言", groupEn: "Languages", items: ["Python"] },
    { group: "AI 模型", groupEn: "AI Models", items: ["Breeze-ASR-26（語音辨識）", "Kev-9B（判讀選擇題，經第一階段微調）", "Qwen3-8B（判讀簡答題，零樣本：未經額外訓練直接使用）"] },
    { group: "資料來源", groupEn: "Data", items: ["NAS 錄音庫", "CATI 問卷資料庫（CATI 是電訪單位使用的電腦輔助電話訪問系統）"] },
    { group: "硬體", groupEn: "Hardware", items: ["單張 NVIDIA V100S GPU"] },
    { group: "開發工具", groupEn: "Dev Tools", items: ["Claude Code", "Git", "tmux", "qmd（本機文件搜尋）"] },
  ],
  architecture: {
    summary:
      "資料只在本機流動：音檔直接從 NAS 讀進記憶體、不存到硬碟，模型在本機 GPU 上執行，比對與排序由固定規則的程式完成；人工標註頁與督導看板只在本機開放，並需要通行碼。",
    layers: [
      { name: "資料層", description: "讀取 NAS 上的錄音，並從 CATI 資料庫取得問卷、訪員登錄的答案與每題開始的時間。", items: ["108,597 通可用錄音", "1,363,638 道選擇題"] },
      { name: "辨識層", description: "Breeze-ASR-26 把錄音轉成逐字稿，並關閉 VAD（自動剪掉無聲片段的功能），避免受訪者的短回答被誤刪；再依每題開始的時間，取前後 90 秒作為該題的錄音片段。", items: ["語音轉文字", "切出每一題", "篩除無效通話"] },
      { name: "判讀層", description: "微調後的 Kev-9B 讀題目與該題的逐字稿，輸出受訪者選的選項和模型的把握程度；把握夠高的題目可直接放行，不必人工檢查。", items: ["單選與複選", "把握程度校正"] },
      { name: "稽核層", description: "與訪員登錄的答案比對，依可疑程度排序，產生給督導的複聽清單。", items: ["一致率", "可疑度排序", "人工判定"] },
    ],
  },

  features: [
    {
      id: "workflow",
      title: "從錄音到問卷答案的自動比對流程",
      titleEn: "Recording-to-Answer Workflow",
      description:
        "訪問系統記錄了每一題開始的時間，系統依此把錄音切成一題一題，由模型判讀受訪者實際選了哪個選項，再和訪員登錄的答案對照。",
      highlights: ["依題目時間切開錄音", "逐題比對", "全程本機執行"],
      media: { type: "image", src: `${base}/pipeline.svg`, alt: "流程圖：讀取錄音、語音辨識、切出每一題、判讀答案、比對與排序五個步驟，以及資料不離開本機的範圍", width: 1600, height: 1000 },
    },
    {
      id: "review-list",
      title: "排出最值得複聽的題目",
      titleEn: "A Ranked Review Queue",
      description:
        "訪員真正登錯的比例本來就低，所以就算偵測器有 95% 的特異度（沒有錯的題目被正確放過的比例），發出的警示仍有七成是誤報。因此系統不發警示，只把最可疑的題目排在前面，讓督導照順序重聽；督導每次確認或駁回，都會成為下一輪改進模型的資料。",
      highlights: ["特異度 95% 時只有 26.9% 的警示是真的", "督導做最終判定"],
      media: { type: "image", src: `${base}/base-rate.svg`, alt: "試算表：特異度 95%、99%、99.9% 時，被標出的題目中真的有錯的比例分別為 26.9%、64.7%、94.8%", width: 1600, height: 1000 },
    },
    {
      id: "screening",
      title: "先篩掉聽不清的錄音，再判讀",
      titleEn: "Screening Before Scoring",
      description:
        "語音辨識讀不懂的通話，會和訪員處處對不上，被誤當成「最差的訪員」。系統在判讀前，先用每分鐘辨識出的字數和低信心字詞的比例篩掉這些通話，共排除 141 通；進一步量音量後發現，其中多數整通都是靜音，往後不必等語音辨識跑完就能先抓出來。",
      highlights: ["判讀前先篩除", "靜音錄音直接用音量判斷"],
      media: { type: "image", src: `${base}/silent-calls.svg`, alt: "無效通話調查三步驟：每分鐘辨識字數、錄音音量、撥號紀錄", width: 1600, height: 1000 },
    },
    {
      id: "measurement",
      title: "一致率不等於正確率",
      titleEn: "Agreement vs. Ground Truth",
      description:
        "「一致率」是模型答案和訪員登錄答案相同的比例。模型經過微調（用這批資料再訓練）後，在沒看過的問卷上，單選題一致率從 81.6% 升到 86.9%。但訪員自己也會登錯，所以另外以人工逐題聽錄音、標出正確答案來檢查：模型和訪員的正確率都落在彼此的誤差範圍內，25 通的測試還分不出高下。",
      highlights: ["數字皆附樣本數與 95% 信賴區間"],
      media: { type: "image", src: `${base}/results.svg`, alt: "量測結果：微調前後的一致率，以及模型與訪員各自的正確率和信賴區間", width: 1600, height: 1000 },
    },
    {
      id: "collaboration",
      title: "人定方向，AI 給證據與執行",
      titleEn: "Human Direction, AI Evidence & Execution",
      description:
        "開發者決定要稽核什麼、輸出長什麼樣、哪些資料該排除。Claude Code 先查證真實資料，再列出 2–4 個技術選項，從延遲、品質、成本等七個面向比較；開發者拍板後才動手實作。每個決策都寫成紀錄文件，沒有可靠出處的數字一律標明「缺口」，不憑印象補上。",
      highlights: ["每個決策都有紀錄", "沒有出處的數字不採用"],
      media: { type: "image", src: `${base}/collab.svg`, alt: "人機分工圖：開發者提供目標、構想與決策；Claude Code 提供資料證據、技術選項比較與實作量測", width: 1600, height: 1000 },
    },
  ],

  developmentStages: [
    {
      key: "idea",
      label: "IDEA",
      title: "每一通都要被稽核",
      description:
        "開發者提出方向：拿現成的錄音和訪員登錄的答案互相比對，讓每一通都被檢查，並希望警示至少有 70% 是真的，才值得交給督導。",
      claudeAssist:
        "以試算指出警示的可信度主要取決於基礎率（訪員實際登錯的比例），無法直接訂為門檻；接著提出「複聽清單、錯誤警示、兩者並行」三個選項並逐項比較，開發者選了複聽清單。",
    },
    {
      key: "prototype",
      label: "PROTOTYPE",
      title: "25 通試點：先查證，再寫規格",
      description:
        "開發者決定先檢查「訪員有沒有照問卷題目問、照受訪者回答登錄」，開場白與拒訪處理留待之後；試點從選舉、物質使用、滿意度、醫療篩檢與教育 5 種調查各取 5 通。",
      claudeAssist:
        "規格裡的每一條都先用真實資料驗證：量出錄音格式是單聲道 8 kHz、確認資料庫記錄的時間就是題目開始的時間、逐通檢查問卷題目都對得上（97–100%），對不上的調查直接換掉。",
    },
    {
      key: "build",
      label: "BUILD",
      title: "劃定資料邊界，接上真實資料",
      description:
        "開發者決定受訪者資料一律不離開本機，並提供一個現場觀察：受訪者回答模糊時，訪員常會口頭確認「這題我幫您選普通好嗎？」，這句話就是最可靠的判讀依據。",
      claudeAssist:
        "逐層整理個資法與研究倫理的要求，確認模型必須全部在本機執行；把訪員的口頭確認設計成獨立的比對依據；串起讀取錄音、語音辨識、切題與答案判讀的完整流程。",
    },
    {
      key: "debug",
      label: "DEBUG",
      title: "人用耳朵聽，AI 找出能量測的訊號",
      description:
        "開發者親自聽錄音，發現幾通逐字稿看起來通順，其實是閩南語被轉成了國語；也自己更正了一次判斷：原以為是訪員登錯，重聽後才發現是 VAD 把受訪者的回答剪掉了。",
      claudeAssist:
        "把人耳發現的問題變成能自動偵測的指標：整句的把握分數看不出這些錯誤，但逐字的低信心比例能把它們排在最前面；也找出逐字稿簡體與繁體混雜、會讓文字比對失敗的問題；最後關閉 VAD 重跑，並用音量與撥號紀錄查清 141 通無效通話。",
    },
    {
      key: "final",
      label: "CURRENT",
      title: "第一階段訓練完成，等待人工標註",
      description:
        "以 1,911 通錄音、13,983 道題目完成第一階段微調。模型「實際正確率」的結論，要等第二輪人工標註（兩份各 600 題）完成後才能確定；督導看板上提示問題的規則，也等開發者決定。",
      claudeAssist:
        "完成微調與評估、製作本機標註頁與督導看板，並把每一輪量測結果和待決定事項寫回進度紀錄，讓下一次工作能直接接手。",
    },
  ],

  challenges: [
    {
      title: "警示太多，就沒有人看",
      problem: "開發者原本想做錯誤警示，但訪員實際登錯的比例很低，特異度 95% 的偵測器發出的警示會有 73% 是誤報，而被誤判的又是具名的員工。",
      approach: "改做複聽清單，只調整督導本來就在做的抽聽順序，最終判定交給督導，督導的確認與駁回再拿來改進模型。等警示可信度真的達到 70%，同一套系統只要換掉輸出方式就能發警示，架構不必重做。",
      lesson: "警示能不能用，取決於錯誤本身有多常見。",
    },
    {
      title: "辨識失敗看起來像訪員失職",
      problem: "閩南語或背景人聲很多的通話，語音辨識會輸出通順但錯誤的國語，整句的把握分數卻一切正常；這些通話會和訪員處處對不上，被當成最差的訪員。",
      approach: "開發者先用耳朵標出問題通話，Claude Code 再找出能自動抓到它們的指標，並把篩除步驟移到判讀之前；逐字稿也先用 OpenCC（簡繁轉換工具）統一成繁體再比對。後來把語音辨識模型換成 Breeze-ASR-26（聯發科創新基地針對台灣華語與閩南語訓練的模型），閩南語的辨識大幅改善。",
      lesson: "結果對不上時，先檢查是不是自己的模型出了問題。",
    },
    {
      title: "一致率高不代表正確率高",
      problem: "微調讓模型和訪員一致的比例明顯上升，但訪員本身也會錯；用人工標註的正確答案檢查後，一致率的提升大約是實際正確率提升的 2 倍以上。",
      approach: "另外抽樣請人逐題標出正確答案，依模型和訪員是否一致分組加權推回整體，並計算信賴區間；區間重疊時就如實說明分不出高下。",
      lesson: "拿訪員的答案當標準，只能量到模型「像不像訪員」；要知道「對不對」，得另外標出正確答案。",
    },
    {
      title: "受訪者資料不能離開本機",
      problem: "錄音裡是可以辨識身分的受訪者，開放式回答還可能提到健康、醫療等個資法列為特種個資的敏感資料；把資料送給雲端 AI 服務，等於改變了當初告知受訪者的資料用途。",
      approach: "所有模型都在本機執行；Claude Code 處理受訪者資料時只看檔案結構、不顯示內容；和受訪者有關的檔案不放進版本控制；對外只開一個需要通行碼的本機網頁。",
      lesson: "模型要放在哪裡，首先是資料保護與研究倫理的問題，其次才是工程取捨。",
    },
  ],

  results: [
    { label: "可用錄音", value: "108,597 通", description: "能直接對上訪問系統資料的完訪錄音，共 1,363,638 道選擇題。" },
    { label: "單選一致率", value: "86.9%", description: "在沒看過的問卷上（4,281 題）與訪員登錄答案相同的比例；未訓練前為 81.6%。" },
    { label: "複聽排序 AUC", value: "0.829", description: "AUC 衡量模型把真正登錯的題目排在前面的能力，1 代表完美、0.5 等於亂排（192 題、95% 信賴區間 0.768–0.913）；與未訓練前的差距仍在誤差範圍內。" },
    { label: "無效通話", value: "141 通", description: "以逐字稿字數、錄音音量與撥號紀錄查明原因並排除，避免被誤判成訪員的問題。" },
  ],

  gallery: [
    { type: "image", src: `${base}/collab.svg`, alt: "人機分工：開發者提供目標、構想與決策，Claude Code 提供證據、選項與實作", width: 1600, height: 1000 },
    { type: "image", src: `${base}/cover.svg`, alt: "示意圖：錄音波形與問卷逐題比對，答案不一致的題目排進複聽清單", width: 1600, height: 1000 },
    { type: "image", src: `${base}/results.svg`, alt: "量測結果：一致率與實際正確率的信賴區間", width: 1600, height: 1000 },
  ],

  // repo 目前為私有（含受訪者相關的規劃紀錄），因此不放連結。
  links: {},

  isPlaceholder: false,
};
