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

[[TODO: What you saw: what you typed, the address the browser ended on, the redirect status in the Network panel (for example 301, 302 or "307 Internal Redirect"), and the certificate issuer and expiry date.]]
[[TODO: What it means: is every visitor protected, and is the redirect done by the server or only by the browser?]] [A1]

### A2. URL structure

| # | URL | HTTPS | Short and readable | Lowercase | Hyphens, not underscores | Few query parameters | Score |
|---|---|---|---|---|---|---|---|
| 1 | `[[TODO]]` | | | | | | /5 |
| 2 | `[[TODO]]` | | | | | | /5 |
| 3 | `[[TODO]]` | | | | | | /5 |
| 4 | `[[TODO]]` | | | | | | /5 |
| 5 | `[[TODO]]` | | | | | | /5 |

[[TODO: The pattern across the five URLs (which rule fails most, and on which kind of page), and what that means for someone reading, sharing or remembering a link.]] [A2]

### A3. One request, closely

| Item | Value |
|---|---|
| Document request | Method `[[TODO]]` · Status `[[TODO]]` · Content-Type `[[TODO]]` |
| Requests on reload | [[TODO]] |
| Transferred / resources | [[TODO: e.g. 1.2 MB transferred, 3.4 MB resources]] |
| Example Fetch/XHR request | [[TODO: path and what it loads, or "none found"]] |

[[TODO: What the numbers mean for a visitor, for example on mobile data: is the page heavy, and what makes up most of it?]] [A3]

### A4. A page that does not exist

[[TODO: The address you visited, the status code in Network, and what the visitor sees: the exact heading or message, and any search box or links back.]]
[[TODO: Is it a real 404 or a soft 404? What does that mean for a lost visitor and for search engines?]] [A4]

### A5. Caching

| Resource | Cache-Control | Meaning in one sentence |
|---|---|---|
| Main document | `[[TODO]]` | [[TODO]] |
| [[TODO: image or script file name]] | `[[TODO]]` | [[TODO]] |

[[TODO: Is this combination sensible for this site, given how often its pages and files change?]] [A5]

### A6. Where the page is built

[[TODO: What the raw source contains (is a sentence of the main text there?), compared with the Elements panel; optionally what remains with JavaScript disabled.]]
[[TODO: Your classification (server-rendered, browser-rendered or mixed) and the evidence that justifies it.]] [A6]

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
