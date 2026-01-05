#!/bin/bash
echo "Checking gzipped sizes of all project pages..."
echo ""
echo "Project Page Sizes (gzipped):"
echo "=============================="
for dir in _site/projects/*/; do
    if [ -f "$dir/index.html" ]; then
        size=$(gzip -c "$dir/index.html" | wc -c)
        name=$(basename "$dir")
        kb=$(echo "scale=2; $size/1024" | bc)
        if (( size >= 10240 )); then
            status="✓ OK"
        else
            status="✗ TOO SMALL"
        fi
        printf "%-40s %6d bytes (%5.2f KB) %s\n" "$name" "$size" "$kb" "$status"
    fi
done | sort -k2 -rn
echo ""
echo "Summary:"
total=$(find _site/projects -name "index.html" | wc -l | tr -d ' ')
above_10k=$(for dir in _site/projects/*/; do [ -f "$dir/index.html" ] && gzip -c "$dir/index.html" | wc -c; done | awk '$1 >= 10240' | wc -l | tr -d ' ')
echo "Total project pages: $total"
echo "Pages >= 10KB: $above_10k"
echo "Pages < 10KB: $((total - above_10k))"
