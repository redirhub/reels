#!/usr/bin/env bash
# Publish rendered reels from out/ to S3, served publicly through CloudFront.
# Run by .github/workflows/render.yml on pushes to main (AWS credentials come
# from GitHub OIDC). Layout under s3://$REELS_S3_BUCKET/reels/:
#
#   <id>/latest.mp4|.jpg             newest render, stable link (5 min cache + invalidation)
#   <id>/download.mp4                same as latest.mp4 but served as an attachment
#   renders/<id>/<commit>.mp4|.jpg   every main render, immutable (cached for a year);
#                                    one fixed prefix so an S3 lifecycle rule can expire
#                                    old ones (docs/aws/reels-lifecycle.json)
#   index.json                       manifest of all reels and their URLs
#
# With REELS_PREVIEW=1 (branch pushes) it writes only
#   previews/<id>/<commit>.mp4|.jpg  this commit's render, for the branch's Vercel preview;
#                                    immutable, expired after 14 days by a lifecycle rule
set -euo pipefail

if [[ "${REELS_PREVIEW:-}" == 1 ]]; then
    : "${REELS_S3_BUCKET:?set the REELS_S3_BUCKET repository variable}"
    SHA="${GITHUB_SHA:-$(git rev-parse HEAD)}"
    for mp4 in out/*.mp4; do
        id="$(basename "$mp4" .mp4)"
        # One file serves both the <video> tag and the download button: an attachment
        # disposition only affects navigation, not playback.
        aws s3 cp "$mp4" "s3://$REELS_S3_BUCKET/reels/previews/$id/$SHA.mp4" --only-show-errors \
            --content-type video/mp4 --cache-control "public, max-age=31536000, immutable" \
            --content-disposition "attachment; filename=\"redirhub-$id-${SHA::7}.mp4\""
        aws s3 cp "out/$id.jpg" "s3://$REELS_S3_BUCKET/reels/previews/$id/$SHA.jpg" --only-show-errors \
            --content-type image/jpeg --cache-control "public, max-age=31536000, immutable"
        echo "preview https://dcr3565853rcg.cloudfront.net/reels/previews/$id/$SHA.mp4"
    done
    exit 0
fi

: "${REELS_S3_BUCKET:?set the REELS_S3_BUCKET repository variable}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?set the CLOUDFRONT_DISTRIBUTION_ID repository variable}"
BASE_URL="https://dcr3565853rcg.cloudfront.net/reels"
PREFIX="reels"
SHA="${GITHUB_SHA:-$(git rev-parse HEAD)}"
NOW="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
IMMUTABLE="public, max-age=31536000, immutable"
SHORT="public, max-age=300"

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
    put "$mp4" "renders/$id/$SHA.mp4" video/mp4 "$IMMUTABLE"
    put "$jpg" "renders/$id/$SHA.jpg" image/jpeg "$IMMUTABLE"
    put "$mp4" "$id/latest.mp4" video/mp4 "$SHORT"
    put "$jpg" "$id/latest.jpg" image/jpeg "$SHORT"
    put "$mp4" "$id/download.mp4" video/mp4 "$SHORT" "attachment; filename=\"redirhub-$id.mp4\""
    invalidation_paths+=(
        "/$PREFIX/$id/latest.mp4"
        "/$PREFIX/$id/latest.jpg"
        "/$PREFIX/$id/download.mp4"
    )
    entries+=("$(jq -n --arg id "$id" --arg base "$BASE_URL/$id" --arg pinned "$BASE_URL/renders/$id/$SHA.mp4" \
        --arg sha "$SHA" --arg now "$NOW" \
        --argjson bytes "$(stat -c %s "$mp4")" \
        '{id: $id, updated: $now, commit: $sha, bytes: $bytes,
          mp4: "\($base)/latest.mp4", download: "\($base)/download.mp4",
          cover: "\($base)/latest.jpg", pinned: $pinned}')")
    echo "published $BASE_URL/$id/latest.mp4"
done

printf '%s\n' "${entries[@]}" | jq -s '{generated: now | todate, reels: .}' > out/index.json
put out/index.json index.json application/json "$SHORT"

# Commit-addressed objects are immutable. Invalidate only mutable stable paths.
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "${invalidation_paths[@]}" --query 'Invalidation.Id' --output text
