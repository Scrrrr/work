#!/usr/bin/env bash

targetdir="/home/user/ドキュメント/work/api/user_states"
logdir="$targetdir/logs"
cachedir="/tmp/watch_user_states_cache"

username_from_file() { basename "$1" | cut -d '_' -f 1; }
current_items() { jq -r '.[]' <"$1"; }

log_new_answers() {
  file="$1"; user=$(username_from_file "$file")
  mkdir -p "$logdir" "$cachedir"
  cache_file="$cachedir/${user}.list"
  mapfile -t now_arr < <(current_items "$file" | sort -u)
  if [ -f "$cache_file" ]; then mapfile -t prev_arr < <(sort -u "$cache_file"); else prev_arr=(); fi
  tmp_now=$(mktemp); tmp_prev=$(mktemp)
  printf '%s\n' "${now_arr[@]}" | sort -u >"$tmp_now"
  printf '%s\n' "${prev_arr[@]}" | sort -u >"$tmp_prev"
  mapfile -t added < <(comm -13 "$tmp_prev" "$tmp_now")
  rm -f "$tmp_now" "$tmp_prev"
  ts_disp=$(date '+%Y/%m/%d %H:%M:%S')
  for qid in "${added[@]}"; do echo "$ts_disp,$qid" >>"$logdir/${user}.log"; done
  printf '%s\n' "${now_arr[@]}" >"$cache_file"
}

# 監視: ファイル更新時のみログ追記
if command -v inotifywait >/dev/null 2>&1; then
  inotifywait -m -e close_write,create,move --format '%w%f' "$targetdir" | while read -r changed; do
    [[ "$changed" == *_state.json ]] || continue
    [ -f "$changed" ] || continue
    log_new_answers "$changed"
  done
else

  while true; do
    for file in "$targetdir"/*_state.json; do
      [ -f "$file" ] || continue
      log_new_answers "$file"
    done
    sleep 1
  done
fi