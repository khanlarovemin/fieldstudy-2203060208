# Website Field Study: 101evler

| | |
|---|---|
| **Site** | https://www.101evler.com |
| **Organisation** | 101evler, online property listing portal (North Cyprus) |
| **Student** | Emin Khanlarov · 2203060208 |
| **Course** | SFWE475 / CPRG201 · Assignment 2 (Website Field Study) |
| **Audit date and time** | 8 November 2026, 18:43–19:21 and 9 November 2026, 20:22–21:14 |
| **Browser** | Google Chrome 156.0.8078.80 on macOS 26.3.1 (Part B and A3 in a private window) |

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

Checked on the listing page `/kibris/satilik-emlak/girne-esentepe-daire-289984.html`.

| Item | Found? | Value or note |
|---|---|---|
| Page title | Yes | "CASA DEL MARE LOFT 1+1 BAHÇE KATI – £199,900 – İlan Numarası #289984 \| 101evler.com" (83 characters) |
| Meta description | Yes, weak | "Satılık Daire - Girne, Esentepe, Kuzey Kıbrıs #289984" (about 54 characters: only category, place and number) |
| Canonical link | Yes | Points to the page's own address |
| `lang` attribute | Yes | `TR` (Turkish) |
| Number of `h1` elements | 4 | The listing title, plus "Mesaj Gönder", "Hatalı İlan Bildirim Formu" and "Bana Özel Not Ekle" |
| `rel="sponsored"` / `rel="ugc"` | 0 / 0 | No ad frames were on the page at the time, although Google's ad script ran (messages from `pubads_impl.js` in the console), so there was no paid link to mark |

The basics are in place. Every item exists, the canonical link points to the page itself, and the raw source also lists the same listing in six language versions (see A6), which helps search engines show each visitor the right one. Two things are weak. First, the meta description, the grey text Google often shows under the title in results, is generated from the category and place and gives no reason to click: no price, size or feature, and only about 54 of the roughly 155 characters that can be shown. The title is the opposite: at 83 characters it is longer than results usually display, so the listing number and the site name at the end would be cut off. Second, the page has four `h1` headings. Only the first names the listing; the other three are form titles. Screen-reader users often jump from heading to heading to understand a page, and four "main" headings blur which one is the subject. The form titles should be `h2` or lower. [A7]

## Part B: The experience

### B1. Loading state

I set the Performance panel to **Slow 4G** with the cache disabled and reloaded the home page. Chrome's live metrics reported a Largest Contentful Paint of **2.47 s**: the biggest element, the main `h1` heading, was on screen after about two and a half seconds. Layout shift was **0.02**, so the page hardly jumped while images arrived, and clicks on the page responded within 24 ms. Chrome rates all three values as "good". While loading, I first saw a plain white screen, with no spinner, placeholder or message.
For about two and a half seconds, a visitor on a slow connection cannot tell whether the site is loading or broken, and some will press Back. Once the heading appears, the page is usable because it is built on the server (A6). Even so, the 2.5 MB download (A3), a third of it advertising and tracking code, keeps the phone busy and uses mobile data long after the useful part is visible. [B1]

### B2. Empty state

I typed `99999999`, a listing number that does not exist, into the "İlan No #" (listing number) box that sits at the top of every page, and pressed Enter. The site opened `/kibris/emlak/index?property=99999999` and showed a large "404", the heading "Bu ilan artık yayında değil" ("This listing is no longer published"), the sentence "Satılmış, kiralanmış veya yayından kalkmış olabilir. Benzer ilanlara aşağıdan göz atabilirsiniz." ("It may have been sold, rented or taken down. You can browse similar listings below.") and an "Anasayfaya dön" ("Back to home page") button. Unlike the general error page in A4, the normal header and menu stay visible.
The message is friendly and gives a next step, so the visitor is not stuck. However, the wording assumes the listing once existed. Someone who simply mistyped a number is told the home "may have been sold". They might give up on a property that is still for sale, and they are never asked to check the number. A neutral sentence such as "We could not find listing #99999999. Please check the number." would work in both cases. [B2]

### B3. Error state

With the Network panel set to **Offline**, I clicked "Satılık" in the main menu of the home page. The site showed nothing of its own. Chrome replaced the page with its standard "no internet" page: the dinosaur, "Oynamak için boşluk tuşuna basın" ("Press space to play") and tips to check the cable, modem and Wi-Fi. The address bar already showed `/kibris/satilik-konut`, but there was no message and no retry button from 101evler.
For a site made of ordinary pages, this is the usual behaviour, and the browser's message is at least clear. Still, a visitor on a weak mobile connection sees the page they were reading replaced by a browser game, with nothing to tell them that their search will still be there when the connection returns. A simple offline page with a "Try again" button would keep them on the site. [B3]

### B4. Form validation

I used the main search form on the home page, the only form that sends nothing personal. I pressed "Ara" without choosing a town, region, room type or price; only the defaults "Satılık" and "Konut" were set. No error appeared. The site opened `/kibris/satilik-konut` with "Kıbrıs Satılık Ev İlanları – 25.083 Sonuç Bulundu", that is, all 25,083 homes for sale. The forms that do have required fields (sending a message to an agent, registering, reporting a listing) would really send data, so these were **not tested safely**, as the assignment rules require.
For a search form, this behaviour is sensible: no field is required, an empty search means "show everything", and the filter bar at the top of the results (Konut, Lokasyon, Fiyat, Alan, Detaylı Ara) lets the visitor narrow the list straight away. There is no error wording to judge, because the form never shows one. [B4]

### B5. Labels

Checked on the listing page with a short Console snippet that lists every form field and its connected `<label>`.

| Field | Visible label? | Clicking the label focuses the field? | Placeholder only? |
|---|---|---|---|
| "İlan No #" search box (header of every page) | No | No label to click | Yes |
| Contact-agent form: name, phone, e-mail, message | No | No label to click | Yes ("Ad ve Soyad", "Telefon", "E-Mail", "Mesajınız") |
| Three drop-down menus (`chartTypeSelect`, `transactionTypeSelect`, `propertyTypeSelect`), the report-reason field and two note boxes (`incNote`, `usernote`) | No | No label to click | No placeholder either: no name at all |
| "Danışman Girişi" tick box (hidden login pop-up) | Yes | Yes, label connected | No |

Of the 18 fields that are not hidden, **none** has a label: 12 rely only on placeholder text and 6 have nothing at all. The only connected labels belong to hidden login and sign-up pop-ups and a third-party share widget. Placeholder text vanishes as soon as the visitor starts typing. Someone checking their message before sending, or anyone with memory or attention difficulties, can no longer see what each box was for, and the light grey text is hard to read. Fields with no name at all are worse: a screen reader announces just "edit text" or "combo box", which is why Lighthouse flagged them (B7). Without labels, there is also no larger area to click, which makes small tick boxes harder for people with shaky hands. [B5]

### B6. Keyboard only

| Task | Keys and steps | Focus visible? | Order logical? | Keyboard trap? | Skip link? |
|---|---|---|---|---|---|
| Open the rental listings ("Kiralık") from the home page | 3 × Tab from the address bar (logo → Satılık → Kiralık), then Enter | Yes, a dark outline around "Kiralık" | Yes, left to right | None on this route | No: the first Tab goes straight to the logo |

This simple task worked well. Each Tab moved one step along the menu with a clearly visible outline, and Enter opened the rental listings. The missing piece is a "skip to content" link. The header alone holds about ten links and controls (logo, five menu items, the listing-number box, Giriş Yap, Kayıt Ol, language). Someone who cannot use a mouse has to pass all of them on every new page before reaching the listings, and on the listing page Lighthouse also found buttons and links without names (B7), which a blind keyboard user can reach with Tab but cannot identify. [B6]

### B7. Automated audit (Lighthouse Accessibility)

| Page | Address | Score | Top three flagged issues |
|---|---|---|---|
| Home | `https://www.101evler.com/` | **74** | Images without `alt` text; search menus (`select`) without labels; links without a readable name. Also: low colour contrast, zooming blocked, no main landmark |
| Listing #289984 | `/kibris/satilik-emlak/girne-esentepe-daire-289984.html` | **53** | Buttons, links and form fields without a name or label; images without `alt` text; ARIA attributes used wrongly (three separate warnings). Also: zooming blocked, no main landmark |

The issue that matters most to real visitors is the **unnamed controls**. On both pages, search menus, form fields, links and (on the listing page) buttons have no name a screen reader can read out. A blind visitor therefore hears only "button" or "link" and cannot search on their own or contact an agent. A second issue affects far more people: the page tells mobile browsers not to allow zooming (`maximum-scale=1`, also visible in the page source, A6). Some browsers obey this, which stops people with weak eyesight from enlarging small text such as prices. One thing the score cannot tell you is whether a person can actually finish a task. Lighthouse checks rules in the code; it does not try to search or contact an agent, and it cannot judge whether an existing label or `alt` text makes sense. Nor does it explain why the listing page, where visitors decide and get in touch, scores 21 points lower than the home page. [B7]

### B8. Link and button text

| Current text or element | Where | Problem | Better text |
|---|---|---|---|
| 6 photo links (`popup-img`) and 17 links to `#st` (`fancybox-link`), all without text | Photo gallery of the listing (it has 17 photos) | Images have no `alt` text, so each link is read as just "link" or a long file address | "Fotoğraf 1 / 17 – büyüt" ("Photo 1 of 17 – enlarge") |
| Share icon (link to addtoany.com) | Next to the price | Icon only, no text or `aria-label` | "Bu ilanı paylaş" ("Share this listing") |
| Agent logo (link to `/acente-detay/northernland-construction/2673`) | Agent box beside the listing | Logo image without `alt` | "Northern Land Construction – tüm ilanları" ("all listings") |
| Two buttons (`button-18-copy`, `div-block-354`), Google Play and App Store badges, back-to-top link (`scrollToHome`) | Elsewhere on the page | No text, no label | e.g. "101evler uygulamasını Google Play'den indir", "Sayfanın başına dön" ("Back to top") |

The same Console check found **32 visible links and buttons with no readable text at all** on the listing page. None used vague words such as "tıkla" or "devamı", so the problem here is not vague text but missing text. Screen-reader users often open a list of all links on a page to jump straight to the one they want. On this page, that list contains 32 entries read as "link", "button" or an image address, 23 of them in the photo gallery. The two empty buttons are the worst case, because a blind visitor cannot tell what pressing them will do. [B8]

## Part C: Recommendations

### What works well

1. **Secure, tidy addresses.** Every visit ends on HTTPS at one single address, the browser is told to stay on HTTPS (HSTS), and page addresses are short, readable and free of query strings, even for search results. Links are safe to share and easy to understand. [A1, A2]
2. **Content arrives ready-made, and dead ends are handled.** Listings are built on the server, so the main heading appeared after about 2.5 s even on Slow 4G. Missing pages return a real 404 with a friendly message and onward links instead of a broken page. [A6, B1, A4, B2]

### The three problems to fix first

**Why this order:** I ranked the problems by how badly they stop a real visitor from doing the site's main job (finding a home and contacting the agent), and then by how cheap they are to fix.

#### 1. Forms, links and buttons have no names

| | |
|---|---|
| **Problem** | None of the 18 visible form fields on a listing page has a label, and 32 links and buttons have no readable text. |
| **Evidence** | B5, B8, B7 (scores 74 and 53), A7 (four `h1` headings) |
| **Who it affects** | Blind and partially sighted visitors using screen readers. Anyone who forgets what a field was for once the placeholder disappears. |
| **Fix in plain words** | Give every field a visible label, every photo and logo a short description (`alt`), and every icon button a spoken name (`aria-label`). Keep one main heading per page. |
| **Effort** | Low to Medium (template changes, no redesign) |
| **Impact** | High: the contact form, the main way to reach an agent, becomes usable for everyone |

#### 2. Zooming is blocked on phones

| | |
|---|---|
| **Problem** | The page tells mobile browsers not to allow zooming (`maximum-scale=1`). |
| **Evidence** | B7 (flagged on both pages), A6 (visible in the page source) |
| **Who it affects** | Visitors with weak eyesight, older visitors, anyone reading small prices and details on a phone |
| **Fix in plain words** | Delete `maximum-scale=1` from one line in the page header. |
| **Effort** | Low (one line) |
| **Impact** | High |

#### 3. Slow first view and heavy extras on mobile

| | |
|---|---|
| **Problem** | On a slow connection, visitors see a blank white screen first, and about a third of the 2.5 MB download is advertising and tracking code. |
| **Evidence** | B1, A3, A5 |
| **Who it affects** | Visitors on mobile data or weak connections |
| **Fix in plain words** | Load advertising and tracking scripts after the listing is visible, show a simple placeholder while loading, and let browsers keep images for days instead of 4 hours. |
| **Effort** | Medium |
| **Impact** | Medium |

<div class="page-break"></div>

## Appendix A: Evidence log

<!-- EVIDENCE_LOG -->
