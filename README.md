# Website Field Study: fieldstudy-2203060208

SFWE475 / CPRG201, Assignment 2. An evidence-based audit of one real, public website.

| | |
|---|---|
| **Site address** | TODO: https://... |
| **Organisation** | TODO: name of the organisation that runs the site |
| **Main purpose of the site** | TODO: one sentence, e.g. "Lets residents find council services, opening hours and news." |
| **Audit date(s)** | TODO: e.g. 9 and 10 November 2026 |
| **Browser** | TODO: e.g. Google Chrome 1xx on macOS |
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
scripts in `tools/`, and to tidy the English of text I wrote. All observations, measurements, screenshots
and findings were collected by me in my own browser.
