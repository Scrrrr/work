#include"functions.h"

#define BASE_DIR "/var/www/html/SCTS/"
#define USER_STATE_DIR BASE_DIR "api/user_states"

static void render_once(void)
{
    FILE *rocky = fopen(BASE_DIR "assets/source/installRocky.html", "r");
    FILE *ubuntu = fopen(BASE_DIR "assets/source/installUbuntu.html", "r");
    int RockyQuestionNum  = rocky ? GetQuestionCount(rocky) : 0;
    int UbuntuQuestionNum = ubuntu ? GetQuestionCount(ubuntu) : 0;
    if (rocky) fclose(rocky);
    if (ubuntu) fclose(ubuntu);

    DIR *dir = opendir(USER_STATE_DIR);
    if (dir) {
        struct dirent *entry;
        while ((entry = readdir(dir)) != NULL) {
            if (entry->d_name[0] == '.') continue;
            if (!has_suffix(entry->d_name, "_state.json")) continue;

            char username[256];
            username_from_filename(entry->d_name, username, sizeof(username));

            char path[1024];
            snprintf(path, sizeof(path), USER_STATE_DIR "/%s", entry->d_name);

            int rocky_cnt = 0, ubuntu_cnt = 0;
            count_answers_file(path, &rocky_cnt, &ubuntu_cnt);

            int rocky_pct = (RockyQuestionNum > 0) ? (rocky_cnt * 100 / RockyQuestionNum) : 0;
            int ubuntu_pct = (UbuntuQuestionNum > 0) ? (ubuntu_cnt * 100 / UbuntuQuestionNum) : 0;

            printf("\n---------------  %s  -------------------\n", username);
            printf("Rocky   "); print_bar10(rocky_pct);
            printf("Ubuntu  "); print_bar10(ubuntu_pct);
        }
        closedir(dir);
    }
}

int main(void)
{
    while (1) {
        system("clear");
        render_once();
        sleep(1);
    }
    return 0;
}