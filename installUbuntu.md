# Ubuntuのインストール
UbuntuはLinuxディストリビューションの中でもサーバ向け、デスクトップ向け共に人気の高いディストリビューションです。これからUbuntuをコンピュータにインストールしてメール、ウェブ、ファイル共有、リモートログイン機能を持ったサーバを構築していきます。
今回インストールするバージョンはUbuntu 22.04.2 - Desktopです。

## ブートローダーの起動
黒い画面が現れたら`「Try or Install Ubuntu」`に矢印キーでカーソルを合わせて[Enter]
しばらくの時間、起動の準備が行われます。

## 言語の選択
使用する言語を選択します。デフォルトでは[日本語]に設定されているます。
使用する言語に併せて、左のリストを下にスクロールして、言語を選択してください。
言語が選択出来たら[ Ubuntuをインストール ]を選択します。

## キーボードレイアウトの設定
キーボードの配列を設定します。
デフォルトでは日本語配列になっています。
問題がなければ、[続ける]を選択します。

## アップデートと他のソフトウェア
[通常のインストール]を選択し、[続ける]を選択します。

## インストールの種類
[ディスクを削除してUbuntuをインストール]を選択し、[インストール]を選択します。

[ディスクに変更を書き込みますか？]というウィンドウが出現します。問題がなければ、[続ける]を選択します。

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

[今すぐ再起動する]を選択して再起動を行います。

:::note
Ubuntuのロゴとロードマークが表示されながら「Please remove the installation medium, then press ENTER:(インストールメディアを取り出し、ENTER キーを押してください。)」と表示されます。指示通り、Enterを押すとマシンが完全に停止します。
:::

SCTSのメニューより、「インストールサーバの起動」からUbuntuを選択して再び起動してください。

# 基本設定

## ログイン
起動が完了すると、ログイン画面が表示されます。

中央のアイコン[tome]をクリックして、設定したパスワード[netsys00]を入力してEnterを押してログインします。

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

```bash
tome@{{serverHostname}}:~$ sudo passwd root
tomeのパスワード:
新しいパスワード:(tomeと同じ)
新しいパスワードを再入力してください:(tomeと同じ)
```
:::caution
パスワードの入力中は文字が何も表示されません。
キーボードで入力したら、Enterを押してください。
:::

## rootユーザにログイン
現在はtomeにログインしていますが、今後、rootで作業するために、rootにログインを行います。
```bash
tome@{{serverHostname}}:~$ su -
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
```hint
nmtuiでは基本、十字キーとEnterキーで操作します。
```

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
ホスト名を`{{serverHostname}}`を`{{serverHostname}}.cs.t-kougei.ac.jp`に変更して`**<ＯＫ>**`を[Enter]します。

「ホスト名を'{{serverHostname}}.cs.t-kougei.a.cjp'に設定します」と表示されたら完了です。`**<ＯＫ>**`を[Enter]します。

すべての設定が完了したら一番最初のオプション選択メニューの最後にあ`**<ＯＫ>**`を[Enter]します。

### ネットワークの設定の確認
ipコマンドを使用して正しくネットワークに接続できているか確認します。
```bash
root@{{serverHostname}}:~# ip a
```

ネットワークデバイス、`enp1s0`の`inet`が`{{serverIP}}/24`とあれば正しく設定されています。
また、enp1s0にipv6の項目がなければ、ipv6を無効に設定できています。

### ホスト名の設定の確認
```bash
root@{{serverHostname}}:~$ cat /etc/hostname
```
これでホスト名が正しく表示された、ホスト名の設定は完了です。

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

### bashのプロキシ設定
再び端末に戻って設定を行います。  
新たに`/etc/profile.d/proxy.sh`ファイルを作成してプロキシ設定を記述します。

```bash
root@{{serverHostname}}:~$ vi /etc/profile.d/proxy.sh
```

:::hint
viエディタは通常モードで「h」で左に移動、「j」で下に移動、「k」で上に移動、「l」で右に移動。  
「i」で入力モードに切り替える。「Esc」を押して通常モードに戻る。
通常モードで「:w」で保存「:q」で終了、「:wq」で保存して終了。
:::  

```
HTTP_PROXY=http://proxy-a.t-kougei.ac.jp:8080
HTTPS_PROXY=http://proxy-a.t-kougei.ac.jp:8080

http_proxy=http://proxy-a.t-kougei.ac.jp:8080
https_proxy=http://proxy-a.t-kougei.ac.jp:8080
```

sourceコマンドで作成した設定ファイルを読み込ませます。

```bash
root@{{serverHostname}}:~$ source /etc/profile.d/proxy.sh
```
### aptのプロキシ設定
```bash
root@{{serverHostname}}:~$ vi /etc/apt/apt.conf
```

以下を記述します。

```
Acquire::http::Proxy "http://proxy-a.t-kougei.ac.jp:8080";
Acquire::https::Proxy "http://proxy-a.t-kougei.ac.jp:8080";
```

### パッケージの更新とインストール
```bash
root@{{serverHostname}}:~$ apt update
```
先頭にステータスが表示されます。**取得**と表示されていれば
既存のリポジトリからパッケージの更新がされていることを意味します。
**取得**の文字が確認できたら成功です。

:::note
パッケージの更新後に、「ソフトウェアの更新」というポップアップがされる時があります。**「後で通知する」**を選択して、消しましょう。
:::

パッケージのアップグレードをします。
```bash
root@{{serverHostname}}:~$ apt upgrade
```
:::note
アップグレードには時間がかかるので気長に待ちましょう
:::

# Mail サーバ

Mailサーバはメールの送受信を行うためのサーバです。  
メールの送信には**Postfix**が、受信には**Davcot**が使用されます。  

## Postfix
Postfixは、オープンソースのメール転送エージェント(MTA: Mail Transfer Agent)で、電子メールの送信・配送を担当するサーバソフトウェアです。

### Postfix のインストール

```bash
root@{{serverHostname}}:~# apt install -y postfix
```

インストール中に[パッケージの設定]が表示されます。
完了を押し、「インターネットサイト」を選択し、設定してたホスト名が記述されているか確認して<了解>を選択します。
:::hint
TUI(Terminal User Interface)での操作は主に`Tabキー`,`矢印キー`,`Enterキー`で操作できます。
:::

### postfixの設定
postfixの設定ファイルである`/etc/postfix/main.cf`を`vi`エディタで編集します。

```bash
root@{{serverHostname}}:~$ vi /etc/postfix/main.cf
```

以下の設定を行います。

```{file=/etc/postfix/main.cf}
relayhost = [smtp-a.t-kougei.ac.jp]
mynetworks = 127.0.0.0/8
inet_protocols = ipv4
home_mailbox = Maildir/
```

参考:
- `myorigin`: 外行きメールに使うドメイン
- `mydestination`: 受信するドメイン
- `mynetworks`: メールリレーを許可するネットワーク

### postfixの設定の反映
`systemctl`コマンドでpostfixを再起動します。

```bash
root@{{serverHostname}}:~$ systemctl restart postfix.service
```

### サーバからメール送受信確認

mailコマンドをインストールしてメールの送信テストをします。

#### mailコマンドのインストール
```bash
root@{{serverHostname}}:~$ apt install -y mailutils
```

#### mailコマンドでtomeに送信 
`mail`コマンドでtomeに「test」というメッセージを送ります。  
```bash
root@{{serverHostname}}:~$ echo "test" | mail tome
```

`/home/tome/Maildi/new`ディレクトリに新しくファイルが作成されており、ファイルの内容が「test」とあれば、成功です。
```bash
root@{{serverHostname}}:~$ ls /home/tome/Maildir/new
```

## ファイアウォールの設定
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

```bash
root@{{serverHostname}}:~# ufw allow pop3
ルールを追加しました
ルールを追加しました(v6)
```

## ファイアウォールの設定項目の確認
`status`オプションで現在のファイアウォールの設定を確認します。
項目Toの`25`,`110`のACTION項目が`ALLOW`であり、なおかつFromの項目が`Anywhere`であれば成功です。

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

### クライアントからの確認
{{clientHostname}}を起動して、SMTPサーバにアクセスできるか確認します。  

```bash
[root@{{clientHostname}} ~]# telnet {{serverHostname}} 25
Trying {{serverIP}}...
Connected to {{serverHostname}}.
Escape character is '^]'.
220 {{serverHostname}}.cs.t-kougei.ac.jp ESMTP Postfix (Ubuntu)
```

一番下の行より、`220 {{serverHostname}}.cs.t-kougei.ac.jp ESMTP Postfix (Ubuntu)`があります。
確認できたら、Postfixの構築は完了です。

## Dovecot（POP3）
Dovecotは、IMAPおよびPOP3の両方のプロトコルに対応したオープンソースのメール受信サーバです。

### Dovecotのインストール
```bash
root@{{serverHostname}}:~$ apt install -y dovecot-core dovecot-pop3d
```

### Dovecotの設定
Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-ssl.conf`ファイルをviエディタで開きます。
```bash
root@{{serverHostname}}:~$ vi /etc/dovecot/conf.d/10-ssl.conf
```

SSLを無効にします。

```
ssl = no
```
Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-auth.conf`ファイルをviエディタで開きます。

```bash
root@{{serverHostname}}:~$ vi /etc/dovecot/conf.d/10-auth.conf
```

コメントアウトを外してプレーンテキスト認証を許可します。

```
#disable_plaintext_auth = yes
+[[disable_plaintext_auth = no]]
```

Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-mail.conf`ファイルをviエディタで開きます。

```bash
root@{{serverHostname}}:~$ vi /etc/dovecot/conf.d/10-mail.conf
```

`mail_location` を `maildir` に変更します。

```markdown
-[[mail_locatoin = mbox:~/mail:IBBOX=/var/mail/%u]]
+[[#mail_locatoin = mbox:~/mail:IBBOX=/var/mail/%u]]
+[[mail_location = maildir:~/Maildir]]
```

### Dovecotの設定の反映
`systemctl`コマンドでdovecotを再起動します。

```bash
root@{{serverHostname}}:~$ systemctl restart dovecot
```

### {{clientHostname}}からMailサーバの確認
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
まず、`USER`と`PASS`でログインを行います。
```
user tome
+OK
pass netsys00
+OK Logged in.
```
`+OK Logged in.`が表示されればログインされます。

```bash
list
+OK 1 message:
1 516
```

`+OK 1 message:`から1件のメールがあることが確認できます。
`1 516`はメール番号とメールのサイズをバイトで表しています。

```bash
retr 1
+OK 516 octets
Return-Path: root@{{serverHostname}}.netsys.cs.t-kougei.ac.jp
X-Original-TO: tome
<略>
```

送信したメールが表示されればメールサーバの構築は完了です。

# WEBサーバの構築

## Apache2のインストール

aptコマンドでapache2をインストールします。

```bash
root@{{serverHostname}}:~$ apt install -y apache2
```

## Apache2の設定
```bash
root@{{serverHostname}}:~$ vi /etc/apache2/apache2.conf
```

サーバの名前を記載します。
コメントアウトされている`ServerName`ディレクティブの下にコメントアウトを外した内容を`{{serverHostname}}.netsys.cs.t-kougei.ac.jp`を追記します。

```{file=/etc/apache2/site-available/000-default.conf}
#ServerName www.example.com
+[[ServerName {{serverHostname}}.netsys.cs.t-kougei.ac.jp]]
```

## コンテンツの設置
サーバが提供するコンテンツを`/var/www/html/`に設置します。既に`index.html`は存在しているので、内容を削除して新たに内容を書きます。

```bash
root@{{serverHostname}}:~$ vi /var/www/html/index.html
```

:::hint
viでは`:%d`で文字の全削除することができる。
:::

```{file=/var/www/html/index.html}
howdy?
```

## サーバでの動作確認
実際にhowdy?が表示されるか確認します。

左下のアプリケーションをクリックして検索バーから`Firefox`と入力して提示されたアプリケーションを起動します。

ナビゲーションバーに[http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp](http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp)を入力してアクセスします。

真っ白な背景にhowdy?と表示されていればサーバからの確認は成功です。

## ファイアウォールの設定
ufwコマンドでファイアウォールを設定します。
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

サーバでの確認と同様に真っ白な背景にhowdy?と表示されていればクライアントからの確認は成功です。