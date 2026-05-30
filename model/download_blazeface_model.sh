#!/usr/bin/env bash
set -euo pipefail

# Simple helper to download BlazeFace TFJS model files into model/blazeface/
# Note: URL may change. Inspect and update MODEL_URL if needed.

MODEL_URL="https://storage.googleapis.com/tfjs-models/savedmodel/blazeface/model.json"
TARGET_DIR="$(dirname "$0")/blazeface"

mkdir -p "$TARGET_DIR"
echo "Mengunduh model dari: $MODEL_URL"
curl -L --fail --output "$TARGET_DIR/model.json" "$MODEL_URL"

echo "Berhasil mengunduh model.json. Memeriksa referensi shards..."
SHARDS=$(jq -r '.weightsManifest[]?.paths[]' "$TARGET_DIR/model.json" 2>/dev/null || true)
if [ -z "$SHARDS" ]; then
  echo "Tidak menemukan shards di model.json atau jq tidak terpasang. Pastikan file model.json valid dan unduh manual jika perlu."
  exit 0
fi

for shard in $SHARDS; do
  shard_url=$(dirname "$MODEL_URL")/"$shard"
  echo "Mengunduh shard: $shard_url"
  curl -L --fail --output "$TARGET_DIR/$shard" "$shard_url"
done

echo "Selesai. Model disimpan di: $TARGET_DIR"
