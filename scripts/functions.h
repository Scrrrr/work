#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<dirent.h>
#include<stdbool.h>
#include<unistd.h>

int GetQuestionCount(FILE *fp)
{
    int count = 0;
    char line[1024];
    int in_php = 0; // 0: まだ, 1: <?php 以降, 2: ?> 到達後

    rewind(fp);
    while (fgets(line, sizeof(line), fp) != NULL) {
        if (!in_php) {
            if (strstr(line, "<?php") != NULL) {
                in_php = 1;
            }
            continue;
        }

        if (strstr(line, "?>") != NULL) {
            break; // 最初の PHP ブロック終端で終了
        }

        // PHP ブロック内のみカウント
        if (strstr(line, "rocky_question_") != NULL || strstr(line, "ubuntu_question_") != NULL) {
            count++;
        }
    }
    return count;
}

static bool has_suffix(const char *s, const char *suffix)
{
    size_t ls = strlen(s), lt = strlen(suffix);
    return ls >= lt && strcmp(s + (ls - lt), suffix) == 0;
}

static void username_from_filename(const char *fname, char *out, size_t outsz)
{
    // fname は "<user>_state.json" を想定
    snprintf(out, outsz, "%s", fname);
    char *p = strstr(out, "_state.json");
    if (p) *p = '\0';
}

static void count_answers_file(const char *filepath, int *rocky_cnt, int *ubuntu_cnt)
{
    *rocky_cnt = 0; *ubuntu_cnt = 0;
    FILE *fp = fopen(filepath, "r");
    if (!fp) return;
    char buf[4096];
    size_t n = fread(buf, 1, sizeof(buf)-1, fp);
    buf[n] = '\0';
    fclose(fp);
    // とても単純な検出（JSON ライブラリ不要）
    const char *p = buf;
    while ((p = strstr(p, "rocky_question_")) != NULL) { (*rocky_cnt)++; p += 1; }
    p = buf;
    while ((p = strstr(p, "ubuntu_question_")) != NULL) { (*ubuntu_cnt)++; p += 1; }
}

static void print_bar10(int pct)
{
    if (pct < 0) pct = 0; if (pct > 100) pct = 100;
    int stars = pct / 10;
    int spaces = 10 - stars;
    printf("[");
    for (int i = 0; i < stars; i++) printf("*");
    for (int i = 0; i < spaces; i++) printf(" ");
    printf("]  (%%%d)\n", pct);
}