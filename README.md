# Next Host Read PoC

This is a minimal Next.js app for validating the `.js.nft.json` symlink-based host file inclusion issue in a hosted build.

## Expected layout

Create a symlink at the repo root:

`host -> /tmp`

Then make sure the build host has a non-sensitive canary file:

`/tmp/vercel-canary.txt`

with content like:

`CANARY-<uuid>`

## Route

After deployment, request:

`/api/hello`

Success looks like:

- `ok: true`
- `data: "CANARY-..."`

Failure looks like:

- `ok: false`
- `error: "ENOENT"` or another filesystem error
