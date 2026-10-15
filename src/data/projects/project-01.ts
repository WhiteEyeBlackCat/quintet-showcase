import type { Project } from "@/types/content";

const base = "/projects/project-01";

export const project01: Project = {
  id: "project-01",
  slug: "water-delivery-ai-assistant",
  number: 1,

  title: "AI 接單助手",
  subtitle: "AI Order-Taking Assistant for a Water Delivery Company",

  category: "AI 應用",
  categoryEn: "AI Application",

  developer: "李芸瑄",
  developerId: "member-a",

  summary:
    "從親戚經營的傳統送水公司出發，設計一套讓 AI 在電話中即時聽懂客戶需求、整理訂單草稿的輔助工具，並用查核機制攔截 AI 不確定卻講得很篤定的錯誤。",
  motivation:
    "親戚經營的傳統送水公司，行政人員接電話時要一邊跟客戶溝通、一邊記下商品、數量、配送日期等資訊，容易出錯；老闆也明確表示送水服務重視「人的溫度」，不希望用 AI 完全取代真人客服，因此把方向定為「AI 輔助」而不是「AI 取代」。",
  audience: "需要一邊講電話、一邊手動建單的傳統產業行政人員。",
  problem:
    "電話一多，行政人員容易漏記或記錯客戶需求（商品、數量、配送日期、時段、地址），送錯水、送錯日期對送水公司是真的會出包的問題。",
  description:
    "行政人員仍然像平常一樣接電話、跟客戶正常對話，系統在背景同步錄音、送到伺服器做語音辨識與語言模型理解，即時把通話內容整理成訂單欄位。來電號碼會先自動比對客戶身份，比對不到時才由 AI 從對話內容判斷。更重要的是，AI 不一定可靠：測試中發現 AI 遇到自己沒把握的狀況，不會老實說不知道，反而會講得很篤定、給出錯誤答案。因此另外寫了一套查核機制，讓程式負責查證事實（身份是否唯一、日期算得對不對、商品數量是否對得上歷史紀錄），AI 只負責理解語意，每個欄位都誠實標示綠（已確認）／黃（依歷史推論）／紅（不確定）三種狀態，行政人員只需要處理系統標出來的不確定部分，趁客戶還在線上當場確認。",

  thumbnail: `${base}/cover.webp`,
  heroImage: `${base}/screenshot-01.webp`,
  mediaPosition: "top",
  heroVideo: {
    type: "video",
    src: `${base}/demo.mp4`,
    poster: `${base}/demo-poster.webp`,
    alt: "實際操作畫面：來電比對客戶身份、AI 即時整理訂單欄位、不確定欄位的查核提示",
    width: 1600,
    height: 1000,
  },

  accentColor: "#627A6D",
  accentColorSecondary: "#A6BCC5",

  technologies: ["Claude Code", "Python", "Streamlit", "FastAPI", "Whisper", "Qwen2.5-7B-Instruct"],
  techStack: [
    { group: "語言", groupEn: "Languages", items: ["Python"] },
    { group: "框架", groupEn: "Frameworks", items: ["Streamlit", "FastAPI"] },
    { group: "AI 模型", groupEn: "AI Models", items: ["Whisper（語音辨識）", "Qwen2.5-7B-Instruct（語意理解）"] },
    { group: "開發工具", groupEn: "Dev Tools", items: ["Claude Code", "Git"] },
  ],
  architecture: {
    summary:
      "本機負責錄音與介面，GPU 伺服器負責語音辨識與語言模型判斷，查核規則留在本機執行，確保安全網邏輯跟模型部署解耦。",
    layers: [
      { name: "介面層", description: "Streamlit 接單畫面：來電比對、錄音、欄位編輯與確認。", items: ["接單", "客戶資料", "待送清單"] },
      { name: "理解層", description: "伺服器端 FastAPI 服務，跑 Whisper 轉錄與 Qwen 語意抽取。", items: ["語音轉文字", "欄位抽取", "身份候選判斷"] },
      { name: "查核層", description: "本機的查證規則，核對模型輸出是否真的有憑有據。", items: ["身份唯一性查證", "日期重新計算", "歷史紀錄比對"] },
    ],
  },

  features: [
    {
      id: "phone-match",
      title: "來電號碼比對身份",
      titleEn: "Caller ID Matching",
      description: "電話一響，先用電話號碼直接查資料庫；查不到唯一客戶時，才輪到 AI 從對話內容自己判斷是誰。",
      highlights: ["不用猜，查得到就查得到", "查不到才需要 AI 判斷"],
    },
    {
      id: "realtime-fill",
      title: "AI 即時整理訂單欄位",
      titleEn: "Real-time Order Extraction",
      description: "客戶講話的同時，AI 把內容拆解成商品、數量、配送日期、時段、地址，行政人員不用邊聽邊記。",
      highlights: ["邊聽邊整理", "行政人員只需確認"],
      media: { type: "image", src: `${base}/screenshot-01.webp`, alt: "客戶描述清楚時，AI 整理出的訂單欄位全部顯示為已確認", width: 1600, height: 1000, position: "top" },
    },
    {
      id: "safety-net",
      title: "查核機制攔截不確定答案",
      titleEn: "Deterministic Safety Net",
      description: "AI 不確定的欄位會誠實標示紅／黃／綠燈號，而不是裝懂硬填一個答案；程式會另外查證身份唯一性、重新計算日期等事實。",
      highlights: ["9 條查核規則", "50+ 情境反覆驗證"],
      media: { type: "image", src: `${base}/screenshot-02.webp`, alt: "客戶描述不清楚時，系統標示不確定欄位並附上查證說明", width: 1600, height: 1000, position: "top" },
    },
    {
      id: "confirm-live",
      title: "趁客戶還在線上當場確認",
      titleEn: "Confirm While Still on the Call",
      description: "只有系統標出來的不確定欄位，才需要行政人員開口跟客戶確認，不用每一格都自己核對一遍。",
      highlights: ["只處理系統標出的部分", "不用逐格人工覆核"],
    },
  ],

  developmentStages: [
    {
      key: "idea",
      label: "IDEA",
      title: "從真實訪談出發的轉折",
      description:
        "最初想做「AI 接電話機器人」讓 AI 直接取代真人客服，實際訪談後發現老闆重視「人的溫度」，方向調整成 AI 輔助行政人員，而不是取代。",
      claudeAssist: "與 Claude Code 討論題目範圍，從展示 AI 功能收斂成解決真實工作流程問題。",
    },
    {
      key: "prototype",
      label: "PROTOTYPE",
      title: "先驗證操作流程",
      description: "建立 Prototype，分 Human Only／Human + AI 兩種操作方式對照，先確認「AI 整理好的草稿」這個流程合不合理，再談模型準不準。",
      claudeAssist: "由 Claude Code 協助建立 Streamlit 介面與欄位編輯、驗證邏輯。",
    },
    {
      key: "build",
      label: "BUILD",
      title: "接上真的語音辨識與語言模型",
      description: "串接學校 GPU 伺服器，跑真的 Whisper 語音辨識與 Qwen 語言模型判斷，逐步建立起查核規則。",
      claudeAssist: "協助設計本機與伺服器之間的職責切分，查核邏輯留在本機、模型推論留在伺服器。",
    },
    {
      key: "debug",
      label: "DEBUG",
      title: "測試中抓出三個真實案例",
      description: "拿真實錄音與設計過的常見情境測試，陸續發現同名客戶衝突、AI 憑空編造客戶、日期算錯三個問題，逐一補上對應的查核規則。",
      claudeAssist: "協助重現問題、設計查核規則，並用既有情境回歸測試，確認修正沒有破壞原本判斷正確的部分。",
    },
    {
      key: "final",
      label: "FINAL PRODUCT",
      title: "實際接通並錄製展示影片",
      description: "接上學校伺服器完成即時語音到訂單的完整流程，錄製包含「清楚情境」與「不清楚情境」兩種展示影片。",
      claudeAssist: "協助整理專案報告與簡報，把測試過程中的發現整理成案例故事。",
    },
  ],

  challenges: [
    {
      title: "同名客戶衝突",
      problem:
        "客戶只說「林小姐，明天要兩桶水」，但客戶資料裡剛好有兩位林小姐；即使提示已經明確寫「遇到這種情況要列出候選人」，AI 還是直接選一個、講得很篤定。",
      approach: "加一道查證：AI 只選一個人時，系統自己去資料庫比對是否真的只有一人符合，若還有同名且無更明確線索，強制列出所有候選人讓人確認。",
      lesson: "AI 講得篤定不代表它真的有把握，不能只靠 AI 自己回報的信心程度。",
    },
    {
      title: "AI 憑空編出客戶",
      problem: "真實錄音測試中，客戶只說「送兩桶水到建國路一段83號」，完全沒提到姓名，AI 卻自己編出一位客戶、還宣稱原文有提到——但根本沒有。",
      approach: "加一道查證：AI 判定是哪位客戶，就要檢查這位客戶的姓名、電話、地址有沒有真的出現在客戶講的話裡，沒有就一律視為不知道是誰。",
      lesson: "這是真實情境自然發生的，不是設計出來的測試案例，代表這類幻覺在實際使用中真的會發生。",
    },
    {
      title: "日期算錯",
      problem: "客戶在星期一說「這個禮拜四」，AI 算出來的日期卻多了整整一週；同批測試裡「明天」又被算成四天後，每次錯的方式都不一樣。",
      approach: "不讓 AI 自己算日期，改成系統用「今天」加減天數算出正確答案，AI 算的跟系統算的對不上就用系統的蓋過去。",
      lesson: "相對日期這種有明確規則可以算的事，不該交給語言模型自由發揮，寫死的程式邏輯更可靠。",
    },
  ],

  results: [
    { label: "查核規則", value: "9 條", description: "針對身份、日期、商品數量、時段、特殊需求等欄位建立的查核規則。" },
    { label: "測試情境", value: "50+ 個", description: "反覆驗證新增規則不會影響原本判斷正確的部分。" },
    { label: "真實錄音測試", value: "7 段", description: "完成語音辨識與 AI 理解的端到端測試，實際量到語音辨識仍有一定比例的同音字錯誤。" },
    { label: "即時展示", description: "已接上學校 GPU 伺服器，完成從錄音到訂單草稿的即時展示影片，包含清楚與不清楚兩種情境。" },
  ],

  gallery: [
    { type: "image", src: `${base}/cover.webp`, alt: "送水行接單系統主畫面，顯示來電比對與語音輸入介面", width: 1600, height: 1000, position: "top" },
    { type: "image", src: `${base}/screenshot-01.webp`, alt: "客戶描述清楚時，AI 整理出的訂單欄位全部顯示為已確認", width: 1600, height: 1000, position: "top" },
    { type: "image", src: `${base}/screenshot-02.webp`, alt: "客戶描述不清楚時，系統標示不確定欄位並附上查證說明", width: 1600, height: 1000, position: "top" },
  ],

  links: {},

  isPlaceholder: false,
};
