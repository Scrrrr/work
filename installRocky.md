# RockyLinuxについて

RockyLinuxは、Red Hat EnterpriseLinux(RHEL)のダウンストリーム版であるCentOSの開発が中止され、CentOS創設者であるGregory Kurtzer氏がプロジェクトを立ち上げたLinuxディストリビューションです。開発はRockyLinux Projectで行われており、2021年から正式なリリースが行われています。

## 序章

OSのインストール練習として、RockyLinuxのインストールを行います。

# RockyLinuxのインストール

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
次に、ネットワークの設定を行います。[ネットワークとホスト名]を選択し、ホスト名に`{{serverHostname}}.netsys.cs.t-kougei.ac.jp`を入力します。

ホスト名入力後、[適用]をクリックします。
:::caution
[適用]をクリックしないと設定が反映されないため注意してください。
:::

さらに、[設定]を選択し、[IPv4の設定]をクリックし、方式を**自動(DHCP)**から**手動**に変更します。

アドレスの[追加]を選択し、以下の項目に値を入力していきます。

|項目名|入力値|
|アドレス|{{serverIP}}|
|ネットマスク|24|
|ゲートウェイ|{{gatewayIP}}|
|DNSサーバー|{{serverIP}}|
|ドメインを検索|netsys.cs.t-kougei.ac.jp, cs.t-kougei.ac.jp, t-kougei.ac.jp|

入力が完了したら[保存]を押して閉じます。

入力後、右上のトグルボタンをクリックして有効に切り替えます。

Ethernetが「接続済みです」と表示されていればネットワークの接続は完了です。

左上の[完了]を押します。

## 時刻と日付の設定
地域設定から[時刻と日付]を選択します。
左上の歯車マークをクリックして[使用するNTPサーバの追加]に`ntp-a.t-kougei.ac.jp`を入力して[＋]ボタンを押します。

`ntp-a.t-kougei.ac.jp`の稼働中の項目欄にチェックがあれば完了です。

OKで閉じて、左上の[完了]ボタンを押します。

## 追加ソフトウェアの選択
インストールするソフトウェアの選択を行います。[ソフトウェアの選択]を選択し、ベース環境は[サーバー(GUI使用)]を選択します。
選択した環境用のその他のソフトウェアは以下を選択します。
- メールサーバー
- ベーシックWebサーバー

選択が完了したら、左上の[完了]をクリックします。

## rootパスワードの設定
[ユーザーの設定]の[rootパスワード]をクリックします。

rootのパスワードには、[netsys00]を入力し、同じく確認でも同じパスワードを入力してください。

入力が完了したら左上の[完了]をクリックします。

:::cation
［このパスワードは辞書チェックに失敗しました］と表示されますが、この場合完了を2回クリックします。
:::

## ユーザーの作成
ユーザーtomeを作成します。

|auto|
| 項目名           | 入力値   | 
| ユーザネーム     | tome     | 
| ユーザー名       | tome     | 
| パスワード       | netsys00 | 
| パスワードの確認 | netsys00 |

:::cation
rootのパスワードと同様に［このパスワードは辞書チェックに失敗しました］と表示されますが、この場合完了を2回クリックします。
:::

## インストールの開始
全ての設定項目が完了したら、[インストールの開始]を選択します。
:::note
インストールには時間がかかるため、終わるまで待機してください。
:::

インストールが完了したら、[システムの再起動]を選択して、サーバを再起動します。
サーバが停止したら、SCTSメニューより、[インストールサーバの起動]->[RockyLinux]でサーバを起動します。

# 基本設定

## ログイン
ライセンスに同意後、ログイン画面が表示されるため、ログインを行います。rootでログインを行うため、[アカウントが見つかりませんか？]を選択しrootでログインします。

|auto|
| 項目名           | 入力値   | 
| ユーザネーム     | root     | 
| パスワード       | netsys00 | 

## 端末の起動
左上の[アクティビティ]をクリック、または<Win>キーを押します。
中央下に表示されているアイコンにカーソルを合わせるとアプリケーション名が表示されるので、そこから[端末]を探します。もしくは、<win>キーを押した後に、[Terminal]と検索して提示された[端末]というソフトを起動します。

## SELinuxの無効化
SELinuxの無効化を行います。

:::warning
この設定にミスがあるとコンピュータが起動しなくなる可能性があるため注意してください。
:::

```bash
root@{{serverHostname}}:~$ vi /etc/selinux/config
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

また、通常モードで`/<探したい文字>`で文字検索ができる。検索を辞める時は**<Esc>**キーを押す。
:::  

## 電源の設定
デフォルトの設定では5分起きにロックされてしまうので、設定で無効にします。

## 各ツール別のプロキシ設定

### NetworkMangaerのプロキシ設定
**ネットワークプロキシ**を見つけ、[歯車マーク]をクリックします。  
[無効]から[手動]を変更し、次の項目に以下の入力値を入力していきます。

| 項目名           | 入力値                   | ポート|
| HTTPプロキシ     | proxy-a.t-kougei.ac.jp   | 8080  |
| HTTPSプロキシ    | proxy-a.t-kougei.ac.jp   | 8080  |
| FTPプロキシ      | proxy-a.t-kougei.ac.jp   | 8080  |
| Socksホスト      | proxy-a.t-kougei.ac.jp   | 8080  |
| 次のホストを無視する    | *.t-kougei.ac.jp  | -     |

入力が完了したら×で閉じます。
設定メニューも×で閉じます。


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

### yumのプロキシ設定
パッケージマネージャーyumの設定を行います。

```bash
root@{{serverHostname}}:~$ vi /etc/yum.conf
```

`skip_if_unavailable=False`の下に以下を記入します。

```
proxy=http://proxy-a.t-kougei.ac.jp:8080
timeout=900
```

保存して終了後アップデートを行います。

```bash
root@{{serverHostname}}:~$ yum -y update --nobest
```

問題なくアップデートが行われれば、プロキシの設定は完了です。

# メールサーバの構築

## Postfix

:::note
OSのインストールで既にPostfixをインストールしていますが、チェック項目を忘れていた場合は以下のコマンドでインストールしてください。

```bash
root@{{serverHostname}}:~$ yum -y install postfix
```
:::

### Postfixの設定

postfixの設定ファイルである`/etc/postfix/main.cf`を`vi`エディタで編集します。

```bash
root@{{serverHostname}}:~$ vi /etc/postfix/main.cf
```

以下の設定を行います。
赤色は削除する場所で、緑色は追記する行です。

```{file=/etc/postfix/main.cf}
myhostname = {{serverHostname}}.netsys.cs.t-kougei.ac.jp
mydomain = netsys.cs.t-kougei.ac.jp
myorigin = $mydomain
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain
relayhost = [smtp-a.t-kougei.ac.jp]
mynetworks = 127.0.0.0/8
inet_interfaces = all
#inet_interfaces = localhost <- 先頭に#を挿入してコメントアウト
inet_protocols = ipv4
home_mailbox = Maildir/
```

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
+[[mynetworks = 127.0.0.0/8]]

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

:::note
`myorigin`: 外行きメールに使うドメイン
`mydestination`: 受信するドメイン
`mynetworks`: メールリレーを許可するネットワーク
:::

### postfixの設定の反映
`systemctl`コマンドでpostfixを再起動します。

```bash
root@{{serverHostname}}:~$ systemctl restart postfix.service
```

### サーバからメール送受信確認

mailコマンドをインストールしてメールの送信テストをします。

#### mailコマンドのインストール
```bash
root@{{serverHostname}}:~$ yum -y install s-nail
```

#### mailコマンドでtomeに送信 
`mail`コマンドでtomeに「test」というメッセージを送ります。  
```bash
root@{{serverHostname}}:~$ echo "test" | mail tome
```

`/home/tome/Maildi/new`ディレクトリに新しくファイルが作成されており、ファイルの内容が「test」とあれば、成功です。
```bash
root@{{serverHostname}}:~$ cat /home/tome/Maildir/new
```

### ファイアウォールの設定

## Dovecot（POP3）
Dovecotは、IMAPおよびPOP3の両方のプロトコルに対応したオープンソースのメール受信サーバです。

### Dovecotのインストール
既にインストール済みですが、もしインストールされていない場合は以下のコマンドでインストールしてください。
```bash
root@{{serverHostname}}:~$ yum -y install dovecot-core dovecot-pop3d
```

### Dovecotの設定
Dovcotの設定ファイルである`/etc/dovecot/dovecot.conf`ファイルをviエディタで開きます。
```bash
root@{{serverHostname}}:~$ vi /etc/dovecot/dovecot.conf
```

protocolsをpop3のみにします。  

```{file=/etc/dovecot/dovecot.conf}
protocols = pop3
```

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

プレーンテキスト認証を許可します。

```
disable_plaintext_auth = no
```

Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-mail.conf`ファイルをviエディタで開きます。

```bash
root@{{serverHostname}}:~$ vi /etc/dovecot/conf.d/10-mail.conf
```

`mail_location` を `maildir` に変更します。

```
mail_location = maildir:~/Maildir
```

### Dovecotの設定の反映
`systemctl`コマンドでdovecotを再起動します。

```bash
root@{{serverHostname}}:~$ systemctl restart dovecot
```

**Firewallの設定が必要**

## client1からの動作確認
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

## httpdのインストール

既にインストール済みですが、もしも未インストールの場合は以下のコマンドでインストールしてください。

```bash
root@{{serverHostname}}:~$ yum -y install httpd
```

## httpdの設定
```bash
root@{{serverHostname}}:~$ vi /etc/httpd/conf/httpd.conf
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

## httpdの起動

`systemctl`コマンドでhttpdの自動起動とサービスの開始をします。

```bash
root@{{serverHostname}}:~$ systemctl enable httpd
```

```bash
root@{{serverHostname}}:~$ systemctl start httpd
```

## クライアントからのチェック

クライアントからfirefoxを起動して、以下のURLにアクセスします。
[http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp](http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp)

真っ白なページに「hello world」とあれば完了です。


### Firewallの設定
client1から接続ができるようにFirewallの設定を行います。


# Firewallの設定
Firewallサービスが起動しているかの確認を行います。

```bash
root@{{serverHostname}}:~$ systemctl status firewalld
```

出力結果:
```
● firewalld.service - firewalld - dynamic firewall daemon
Loaded: loaded (/usr/lib/systemd/system/firewalld.service; enabled; vendorpreset: enabled)
Active: active (running) since 水 2021-04-14 10:09:28 JST; 4h 52min ago
Docs: man:firewalld(1)
```

Activeの項目がactive (running)となっている場合はサービスが起動しているため、OKです。
inactiveとなっている場合は起動していないため、以下のコマンドを実行します。

```bash
root@{{serverHostname}}:~$ systemctl start firewalld
```

再度確認を行い、activeとなっていればOKです。

Firewallの設定確認を行います。

```bash
root@{{serverHostname}}:~$ firewall-cmd --list-all
```

出力結果:
```
public (active)
target: default
icmp-block-inversion: no
interfaces: ens3
sources:
services: dhcpv6-client ssh
ports:
protocols:
masquerade: no
forward-ports:
source-ports:
icmp-blocks:
rich rules:
```

必要のないdhcpv6-clientとsshの削除を行います。

```bash
root@{{serverHostname}}:~$ firewall-cmd --permanent --remove-service=dhcpv6-client
```

```bash
root@{{serverHostname}}:~$ firewall-cmd --permanent --remove-service=ssh
```

出力結果:
```
success
```

設定の反映を行います。

```bash
root@{{serverHostname}}:~$ firewall-cmd --reload
```

出力結果:
```
success
```

再度確認を行い、servicesの項目に消えていればOKです。

```bash
root@{{serverHostname}}:~$ firewall-cmd --list-all
```

出力結果:
```
public (active)
target: default
icmp-block-inversion: no
interfaces: ens3
sources:
services:
ports:
protocols:
masquerade: no
forward-ports:
source-ports:
icmp-blocks:
rich rules:
```

Firewallの特定のIPアドレスからのアクセス許可を行います。

```bash
root@{{serverHostname}}:~$ firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="127.0.0.1/32" accept"
```

```bash
root@{{serverHostname}}:~$ firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="{{gatewayIP}}/32" accept"
```

```bash
root@{{serverHostname}}:~$ firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="{{clientIP}}/32" accept"
```

出力結果:
```
success
```

設定の反映を行います。

```bash
root@{{serverHostname}}:~$ firewall-cmd --reload
```

出力結果:
```
success
```

再度確認を行い、rich rules:の項目に追加したIPアドレスが表示されていればOKです。

```bash
root@{{serverHostname}}:~$ firewall-cmd --list-all
```

出力結果:
```
public (active)
target: default
icmp-block-inversion: no
interfaces: ens3
sources:
services:
ports:
protocols:
masquerade: no
forward-ports:
source-ports:
icmp-blocks:
rich rules:
rule family="ipv4" source address="127.0.0.1/32" accept
rule family="ipv4" source address="{{gatewayIP}}/32" accept
rule family="ipv4" source address="{{clientIP}}/32" accept
```

# リモートアクセスの設定

## rloginとrshの設定
rloginとrshのインストールを行います。

```bash
root@{{serverHostname}}:~$ yum -y install rsh rsh-server
```

インストール後、設定を行います。

```bash
root@{{serverHostname}}:~$ vi /usr/lib/systemd/system/rsh.socket
```

以下を変更:
```
ListenStream=514 → ListenStream=0.0.0.0:514に変更
```

```bash
root@{{serverHostname}}:~$ vi /usr/lib/systemd/system/rlogin.socket
```

以下を変更:
```
ListenStream=513 → ListenStream=0.0.0.0:513に変更
```

設定の反映を行います。

```bash
root@{{serverHostname}}:~$ systemctl daemon-reload
```

rloginとrshの起動と自動起動設定を行います。

```bash
root@{{serverHostname}}:~$ systemctl start rsh
```

```bash
root@{{serverHostname}}:~$ systemctl start rlogin
```

```bash
root@{{serverHostname}}:~$ systemctl enable rsh
```

```bash
root@{{serverHostname}}:~$ systemctl enable rlogin
```

パスワード無しでログインを許可します。

```bash
root@{{serverHostname}}:~$ vi /root/.rhosts
```

以下を記入:
```
{{gatewayIP}} root
{{gatewayIP}} user1
{{clientIP}} root
{{clientIP}} check
```

rootユーザでログインを可能にします。

```bash
root@{{serverHostname}}:~$ vi /etc/pam.d/rsh
```

```bash
root@{{serverHostname}}:~$ vi /etc/pam.d/rlogin
```

以下を変更:
```
#auth require pam_securetty.so ← 先頭の#を削除
```

## sshの設定
sshの設定を変更します。

```bash
root@{{serverHostname}}:~$ vi /etc/ssh/sshd_config
```

以下を変更:
```
#PermitRootLogin Yes → 先頭の#を削除し，PermitRootLogin Noに変更
#PermitEmptyPasswords No ← 先頭の#を削除する
```

設定の反映を行います。

```bash
root@{{serverHostname}}:~$ systemctl restart sshd
```

以上でOSのインストールと設定は完了となります。
