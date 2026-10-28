#!/usr/bin/env bash
# Publish rendered reels from out/ to S3, served publicly through CloudFront.
# Run by .github/workflows/render.yml on every branch push (AWS credentials come from
# GitHub OIDC). Renders are named by content key (scripts/reel-keys.mjs: a sha256 of every
# file that can change the reel), so a render is stored once and found by every commit,
# branch and CI run with the same content. Layout under s3://$REELS_S3_BUCKET/reels/:
#
#   renders/<id>/<key>.mp4|.jpg      the render of that exact content, immutable. CI checks for
#                                    the .jpg (uploaded last) before rendering a reel, and a
#                                    branch's Vercel preview computes the same key to play it.
#                                    One fixed prefix so a lifecycle rule expires old ones
#                                    (reels-lifecycle.json).
#   renders/<id>/branch-<slug>.mp4|.jpg  the newest render of the reel on a branch (slug: the branch
#                                    name, [A-Za-z0-9._-] kept, the rest -). The preview shows it
#                                    while CI is still rendering its own content. Short cache,
#                                    invalidated on every upload.
# main only (REELS_PUBLISH_LATEST=1), i.e. after a merge, for every reel whose key changed
# (from this run's render, or downloaded from renders/ when a branch already rendered it):
#   <id>/latest.mp4|.jpg             the public, stable link (5 min cache + invalidation)
#   <id>/download.mp4                same as latest.mp4 but served as an attachment
#   index.json                       manifest of all reels, newest first, with each one's key
#
# Env: REELS_KEYS "<id>=<key> …" and REELS_REGISTERED "<id> …" (newest first), both from
# scripts/reels-to-render.mjs.
set -euo pipefail

: "${REELS_S3_BUCKET:?set the REELS_S3_BUCKET repository variable}"
: "${REELS_KEYS:?set by scripts/reels-to-render.mjs}"
BASE_URL="https://dcr3565853rcg.cloudfront.net/reels"
PREFIX="reels"
SHA="${GITHUB_SHA:-$(git rev-parse HEAD)}"
BRANCH="${GITHUB_REF_NAME:-$(git rev-parse --abbrev-ref HEAD)}"
SLUG="$(printf %s "$BRANCH" | tr -c 'A-Za-z0-9._-' '-')"   # app/components/Gallery.tsx makes the same slug
NOW="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
IMMUTABLE="public, max-age=31536000, immutable"
SHORT="public, max-age=300"
LATEST="${REELS_PUBLISH_LATEST:-}"
if [[ "$LATEST" == 1 ]]; then
    : "${CLOUDFRONT_DISTRIBUTION_ID:?set the CLOUDFRONT_DISTRIBUTION_ID repository variable}"
fi
declare -A KEY
for kv in $REELS_KEYS; do KEY["${kv%%=*}"]="${kv#*=}"; done

put() { # put <file> <key> <content-type> <cache-control> [content-disposition]
    local args=(--content-type "$3" --cache-control "$4" --only-show-errors)
    [[ -n "${5:-}" ]] && args+=(--content-disposition "$5")
    aws s3 cp "$1" "s3://$REELS_S3_BUCKET/$PREFIX/$2" "${args[@]}"
}

invalidation_paths=()
for mp4 in out/*.mp4; do
    [[ -e "$mp4" ]] || continue
    id="$(basename "$mp4" .mp4)"
    key="${KEY[$id]:?no key for $id}"
    jpg="out/$id.jpg"
    # The attachment disposition only affects the download link, not <video> playback, so one file
    # serves both. The mp4 goes first: a cover that's there means its video is (CI and the gallery
    # both check the cover).
    put "$mp4" "renders/$id/$key.mp4" video/mp4 "$IMMUTABLE" "attachment; filename=\"redirhub-$id-${key::12}.mp4\""
    put "$jpg" "renders/$id/$key.jpg" image/jpeg "$IMMUTABLE"
    echo "render $BASE_URL/renders/$id/$key.mp4"
    put "$mp4" "renders/$id/branch-$SLUG.mp4" video/mp4 "$SHORT" "attachment; filename=\"redirhub-$id-$SLUG.mp4\""
    put "$jpg" "renders/$id/branch-$SLUG.jpg" image/jpeg "$SHORT"
    invalidation_paths+=("/$PREFIX/renders/$id/branch-$SLUG.mp4" "/$PREFIX/renders/$id/branch-$SLUG.jpg")
    echo "branch $BASE_URL/renders/$id/branch-$SLUG.mp4"
done
invalidate() {
    [[ ${#invalidation_paths[@]} -gt 0 && -n "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]] || return 0
    aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
        --paths "${invalidation_paths[@]}" --query 'Invalidation.Id' --output text
}
if [[ "$LATEST" != 1 ]]; then invalidate; exit 0; fi

# main: point each reel's latest links at the render of its current key. A reel whose published key
# is already current is left alone; one rendered on a branch before the merge is copied from renders/.
old="$(curl -sf "$BASE_URL/index.json" || true)"
echo "$old" | jq -e '.reels | type == "array"' >/dev/null 2>&1 || old='{"reels":[]}'
tmp="$(mktemp -d)"
entries=()
for id in ${REELS_REGISTERED:-${!KEY[@]}}; do
    key="${KEY[$id]:?no key for $id}"
    if [[ "$(echo "$old" | jq -r --arg id "$id" '.reels[] | select(.id == $id) | .key // empty')" == "$key" && ! -e "out/$id.mp4" ]]; then
        entries+=("$(echo "$old" | jq -c --arg id "$id" '.reels[] | select(.id == $id)')")
        continue
    fi
    mp4="out/$id.mp4" jpg="out/$id.jpg"
    if [[ ! -e "$mp4" ]]; then
        mp4="$tmp/$id.mp4" jpg="$tmp/$id.jpg"
        curl -sfo "$mp4" "$BASE_URL/renders/$id/$key.mp4" && curl -sfo "$jpg" "$BASE_URL/renders/$id/$key.jpg" \
            || { echo "::error::$id: no render of key $key to publish (renders/$id/$key.mp4)"; exit 1; }
    fi
    put "$mp4" "$id/latest.mp4" video/mp4 "$SHORT"
    put "$jpg" "$id/latest.jpg" image/jpeg "$SHORT"
    put "$mp4" "$id/download.mp4" video/mp4 "$SHORT" "attachment; filename=\"redirhub-$id.mp4\""
    invalidation_paths+=("/$PREFIX/$id/latest.mp4" "/$PREFIX/$id/latest.jpg" "/$PREFIX/$id/download.mp4")
    entries+=("$(jq -nc --arg id "$id" --arg base "$BASE_URL/$id" --arg pinned "$BASE_URL/renders/$id/$key.mp4" \
        --arg key "$key" --arg sha "$SHA" --arg now "$NOW" --argjson bytes "$(stat -c %s "$mp4")" \
        '{id: $id, updated: $now, key: $key, commit: $sha, bytes: $bytes,
          mp4: "\($base)/latest.mp4", download: "\($base)/download.mp4",
          cover: "\($base)/latest.jpg", pinned: $pinned}')")
    echo "latest $BASE_URL/$id/latest.mp4"
done
rm -rf "$tmp"

# Every registered reel, newest first (REELS_REGISTERED's order); reels no longer registered drop out.
invalidation_paths+=("/$PREFIX/index.json")
printf '%s\n' "${entries[@]}" | jq -s '{generated: (now | todate), reels: .}' > out/index.json
put out/index.json index.json application/json "$SHORT"

# Key-addressed renders are immutable. Invalidate only the mutable paths (branch, latest, index).
invalidate
