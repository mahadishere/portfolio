#!/bin/bash
echo "Checking LIVE gzipped sizes from mahadmufti.com..."
echo ""
echo "Project Page Sizes (gzipped, live):"
echo "===================================="

projects=(
  "360lens"
  "3d-modeling"
  "3d-visualisations"
  "ai-furniture-designer"
  "anomaly-detection-in-mri-images"
  "cheater-identification-in-online-games"
  "clothing-shop-virtual-tour"
  "find-my-ball"
  "hotspring"
  "intelligent-pdf-summarization"
  "marina-yachts-virtual-tour"
  "mozaico"
  "road-crack-segmentation"
  "solidvr"
  "spaceship-attack-shooter"
  "stem-buddies"
  "vr-cabin-virtual-tour"
  "zombie-tag-royale"
)

results=()
for project in "${projects[@]}"; do
  if curl -sk --compressed -o /tmp/${project}.html https://mahadmufti.com/projects/${project}/ 2>/dev/null; then
    size=$(gzip -c /tmp/${project}.html | wc -c)
    kb=$(echo "scale=2; $size/1024" | bc)
    if (( size >= 10240 )); then
      status="✓ OK"
    else
      status="✗ TOO SMALL"
    fi
    results+=("$size|$kb|$project|$status")
    rm /tmp/${project}.html
  else
    results+=("0|0.00|$project|✗ FAILED")
  fi
done

printf "%-40s %8s %8s %s\n" "Project" "Bytes" "KB" "Status"
echo "----------------------------------------------------------------------------"
for result in "${results[@]}"; do
  IFS='|' read -r size kb project status <<< "$result"
  printf "%-40s %8d %8s %s\n" "$project" "$size" "$kb" "$status"
done | sort -k2 -rn

echo ""
echo "Summary:"
total=${#projects[@]}
above_10k=$(printf '%s\n' "${results[@]}" | awk -F'|' '$1 >= 10240' | wc -l | tr -d ' ')
below_10k=$((total - above_10k))
echo "Total project pages checked: $total"
echo "Pages >= 10KB: $above_10k"
echo "Pages < 10KB: $below_10k"
