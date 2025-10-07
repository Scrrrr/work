# RockyLinuxについて

RockyLinuxは、Red Hat EnterpriseLinux(RHEL)のダウンストリーム版であるCentOSの開発が中止され、CentOS創設者であるGregory Kurtzer氏がプロジェクトを立ち上げたLinuxディストリビューションです。開発はRockyLinux Projectで行われており、2021年から正式なリリースが行われています。

## 序章

OSのインストール練習として、RockyLinuxのインストールを行います。

# RockyLinuxのインストール

## 言語選択
インストールが開始されると言語選択メニューが表示されます。左のメニューの中央付近にある[日本語]を選択し、[続行]を選択します。

## ディスクパーティション
インストール先のディスクパーティションの設定を行います。[インストール先]を選択し、その他のストレージオプションから、[カスタム]にチェックを入れ、[完了]を選択します。

その後、以下のような画面が表示されるため、[+]を選択し、マウントポイントに/bootを選択、割り当てる領域に512MBを入力し、[マウントポイントの追加]を選択します。

再度、[+]を選択し、マウントポイントにswapを選択、割り当てる領域に2GBを入力し、[マウントポイントの追加]を選択します。さらに、[+]を選択し、マウントポイントに/を選択、割り当てる領域は空欄にし、[マウントポイントの追加]を選択します。

その後、[完了]をクリックし、[変更の概要]ウィンドウより[変更を許可する]を選択します。

## Kdump
Kdumpの無効化を行うために、[KDUMP]を選択し、[kdumpを有効にする]のチェックを外し、[完了]を選択します。

## ネットワーク設定
次に、ネットワークの設定を行います。[ネットワークとホスト名]を選択し、ホスト名に`{{serverHostname}}.netsys.cs.t-kougei.ac.jp`を入力します。

ホスト名入力後、[適用]をクリックします。
ここで、[適用]をクリックしないと設定が反映されないため注意してください。

さらに、[設定]を選択し、[IPv4のセッティング]をクリックし、方式を自動(DHCP)から手動に変更します。

アドレスの[追加]を選択し、アドレスに`{{serverIP}}`、ネットマスクに255.255.255.0、ゲートウェイに`{{gatewayIP}}`を入力します。

DNSサーバに`{{gatewayIP}}`、ドメインを検索に`netsys.cs.t-kougei.ac.jp,cs.t-kougei.ac.jp,t-kougei.ac.jp`を入力し、[保存]を選択します。

保存後、右上の[オフ]を[オン]に変更し、IPアドレスなどが表示されているか確認し、[完了]を選択します。

## NTPの設定

## 追加ソフトウェアの選択
インストールするソフトウェアの選択を行います。[ソフトウェアの選択]を選択し、ベース環境は[サーバー(GUI使用)]を選択します。
選択した環境用のその他のソフトウェアは以下を選択します。
- DNSネームサーバー
- ファイルとストレージサーバー
- FTPサーバー
- メールサーバー
- ネットワークファイルシステムクライアント
- レガシーなUNIX互換性

開発ツールにチェックを入れ[完了]を選択します。

## rootパスワードの設定
rootのパスワードには、指定されたパスワード[netsys00]を入力し、[完了]を選択します。

［このパスワードは辞書チェックに失敗しました］と表示されますが、この場合完了を2回クリックします。

## ユーザーの作成
ユーザーtomeを作成します。

|auto|
| 項目名           | 入力値   | 
| ユーザネーム     | tome     | 
| ユーザー名       | tome     | 
| パスワード       | netsys00 | 
| パスワードの確認 | netsys00 |

rootのパスワードと同様に［このパスワードは辞書チェックに失敗しました］と表示されますが、この場合完了を2回クリックします。

## インストールの開始
全ての設定項目が完了したら、[インストールの開始]を選択します。
:::note
インストールには時間がかかるため、終わるまで待機してください。
:::

インストールが完了したら、[システムの再起動]を選択して、サーバを再起動します。
サーバが停止したら、SCTSメニューより、[インストールサーバの起動]->[RockyLinux]でサーバを起動します。

# 初期設定

## ログイン
ライセンスに同意後、ログイン画面が表示されるため、ログインを行います。rootでログインを行うため、[アカウントが見つかりませんか？]を選択しrootでログインします。

ユーザ名の入力後、右下にある歯車のマークをクリックし、GNOMEクラシックを選択します。
選択を完了したらパスワードを入力し、ログインします。

|auto|
| 項目名           | 入力値   | 
| ユーザネーム     | root     | 
| パスワード       | netsys00 | 

## デスクトップアイコンの設定
デフォルト設定だとデスクトップアイコンの表示が大きいため、小さくします。  
右上の`[アプリケーション]`->`[ファイル]`を選択します。

画面右側上部にある三本線マークの隣の`[▼]ボタン`からプルダウンを行い、[-]をクリックし、50%にします。

次に、デスクトップ画面にfirefoxと端末を配置します。
ファイルマネージャーより、左の項目欄末尾にある`[他の場所]`を選択し、`[コンピューター]`から`[usr]`->`[share]`->`[applications]`の順でクリックします。

`[applications]`ディレクトリから、`org.gnome.Termianl.desktop`と`firefox.desktop`を探し出し、デスクトップに貼り付けます。
貼り付けには、[ctrl]+[c]、[ctrl]+[v]もしくは[右クリック]、[コピー]、[貼り付け]を使用します。
ドラッグ＆ドロップではできません。

ファイルマネージャは必要ないため閉じます。

デスクトップに配置した、firefoxと端末のファイルをそれぞれ、右クリックし、[起動を許可する]を選択します。
正常であれば、アイコンが正しく表示されるようになります。

## Firefoxの設定
firefoxを起動して右上の[三本線]をクリックし、[設定]を選択します。

### カスタムホームページの設定

[ホーム]->[ホームページ]よりカスタムURLを設定します。  
[ホームページと新しいウィンドウ]に`http://www.cs.t-kougei.ac.jp/netsys`を記入します。

### プロキシの設定

ネットワークプロキシ設定を行います。設定画面の`[一般]`から設定画面の一番下にある`[接続設定]`を選択します。
`[手動でプロキシを設定する]`のボタンを選択し、以下の項目を入力します。。

| 項目名            | 入力値                   | ポート|
| HTTPプロキシー    | proxy-a.t-kougei.ac.jp   | 8080  |

`[このプロキシーを HTTPSでも使用する]`にチェックを入れます。

次に、`[プロキシなしで接続]`に`*.t-kougei.ac.jp`を記入し、[OK]をクリックします。

### 設定確認
ホームボタン、または新規タブで、ネットワークシステム研究室のホームページが表示されれば正しく設定されています。  
Firefoxはもう必要ないため、×ボタンで閉じます。

# コンピュータの設定

## 入力方式の設定
入力方式の設定を行います。  
右上の`[アプリケーション]->[ユーティリティ]->設定`を選択して、設定画面を起動します。
左の項目欄から`[keyboard]`を選択し、`[入力ソース]`項目より`[日本語]`下にある`[＋]`マークを選択します。次に、`[入力ソースの追加]`メニューから`[日本語]`を選択し、`[日本語(Anthy)]`を追加します。

右上日付の隣のトレイバーにある`[ja]`をクリックし、`[日本語(Anthy)]`を選択します。

## ネットワークの設定
設定より`[ネットワーク]`を選択します。

### IPv6の無効化
[有線]の[歯車マーク]をクリックし、[IPv6]項目を選択し、`IPv6メゾット`を`無効`にして適用します。

### プロキシの設定
ネットワークプロキシの[歯車マーク]をクリックし、[手動]を選択し以下を記入します。

| 項目名           | 入力値                   | ポート|
| HTTPプロキシ     | proxy-a.t-kougei.ac.jp   | 8080  |
| HTTPSプロキシ    | proxy-a.t-kougei.ac.jp   | 8080  |
| FTPプロキシ      | proxy-a.t-kougei.ac.jp   | 8080  |
| Socksホスト      | proxy-a.t-kougei.ac.jp   | 8080  |
| 次のホストを無視する    | *.t-kougei.ac.jp  | -     |

入力が完了したら×で閉じます。

## 電源の設定
設定より[電源]を選択し、Screen Blankを[Never]に変更します。

すべての設定項目を終えたら、設定画面を×で閉じます。  

# サーバの設定
サーバとしての設定を行うために、デスクトップから[端末]を起動します。

## SELinuxの無効化
SELinuxの無効化を行います。

:::warning
この設定にミスがあるとコンピュータが起動しなくなる可能性があるため注意してください。
:::

```bash
vi /etc/selinux/config
```

以下を変更:
```
SELINUX=disabled
```
## yumの設定
パッケージマネージャーyumの設定を行います。

```bash
vi /etc/yum.conf
```

`skip_if_unavailable=False`の下に以下を記入:
```
proxy=http://proxy-a.t-kougei.ac.jp:8080/
timeout=900
```

保存して終了後アップデートを行います。

```bash
yum -y update --nobest
```

# NFSクライアント
NFSはネットワーク上でファイルの送受信を行うためのプロトコルです。

NFSクライアントはNFSサーバからファイルを取得するためのソフトです。

今回はjpc1をマウントするためにルートディレクトリに`/jpc1`を作成します。

## NFSのマウント
```bash
mkdir /jpc1
mount -t nfs jpc1.cs.t-kougei.ac.jp /jpc1
```

## マウントの確認
```bash
df
```

`df`コマンドでjpc1がマウントされているか確認します。

## NFSのアンマウント
```bash
umount /jpc1
```

`umount`コマンドでjpc1をアンマウントします。

# メールサーバの構築

## Postfix

### Postfix のインストール
OSのインストールで既にPostfixをインストールしていますが、チェック項目を忘れていた場合は以下のコマンドでインストールしてください。

```bash
yum -y install postfix
```

### Postfixの設定

postfixの設定ファイルである`/etc/postfix/main.cf`を`vi`エディタで編集します。

```bash
vi /etc/postfix/main.cf
```

以下の設定を行います。

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

参考:
- `myorigin`: 外行きメールに使うドメイン
- `mydestination`: 受信するドメイン
- `mynetworks`: メールリレーを許可するネットワーク

### postfixの設定の反映
`systemctl`コマンドでpostfixを再起動します。

```bash
systemctl restart postfix.service
```

### メール転送の設定
`/etc/aliases`ファイルに、 `転送元: 転送先` を指定することでメールを自動的に転送することができます。
```bash
sudo vi /etc/aliases
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
yum -y install s-nail
```

#### mailコマンドでtomeに送信 
`mail`コマンドでtomeに「test」というメッセージを送ります。  
```bash
echo "test" | mail tome
```

`/home/tome/Maildi/new`ディレクトリに新しくファイルが作成されており、ファイルの内容が「test」とあれば、成功です。
```bash
cat /home/tome/Maildir/new
```

## Dovecot（POP3）
Dovecotは、IMAPおよびPOP3の両方のプロトコルに対応したオープンソースのメール受信サーバです。

### Dovecotのインストール
```bash
yum -y install dovecot-core dovecot-pop3d
```

### Dovecotの設定
Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-ssl.conf`ファイルをviエディタで開きます。
```bash
vi /etc/dovecot/conf.d/10-ssl.conf
```

SSLを無効にします。

```
ssl = no
```
Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-auth.conf`ファイルをviエディタで開きます。

```bash
vi /etc/dovecot/conf.d/10-auth.conf
```

プレーンテキスト認証を許可します。

```
disable_plaintext_auth = no
```

Dovcotの設定ファイルである`/etc/dovecot/conf.d/10-mail.conf`ファイルをviエディタで開きます。

```bash
vi /etc/dovecot/conf.d/10-mail.conf
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
# SSHの設定

# Firewallの設定
Firewallサービスが起動しているかの確認を行います。

```bash
systemctl status firewalld
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
systemctl start firewalld
```

再度確認を行い、activeとなっていればOKです。

Firewallの設定確認を行います。

```bash
firewall-cmd --list-all
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
firewall-cmd --permanent --remove-service=dhcpv6-client
```

```bash
firewall-cmd --permanent --remove-service=ssh
```

出力結果:
```
success
```

設定の反映を行います。

```bash
firewall-cmd --reload
```

出力結果:
```
success
```

再度確認を行い、servicesの項目に消えていればOKです。

```bash
firewall-cmd --list-all
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
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="127.0.0.1/32" accept"
```

```bash
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="{{gatewayIP}}/32" accept"
```

```bash
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="{{clientIP}}/32" accept"
```

出力結果:
```
success
```

設定の反映を行います。

```bash
firewall-cmd --reload
```

出力結果:
```
success
```

再度確認を行い、rich rules:の項目に追加したIPアドレスが表示されていればOKです。

```bash
firewall-cmd --list-all
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
yum -y install rsh rsh-server
```

インストール後、設定を行います。

```bash
vi /usr/lib/systemd/system/rsh.socket
```

以下を変更:
```
ListenStream=514 → ListenStream=0.0.0.0:514に変更
```

```bash
vi /usr/lib/systemd/system/rlogin.socket
```

以下を変更:
```
ListenStream=513 → ListenStream=0.0.0.0:513に変更
```

設定の反映を行います。

```bash
systemctl daemon-reload
```

rloginとrshの起動と自動起動設定を行います。

```bash
systemctl start rsh
```

```bash
systemctl start rlogin
```

```bash
systemctl enable rsh
```

```bash
systemctl enable rlogin
```

パスワード無しでログインを許可します。

```bash
vi /root/.rhosts
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
vi /etc/pam.d/rsh
```

```bash
vi /etc/pam.d/rlogin
```

以下を変更:
```
#auth require pam_securetty.so ← 先頭の#を削除
```

## sshの設定
sshの設定を変更します。

```bash
vi /etc/ssh/sshd_config
```

以下を変更:
```
#PermitRootLogin Yes → 先頭の#を削除し，PermitRootLogin Noに変更
#PermitEmptyPasswords No ← 先頭の#を削除する
```

設定の反映を行います。

```bash
systemctl restart sshd
```

以上でOSのインストールと設定は完了となります。
