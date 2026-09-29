#!/usr/bin/env bash
# Publish rendered reels from out/ to S3, served publicly through CloudFront.
# Run by .github/workflows/render.yml on pushes to main (AWS credentials come
# from GitHub OIDC). Layout under s3://$REELS_S3_BUCKET/reels/:
#
#   <id>/<commit>.mp4|.jpg  every main render, immutable (cached for a year)
#   <id>/latest.mp4|.jpg    newest render, stable link (5 min cache + invalidation)
#   <id>/download.mp4       same as latest.mp4 but served as an attachment
#   index.json              manifest of all reels and their URLs
set -euo pipefail

: "${REELS_S3_BUCKET:?set the REELS_S3_BUCKET repository variable}"
: "${REELS_CLOUDFRONT_DISTRIBUTION_ID:?set the REELS_CLOUDFRONT_DISTRIBUTION_ID repository variable}"
BASE_URL="${REELS_PUBLIC_BASE_URL:-https://dcr3565853rcg.cloudfront.net/reels}"
PREFIX="reels"
SHA="${GITHUB_SHA:-$(git rev-parse HEAD)}"
SHA="${SHA::7}"
NOW="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
IMMUTABLE="public, max-age=31536000, immutable"
SHORT="public, max-age=300"

put() { # put <file> <key> <content-type> <cache-control> [content-disposition]
    local args=(--content-type "$3" --cache-control "$4" --only-show-errors)
    [[ -n "${5:-}" ]] && args+=(--content-disposition "$5")
    aws s3 cp "$1" "s3://$REELS_S3_BUCKET/$PREFIX/$2" "${args[@]}"
}

entries=()
for mp4 in out/*.mp4; do
    id="$(basename "$mp4" .mp4)"
    jpg="out/$id.jpg"
    put "$mp4" "$id/$SHA.mp4" video/mp4 "$IMMUTABLE"
    put "$jpg" "$id/$SHA.jpg" image/jpeg "$IMMUTABLE"
    put "$mp4" "$id/latest.mp4" video/mp4 "$SHORT"
    put "$jpg" "$id/latest.jpg" image/jpeg "$SHORT"
    put "$mp4" "$id/download.mp4" video/mp4 "$SHORT" "attachment; filename=\"redirhub-$id.mp4\""
    entries+=("$(jq -n --arg id "$id" --arg base "$BASE_URL/$id" --arg sha "$SHA" --arg now "$NOW" \
        --argjson bytes "$(stat -c %s "$mp4")" \
        '{id: $id, updated: $now, commit: $sha, bytes: $bytes,
          mp4: "\($base)/latest.mp4", download: "\($base)/download.mp4",
          cover: "\($base)/latest.jpg", pinned: "\($base)/\($sha).mp4"}')")
    echo "published $BASE_URL/$id/latest.mp4"
done

printf '%s\n' "${entries[@]}" | jq -s '{generated: now | todate, reels: .}' > out/index.json
put out/index.json index.json application/json "$SHORT"

# One wildcard path: invalidation cost is per path, and immutable files are unaffected.
aws cloudfront create-invalidation --distribution-id "$REELS_CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/$PREFIX/*" --query 'Invalidation.Id' --output text
