# Website Field Study: fieldstudy-2203060208

SFWE475 / CPRG201, Assignment 2. An evidence-based audit of one real, public website.

| | |
|---|---|
| **Site address** | https://www.101evler.com |
| **Organisation** | 101evler, an online property listing portal in North Cyprus |
| **Main purpose of the site** | Lets people search properties for sale and rent in North Cyprus and contact the estate agents who list them. |
| **Audit date(s)** | 8 and 9 November 2026 |
| **Browser** | Google Chrome 156.0.8078.80 on macOS 26.3.1 |
| **Tier attempted** | Core |

## Deliverables

| Path | Contents |
|---|---|
| `report.pdf` | Parts A, B and C, with an evidence-log appendix |
| `owner-summary.pdf` | One-page, plain-language summary for the site owner |
| `evidence/` | Original screenshots and Lighthouse reports, named by checklist ID (e.g. `A4-missing-page.png`) |

## How the PDFs are made

The report and the owner summary are written in Markdown in `source/` and converted to PDF with
`tools/build.sh` (uses Node.js and Google Chrome). `tools/snap.sh` takes a full-screen screenshot into
`evidence/` and adds a row with the date, time and page address to the evidence log.

```bash
tools/build.sh            # report.pdf and owner-summary.pdf
tools/build.sh stretch    # stretch/benchmark.pdf and stretch/usability-test.pdf
```

## Use of AI tools

I used Claude (an AI assistant) to set up the repository structure, the report templates and the helper
scripts in `tools/`, to tell me which DevTools steps to follow for each check, to write the two short Console
snippets used in A7, B5 and B8 (they only read the open page and send nothing to the site), and to draft the
English wording of the report and the owner summary from my screenshots, measurements and notes. All
observations, measurements and screenshots were collected by me in my own browser, and I checked the
statements in the report against my evidence.
