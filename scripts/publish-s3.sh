#!/usr/bin/env bash
# Publish rendered reels from out/ to S3, served publicly through CloudFront.
# Run by .github/workflows/render.yml on every branch push (AWS credentials come from
# GitHub OIDC). Layout under s3://$REELS_S3_BUCKET/reels/:
#
#   renders/<id>/<commit>.mp4|.jpg   every push, any branch: this commit's render, immutable.
#                                    A branch's Vercel preview plays it. One fixed prefix so
#                                    a lifecycle rule expires old ones (reels-lifecycle.json).
# main only (REELS_PUBLISH_LATEST=1), i.e. after a merge:
#   <id>/latest.mp4|.jpg             the public, stable link (5 min cache + invalidation)
#   <id>/download.mp4                same as latest.mp4 but served as an attachment
#   index.json                       manifest of all reels and their URLs
set -euo pipefail

: "${REELS_S3_BUCKET:?set the REELS_S3_BUCKET repository variable}"
BASE_URL="https://dcr3565853rcg.cloudfront.net/reels"
PREFIX="reels"
SHA="${GITHUB_SHA:-$(git rev-parse HEAD)}"
NOW="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
IMMUTABLE="public, max-age=31536000, immutable"
SHORT="public, max-age=300"
LATEST="${REELS_PUBLISH_LATEST:-}"
if [[ "$LATEST" == 1 ]]; then
    : "${CLOUDFRONT_DISTRIBUTION_ID:?set the CLOUDFRONT_DISTRIBUTION_ID repository variable}"
fi

put() { # put <file> <key> <content-type> <cache-control> [content-disposition]
    local args=(--content-type "$3" --cache-control "$4" --only-show-errors)
    [[ -n "${5:-}" ]] && args+=(--content-disposition "$5")
    aws s3 cp "$1" "s3://$REELS_S3_BUCKET/$PREFIX/$2" "${args[@]}"
}

entries=()
invalidation_paths=("/$PREFIX/index.json")
for mp4 in out/*.mp4; do
    id="$(basename "$mp4" .mp4)"
    jpg="out/$id.jpg"
    # The attachment disposition only affects the download link, not <video> playback,
    # so one file serves both on a branch preview.
    put "$mp4" "renders/$id/$SHA.mp4" video/mp4 "$IMMUTABLE" "attachment; filename=\"redirhub-$id-${SHA::7}.mp4\""
    put "$jpg" "renders/$id/$SHA.jpg" image/jpeg "$IMMUTABLE"
    echo "render $BASE_URL/renders/$id/$SHA.mp4"
    [[ "$LATEST" == 1 ]] || continue

    put "$mp4" "$id/latest.mp4" video/mp4 "$SHORT"
    put "$jpg" "$id/latest.jpg" image/jpeg "$SHORT"
    put "$mp4" "$id/download.mp4" video/mp4 "$SHORT" "attachment; filename=\"redirhub-$id.mp4\""
    invalidation_paths+=(
        "/$PREFIX/$id/latest.mp4"
        "/$PREFIX/$id/latest.jpg"
        "/$PREFIX/$id/download.mp4"
    )
    entries+=("$(jq -n --arg id "$id" --arg base "$BASE_URL/$id" --arg pinned "$BASE_URL/renders/$id/$SHA.mp4" \
        --arg sha "$SHA" --arg now "$NOW" --argjson bytes "$(stat -c %s "$mp4")" \
        '{id: $id, updated: $now, commit: $sha, bytes: $bytes,
          mp4: "\($base)/latest.mp4", download: "\($base)/download.mp4",
          cover: "\($base)/latest.jpg", pinned: $pinned}')")
    echo "latest $BASE_URL/$id/latest.mp4"
done
[[ "$LATEST" == 1 ]] || exit 0

printf '%s\n' "${entries[@]}" | jq -s '{generated: now | todate, reels: .}' > out/index.json
put out/index.json index.json application/json "$SHORT"

# Commit-addressed renders are immutable. Invalidate only the mutable stable paths.
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "${invalidation_paths[@]}" --query 'Invalidation.Id' --output text
