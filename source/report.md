# Website Field Study: 101evler

| | |
|---|---|
| **Site** | https://www.101evler.com |
| **Organisation** | 101evler, online property listing portal (North Cyprus) |
| **Student** | [[TODO: Full name]] · 2203060208 |
| **Course** | SFWE475 / CPRG201 · Assignment 2 (Website Field Study) |
| **Audit date and time** | [[TODO: e.g. 9 November 2026, 14:10–16:30]] |
| **Browser** | [[TODO: Google Chrome version (chrome://version), macOS version]] |

## Part A: Under the hood

### A1. HTTPS and redirects

Typing `http://101evler.com` ended on `https://www.101evler.com/`. The Network panel shows three document requests in a row: a **307 Internal Redirect** (0 kB, 1 ms, started by the browser, not the server), then a **301** from `https://101evler.com/` to the `www` address, then **200** for the page itself. The certificate is valid: it was issued to 101evler.com by Google Trust Services (WE1) and runs from 16 October 2026 to 14 January 2027. The 307 means Chrome switched to HTTPS by itself before contacting the server. The page's `strict-transport-security: max-age=2592000` header explains why: it tells the browser to use only HTTPS for this site for the next 30 days, so after one visit Chrome never tries plain `http` again. It also means this test cannot show whether the server would redirect plain `http` on its own. The 301 shows that the server permanently sends every visitor to a single address (`www`), which keeps bookmarks and shared links consistent. Every visitor ends on a secure connection, and the short, 90-day certificate is normal for certificates that renew automatically. [A1]

### A2. URL structure

All five addresses start with `https://www.101evler.com`.

| # | Page | Path | HTTPS | Short and readable | Lowercase | Hyphens, not underscores | Few query parameters | Score |
|---|---|---|---|---|---|---|---|---|
| 1 | Homes for sale (menu) | `/kibris/satilik-konut` | ✓ | ✓ | ✓ | ✓ | ✓ none | 5/5 |
| 2 | Search result: Girne | `/kibris/satilik-konut/girne` | ✓ | ✓ | ✓ | ✓ | ✓ none | 5/5 |
| 3 | One listing | `/kibris/satilik-emlak/girne-esentepe-daire-289984.html` | ✓ | Partly | ✓ | ✓ | ✓ none | 4/5 |
| 4 | Estate agents | `/firmalar` | ✓ | ✓ | ✓ | ✓ | ✓ none | 5/5 |
| 5 | Buying guide | `/kktc-emlak-satin-alma-rehberi` | ✓ | ✓ | ✓ | ✓ | ✓ none | 5/5 |

The addresses are clean and consistent. All five use HTTPS, lowercase letters and hyphens, and none has a query string. Even a search result is a plain path (`/kibris/satilik-konut/girne`, "Cyprus / homes for sale / Girne") rather than something like `?city=12&type=3`, so the address alone tells a reader what the page shows, and it stays short when shared in a message. Turkish letters are written without accents (`kibris` for Kıbrıs, `satin` for satın), which avoids unreadable codes such as `%C4%B1` when a link is pasted. The weakest address is the listing page: it ends in an ID number and an old-style `.html`, and sits under `satilik-emlak` although the list of homes for sale is under `satilik-konut`. Another listing I opened (`girne-girne-merkez-daire-584797.html`) also repeats the town name. The number is needed to keep each listing unique, so these are minor points. [A2]

### A3. One request, closely

| Item | Value |
|---|---|
| Document request | Method `GET` · Status `200 OK` · Content-Type `text/html; charset=UTF-8` |
| Requests on reload | 92 (private window, cache disabled) |
| Transferred / resources | 2.5 MB transferred, 7.3 MB resources · DOMContentLoaded 1.74 s · Load 3.55 s |
| Example Fetch/XHR request | `collect?v=2&tid=G-D8562466R8…`, which sends visit statistics to Google Analytics (8 such background requests in total) |

The home page is an ordinary `GET` answered with `200` and HTML. It is compressed with Brotli (`content-encoding: br`) and delivered through Cloudflare (`server: cloudflare`). In a private window with the cache disabled, one visit made 92 requests and downloaded 2.5 MB (7.3 MB once unpacked). The page was readable after 1.74 s and fully loaded after 3.55 s. My first measurement in a normal window showed 7.2 MB, but its two largest files (2.9 MB and 1.6 MB, "downloaded" in 3–4 ms) came from one of my browser extensions, not from the site. This is a reminder to audit in a clean window. Sorted by size, the heaviest files are not the property photos. They are advertising and tracking scripts: Google's ad script (`pubads_impl.js`, 221 kB), Google Analytics and Tag Manager (203 kB and 167 kB) and the Facebook pixel (114 kB and 112 kB). Together they make up about a third of the download, so on mobile data roughly a third of every first visit goes on code that does not help the visitor find a home. [A3]

### A4. A page that does not exist

Visiting `https://www.101evler.com/no-such-page-123` returned a real **404** status, not a soft 404, and the tab title reads "404 | Sayfa bulunamadı". The visitor sees a large "404", the heading "Aradığınız sayfa bulunamadı" ("The page you are looking for was not found") and the sentence "Sayfa silinmiş veya taşınmış olabilir. Anasayfaya dönebilir veya aşağıdan aramaya devam edebilirsiniz." ("The page may have been deleted or moved. You can go back to the home page or continue searching below."), followed by an "Anasayfaya dön" ("Back to home page") button. Further down are links to popular categories (Satılık konut, Kiralık konut, Projeler, Satılık emlak) and popular towns (Girne, Lefkoşa, Mağusa, İskele, Güzelyurt). The page is light (9 requests, 54 kB). Because the status is a real 404, search engines drop dead links instead of listing the error page, which matters on a site where listings are removed every day. Two small weaknesses remain. The text promises a search "below", but there is no search box, only fixed links. The site's usual header and main menu are also missing, so a visitor who arrives from an old listing link loses the familiar way around the site. [A4]

### A5. Caching

| Resource | Cache-Control | Meaning in one sentence |
|---|---|---|
| Main document | `max-age=0, must-revalidate, private` | Only the visitor's own browser may keep a copy, and it must check with the server before every reuse, so each visit shows the latest page. |
| Image `lefkosa-min.webp` | `max-age=14400` | The browser may reuse the image for 4 hours (14,400 s) without asking; Cloudflare also served it from its own cache (`cf-cache-status: HIT`). |

This split suits a property site: listings and prices change all the time, so the HTML is always fresh (Cloudflare marks it `DYNAMIC`, meaning it is fetched from the site's own server every time), while pictures are stored. However, 4 hours is short for an image that rarely changes (this one was last modified the day before). A visitor who comes back the next day has to check every image with the server again. The site already puts version numbers on some files (`101evler.webflow.css?v=1.81`), so images and scripts could safely be cached for much longer. [A5]

### A6. Where the page is built

I opened the listing page `/kibris/satilik-emlak/girne-esentepe-daire-289984.html` and then its raw source (View Source), which is the HTML exactly as the server sends it, before any JavaScript runs. I searched the source for the listing title "CASA DEL MARE LOFT 1+1 BAHÇE KATI", the main heading the visitor sees on the page, and Chrome found 95 matches. The first is in the `<title>` element together with the price (£199,900) and the listing number. The raw source also already contains the canonical link and links to the same listing in six language versions.

**Classification: server-rendered.** The server sends the finished listing (title, price, number) in the HTML, so the content does not depend on JavaScript. Scripts such as Google Tag Manager, which is visible at the top of the source, are added on top for tracking. This is good for visitors on slow phones and for search engines, because both get the listing without having to run any code. [A6]

### A7. SEO basics

| Item | Found? | Value or note |
|---|---|---|
| Page title | | [[TODO]] |
| Meta description | | [[TODO]] |
| Canonical link | | [[TODO]] |
| `lang` attribute | | [[TODO]] |
| Number of `h1` elements | | [[TODO]] |
| `rel="sponsored"` / `rel="ugc"` | | [[TODO: only relevant if the page has adverts or user comments]] |

[[TODO: What is missing or wrong, and what it means for how the site appears in search results or to screen-reader users.]] [A7]

## Part B: The experience

### B1. Loading state

[[TODO: Network setting used and what the visitor saw at each moment (for example at 1 s, 4 s and 10 s): blank page, spinner, placeholders or partial content. When did the first useful content appear?]]
[[TODO: How it feels for a visitor on a slow connection.]] [B1]

### B2. Empty state

[[TODO: Where you searched, the exact search term, and the exact wording on screen, in quotation marks.]]
[[TODO: Is there a clear, friendly message and a next step? How would a visitor react?]] [B2]

### B3. Error state

[[TODO: What you did while offline (search, link click) and exactly what appeared: the site's own message or the browser's error page. Is there a retry?]]
[[TODO: What it means for a visitor with an unreliable connection.]] [B3]

### B4. Form validation

[[TODO: Which form, what you left empty on purpose, where the errors appeared, their exact wording, and whether your other input was kept. If the form could have been sent, write "not tested safely" and explain why.]]
[[TODO: Is the wording useful for fixing the problem?]] [B4]

### B5. Labels

| Field | Visible label? | Clicking the label focuses the field? | Placeholder only? |
|---|---|---|---|
| [[TODO]] | | | |
| [[TODO]] | | | |
| [[TODO]] | | | |

[[TODO: Who is affected by missing or unconnected labels, and how.]] [B5]

### B6. Keyboard only

| Task | Keys and steps | Focus visible? | Order logical? | Keyboard trap? | Skip link? |
|---|---|---|---|---|---|
| [[TODO: e.g. find the opening hours]] | [[TODO: e.g. 14 × Tab, Enter, 6 × Tab]] | | | | |

[[TODO: Where you got lost or stuck, and what that means for someone who cannot use a mouse.]] [B6]

### B7. Automated audit (Lighthouse Accessibility)

| Page | Address | Score | Top three flagged issues |
|---|---|---|---|
| Home | [[TODO]] | [[TODO]] | [[TODO]] |
| [[TODO: inner page]] | [[TODO]] | [[TODO]] | [[TODO]] |

[[TODO: Which flagged issue matters most to real visitors, and one thing the automated score cannot tell you.]] [B7]

### B8. Link and button text

| Current text or element | Where | Problem | Better text |
|---|---|---|---|
| [[TODO]] | | | |
| [[TODO]] | | | |
| [[TODO]] | | | |

[[TODO: Why vague link text matters, for example for screen-reader users who list all links on a page.]] [B8]

## Part C: Recommendations

### What works well

1. **[[TODO: Strength 1]]**: [[TODO: what the site does well and why it helps visitors]] [[[TODO: evidence ID]]]
2. **[[TODO: Strength 2]]**: [[TODO]] [[[TODO: evidence ID]]]

### The three problems to fix first

**Why this order:** [[TODO: one sentence explaining the ranking]]

#### 1. [[TODO: Short problem title]]

| | |
|---|---|
| **Problem** | [[TODO: one sentence]] |
| **Evidence** | [[TODO: e.g. A4, B2]] |
| **Who it affects** | [[TODO]] |
| **Fix in plain words** | [[TODO]] |
| **Effort** | [[TODO: Low / Medium / High]] |
| **Impact** | [[TODO: Low / Medium / High]] |

#### 2. [[TODO: Short problem title]]

| | |
|---|---|
| **Problem** | [[TODO: one sentence]] |
| **Evidence** | [[TODO]] |
| **Who it affects** | [[TODO]] |
| **Fix in plain words** | [[TODO]] |
| **Effort** | [[TODO: Low / Medium / High]] |
| **Impact** | [[TODO: Low / Medium / High]] |

#### 3. [[TODO: Short problem title]]

| | |
|---|---|
| **Problem** | [[TODO: one sentence]] |
| **Evidence** | [[TODO]] |
| **Who it affects** | [[TODO]] |
| **Fix in plain words** | [[TODO]] |
| **Effort** | [[TODO: Low / Medium / High]] |
| **Impact** | [[TODO: Low / Medium / High]] |

<div class="page-break"></div>

## Appendix A: Evidence log

<!-- EVIDENCE_LOG -->
