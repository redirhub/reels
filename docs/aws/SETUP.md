# Publishing reels to S3 + CloudFront

On every push to `main`, CI renders the reels and uploads them to S3. They're
served publicly from CloudFront at:

```
https://dcr3565853rcg.cloudfront.net/reels/<id>/latest.mp4     stable link to the newest render
https://dcr3565853rcg.cloudfront.net/reels/<id>/download.mp4   same file, downloads instead of playing
https://dcr3565853rcg.cloudfront.net/reels/<id>/latest.jpg     cover image
https://dcr3565853rcg.cloudfront.net/reels/renders/<id>/<commit>.mp4   a specific render, kept 90 days
https://dcr3565853rcg.cloudfront.net/reels/index.json          manifest of all reels
```

Every **branch** push also publishes that commit's render for the branch's Vercel
preview, which plays it under **Rendered MP4**:

```
https://dcr3565853rcg.cloudfront.net/reels/previews/<id>/<commit>.mp4|.jpg   kept 14 days
```

Branch previews use a **separate role** that can only write `reels/previews/*`, so a
branch can never overwrite what `main` published. Preview URLs contain the full commit
SHA and aren't linked anywhere public, but anyone who has one can open it.

GitHub signs in to AWS with short-lived OIDC tokens, so no AWS keys are stored
in GitHub. The role can only write under `reels/` in one bucket and invalidate one
distribution, and only runs on `main` can assume it.

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
   and repository IDs are deliberate and restrict this role to `redirhub/reels` on `main`.

   To check the template or rebuild the subject (for another repo, or after a change), look
   up the values with the GitHub CLI:

   ```bash
   gh api orgs/redirhub/actions/oidc/customization/sub   # the org's subject template
   gh api orgs/redirhub --jq .id                         # organization ID (141114424)
   gh api repos/redirhub/reels --jq .id                  # repository ID (1394109103)
   ```

   Then assemble the subject as `repo:<org>@<org-id>/<repo>@<repo-id>:ref:refs/heads/main`.
   IDs don't change when a repository is renamed, and a repository recreated under the
   same name gets a new ID, so it can't inherit this role.

3. **CloudFront → S3 read access.** The distribution must be able to read `reels/*`
   from the bucket. If it uses Origin Access Control with a bucket policy limited to
   certain prefixes, add `arn:aws:s3:::<BUCKET_NAME>/reels/*` to it. Keep the bucket
   itself private; only CloudFront reads it.

4. **Lifecycle rules (cleanup).** Every publish adds an immutable copy under
   `reels/renders/<id>/<commit>.mp4|.jpg` (~5 MB per reel) and overwrites the `latest`
   files. Without rules these accumulate forever. [`reels-lifecycle.json`](reels-lifecycle.json):
   - expires `reels/renders/` objects after **90 days** (the `latest` links are unaffected);
   - expires branch previews (`reels/previews/`) after **14 days**;
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

5. **Branch-preview role** `github-actions-reels-preview`: same steps as the role in step 2,
   with [`github-oidc-preview-trust-policy.json`](github-oidc-preview-trust-policy.json)
   (any branch of `redirhub/reels`, same custom subject IDs, `StringLike` on
   `ref:refs/heads/*`) and the inline policy [`reels-preview-policy.json`](reels-preview-policy.json)
   (`PutObject` on `reels/previews/*` only; no CloudFront access, because preview files are
   immutable).

## Repository variables (GitHub)

redirhub/reels → Settings → Secrets and variables → Actions → **Variables** tab. None
of these are secrets.

| Variable | Example |
|---|---|
| `AWS_ROLE_ARN` | `arn:aws:iam::123456789012:role/github-actions-reels-publisher` |
| `AWS_REGION` | the bucket's region, e.g. `us-east-1` |
| `REELS_S3_BUCKET` | bucket name only, no `s3://` |
| `CLOUDFRONT_DISTRIBUTION_ID` | e.g. `E1ABCDEF2GHIJK` |
| `AWS_PREVIEW_ROLE_ARN` | `arn:aws:iam::123456789012:role/github-actions-reels-preview` |

Until `AWS_ROLE_ARN` is set, `main` builds still render and attach artifacts, and
log a warning that nothing was published. Until `AWS_PREVIEW_ROLE_ARN` is set, branch
pushes render and attach artifacts, and the Vercel preview falls back to the live Player.

## Verify

Re-run the latest `main` workflow (Actions → Render reels → Run workflow), then:

```bash
curl -sI https://dcr3565853rcg.cloudfront.net/reels/qr-no-reprint/latest.mp4 | head -5
# HTTP/2 200, content-type: video/mp4
```
