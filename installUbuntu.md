# Ubuntuのインストール
UbuntuはLinuxディストリビューションの中でもサーバ向け、デスクトップ向け共に人気の高いディストリビューションです。これからUbuntuをコンピュータにインストールしてメール、ウェブ、ファイル共有、リモートログイン機能を持ったサーバを構築していきます。
今回インストールするバージョンはUbuntu 24.04.2 - Desktopです。

## インストールする前に
このマニュアルは設定内容と基本説明のみで構成されています。 そのため、コマンドの操作などは実際に調べて設定してもらいます。 コマンドの調べ方は「[コマンドの名前] 操作方法」または「[コマンドの名前] 使い方」で検索してブログ記事やオンラインマニュアルから探してください。

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
左の[次へ]をクリックしてください。
・Livepatchセキュリティ
・Ubuntuの改善
　はい、システム情報をCanonicalに送信します。
・プライバシー位置情報(default:off)
・準備が完了しました→(完了)


### Proxyの設定

設定→ネットワークより、**ネットワークプロキシ**を選択して、無効から**手動**に変更して、以下の項目を入力します。
| 項目名           | 入力値                   | ポート|
| HTTPプロキシ     | proxy-a.t-kougei.ac.jp   | 8080  |
| HTTPSプロキシ    | proxy-a.t-kougei.ac.jp   | 8080  |
| FTPプロキシ      | proxy-a.t-kougei.ac.jp   | 8080  |
| Socksホスト      | proxy-a.t-kougei.ac.jp   | 8080  |
| 次のホストを無視する    | *.t-kougei.ac.jp  | -     |

## 端末の起動
左下端の[アプリケーション]アイコンをクリックして項目の中から[端末]をクリックします。または[検索キーワード入力]から[Terminal]と入力して[端末]をクリックしします。

:::hint
`Ctrl+Alt+T`でもターミナルが開けます
:::

## root パスワードの設定
端末を開き、root のパスワードを設定します。

```bash
tome@{{serverHostname}}:~$ sudo passwd root [Enter]
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
root@{{serverHostname}}:~# ip a [Enter]
```

ネットワークデバイス、`enp1s0`の`inet`が`{{serverIP}}/24`とあれば正しく設定されています。
また、enp1s0にipv6の項目がなければ、ipv6を無効に設定できています。

### ホスト名の設定の確認
```bash
root@{{serverHostname}}:~$ cat /etc/hostname [Enter]
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

パッケージのインストールをします。
```bash
root@{{serverHostname}}:~$ apt install
```
:::note
インストールは時間がかかるので気長に待ちましょう
:::

# Mail サーバ

Mailサーバはメールの送受信を行うためのサーバです。  

## Postfix
メールの送信には**Postfix**が、受信には**Davcot**が使用されます。  

### Postfix のインストール

```bash
tome@{{serverHostname}}:~$ sudo apt -y install postfix
```

インストーラで「インターネットサイト」を選択し、ホスト名を確認します。

### postfixの設定
postfixの設定ファイルである`/etc/postfix/main.cf`を`vi`エディタで編集します。

```bash
tome@{{serverHostname}}:~$ sudo vi /etc/postfix/main.cf
```

以下の設定を行います。

```
myhostname = {{serverHostname}}.netsys.cs.t-kougei.ac.jp
mydomain = netsys.cs.t-kougei.ac.jp
myorigin = $mydomain
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain
relayhost = [smtp-a.t-kougei.ac.jp]
mynetworks = 127.0.0.0/8
inet_interfaces = all
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
tome@{{serverHostname}}:~$ sudo systemctl restart postfix.service
```

### メール転送の設定
`/etc/aliases`ファイルに、 `転送元: 転送先` を指定することでメールを自動的に転送することができます。
```bash
tome@{{serverHostname}}:~$ sudo vi /etc/aliases
```

`/etc/aliases`ファイルに下記を記述します。
```
root: kitamura@st.t-kougei.ac.jp
```

`newaliases`コマンドで、`/etc/aliases`ファイルの設定を反映させます。
```bash
sudo newaliases
```

### メール送受信確認（ローカル）

mailコマンドをインストールしてメールの送信テストをします。

#### mailコマンドのインストール
```bash
tome@{{serverHostname}}:~$ sudo apt -y install mailutils
```

#### mailコマンドでtomeに送信 
`mail`コマンドでtomeに「Test」というメッセージを送ります。  
```bash
tome@{{serverHostname}}:~$ echo "test" | mail tome
```

`/home/tome/Maildi/new`ディレクトリに新しくファイルが作成されており、ファイルの内容が「Test」とあれば、成功です。
```bash
tome@{{serverHostname}}:~$ ls /home/tome/Maildir/new
```

#### SMTP レベルでの確認（任意）:  

`telnet`コマンドでSMTPが起動しているか確認します。
```bash
tome@{{serverHostname}}:~$ telnet localhost 25
> quit
```

## Dovecot（POP3）
Dovecotは、IMAPおよびPOP3の両方のプロトコルに対応したオープンソースのメール受信サーバです。

### Dovecotのインストール
```bash
tome@{{serverHostname}}:~$ sudo apt -y install dovecot-core dovecot-pop3d
```

### Dovecotの設定
Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-ssl.conf`ファイルをviエディタで開きます。
```bash
tome@{{serverHostname}}:~$ sudo vi /etc/dovecot/conf.d/10-ssl.conf
```

SSLを無効にします。

```
ssl = no
```
Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-auth.conf`ファイルをviエディタで開きます。

```bash
tome@{{serverHostname}}:~$ sudo vi /etc/dovecot/conf.d/10-auth.conf
```

プレーンテキスト認証を許可します。

```
disable_plaintext_auth = no
```

Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-mail.conf`ファイルをviエディタで開きます。

```bash
tome@{{serverHostname}}:~$ sudo vi /etc/dovecot/conf.d/10-mail.conf
```

`mail_location` を `maildir` に変更します。

```
# mail_location = mbox:~/mail:INBOX=/var/mail/%u
mail_location = maildir:~/Maildir
```

### Dovecotの設定の反映
`systemctl`コマンドでdovecotを再起動します。

```bash
tome@{{serverHostname}}:~$ sudo systemctl restart dovecot
```

### client1からの POP3 動作確認
cilent1を起動して、client1から
`telnet`コマンドを使用してメールの受信を確認します。

```bash
tome@client1:~$ telnet {{serverHostname}} 110
user tome
pass netsys00
list
retr 1
dele 1
quit
```

# WEBサーバの構築

## apache2のインストール

aptコマンドでapache2をインストールします。

```
root@{{serverHostname}}:~$ apt install apache2
```

## apache2の設定
```bash
root@{{serverHostname}}:~$ vi /etc/apache2/apache2.conf
```

サーバの名前とポート番号を記載します。

```{file=/etc/httpd/conf/httpd.conf}
ServerName {{serverHostname}}.netsys.cs.t-kougei.ac.jp:80
```

## コンテンツの設置
サーバが提供するコンテンツを`/var/www/html/`に設置します。ファイル名は`index.html`とします。

```bash
root@{{serverHostname}}:~$ vi /var/www/html/index.html
```

```{file=/var/www/html/index.html}
hello world
```

### クライアントからの確認