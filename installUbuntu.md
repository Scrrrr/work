# Ubuntuのインストール
UbuntuはLinuxディストリビューションの中でもサーバ向け、デスクトップ向け共に人気の高いディストリビューションです。これからUbuntuをコンピュータにインストールしてメールサーバ、ウェブサーバの機能を持ったサーバを構築していきます。
今回インストールするバージョンはUbuntu 22.04.2 - Desktopです。

:::note
本マニュアルの各所に確認用の質問が配置されています。正解すると、本文中の伏せ字が自動で解放され、続きが読めるようになります。答えに迷ったら、**Firefoxでキーワード検索して調べてください。**

試しに下の質問に答えてください。
{question:Linuxをカタカナで入力してください}{answer:リナックス}

質問への回答は何回でもできます。
もしも、最初の回答から3分経過してもわからない場合は、**「解答を表示する」ボタン**が現れます。
**!!一度も回答しないと3分経過してもボタンは表示されません!!**
:::

## 言語の選択
使用する言語を選択します。デフォルトでは日本語に設定されています。
使用する言語に併せて、左のリストを下にスクロールして、言語を選択してください。
言語が選択出来たら**[ Ubuntuをインストール ]**を選択します。

## キーボードレイアウトの設定
キーボードの配列を設定します。
デフォルトでは日本語配列になっています。
問題がなければ、**[続ける]**を選択します。

## アップデートと他のソフトウェア
**[通常のインストール]**を選択し、**[続ける]**を選択します。

## インストールの種類
**[ディスクを削除してUbuntuをインストール]**を選択し、**[インストール]**を選択します。

**[ディスクに変更を書き込みますか？]**というウィンドウが出現します。問題がなければ、**[続ける]**を選択します。

## どこに住んでいますか
時刻の設定をします。  
世界地図で日本にピンが刺されてあり、下の入力欄に「Tokyo」とあったら[続ける]を選択します。

## あなたの情報を入力してください
表示された項目を以下の表から設定してください。
|auto|
|項目|入力値|
|あなたの名前|tome  |
|コンピュータの名前|{{serverHostname}}  |
|ユーザ名の入力|tome  |
|パスワードの入力|netsys00|
|パスワードの確認|netsys00|
[ログイン時にパスワードを要求する]にチェックを付けて[続ける]を選択します。

## インストールの開始
インストールの準備が完了すると、インストールが開始されます。
インストールにしばらくかかります。

インストールが完了すると[インストールが完了しました]というポップアップと共に、再起動を促されます。

**[今すぐ再起動する]**を選択して再起動を行います。

:::note
Ubuntuのロゴとロードマークが表示されながら「Please remove the installation medium, then press ENTER:(インストールメディアを取り出し、ENTER キーを押してください。)」と表示されます。指示通り、Enterを押すとマシンが完全に停止します。
:::

SCTSのメニューより、「インストールサーバの起動」からUbuntuを選択して再び起動してください。

# 基本設定

## ログイン
起動が完了すると、ログイン画面が表示されます。

中央のアイコン`tome`をクリックして、設定したパスワード`netsys00`を入力してEnterを押してログインします。

## 初期セットアップウィンドウ
初めてログインをすると、Livepathchセキュリティのセットアップが表示されます。
左の[次へ]をクリックして[完了]を押してください。

## 端末の起動
左下端の[アプリケーション]アイコンをクリックして項目の中から[端末]をクリックします。または[検索キーワード入力]から[Terminal]と入力して[端末]をクリックしします。

:::hint
`Ctrl+Alt+T`でもターミナルが開けます
:::

## root パスワードの設定
端末を開き、root のパスワードを設定します。
rootのパスワードは`netsys00`に設定します。

{question:一般ユーザが管理者権限でコマンドを実行するとき使用するコマンドは何ですか？}{answer:sudo}{hint:super user do の略}

```bash
tome@{{serverHostname}}:~$ sudo passwd root
tomeのパスワード:
新しいパスワード:
新しいパスワードを再入力してください:
```
:::caution
パスワードの入力中は文字が何も表示されません。
キーボードで入力したら、Enterを押してください。
:::

## rootユーザにログイン
現在はtomeにログインしていますが、今後、rootで作業するために、rootにログインを行います。
```bash
tome@{{serverHostname}}:~# su -
パスワード:
root@{{serverHostname}}:~#
```
root権限ではシェルの記号が`$`から`#`に表記が変わります。
root権限ではシステムの全ての権限を保持しているので、慎重に操作してください。

## ネットワークの設定
nmtuiを起動してネットワークの設定を行います。
```bash
root@{{serverHostname}}:~# nmtui
```

`接続の編集`->`編集`でネットワークの設定ファイルの編集を行います。
:::hint
TUI(Terminal User Interface)での操作は主に`Tabキー`,`矢印キー`,`Enterキー`で操作します。
:::

**IPv4の設定**の`**自動**`を[Enter]して`**手作業**`に変更します。
右の`**<表示する>**`にカーソルを合わせて[Enter]を押します。

次の項目に以下を記入します。
|項目名|入力値|
|アドレス|{{serverIP}}|
|ゲートウェイ|{{gatewayIP}}|
|DNSサーバー|{{gatewayIP}}|
|検索ドメイン|netsys.cs.t-kougei.ac.jp
|検索ドメイン|cs.t-kougei.ac.jp
|検索ドメイン|t-kougei.ac.jp

次に**IPv6の設定**の`**自動**`を[Enter]して`**無効**`に変更します。

すべての設定が終わったら、一番下の`**<ＯＫ>**`を選択して、[Enter]を押します。
`**<戻る>**`を押して、一番最初に戻ります。

### ホスト名の設定
`nmtui`の一番最初のオプション選択メニューから`システムのホスト名を設定する`を選択します。
ホスト名を`{{serverHostname}}`を`{{serverHostname}}.netsys.cs.t-kougei.ac.jp`に変更して`**<ＯＫ>**`を[Enter]します。

「ホスト名を'{{serverHostname}}.cs.t-kougei.a.cjp'に設定します」と表示されたら完了です。`**<ＯＫ>**`を[Enter]します。

すべての設定が完了したら一番最初のオプション選択メニューの最後にあ`**<ＯＫ>**`を[Enter]します。

### ネットワークの設定の確認
`ip`コマンドを使用して正しくネットワークに接続できているか確認します。
```bash
root@{{serverHostname}}:~# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
…
2: enp1s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 52:54:00:62:e8:57 brd ff:ff:ff:ff:ff:ff
    inet {{serverIP}}/24 brd 10.10.1.255 scope global noprefixroute enp1s0
       valid_lft forever preferred_lft forever
```

ネットワークデバイス、`enp1s0`の`inet`が`{{serverIP}}/24`とあれば正しく設定されています。
また、enp1s0にipv6の項目がなければ、ipv6を無効に設定できています。

### ホスト名の設定の確認
```bash
root@{{serverHostname}}:~# cat /etc/hostname
```
これでホスト名が正しく表示されたら設定は完了です。

## NTPの設定
デフォルトではヨーロッパのNTPサーバに接続されているため、学内に設置された`ntp-a.t-kougei.ac.jp`に接続するように設定します。

### 設定ファイルディレクトリの作成
NTPプロトコルはSystemdが管理しています。`timesyncd.conf.d`を作成するとで、設定ファイルを設置できるようにします。
```bash
root@{{serverHostname}}:~# mkdir -p /etc/systemd/timesyncd.conf.d/
```

### 設定ファイルの作成
viで新たにNTPの設定ファイル`ntp-kougei.conf`を作成します。
```bash
root@{{serverHostname}}:~# vi /etc/systemd/timesyncd.conf.d/ntp-kougei.conf
```

```{file=/etc/systemd/timesyncd.conf.d/ntp-kougei.conf}
[Time]
NTP=ntp-a.t-kougei.ac.jp
```

### systemd-timesyncdの再起動
{question:Linuxのシステムを管理するソフトsystemdを操作するコマンドは何でしょうか}{answer:systemctl}{hint:systemd + control}
`systemdctl`コマンドで`systemd-timesyncd`を再起動します。
```bash
root@{{serverHostname}}:~# systemctl restart systemd-timesyncd
```

### NTPの接続確認
`timedatectl`コマンドで大学のNTPサーバに接続しているか確認します。
```bash
root@{{serverHostname}}:~# timedatectl timesync-status
       Server: 192.168.16.188 (ntp-a.t-kougei.ac.jp)
Poll interval: 1min 4s (min: 32s; max 34min 8s)
         Leap: normal
      Version: 4
      Stratum: 2
    Reference: 96640107
    Precision: 1us (-26)
Root distance: 2.700ms (max: 5s)
       Offset: +26.200ms
        Delay: 336us
       Jitter: 0
 Packet count: 1
    Frequency: +191.938ppm
```
[Server]の項目行に`ntp-a.t-kougei.ac.jp`が記述されていれば完了です。


## 各ツール別のプロキシ設定

### NetworkMangaerのプロキシ設定
右上の電源アイコンをクリックして、表示された項目欄から[設定]を選択します。
ネットワークの設定項目のうち`ネットワークプロキシ`をの歯車マークをクリックします。
**無効**から**手動**に変更して、以下の項目を入力します。
| 項目名           | 入力値                   | ポート|
| HTTPプロキシ     | proxy-a.t-kougei.ac.jp   | 8080  |
| HTTPSプロキシ    | proxy-a.t-kougei.ac.jp   | 8080  |
| FTPプロキシ      | proxy-a.t-kougei.ac.jp   | 8080  |
| Socksホスト      | proxy-a.t-kougei.ac.jp   | 8080  |
| 次のホストを無視する    | *.t-kougei.ac.jp  | -     |

入力が完了したら×で閉じます。
設定ウィンドウも×で閉じます。

### Bashのプロキシ設定
再び端末に戻って設定を行います。  
新たに`/etc/profile.d/proxy.sh`ファイルを作成してプロキシ設定を記述します。

```bash
root@{{serverHostname}}:~# vi /etc/profile.d/proxy.sh
```

:::hint
viエディタは通常モードで「h」で左に移動、「j」で下に移動、「k」で上に移動、「l」で右に移動。  
「i」で入力モードに切り替える。「Esc」を押して通常モードに戻る。
通常モードで「:w」で保存「:q」で終了、「:wq」で保存して終了。
:::  

```{file=/etc/profile.d/proxy.sh}
HTTP_PROXY=http://proxy-a.t-kougei.ac.jp:8080
HTTPS_PROXY=http://proxy-a.t-kougei.ac.jp:8080

http_proxy=http://proxy-a.t-kougei.ac.jp:8080
https_proxy=http://proxy-a.t-kougei.ac.jp:8080
```

`source`コマンドで作成した設定ファイルを読み込ませます。

```bash
root@{{serverHostname}}:~# source /etc/profile.d/proxy.sh
```
### aptのプロキシ設定
{question:Debian系Linuxで使用される高機能なパッケージマネージャのコマンドはなんですか？}{answer:apt}{hint:advanced package toolの略}
`/etc/apt/apt.conf.d`の配下に`30proxy.conf`ファイルを新たに作成します。
```bash
root@{{serverHostname}}:~# vi /etc/apt/apt.conf.d/30proxy.conf
```

ファイルに以下を記述します。

```{file=/etc/apt/apt.conf.d/30proxy.conf}
Acquire::http::Proxy "http://proxy-a.t-kougei.ac.jp:8080";
Acquire::https::Proxy "http://proxy-a.t-kougei.ac.jp:8080";
```

### パッケージの更新とインストール
以下のコマンでアップデート可能なパッケージ情報を更新します。
```bash
root@{{serverHostname}}:~# apt update
```
先頭にステータスが表示されます。**取得**と表示されていれば既存のリポジトリからパッケージの更新がされていることを意味します。
**取得**の文字が確認できたら成功です。

:::note
パッケージの更新後に、「ソフトウェアの更新」というポップアップがされる時があります。**「後で通知する」**を選択して、消しましょう。
:::

パッケージのアップグレードをします。
以下のコマンで、パッケージを更新します。
```bash
root@{{serverHostname}}:~# apt upgrade -y
```
:::note
アップグレードには時間がかかるので気長に待ちましょう
:::

# メールサーバの構築

メールサーバはメールの送受信を行うためのサーバです。  
メールの送信には**Postfix**が、受信には**Davcot**が使用されます。  

## Postfix
Postfixは、オープンソースのメール転送エージェント(MTA: Mail Transfer Agent)で、電子メールの送信・配送を担当するサーバソフトウェアです。

### Postfix のインストール

```bash
root@{{serverHostname}}:~# apt install -y postfix
```

インストール中に[パッケージの設定]が表示されます。
完了を押し、**[インターネットサイト]**を選択し、設定してたホスト名が記述されているか確認して**<了解>**を選択します。

### postfixの設定
postfixの設定ファイルである`/etc/postfix/main.cf`を`vi`エディタで編集します。

```bash
root@{{serverHostname}}:~# vi /etc/postfix/main.cf
```

以下の設定を行います。

```{file=/etc/postfix/main.cf}
relayhost = +[[[smtp-a.t-kougei.ac.jp]]]
-[[mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128]]
+[[#mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128]]
mynetworks = 10.10.0.0/16
-[[#inet_protocols = all]]
+[[inet_protocols = ipv4]]
+[[home_mailbox = Maildir/]]
```

{question:postfixのディレクティブについて、メールを指定したサーバに転送するディレクティブは何でしょうか}{answer:relayhost}{hint:メールをリレーさせる}

### postfixの設定の反映
`systemctl`コマンドでpostfixを再起動します。

```bash
root@{{serverHostname}}:~# systemctl restart postfix
```

また、サーバの再起動後もサービスが開始されるように設定します。
```bash
root@{{serverHostname}}:~# systemctl enable postfix
```

## ファイアウォールの設定
{question:Ubuntuで簡単にファイアウォールを設定するコマンドは何でしょうか}{answer:ufw}{hint:uncomplicated firewallの略}
`ufw`コマンドでファイアウォールを設定します。

### ufwの有効化
はじめに、ufwをアクティブに変更します。
```bash
root@{{serverHostname}}:~# ufw enable
ファイアウォールはアクティブかつシステムの起動時に有効化されます。
```

ufwがアクティブな状態になっているか確認します。
```bash
root@{{serverHostname}}:~# ufw status
状態: アクティブ
```
状態がアクティブであれば完了です。

### 許可するサービスの追加
外部からの接続を許可するサービスを指定します。今回追加するサービスはsmtpとpop3です。以下のようにして許可をします。
```bash
root@{{serverHostname}}:~# ufw allow smtp
ルールを追加しました
ルールを追加しました(v6)
```

### ファイアウォールの設定項目の確認
`status`オプションで現在のファイアウォールの設定を確認します。
項目Toの`25`のAction項目が`ALLOW`であり、なおかつFromの項目が`Anywhere`であれば成功です。

```bash

root@{{serverHostname}}:~# ufw status
状態: アクティブ

To                         Action      From
--                         ------      ----
25/tcp                     ALLOW       Anywhere                  
25/tcp (v6)                ALLOW       Anywhere (v6)             
```

## クライアントからの動作確認

### クライアントの起動とログイン

クライアントを起動して`mail`コマンドをインストールしてメールの送信テストをします。

SSCTSメニューから、**[仮想コンピュータの操作]**をクリック。**[Client]**の**[制御]**をクリックし、**[起動]**をクリックしてクライアントを起動します。

ユーザ名は`root`。パスワードは`netsys00`でログインします。

### クライアントのrelayhostを指定。
クライアントのPostfixのメール配送先を構築したサーバに変更します。
```bash
root@{{clientHostname}}:~# vi /etc/postfix/main.cf
```

main.cfにある既存の`relayhost`ディレクティブを全てコメントアウトし、新しく構築したサーバを追加します。

```{file=/etc/postfix/main.cf}
#relayhost = [smtp-a.t-kougei.ac.jp]
relayhost = [{{serverHostname}}.netsys.cs.t-kougei.ac.jp]
```

### mailコマンドでtomeに送信 
ターミナルを起動して、`mail`コマンドでtomeに「test」というメッセージを送ります。  
```bash
root@{{clientHostname}}:~# echo "test" | mail tome@{{serverHostname}}.netsys.cs.t-kougei.ac.jp
```

サーバの`/home/tome/Maildi/new`ディレクトリに新しくファイルが作成されており、ファイルの内容が「test」とあれば、成功です。
```bash
root@{{serverHostname}}:~# ls /home/tome/Maildir/new/
```

### 外部ネットワークへのメール送信確認
サーバ外にメールが届くかテストを行います。
クライアントから自分の大学用のメールアドレスにメールを送信してメールが届くか確認します。
```bash
root@{{clientHostname}}:~# echo "test" | mail <学籍番号>@st.t-kougei.ac.jp
```

自分の大学用のメールボックスにrootから「test」というメッセージが来ていたら成功です。

:::note
もしも以下のコマンドを実行した結果、パラメータの値が表と合致していたらメールが届いてなくても成功です。
```bash
root@{{serverHostname}}:~# 
grep "st.t-kougei.ac.jp" /var/log/mail.log | tail -1 | egrep 'to=|relay=|status="
```

|auto|
|パラメータ|値|
|to|大学用のメールアドレス|
|relay|smtp-a.t-kougei.ac.jp|
|status|sent|

:::


## Dovecot（POP3）
Dovecotは、IMAPおよびPOP3の両方のプロトコルに対応したオープンソースのメール受信サーバです。

### Dovecotのインストール
```bash
root@{{serverHostname}}:~# apt install -y dovecot-core dovecot-pop3d
```

### Dovecotの設定
Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-ssl.conf`ファイルをviエディタで開きます。
```bash
root@{{serverHostname}}:~# vi /etc/dovecot/conf.d/10-ssl.conf
```

SSLを無効にします。

{question:DeovecotでSSLを無効にするにはどのような設定を記述しますか？ディレクティブ名とパラメータを入力してください(イコールの前後にスペースを開けてください)}{answer:ssl = no}{hint:「10-ssl.conf ssl 無効」でWeb検索}

`ssl = no`をコメントアウトし、`ssl = yes`を追記します。
```
-[[ssl = no]]
+[[#ssl = no]]
+[[ssl = yes]]
```
Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-auth.conf`ファイルをviエディタで開きます。

```bash
root@{{serverHostname}}:~# vi /etc/dovecot/conf.d/10-auth.conf
```

コメントアウトを外してプレーンテキスト認証を許可します。

```
#disable_plaintext_auth = yes
+[[disable_plaintext_auth = no]]
```

Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-mail.conf`ファイルをviエディタで開きます。

```bash
root@{{serverHostname}}:~# vi /etc/dovecot/conf.d/10-mail.conf
```

`mail_location` を `maildir:~/Maildir` に変更します。

```markdown
-[[mail_locatoin = mbox:~/mail:IBBOX=/var/mail/%u]]
+[[#mail_locatoin = mbox:~/mail:IBBOX=/var/mail/%u]]
+[[mail_location = maildir:~/Maildir]]
```

### Dovecotの設定の反映
`systemctl`コマンドでdovecotを再起動します。

```bash
root@{{serverHostname}}:~# systemctl restart dovecot
```

また、サーバの再起動後もサービスが開始されるように設定します。
```bash
root@{{serverHostname}}:~# systemctl enable dovecot
```

## ファイアウォールの設定
`ufw`コマンドでファイアウォールを設定します。

### 許可するサービスの追加
外部からの接続を許可するサービスを指定します。今回追加するサービスはpop3です。以下のようにして許可をします。
```bash
root@{{serverHostname}}:~# ufw allow pop3
ルールを追加しました
ルールを追加しました(v6)
```

### ファイアウォールの設定項目の確認
`status`オプションで現在のファイアウォールの設定を確認します。
項目Toの`110`のAction項目が`ALLOW`であり、なおかつFromの項目が`Anywhere`であれば成功です。

```bash

root@{{serverHostname}}:~# ufw status
状態: アクティブ

To                         Action      From
--                         ------      ----
25/tcp                     ALLOW       Anywhere                  
110/tcp                    ALLOW       Anywhere                  
25/tcp (v6)                ALLOW       Anywhere (v6)             
110/tcp (v6)               ALLOW       Anywhere (v6) 
```

## クライアントからの動作確認
{{clientHostname}}を起動して、Clientから`telnet`コマンドを使用してメールの受信を確認します。

```bash
root@client1:~$ telnet {{serverHostname}} 110
Trying {{serverIP}}...
Connected to {{serverHostname}}.
Escape character is '^]'.
+[[+OK Dovecto (Ubuntu) ready.]]
```
`+OK Dovecto (Ubuntu) ready.`という情報から、Dovecotに接続できたことが確認できました。


### メールの内容を確認する
telnetでDovecotコマンドを入力します。
始めに、`USER`と`PASS`を指定してログインを行います。
```
USER tome
+OK
PASS netsys00
+OK Logged in.
```
`+OK Logged in.`が表示されればログインされます。

```bash
list
+OK 1 message:
1 516
```

`+OK 1 message:`というメッセージから1件のメールがあることが確認できます。
`1 516`はメール番号とメールのサイズをバイトで表しています。

```bash
retr 1
+OK 516 octets
Return-Path: root@{{serverHostname}}.netsys.cs.t-kougei.ac.jp
X-Original-TO: tome
<略>
```

:::hint
telnetから抜けるには`quit`を入力して抜ける。
```bash
…
+OK Dovecto (Ubuntu) ready.
quit
221 2.0.0 Bye
Connection closed by foreign host.
```
:::

送信したメールが表示されればメールサーバの構築は完了です。

# WEBサーバの構築

## Apache2のインストール

`apt`コマンドでapache2をインストールします。

```bash
root@{{serverHostname}}:~# apt install -y apache2
```

## Apache2の設定
apache2の設定ファイルを記述します。作成するサイトの設定ファイルは`mywebsite.conf`とします。

{question:apache2で新たにウェブサイトを作成するとき、どこのディレクトリに設定ファイルを作成しますか。(絶対パスで入力)}{answer:/etc/apache2/sites-available}{hint:「利用可能なWebサイトの固有設定をおくディレクトリ apach2」でWeb検索}
```bash
root@{{serverHostname}}:~# vi /etc/apache2/sites-available/mywebsite.conf
```

サーバの名前を記載します。
```{file=/etc/apache2/sites-available/mywebsite.conf}
ServerName {{serverHostname}}.netsys.cs.t-kougei.ac.jp
```

作成した設定ファイル`a2ensite`コマンドでを有効化します。
{question:apache2で作成したウェブサイトの設定ファイルを有効化するコマンドは何でしょうか}{answer:a2ensite}{hint:コマンドの先頭は「a2」から始まる}

```bash
root@{{serverHostname}}:~# a2ensite mywebsite
```

`systemctl`コマンドでApache2の設定を再読み込みします。
```bash
root@{{serverHostname}}:~# systemctl reload apache2
```

## コンテンツの設置
サーバが提供するコンテンツを`/var/www/html/`に設置します。既に`index.html`は存在しているので、内容を削除して新たに内容を書きます。

```bash
root@{{serverHostname}}:~# vi /var/www/html/index.html
```

:::hint
viでは`:%d`で文字の全削除することができる。
:::

```{file=/var/www/html/index.html}
hello world
```

## サーバでの動作確認
実際にhello worldが表示されるか確認します。

左下のアプリケーションをクリックして検索バーから`Firefox`と入力して提示されたアプリケーションを起動します。

ナビゲーションバーに[http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp](http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp)を入力してアクセスします。

真っ白な背景にhello worldと表示されていればサーバからの確認は成功です。

## ファイアウォールの設定
`ufw`コマンドでファイアウォールを設定します。
```bash
root@{{serverHostname}}:~# ufw allow http
```
:::note
もしPostfixでufwをアクティブにしていない場合、以下のコマンドでアクティブにします。
```bash
root@{{serverHostname}}:~# ufw enable
```
:::

### ファイアウォールの設定項目の確認
```bash

root@{{serverHostname}}:~# ufw status
状態: アクティブ

To                         Action      From
--                         ------      ----
25/tcp                     ALLOW       Anywhere                  
110/tcp                    ALLOW       Anywhere                  
80/tcp                     ALLOW       Anywhere                  
25/tcp (v6)                ALLOW       Anywhere (v6)             
110/tcp (v6)               ALLOW       Anywhere (v6) 
80/tcp (v6)                ALLOW       Anywhere (v6) 
```

`80/tcp`が追加されていればファイアウォールの設定は完了です。

## クライアントからの動作確認
{{clientHostname}}を起動して、WEBサーバにアクセスできるか確認します。  

{{clientHostname}}を起動したらFirefoxから[http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp](http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp)にアクセスしてます。

サーバでの確認と同様に真っ白な背景にhello worldと表示されていればクライアントからの確認は成功です。