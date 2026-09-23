# Ajeer notice verification frontend

Frontend-only Next.js + TypeScript recreation of the Ajeer notice-verification page.

## Add or edit a notice

Edit `data/notices.json`. Each object becomes one statically generated page. The `code` value is the long letters/numbers token used in the URL, while `permit.number` is the shorter permit number shown in the table.

```text
/notice-verification/{code}
```

The list of QR-ready paths is available at `/notice-verification`.

## Run locally

```bash
npm install
npm run dev
```

## Verify the static pages

```bash
npm run typecheck
npm run build
```

The virtual assistant intentionally does not call an API and displays `Failed to fetch`, as requested.
