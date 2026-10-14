#!/usr/bin/env node
/**
 * 內容檢查：npm run check:content
 *
 * 檢查 src/data/ 的作品與成員資料是否填寫正確，避免一個人填錯讓整個網站壞掉。
 * GitHub 上每次有人送出修改都會自動執行；有「錯誤」就不會上線，「提醒」只是建議。
 * 需要 Node.js 22.18 以上（直接讀取 .ts 檔）。
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECTS_DIR = join(ROOT, "src/data/projects");
const PUBLIC = join(ROOT, "public");

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`✗ ${where}：${msg}`);
const warn = (where, msg) => warnings.push(`! ${where}：${msg}`);

// 只列出簡體專用字（繁體不會出現），用來抓不小心貼進來的簡體內容。
const SIMPLIFIED = /[这们个为说时发动学习与过实现对开关数据图处复设计项资应视频单务线网络长门问题进还么样览层级种类产简统质华页码测试记录历档输显该让从视觉获结构选择环创]/g;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX = /^#[0-9a-fA-F]{6}$/;
const STAGE_KEYS = ["idea", "prototype", "build", "debug", "final"];
const MAX_MEDIA_BYTES = 3 * 1024 * 1024;

async function load(file, exportName) {
  try {
    const mod = await import(pathToFileURL(file).href);
    const value = exportName ? mod[exportName] : Object.values(mod)[0];
    if (value === undefined) err(rel(file), `找不到匯出的資料${exportName ? `「${exportName}」` : ""}，請確認檔案開頭的 export 沒有被刪掉`);
    return value;
  } catch (e) {
    err(rel(file), `檔案格式有誤，無法讀取（常見原因：少了逗號、引號或括號沒有成對）。\n    詳細訊息：${String(e.message).split("\n")[0]}`);
    return undefined;
  }
}

const rel = (p) => relative(ROOT, p);

function requireText(obj, field, where) {
  if (typeof obj?.[field] !== "string" || obj[field].trim() === "") err(where, `「${field}」必須填寫`);
}

function checkMedia(path, where) {
  if (path === undefined) return;
  if (typeof path !== "string" || !path.startsWith("/")) {
    err(where, `圖片／影片路徑要以 / 開頭，例如 "/projects/project-01/cover.webp"（目前是 ${JSON.stringify(path)}）`);
    return;
  }
  const file = join(PUBLIC, decodeURIComponent(path));
  if (!existsSync(file)) {
    err(where, `找不到檔案 public${path}，請確認檔名（含大小寫與副檔名）和上傳位置一致`);
    return;
  }
  const size = statSync(file).size;
  if (size > MAX_MEDIA_BYTES) warn(where, `public${path} 有 ${(size / 1024 / 1024).toFixed(1)} MB，建議壓縮到 3 MB 以下，網頁會比較快`);
}

function checkMediaItem(m, where) {
  if (!m) return;
  if (m.type !== "image" && m.type !== "video") err(where, `「type」只能是 "image" 或 "video"`);
  checkMedia(m.src, `${where}.src`);
  if (m.type === "video") {
    if (!m.poster) warn(where, "影片建議提供 poster（封面圖），載入前才不會一片黑");
    else checkMedia(m.poster, `${where}.poster`);
  }
  if (typeof m.alt !== "string" || m.alt.trim() === "") err(where, "「alt」必須填寫：用一句話描述畫面內容（給看不到圖的人與搜尋使用）");
}

function scanText(value, where) {
  if (typeof value === "string") {
    const hits = [...new Set(value.match(SIMPLIFIED) ?? [])];
    if (hits.length) err(where, `出現簡體字「${hits.join("")}」，請改成繁體中文`);
    if (/TODO|待填|請填寫|XXX/.test(value)) warn(where, `看起來還沒填完：「${value.slice(0, 30)}」`);
    return;
  }
  if (Array.isArray(value)) value.forEach((v, i) => scanText(v, `${where}[${i}]`));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) scanText(v, `${where}.${k}`);
}

function checkLinks(links, where) {
  if (!links) return;
  for (const [k, url] of Object.entries(links)) {
    if (url === undefined || url === "") continue;
    if (!["github", "demo", "documentation", "video"].includes(k)) warn(`${where}.${k}`, "不認得的連結種類，網站不會顯示（可用：github、demo、documentation、video）");
    if (typeof url !== "string" || !/^https:\/\/[^\s]+\.[^\s]+/.test(url)) err(`${where}.${k}`, `連結必須是完整的 https:// 網址（目前是 ${JSON.stringify(url)}）`);
    else if (/example\.(com|org)|localhost|127\.0\.0\.1/.test(url)) err(`${where}.${k}`, "這不是真實可用的連結；沒有連結就整行刪掉，按鈕會自動隱藏");
  }
}

function checkProject(p, file, n) {
  const w = rel(file);
  if (!p || typeof p !== "object") return;
  for (const f of ["id", "slug", "title", "category", "developer", "summary", "description", "thumbnail", "heroImage"]) requireText(p, f, w);
  if (p.number !== n) err(w, `「number」應該是 ${n}（和檔名 project-0${n} 一致），目前是 ${JSON.stringify(p.number)}`);
  if (p.slug && !SLUG.test(p.slug)) err(w, `「slug」只能用小寫英文、數字和 -，例如 "my-project"（目前是 "${p.slug}"）。它會變成網址 /projects/${p.slug}`);
  if (typeof p.isPlaceholder !== "boolean") err(w, "「isPlaceholder」要填 true（範例內容）或 false（真實內容）");
  for (const f of ["accentColor", "accentColorSecondary"]) if (p[f] !== undefined && !HEX.test(p[f])) warn(w, `「${f}」建議用 #RRGGBB 格式的色碼，例如 "#5EE3F0"`);
  if (p.summary && p.summary.length > 90) warn(w, `「summary」有 ${p.summary.length} 字，建議 90 字以內的一句話，卡片上比較好看`);
  if (!Array.isArray(p.technologies) || p.technologies.length === 0) err(w, "「technologies」至少要列一項技術，例如 [\"Python\"]");

  checkMedia(p.thumbnail, `${w} thumbnail`);
  checkMedia(p.heroImage, `${w} heroImage`);
  checkMediaItem(p.heroVideo, `${w} heroVideo`);
  checkMediaItem(p.architecture?.diagram, `${w} architecture.diagram`);

  if (!Array.isArray(p.features) || p.features.length === 0) err(w, "「features」至少要有 1 項核心功能");
  else {
    if (p.features.length < 3 || p.features.length > 5) warn(w, `核心功能有 ${p.features.length} 項，建議 3–5 項`);
    const ids = new Set();
    p.features.forEach((f, i) => {
      const fw = `${w} features[${i}]`;
      requireText(f, "id", fw);
      requireText(f, "title", fw);
      requireText(f, "description", fw);
      if (ids.has(f.id)) err(fw, `功能的「id」重複了："${f.id}"，每項要不一樣`);
      ids.add(f.id);
      if (!f.media) warn(fw, "沒有對應的截圖，這一項在捲動展示時會沒有畫面");
      checkMediaItem(f.media, `${fw}.media`);
    });
  }
  (p.developmentStages ?? []).forEach((s, i) => {
    if (!STAGE_KEYS.includes(s.key)) err(`${w} developmentStages[${i}]`, `「key」只能是 ${STAGE_KEYS.join(" / ")}`);
    checkMediaItem(s.media, `${w} developmentStages[${i}].media`);
  });
  (p.gallery ?? []).forEach((m, i) => checkMediaItem(m, `${w} gallery[${i}]`));
  (p.results ?? []).forEach((r, i) => {
    requireText(r, "label", `${w} results[${i}]`);
    requireText(r, "description", `${w} results[${i}]`);
  });
  checkLinks(p.links, `${w} links`);
  scanText(p, w);
}

// ── run ─────────────────────────────────────────────────────────────
const files = readdirSync(PROJECTS_DIR).filter((f) => /^project-0\d\.ts$/.test(f)).sort();
const projects = [];
for (const f of files) {
  const file = join(PROJECTS_DIR, f);
  const n = Number(f.match(/\d+/)[0]);
  const p = await load(file);
  checkProject(p, file, n);
  if (p) projects.push({ p, file });
}

const seen = (key) => {
  const m = new Map();
  for (const { p, file } of projects) {
    if (p[key] === undefined) continue;
    if (m.has(p[key])) err(rel(file), `「${key}」和 ${rel(m.get(p[key]))} 重複了（"${p[key]}"）`);
    else m.set(p[key], file);
  }
};
seen("slug");
seen("id");

const teamFile = join(ROOT, "src/data/team.ts");
const team = (await load(teamFile, "team")) ?? [];
const slugs = new Set(projects.map(({ p }) => p.slug));
const memberIds = new Set();
team.forEach((m, i) => {
  const w = `${rel(teamFile)} [${i}]${m?.name ? `（${m.name}）` : ""}`;
  for (const f of ["id", "name", "role", "projectSlug", "bio"]) requireText(m, f, w);
  if (memberIds.has(m.id)) err(w, `成員「id」重複了："${m.id}"`);
  memberIds.add(m.id);
  if (m.projectSlug && !slugs.has(m.projectSlug)) err(w, `「projectSlug」"${m.projectSlug}" 找不到對應的作品，要和作品檔的 slug 完全一樣`);
  checkMedia(m.avatar, `${w} avatar`);
  if (m.github !== undefined && !/^https:\/\/github\.com\/[^\s/]+\/?$/.test(m.github)) err(w, `「github」要是完整網址，例如 "https://github.com/你的帳號"`);
  if (typeof m.isPlaceholder !== "boolean") err(w, "「isPlaceholder」要填 true 或 false");
  scanText(m, w);
});
for (const { p, file } of projects) {
  if (p.developerId && !memberIds.has(p.developerId)) err(rel(file), `「developerId」"${p.developerId}" 在 team.ts 裡找不到對應的成員 id`);
}

// ── report ──────────────────────────────────────────────────────────
console.log(`檢查了 ${projects.length} 個作品、${team.length} 位成員。\n`);
if (warnings.length) console.log(`提醒（不影響上線）：\n${warnings.join("\n")}\n`);
if (errors.length) {
  console.log(`錯誤（必須修正才能上線）：\n${errors.join("\n")}\n`);
  console.log(`共 ${errors.length} 個錯誤。修正後再存檔一次，檢查會自動重跑。`);
  process.exit(1);
}
console.log("✓ 內容檢查通過");
