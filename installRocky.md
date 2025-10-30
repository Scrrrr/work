# RockyLinuxとは
RockyLinuxは、サーバ向け用途に特化した安定性の高いLinuxディストリビューションです。これからRockyLinuxをコンピュータにインストールし、メールサーバやウェブサーバとしての機能を持つサーバを構築していきます。
今回インストールするバージョンはRocky Linux 9.5です。

:::note
本マニュアルの各所に確認用の質問が配置されています。正解すると、本文中の伏せ字が自動で解放され、続きが読めるようになります。答えに迷ったら、Firefoxでキーワード検索して調べてください。

試しに下の質問に答えてください。
{question:Linuxを作った人の氏名を英語で答えてください}{answer:Linus Torvalds}

質問への回答は何回でもできます。
もしも、最初の回答から3分経過してもわからない場合は、**「解答を表示する」ボタン**が現れます。
**!!一度も回答しないと3分経過してもボタンは表示されません!!**
:::

## 言語選択
インストールが開始されると言語選択メニューが表示されます。左のメニューの中央付近にある[日本語]を選択し、[続行]を選択します。

## インストール先
システムのインストール先を決定します。
[インストール先]を選択すると自動でインストール先が決定されるので、左上の青いボタンの[完了]をクリックします。

:::note
システムの[インストール先]のアイコンに注意が表示されていたのが消えていればＯＫです。
:::

## Kdump
Kdumpの無効化を行うために、[KDUMP]を選択し、[kdumpを有効にする]のチェックボックスを外し、[完了]を選択します。

## ネットワーク設定
次に、ネットワークの設定を行います。[ネットワークとホスト名]を選択し、左下のホスト名のテキストボックスに`{{serverHostname}}.netsys.cs.t-kougei.ac.jp`を入力します。

ホスト名入力後、[適用]をクリックします。すると、右下に現在のホスト名が表示されます。
:::caution
[適用]をクリックしないと設定が反映されないため注意してください。
:::

さらに、[設定]を選択し、[IPv4の設定]をクリックし、方式を**自動(DHCP)**から**手動**に変更します。

アドレスの[追加]を選択し、以下の項目に値を入力していきます。

|項目名|入力値|
|アドレス|{{serverIP}}|
|ネットマスク|24|
|ゲートウェイ|{{gatewayIP}}|
|DNSサーバー|{{gatewayIP}}|
|ドメインを検索|netsys.cs.t-kougei.ac.jp, cs.t-kougei.ac.jp, t-kougei.ac.jp|

入力が完了したら[保存]を押して閉じます。

入力後、右上のトグルボタンをクリックして有効に切り替えます。

Ethernetが「接続済みです」と表示されていればネットワークの接続は完了です。

左上の[完了]を押します。

## 時刻と日付の設定
地域設定から**[時刻と日付]**を選択します。
左上の**歯車マーク**をクリックして**[使用するNTPサーバの追加]**に`ntp-a.t-kougei.ac.jp`を入力して**[＋]ボタン**を押します。

`ntp-a.t-kougei.ac.jp`の稼働中の項目欄にチェックがあれば追加は完了です。
`ntp-a.t-kougei.ac.jp`の項目欄の一番右の使用中のチェックを入れ、**それ以外の使用中のチェックを外します。**

OKで閉じて、左上の**[完了]**ボタンを押します。

## 追加ソフトウェアの選択
インストールするソフトウェアの選択を行います。[ソフトウェアの選択]を選択し、ベース環境は[サーバー(GUI使用)]を選択します。
選択した環境用のその他のソフトウェアは以下を選択します。
- **メールサーバー**
- **ベーシックWebサーバー**

選択が完了したら、左上の**[完了]**をクリックします。

## rootパスワードの設定
[ユーザーの設定]の**[rootパスワード]**をクリックします。

rootのパスワードには、[netsys00]を入力し、同じく確認でも同じパスワードを入力してください。

入力が完了したら左上の**[完了]**をクリックします。

:::caution
［このパスワードは辞書チェックに失敗しました］と表示されますが、この場合完了を2回クリックします。
:::

## ユーザーの作成
ユーザーtomeを作成します。

|auto|
| 項目名           | 入力値   | 
| フルネーム     | tome     | 
| ユーザー名       | tome     | 
| パスワード       | netsys00 | 
| パスワードの確認 | netsys00 |

入力が完了したら左上の**[完了]**をクリックします。

:::caution
rootのパスワードと同様に［このパスワードは辞書チェックに失敗しました］と表示されますが、この場合完了を2回クリックします。
:::

## インストールの開始
全ての設定項目が完了したら、**[インストールの開始]**を選択します。
:::note
インストールには時間がかかるため、終わるまで待機してください。
:::

インストールが完了したら、[システムの再起動]を選択して、サーバを再起動します。
サーバが停止したら、SCTSメニューより、**[インストールサーバの起動]→[RockyLinux]**でサーバを起動します。

# 基本設定

## ログイン
ライセンスに同意後、ログイン画面が表示されるため、ログインを行います。rootでログインを行うため、[アカウントが見つかりませんか？]を選択しrootでログインします。

|auto|
| 項目名           | 入力値   | 
| ユーザネーム     | root     | 
| パスワード       | netsys00 | 

## 端末の起動
左上の[アクティビティ]をクリック、または`Win`キーを押します。
中央下に表示されているアイコンにカーソルを合わせるとアプリケーション名が表示されるので、そこから[端末]を探します。もしくは、<win>キーを押した後に、[Terminal]と検索して提示された[端末]というソフトを起動します。

## SELinuxの無効化
{question:管理者の権限を分散させて安全性を高めるLinuxのセキュリティ機能はなんですか？}{answer:SELinux}
SELinuxの無効化を行います。

:::warning
この設定にミスがあるとコンピュータが起動しなくなる可能性があるため注意してください。
:::

```bash
root@{{serverHostname}}:~# vi /etc/selinux/config
```

以下を変更:
```
-[[SELINUX=enforcing]]
+[[#SELINUX=enforcing]]
+[[SELINUX=disabled]]
```

:::hint
viエディタは通常モードで「h」で左に移動、「j」で下に移動、「k」で上に移動、「l」で右に移動。  
「i」で入力モードに切り替える。「Esc」を押して通常モードに戻る。
通常モードで「:w」で保存「:q」で終了、「:wq」で保存して終了。

また、通常モードで`/<探したい文字>`で文字検索ができる。検索を辞める時は**Esc**キーを押す。
:::  

## 電源の設定
デフォルトの設定では5分起きにロックされてしまうので、設定で無効にします。

右上の電源アイコンをクリックして、表示された項目欄から**[設定]**をクリックして、設定メニューを起動します。
設定メニューのサイドバー中部にある**[電源]**を見つけクリックし、設定項目の**[Screen Blank]**を`5分`から`Naver`に変更します。

## 各ツール別のプロキシ設定

### NetworkMangaerのプロキシ設定
設定メニューのサイドバー上部にある**[ネットワーク]**を見つけクリックし、設定項目の**ネットワークプロキシ**を見つけ、**歯車マーク**をクリックします。  
**[無効]**から**[手動]**を変更し、次の項目に以下の入力値を入力していきます。

| 項目名           | 入力値                   | ポート|
| HTTPプロキシ     | proxy-a.t-kougei.ac.jp   | 8080  |
| HTTPSプロキシ    | proxy-a.t-kougei.ac.jp   | 8080  |
| FTPプロキシ      | proxy-a.t-kougei.ac.jp   | 8080  |
| Socksホスト      | proxy-a.t-kougei.ac.jp   | 8080  |
| 次のホストを無視する    | *.t-kougei.ac.jp  | -     |

入力が完了したら×で閉じます。
設定メニューも×で閉じます。


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

### dnfのプロキシ設定
{question:RedHat系Linuxで使用される高機能なパッケージマネージャの名前はなんですか？}{answer:dnf}
パッケージマネージャーdnfの設定を行います。

```bash
root@{{serverHostname}}:~# vi /etc/dnf/dnf.conf
```

`skip_if_unavailable=False`の下に以下を記入します。

```{file=/etc/dnf/dnf.conf}
…
best=True
skip_if_unavailable=False
+[[proxy=http://proxy-a.t-kougei.ac.jp:8080]]
+[[timeout=900]]
```

保存して終了後アップデートを行います。

```bash
root@{{serverHostname}}:~# dnf -y update 
```

問題なくアップデートが行われれば、プロキシの設定は完了です。

# メールサーバの構築

メールサーバはメールの送受信を行うためのサーバです。  
メールの送信には**Postfix**が、受信には**Davcot**が使用されます。  

## Postfix
Postfixは、オープンソースのメール転送エージェント(MTA: Mail Transfer Agent)で、電子メールの送信・配送を担当するサーバソフトウェアです。

:::note
OSのインストールで既にPostfixをインストールしていますが、チェック項目を忘れていた場合は以下のコマンドでインストールしてください。

```bash
root@{{serverHostname}}:~# dnf -y install postfix
```
:::

### Postfixの設定

postfixの設定ファイルである`/etc/postfix/main.cf`を`vi`エディタで編集します。

```bash
root@{{serverHostname}}:~# vi /etc/postfix/main.cf
```

以下の設定を行います。
赤色は削除する場所で、緑色は追記する行です。
無地は周辺の設定項目を表しています。

{question:postfixのディレクティブについて、メールを指定したサーバに転送するディレクティブは何でしょうか}{answer:relayhost}

```{file=/etc/postfix/main.cf}
#myhostname = host.domain.tld
#myhostname = virtual.domain.tld
+[[myhostname = {{serverHostname}}.netsys.cs.t-kougei.ac.jp]]

#mydomain = domain.tld
+[[mydomain = netsys.cs.t-kougei.ac.jp]]

#myorigin = $myhostname
#myorigin = $mydomain
+[[myorigin = $mydomain]]

-[[mydestination = $myhostname, localhost.$mydomain, localhost]]
+[[#mydestination = $myhostname, localhost.$mydomain, localhost]]
#mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain
#mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain,
        mail.$mydomain, www.$mydomain, ftp.$mydomain
+[[mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain]]

#relayhost = $mydomain
#relayhost = [gateway.my.domain]
#relayhost = [mailserver.isp.tld]
#relayhost = uucphost
#relayhost = [an.ip.add.ress]
+[[relayhost = [smtp-a.t-kougei.ac.jp]]]

#mynetworks = 168.100.189.0/28, 127.0.0.0/8
#mynetworks = $config_directory/mynetworks
#mynetworks = hash:/etc/postfix/network_table
+[[mynetworks = 10.10.0.0/16]]

#inet_interfaces = all
#inet_interfaces = $myhostname
#inet_interfaces = $myhostname,localhost
-[[inet_interfaces = localhost]]
+[[#inet_interfaces = localhost]]
+[[inet_interfaces = all]]

# Enable IPv4, and IPv6 if supported
-[[inte_protocols = all]]
+[[#inte_protocols = all]]
+[[inte_protocols = ipv4]]

#home_mailbox = Mailbox
#home_mailbox = Maildir/
+[[home_mailbox = Maildir/]]
```

### postfixの設定の反映
{question:Linuxのシステムを管理するソフトsystemdを操作するコマンドは何でしょうか}{answer:systemctl}
`systemctl`コマンドでpostfixを再起動します。

```bash
root@{{serverHostname}}:~# systemctl restart postfix
```

また、サーバの再起動後にサービスを自動起動するように設定します。
```bash
root@{{serverHostname}}:~# systemctl enable postfix
```

## ファイアウォールの設定
{question:RedHat系でデフォルトのファイアウォールであるfirewalldを操作するためのコマンドは何でしょうか}{answer:firewall-cmd}
`firewall-cmd`コマンドでファイアウォールを設定します。

### firewall-cmdの起動確認
初めに、firewall-cmdが起動しているかどうか確認します。
```bash
root@{{serverHostname}}:~# firewall-cmd --state
runnning
```

`runnning`と表示されれば起動しています。

:::hint
もし起動していな場合以下の方法で起動します。
```bash
root@{{serverHostname}}:~# systemctl start firewalld
```
また、自動起動を有効にします。
```bash
root@{{serverHostname}}:~# systemctl enable firewalld
```
:::

### 許可するサービスの追加
外部からの接続を許可するサービスを指定します。今回追加するサービスはsmtpです。以下のようにして許可をします。
```bash
root@{{serverHostname}}:~# firewall-cmd --permanent --add-service=smtp
success
```

コマンドの実行後に`success`が表示されれば、追加に成功しています。

### 許可したサービスの設定を反映させる
追加した設定を以下のコマンドで反映させます。
```bash
root@{{serverHostname}}:~# firewall-cmd --reload
success
```

### 設定の確認
以下のコマンドで設定した内容を確認できます。
```bash
root@{{serverHostname}}:~# firewall-cmd --list-all
```

```
services: cockpit dhcpv6-client +[[smtp]] ssh
```
[services]の項目欄に`smtp`があればファイアウォールの設定は完了です。

## クライアントからの動作確認

### クライアントの起動とログイン

クライアントを起動して`mail`コマンドでメールの送信テストをします。

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

Postfixを再起動します。
```bash
root@{{clientHostname}}:~# systemctl restart postfix
```


### mailコマンドでtomeに送信 
ターミナルを起動して、`mail`コマンドでtomeに「test」というメッセージを送ります。  
```bash
root@{{clientHostname}}:~# echo "test" | mail tome@{{serverHostname}}.netsys.cs.t-kougei.ac.jp
```

サーバの`/home/tome/Maildi/new`ディレクトリに新しくファイルが作成されており、ファイルの内容が「test」とあれば、成功です。
```bash
root@{{serverHostname}}:~# ls /home/tome/Maildir/new
```

### 外部ネットワークへのメール送信確認
サーバ外にメールが届くかテストを行います。
クライアントから自分の大学用のメールアドレスにメールを送信してメールが届くか確認します。
```bash
root@{{clientHostname}}:~# echo "test" | mail <学籍番号>@st.t-kougei.ac.jp
```

自分の大学用のメールボックスにrootから「test」というメッセージが来ていたら成功です。

これでPostfixの構築は完了です。

## Dovecot（POP3）
Dovecotは、IMAPおよびPOP3の両方のプロトコルに対応したオープンソースのメール受信サーバです。

:::note
既にインストール済みですが、もしインストールされていない場合は以下のコマンドでインストールしてください。
```bash
root@{{serverHostname}}:~# dnf -y install dovecot-core dovecot-pop3d
```
:::

### Dovecotの設定
Dovcotの設定ファイルである`/etc/dovecot/dovecot.conf`ファイルをviエディタで開きます。
```bash
root@{{serverHostname}}:~# vi /etc/dovecot/dovecot.conf
```

protocolsをpop3のみにします。  

```{file=/etc/dovecot/dovecot.conf}
-[[protocols = imap pop3 lmtp submission]]
+[[#protocols = imap pop3 lmtp submission]]
+[[protocols = pop3]]
```

Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-ssl.conf`ファイルをviエディタで開きます。

```bash
root@{{serverHostname}}:~# vi /etc/dovecot/conf.d/10-ssl.conf
```

SSLを無効にします。
{question:DeovecotでSSLを無効にするにはどのような設定を記述しますか？ディレクティブ名とパラメータを入力してください(イコールの前後にスペースを開けてください)}{answer:ssl = no}

```{file=/etc/dovecot/conf.d/10-ssl.conf}
-[[ssl = required]]
+[[ssl = no]]
```
Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-auth.conf`ファイルをviエディタで開きます。

```bash
root@{{serverHostname}}:~# vi /etc/dovecot/conf.d/10-auth.conf
```

プレーンテキスト認証を許可します。

```{file=/etc/dovecot/conf.d/10-auth.conf}
#disable_plaintext_auth = yes
+[[disable_plaintext_auth = no]]
```

Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-mail.conf`ファイルをviエディタで開きます。

```shell
root@{{serverHostname}}:~# vi /etc/dovecot/conf.d/10-mail.conf
```

`mail_locaution` を `maildir` に変更します。

```{file=/etc/dovecot/conf.d/10-mail.conf}
#   mail_location = maildir:~/Maildir
#   mail_location = mbox:~/mail:INBOX=/var/mail/%u
#   mail_location = mbox:/var/mail/%d/%1n/%n:INDEX=/var/indexes/%d/%1n/%n
#
# <doc/wiki/MailLocation.txt>
#
#mail_location = 
+[[mail_locaution = maildir:~/Maildir]]
```

### Dovecotの設定の反映
`systemctl`コマンドでdovecotを再起動します。

```bash
root@{{serverHostname}}:~# systemctl restart dovecot
```

## ファイアウォールの設定
`firewall-cmd`コマンドでファイアウォールを設定します。

### 許可するサービスの追加
外部からの接続を許可するサービスを指定します。今回追加するサービスはpop3です。以下のようにして許可をします。
```bash
root@{{serverHostname}}:~# firewall-cmd --permanent --add-service=pop3
success
```

コマンドの実行後に`success`が表示されれば、追加に成功しています。

### 許可したサービスの設定を反映させる
追加した設定を以下のコマンドで反映させます。
```bash
root@{{serverHostname}}:~# firewall-cmd --reload
success
```

### 設定の確認
以下のコマンドで設定した内容を確認できます。
```bash
root@{{serverHostname}}:~# firewall-cmd --list-all
```

```
services: cockpit dhcpv6-client +[[pop3]] smtp ssh
```
[services]の項目欄に`pop3`があればファイアウォールの設定は完了です。


## クライアントからの動作確認
Client1を起動して、クライアントから`telnet`コマンドを使用してメールの受信を確認します。

```bash
root@client1:~$ telnet {{serverHostname}} 110
Trying {{serverIP}}...
Connected to {{serverHostname}}.
Escape character is '^]'.
+[[+OK Dovecto ready.]]
```
`+OK Dovecto ready.`という情報から、Dovecotに接続できたことが確認できました。

:::hint
telnetから抜けるには`quit`を入力して抜ける。
```bash
[root@{{clientHostname}} ~]# telnet {{serverHostname}} 25
…
+OK Dovecot ready.
quit
+OK Logging out
Connection closed by foreign host.
```
:::


### メールの内容を確認する
telnetでDovecotコマンドを入力します。
始めに、`USER`と`PASS`を指定してログインを行います。
```bash
USER tome
+OK
PASS netsys00
+OK Logged in.
```
`+OK Logged in.`が表示されればログインされます。

```bash
list
+OK 1 message:
1 792
```

`+OK 1 message:`というメッセージから1件のメールがあることが確認できます。
`1 792`はメール番号とメールのサイズをバイトで表しています。

```bash
retr 1
+OK 792 octets
Return-Path: root@{{serverHostname}}.netsys.cs.t-kougei.ac.jp
X-Original-TO: tome
<略>
```

送信したメールが表示されればメールサーバの構築は完了です。

# WEBサーバの構築

:::note
既にインストール済みですが、もしインストールされていない場合は以下のコマンドでインストールしてください。

```bash
root@{{serverHostname}}:~# dnf -y install httpd
```
:::

## httpdの設定
{question:httpdの設定ファイルの場所はどこですか？(絶対パスで入力)}{answer:/etc/httpd/conf/httpd.conf}

```bash
root@{{serverHostname}}:~# vi /etc/httpd/conf/httpd.conf
```

サーバの名前とポート番号を記載します。

```{file=/etc/httpd/conf/httpd.conf}
#ServerName www.example.com:80
+[[ServerName {{serverHostname}}.netsys.cs.t-kougei.ac.jp:80]]
```

## コンテンツの設置
サーバが提供するコンテンツを`/var/www/html/`に設置します。ファイル名は`index.html`とします。

```bash
root@{{serverHostname}}:~# vi /var/www/html/index.html
```

```{file=/var/www/html/index.html}
hello world
```

### サーバの再起動
サーバを再起動させて再起動後に自動で起動するよう設定します。

```bash
root@{{serverHostname}}:~# systemctl restart httpd
```

```bash
root@{{serverHostname}}:~# systemctl enable httpd
```

## サーバでの動作確認
実際にhello worldが表示されるか確認します。

左下のアプリケーションをクリックして検索バーから`Firefox`と入力して提示されたアプリケーションを起動します。

ナビゲーションバーに[http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp](http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp)を入力してアクセスします。

:::hint
警告が表示されたら以下の手順でアクセスします。

**[詳細へ進...]** -> **[危険性を承知の上で使用]**
:::

真っ白な背景にhello worldと表示されていればサーバからの確認は成功です。

## ファイアウォールの設定
`firewall-cmd`コマンドでファイアウォールを設定します。

### 許可するサービスの追加
外部からの接続を許可するサービスを指定します。今回追加するサービスはhttpです。以下のようにして許可をします。
```bash
root@{{serverHostname}}:~# firewall-cmd --permanent --add-service=http
success
```

コマンドの実行後に`success`が表示されれば、追加に成功しています。

### 許可したサービスの設定を反映させる
追加した設定を以下のコマンドで反映させます。
```bash
root@{{serverHostname}}:~# firewall-cmd --reload
success
```

### 設定の確認
以下のコマンドで設定した内容を確認できます。
```bash
root@{{serverHostname}}:~# firewall-cmd --list-all
```

```
services: cockpit dhcpv6-client +[[http]] pop3 smtp ssh
```
[services]の項目欄に`http`があればファイアウォールの設定は完了です。

## クライアントからの動作確認
{{clientHostname}}を起動してfirefoxから、以下のURLにアクセスします。
[http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp](http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp)

真っ白なページに「hello world」とあれば完了です。

以上でOSのインストールと設定は完了となります。
