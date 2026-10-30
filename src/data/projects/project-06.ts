import type { Project } from "@/types/content";

// 實際專案：mentor（master-mentor skill 與其來源 Mentor 學習系統）。文字定稿於 drafts/li-chi-yun.md，
// 內容整理自 github.com/Elier87/master-mentor 的 README / SKILL.md / git 紀錄，以及 ../Thesis 的
// report/wikillm_report.marp.md 與 shared/session_log.md。依作者要求不以其論文主題舉例；
// 配圖由 scripts/generate-diagrams.py 繪製。
const base = "/projects/project-06";

export const project06: Project = {
  id: "project-06",
  slug: "master-mentor",
  number: 6,

  title: "mentor 論文導師",
  titleLines: ["mentor", "論文導師"],
  subtitle: "A Claude Code Skill for Thesis Self-Study",

  category: "AI 學習系統",
  categoryEn: "AI Tutoring",

  developer: "李祺允 LI CHI YUN",
  developerId: "member-d",

  summary: "讓 Claude Code 扮演研究所導師：先問後講、隔一段時間再抽考，並把讀過的論文整理成每句都找得到出處的個人 wiki。",
  motivation:
    "讀完一段論文或推導、覺得「懂了」的感覺，幾天後往往就消失了；直接請 AI 摘要，得到的理解很流暢，卻經不起追問。研究生需要的是一個會追問、會記錄、不會替自己把答案講完的導師。",
  audience: "已經定下研究方向，要自學論文背後的理論、前人研究與方法細節的碩博士生。",
  problem:
    "自學時很難分辨自己是真的會，還是只是看過；研究筆記也常把「論文說的」和「我推論的」混在一起，到口試時才被問倒。",
  description: [
    "mentor 受到 Andrej Karpathy 的 LLM Wiki 與 Matt Pocock 的 teach skill 啟發，是一個在 Claude Code 上運作的教學技能：讓研究生用 AI 加速自學，但思考仍由自己完成。",
    "",
    "先問後講：AI 先請你預測、解釋或比較，再給最小的提示與更深的追問，最後才整理重點。",
    "隔一段時間再考：剛學完答得出來不算數，隔一段時間、沒有提示仍答得出來，才算真的會。",
    "每句話都找得到出處：讀過的論文整理成個人 wiki，每段文字都標明頁碼、圖號或公式編號。",
    "",
    "主要指令：",
    "・/master-mentor init：第一次使用時建立學習環境，寫下研究目標、「懂了」的標準與能力清單；所有能力一律從「尚未驗證」開始，不採信自我評估。",
    "・/master-mentor plan：依研究目標挑出下一個該學的單元，只找這個單元需要的論文，份量控制在一次讀得完的範圍。",
    "・/master-mentor lorevore <draft|middle|deep>：把已下載的論文整理成指定深度的 wiki 頁，每一句都對回原文。",
    "・/master-mentor：不加參數時進行一次教學，從上次停下的地方接續，結束時把進度寫回紀錄。",
    "",
    "成果：作者自己的學習系統已涵蓋 6 個領域、約 300 頁 wiki；其中通用的教學方法整理成 master-mentor，以 MIT 授權開源。",
    "",
    "研究目標、每一次作答與最後的判斷都由學習者自己完成；Claude Code 負責出題、評分、查證出處與維護學習紀錄。",
  ].join("\n"),

  thumbnail: `${base}/cover.svg`,
  heroImage: `${base}/ladder.svg`,

  accentColor: "#E9D8A6",
  accentColorSecondary: "#8B7CFF",

  technologies: ["Claude Code", "Agent Skills", "Markdown"],
  techStack: [
    { group: "AI 工具", groupEn: "AI Tools", items: ["Claude Code", "master-mentor skill"] },
    { group: "知識庫", groupEn: "Knowledge Base", items: ["Markdown wiki", "wikilink 知識網", "原始論文 PDF 與擷取的圖檔"] },
    { group: "學習紀錄", groupEn: "Learner State", items: ["研究目標", "能力清單", "每次學習紀錄", "容易混淆的概念", "題庫"] },
    { group: "輸出", groupEn: "Outputs", items: ["互動式網頁說明", "Beamer 投影片（學術報告常用的 LaTeX 簡報格式）"] },
  ],
  architecture: {
    summary:
      "技能本身只寫通用的教學方法；檔案放在哪裡、wiki 的格式、引用方式與各領域的注意事項，由每個研究專案的 CLAUDE.md（Claude Code 每次啟動都會讀取的專案說明檔）決定，兩者衝突時以專案為準。因此同一個技能可以直接用在任何研究專案。",
    layers: [
      { name: "目標層", description: "研究目標與「懂了」的標準，決定每次要學什麼。" },
      { name: "知識層", description: "原始論文保持原樣、不修改；wiki 頁依深度分級並互相連結。" },
      { name: "學習紀錄層", description: "只記錄實際表現（解釋了、推導了、答錯了），並標明是剛學完的分數還是隔一段時間再考的分數。" },
      { name: "規劃層", description: "依研究目標與目前進度，挑出下一個學習單元。" },
    ],
  },

  features: [
    {
      id: "architecture",
      title: "一個導師，串起多個領域的 wiki",
      titleEn: "LLM Wiki Architecture",
      description:
        "知識庫分成三層：最上層是導師，負責教學與維護整個 wiki；底下依學科分成領域，例如統計、機器學習、深度學習；每個領域再放進具體的主題，例如一門課、一個專題或論文本身。導師從總索引找到領域，再從領域找到主題和頁面，所以不論學到哪個領域，筆記都在同一個知識網裡、互相連得到。",
      highlights: ["導師 → 領域 → 主題", "6 個領域共用一個知識網"],
      media: { type: "image", src: `${base}/architecture.svg`, alt: "LLM Wiki 架構：導師在中心，連到六個領域，每個領域底下再放具體的主題", width: 1600, height: 1000 },
    },
    {
      id: "workflow",
      title: "兩個階段，一個循環",
      titleEn: "Build, Then Absorb",
      description:
        "第一階段是建立：設定目標、搜尋並下載論文、整理成 Markdown 筆記、整合進 wiki，最後檢查連結和出處有沒有缺漏。第二階段是吸收：安排閱讀順序、一邊提問一邊對照原始 PDF、做測驗、再複習。提問時發現摘要有誤，就回頭修正 wiki；複習時再回到原文重新查證，兩個階段因此形成一個循環。",
      highlights: ["建立 Build", "吸收 Absorb", "回到原文重新查證"],
      media: { type: "image", src: `${base}/workflow.svg`, alt: "建立 LLM Wiki 的流程：建立階段與吸收階段，複習後回到原文重新查證", width: 1600, height: 1000 },
    },
    {
      id: "ladder",
      title: "六階提問：懂到哪裡，問到哪裡",
      titleEn: "The Question Ladder",
      description:
        "論文裡的每個核心概念都用同樣六個層次檢查：閉卷寫出定義、用白話講給大學生聽、和最容易混淆的概念區分開來、在具體情境裡判斷怎麼用、說出它什麼時候會失效，最後濃縮成一句能寫進論文、經得起口試追問的話。卡在哪一層，就是下一步要補的地方。",
      highlights: ["六個層次", "卡住的地方就是下一步"],
      media: { type: "image", src: `${base}/ladder.svg`, alt: "六階提問：閉卷寫出定義、白話解釋、區分相近概念、情境應用、說出何時失效、濃縮成論文中的一句話", width: 1600, height: 1000 },
    },
    {
      id: "wiki",
      title: "建立個人專屬的論文 wiki",
      titleEn: "Traceable Wiki",
      description:
        "每篇論文依它對自己研究的重要程度，整理成三種深度之一：draft 交代這篇在研究脈絡中的位置；middle 加上方法、公式與圖表解讀；deep 則每張圖都打開讀過、每個論點都附上原文出處。沒讀過的圖不寫，AI 也不能憑記憶補內容。各頁之間用 wikilink（頁面互相連結的語法）串成知識網。",
      highlights: ["三種深度", "每句附出處", "沒讀過的圖不寫"],
      media: { type: "image", src: `${base}/tiers.svg`, alt: "wiki 頁的三種深度：draft、middle、deep 各自包含的內容", width: 1600, height: 1000 },
    },
    {
      id: "planning",
      title: "依研究目標安排學習順序",
      titleEn: "Goal-directed Planning",
      description:
        "先寫下研究目標，再挑出「前置知識已經具備、又最卡住進度」的單元，只找這個單元需要的幾篇論文。隔一段時間再考、過關才前進到下一個單元，沒過關的部分會排回複習。",
      highlights: ["一次只學一個單元", "需要時才找論文", "過關才前進"],
      media: { type: "image", src: `${base}/roadmap.svg`, alt: "學習規劃流程：寫下研究目標、挑出下一個單元、只找需要的論文、教學、隔一段時間再考，過關才前進", width: 1600, height: 1000 },
    },
  ],

  developmentStages: [
    {
      key: "idea",
      label: "IDEA",
      title: "從一個個人知識庫的想像出發",
      description:
        "Karpathy 的 LLM Wiki 讓開發者想像出一個個人專屬的知識庫，能整合外部文獻、個人機密資料與實驗產出。教學方法則借用 Matt Pocock 的 teach skill：學習要對準目標、題目要落在「再努力一點就做得到」的難度、並分清楚當下的熟悉感和長期記憶。",
      claudeAssist:
        "依 LLM Wiki 的分工，同一個 Claude Code 身兼兩職：wiki 維護者（找來源、保存、整理結構、附上出處）與導師（教學、出題、找出卡住的地方、練習寫作）。",
    },
    {
      key: "prototype",
      label: "PROTOTYPE",
      title: "先問後講的教學流程",
      description:
        "把一次學習定成固定流程：讀取上次進度、選一個小目標、先問後講、給最少的提示、再追問得更深，最後才整理重點並寫回紀錄。搭配六階提問與 0–100 分的評分標準。",
      claudeAssist:
        "在第一個 wiki 試做的 26 天裡（2026-04-26～05-21），開發者逐筆記錄 Claude Code 犯的錯；Claude Code 再針對每一類錯誤加上自我檢查：查不到出處就明確標註、數字逐一對照 PDF、引文不可改動並以指令逐字比對原文、回答前先說明自己對這個主題有多熟。",
    },
    {
      key: "build",
      label: "BUILD",
      title: "從一個主題擴充成跨領域的學習系統",
      description:
        "從單一論文主題擴充成涵蓋 6 個領域、約 300 頁 wiki 的學習系統，並把規則分層：通用的回答方式、整個系統的運作方式、各主題特有的注意事項；越是針對特定主題的規則，衝突時越優先。",
      claudeAssist:
        "擔任 wiki 維護者檢查整個知識庫：修正 76 處以上失效的檔案路徑；刪除舊資料夾前，先找出 19 個從未備份的檔案，搬移後逐一比對檔案指紋（checksum）確認完全相同才刪除；補登論文前先打開 PDF 核對標題與作者，無法確認的檔案不擅自命名，留給開發者決定。",
    },
    {
      key: "debug",
      label: "DEBUG",
      title: "實際用在自己的論文上",
      description:
        "把技能用在自己的碩士論文自學，第一次學習就發現：自己認定的強項和弱項，和實際作答表現對不上，證實了「自我評估不算證據」這條規則的必要。",
      claudeAssist:
        "全程先問後講、不先給答案，答錯時只給線索，沒答完的問題留到下次再考。再考時不預告、不給提示，只依作答內容判定，並記下實際表現（應用、比較、解釋、連結）與下一步要補的地方。",
    },
    {
      key: "final",
      label: "FINAL",
      title: "抽出通用部分，開源成 master-mentor",
      description:
        "把學習系統裡和特定主題無關的教學方法抽出來，加上 init、plan、lorevore 三個指令，以 MIT 授權公開在 GitHub，任何人都能裝進自己的 Claude Code 使用。",
      claudeAssist:
        "和開發者一起撰寫技能文件，Git 紀錄裡的 4 次提交都由 Claude Code 共同完成；發布前逐字精簡全部 8 份文件，刪去約 879 字（約 8%）的重複內容，規則一條也沒少。",
    },
  ],

  challenges: [
    {
      title: "熟悉感會偽裝成真的懂",
      problem: "看完一段講解覺得完全合理，這種感覺幾天內就會消失；AI 講解得越好，這種錯覺越強。",
      approach: "規定 AI 在學習者先試著預測、解釋或比較之前不整理重點，剛學完的分數也不能讓概念過關。",
      lesson: "AI 最有價值的時刻，常是在對的時候忍住不講。",
    },
    {
      title: "自我評估不等於證據",
      problem: "學習者對自己強弱項的判斷常常不準，照自我評估安排教學，會跳過真正的弱點。",
      approach: "所有能力一律從「尚未驗證」開始，只依實際表現記錄；單次失誤也不直接下結論，留待下次再考確認。",
      lesson: "難點常落在兩個領域的交界，兩邊都要測。",
    },
    {
      title: "AI 會憑記憶編出處",
      problem: "建立第一個 wiki 的 26 天裡，Claude Code 捏造沒有出處的內容 4 次、誤讀原文 5 次、潤飾時悄悄改動引文 5 次、引錯論文 1 次、不懂裝懂 5 次；把兩個相近概念混用的錯誤，事後修正了 68 頁、107 處以上。",
      approach: "每一句都要對得到頁碼、圖號或原文引用；沒打開過的圖不寫；「論文說的」和「我推論的」分開記錄。",
      lesson: "口試會被問倒的，常是說不出出處的那一句。",
    },
    {
      title: "檔案路徑會過期",
      problem: "如果把檔案位置和格式寫死在技能裡，換一個研究專案就不能用。",
      approach: "技能只寫通用的教學方法，路徑、wiki 格式和各領域規則交給每個專案的 CLAUDE.md 決定。",
      lesson: "把通用的部分和專案專屬的部分分開，工具才能重複使用。",
    },
  ],

  results: [
    { label: "開源授權", value: "MIT", description: "公開在 GitHub，可直接裝進 Claude Code 使用。" },
    { label: "指令", value: "3 個", description: "init、plan、lorevore，另有不加參數的一般教學。" },
    { label: "參考文件", value: "6 份", description: "提問與評分、學習紀錄、建立學習環境、學習規劃、wiki 分級、輸出格式。" },
    { label: "學習系統規模", value: "6 個領域", description: "作者自己的學習系統，約 300 頁 wiki。" },
    { label: "人機協作", value: "116 / 122", description: "學習系統的 122 次 Git 提交中，有 116 次由 Claude Code 共同撰寫。" },
  ],

  gallery: [
    { type: "image", src: `${base}/cover.svg`, alt: "示意圖：先問後講、隔一段時間再考、每句話都找得到出處", width: 1600, height: 1000 },
    { type: "image", src: `${base}/architecture.svg`, alt: "LLM Wiki 架構：導師、領域與主題", width: 1600, height: 1000 },
    { type: "image", src: `${base}/roadmap.svg`, alt: "依研究目標安排學習順序的流程", width: 1600, height: 1000 },
  ],

  links: {
    github: "https://github.com/Elier87/master-mentor",
  },

  isPlaceholder: false,
};
