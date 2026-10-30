# Publishing reels to S3 + CloudFront

CI renders on every branch push and uploads to S3, served from CloudFront:

- **Renders are named by content, not by commit:** `renders/<id>/<key>.mp4|.jpg`, where the key is a
  sha256 of every file that can change how the reel looks or sounds (`scripts/reel-keys.mjs`). Before
  rendering, CI checks the CDN for each reel's key (`scripts/reels-to-render.mjs`) and renders only the
  reels whose key has no render yet, so the same content is never rendered twice: not for a docs-only
  commit, a gallery change, a cancelled run or a merge. A branch's Vercel preview computes the same keys
  at build time and plays `renders/<id>/<key>.mp4` under **Rendered MP4**. Also
  `renders/<id>/branch-<slug>.mp4|.jpg`, the newest render of the reel on that branch (slug: the branch
  name with anything but `A-Za-z0-9._-` turned into `-`), short-cached and invalidated on every upload:
  the preview shows it while CI is still rendering its own content, then falls back to main's
  `latest`, and offers **Download MP4** only once a file's cover has loaded. S3 answers a link to a
  missing file with `AccessDenied`, which is what the button used to hand out (2026-10-28).
- **`main` only (after a merge):** points the public `latest` links and `download.mp4` at each reel's
  current key (copying the render a branch already made, so a merge renders nothing new), updates
  `index.json` (newest reel first, each with its `key`), and invalidates them in CloudFront.

```
https://dcr3565853rcg.cloudfront.net/reels/<id>/latest.mp4     stable link to the newest render
https://dcr3565853rcg.cloudfront.net/reels/<id>/download.mp4   same file, downloads instead of playing
https://dcr3565853rcg.cloudfront.net/reels/<id>/latest.jpg     cover image
https://dcr3565853rcg.cloudfront.net/reels/renders/<id>/<key>.mp4      the render of one exact content (any branch), kept 90 days
https://dcr3565853rcg.cloudfront.net/reels/renders/<id>/branch-<slug>.mp4   a branch's newest render, kept 90 days after its last upload
https://dcr3565853rcg.cloudfront.net/reels/index.json          manifest of all reels
```

Branches use the **same role** as `main`; on a branch `publish-s3.sh` writes only
`reels/renders/*`. The role itself could write any `reels/*` path, which is acceptable
while `main` isn't branch-protected (anyone who can push a branch can push to `main` too).
Render URLs contain a 64-character key and aren't linked anywhere public, but anyone who has
one can open it.

GitHub signs in to AWS with short-lived OIDC tokens, so no AWS keys are stored
in GitHub. The role can only write under `reels/` in one bucket and invalidate one
distribution, and only workflow runs of `redirhub/reels` can assume it.

## One-time setup (AWS admin)

Replace `<AWS_ACCOUNT_ID>`, `<BUCKET_NAME>` and `<DISTRIBUTION_ID>` in the JSON files first.

1. **GitHub OIDC provider** (skip if the account already has one):
   IAM → Identity providers → Add provider → OpenID Connect
   - Provider URL: `https://token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`

2. **Role** `github-actions-reels-publisher`:
   IAM → Roles → Create role → Custom trust policy → paste
   [`github-oidc-trust-policy.json`](github-oidc-trust-policy.json).
   Then add an inline policy from [`reels-publish-policy.json`](reels-publish-policy.json).

   RedirHub's GitHub organization uses a custom OIDC subject template. Keep the
   `token.actions.githubusercontent.com:sub` value from that file exactly; its organization
   and repository IDs are deliberate and restrict this role to `redirhub/reels`. It matches
   `ref:refs/heads/*` (`StringLike`), so every branch can upload its commit renders.

   To check the template or rebuild the subject (for another repo, or after a change), look
   up the values with the GitHub CLI:

   ```bash
   gh api orgs/redirhub/actions/oidc/customization/sub   # the org's subject template
   gh api orgs/redirhub --jq .id                         # organization ID (141114424)
   gh api repos/redirhub/reels --jq .id                  # repository ID (1394109103)
   ```

   Then assemble the subject as `repo:<org>@<org-id>/<repo>@<repo-id>:ref:refs/heads/*`.
   IDs don't change when a repository is renamed, and a repository recreated under the
   same name gets a new ID, so it can't inherit this role.

3. **CloudFront → S3 read access.** The distribution must be able to read `reels/*`
   from the bucket. If it uses Origin Access Control with a bucket policy limited to
   certain prefixes, add `arn:aws:s3:::<BUCKET_NAME>/reels/*` to it. Keep the bucket
   itself private; only CloudFront reads it.

4. **Lifecycle rules (cleanup).** Every publish adds an immutable copy under
   `reels/renders/<id>/<key>.mp4|.jpg` (~5 MB per reel, one per distinct content) and overwrites the `latest`
   files. Without rules these accumulate forever. [`reels-lifecycle.json`](reels-lifecycle.json):
   - expires `reels/renders/` objects after **90 days** (the `latest` links are unaffected; a reel
     unchanged for longer is rendered once more on the next push, since its key is missing again);
   - if the bucket has **versioning** on, deletes overwritten versions of `reels/` files after
     7 days (otherwise every publish silently keeps the previous `latest.mp4` and
     `download.mp4`), and cleans up failed multipart uploads.

   Lifecycle configuration replaces the bucket's **whole** rule set, so merge these rules
   into any existing ones instead of overwriting them:

   ```bash
   aws s3api get-bucket-lifecycle-configuration --bucket <BUCKET_NAME>   # existing rules, if any
   aws s3api put-bucket-lifecycle-configuration --bucket <BUCKET_NAME> \
       --lifecycle-configuration file://docs/aws/reels-lifecycle.json    # only if there were none
   ```

   The publish role can't delete anything (by design), so cleanups like this run as an admin.

## Repository variables (GitHub)

redirhub/reels → Settings → Secrets and variables → Actions → **Variables** tab. None
of these are secrets.

| Variable | Example |
|---|---|
| `AWS_ROLE_ARN` | `arn:aws:iam::123456789012:role/github-actions-reels-publisher` |
| `AWS_REGION` | the bucket's region, e.g. `us-east-1` |
| `REELS_S3_BUCKET` | bucket name only, no `s3://` |
| `CLOUDFRONT_DISTRIBUTION_ID` | e.g. `E1ABCDEF2GHIJK` |

Until `AWS_ROLE_ARN` is set, `main` builds still render and attach artifacts, and
log a warning that nothing was published.

## Verify

Re-run the latest `main` workflow (Actions → Render reels → Run workflow), then:

```bash
curl -sI https://dcr3565853rcg.cloudfront.net/reels/qr-no-reprint/latest.mp4 | head -5
# HTTP/2 200, content-type: video/mp4
```
