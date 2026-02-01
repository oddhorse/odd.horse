#!/bin/bash
#
# convert-mp3-to-ogg.sh
# Converts all MP3 files in src/assets/audio/ to OGG format using ffmpeg
#
# Usage:
#   ./scripts/convert-mp3-to-ogg.sh           # Convert all, skip existing
#   ./scripts/convert-mp3-to-ogg.sh --force   # Convert all, overwrite existing
#

set -e  # Exit on error

AUDIO_DIR="src/assets/audio"
FORCE=false

# Parse arguments
if [[ "$1" == "--force" ]]; then
	FORCE=true
fi

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
	echo "❌ Error: ffmpeg is not installed"
	echo "Install with: brew install ffmpeg"
	exit 1
fi

# Check if audio directory exists
if [[ ! -d "$AUDIO_DIR" ]]; then
	echo "❌ Error: Audio directory not found: $AUDIO_DIR"
	exit 1
fi

# Convert MP3 files to OGG
echo "🎵 Converting MP3 files to OGG in $AUDIO_DIR/"
echo ""

converted=0
skipped=0

for mp3_file in "$AUDIO_DIR"/*.mp3; do
	# Skip if no MP3 files found
	if [[ ! -f "$mp3_file" ]]; then
		echo "No MP3 files found in $AUDIO_DIR/"
		exit 0
	fi

	# Get basename without extension
	basename=$(basename "$mp3_file" .mp3)
	ogg_file="$AUDIO_DIR/${basename}.ogg"

	# Check if OGG already exists
	if [[ -f "$ogg_file" ]] && [[ "$FORCE" == false ]]; then
		echo "⏭️  Skipping $basename.mp3 (OGG already exists)"
		((skipped++))
		continue
	fi

	# Convert using ffmpeg
	# -i: input file
	# -vn: disable video (skip album art/embedded images)
	# -c:a libopus: use Opus codec (better than Vorbis, modern standard)
	# -b:a 96k: bitrate (96kbps is good for speech/music, adjust as needed)
	# -y: overwrite output file if exists
	echo "🔄 Converting $basename.mp3 → $basename.ogg"
	ffmpeg -i "$mp3_file" -vn -c:a libopus -b:a 96k -y "$ogg_file" -loglevel error

	# Show file sizes
	mp3_size=$(du -h "$mp3_file" | cut -f1)
	ogg_size=$(du -h "$ogg_file" | cut -f1)
	echo "   MP3: $mp3_size → OGG: $ogg_size"
	echo ""

	((converted++))
done

echo "✅ Done!"
echo "   Converted: $converted files"
echo "   Skipped: $skipped files"
