# Publishing reels to S3 + CloudFront

On every push to `main`, CI renders the reels and uploads them to S3. They're
served publicly from CloudFront at:

```
https://dcr3565853rcg.cloudfront.net/reels/<id>/latest.mp4     stable link to the newest render
https://dcr3565853rcg.cloudfront.net/reels/<id>/download.mp4   same file, downloads instead of playing
https://dcr3565853rcg.cloudfront.net/reels/<id>/latest.jpg     cover image
https://dcr3565853rcg.cloudfront.net/reels/<id>/<commit>.mp4   a specific render, never changes
https://dcr3565853rcg.cloudfront.net/reels/index.json          manifest of all reels
```

Pull-request renders are not published. They stay private as GitHub Actions artifacts.

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

4. **(Optional) cleanup:** add an S3 lifecycle rule to expire old
   `reels/*/<commit>.mp4` renders, e.g. after 180 days. The `latest` files are
   overwritten on each publish and aren't affected.

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
