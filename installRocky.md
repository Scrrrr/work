# RockyLinuxのインストール

RockyLinuxは、Red Hat EnterpriseLinux(RHEL)のダウンストリーム版であるCentOSの開発が中止され、CentOS創設者であるGregory Kurtzer氏がプロジェクトを立ち上げたLinuxディストリビューションです。開発はRockyLinux Projectで行われており、2021年から正式なリリースが行われています。

## 序章

OSのインストール練習として、RockyLinuxのインストールを行います。

## インストール

### 言語選択
インストールが開始されると言語選択メニューが表示されます。左のメニューの中央付近にある[日本語]を選択し、[続行]を選択します。

### ディスクパーティション
インストール先のディスクパーティションの設定を行います。[インストール先]を選択し、その他のストレージオプションから、[カスタム]にチェックを入れ、[完了]を選択します。

その後、以下のような画面が表示されるため、[+]を選択し、マウントポイントに/bootを選択、割り当てる領域に512MBを入力し、[マウントポイントの追加]を選択します。

再度、[+]を選択し、マウントポイントにswapを選択、割り当てる領域に2GBを入力し、[マウントポイントの追加]を選択します。さらに、[+]を選択し、マウントポイントに/を選択、割り当てる領域は空欄にし、[マウントポイントの追加]を選択します。

その後、[完了]をクリックし、[変更の概要]ウィンドウより[変更を許可する]を選択します。

### Kdump
Kdumpの無効化を行うために、[KDUMP]を選択し、[kdumpを有効にする]のチェックを外し、[完了]を選択します。

### ネットワーク設定
次に、ネットワークの設定を行います。[ネットワークとホスト名]を選択し、ホスト名に`{{serverHostname}}.netsys.cs.t-kougei.ac.jp`を入力します。

ホスト名入力後、[適用]をクリックします。
ここで、[適用]をクリックしないと設定が反映されないため注意してください。

さらに、[設定]を選択し、[IPv4のセッティング]をクリックし、方式を自動(DHCP)から手動に変更します。

アドレスの[追加]を選択し、アドレスに`{{serverIP}}`、ネットマスクに255.255.255.0、ゲートウェイに`{{gatewayIP}}`を入力します。

DNSサーバに`{{gatewayIP}}`、ドメインを検索に`netsys.cs.t-kougei.ac.jp,cs.t-kougei.ac.jp,t-kougei.ac.jp`を入力し、[保存]を選択します。

保存後、右上の[オフ]を[オン]に変更し、IPアドレスなどが表示されているか確認し、[完了]を選択します。

### 追加ソフトウェアの選択
インストールするソフトウェアの選択を行います。[ソフトウェアの選択]を選択し、ベース環境は[サーバー(GUI使用)]を選択します。
選択した環境用のその他のソフトウェアは以下を選択します。
- DNSネームサーバー
- ファイルとストレージサーバー
- FTPサーバー
- メールサーバー
- ネットワークファイルシステムクライアント
- レガシーなUNIX互換性

開発ツールにチェックを入れ[完了]を選択します。

### rootパスワードの設定
rootのパスワードには、指定されたパスワード[netsys00]を入力し、[完了]を選択します。

［このパスワードは辞書チェックに失敗しました］と表示されますが、この場合完了を2回クリックします。

### ユーザーの作成
ユーザーtomeを作成します。

|auto|
| 項目名           | 入力値   | 
| ユーザネーム     | tome     | 
| ユーザー名       | tome     | 
| パスワード       | netsys00 | 
| パスワードの確認 | netsys00 |

rootのパスワードと同様に［このパスワードは辞書チェックに失敗しました］と表示されますが、この場合完了を2回クリックします。

### インストールの開始
全ての設定項目が完了したら、[インストールの開始]を選択します。
:::hint
インストールには時間がかかるため、終わるまで待機してください。
:::

:::note
これはノートです。
:::

:::warning
警告
:::

:::important
重要です
:::

:::caution
注意です
:::

# 初期設定

## ログイン
ライセンスに同意後、ログイン画面が表示されるため、ログインを行います。rootでログインを行うため、[アカウントが見つかりませんか？]を選択します。

ユーザの入力後、右下にある歯車のマークをクリックし、GNOMEクラシックを選択します。
選択を完了したらパスワードを入力し、ログインします。

## デスクトップアイコンの設定
デフォルト設定だとデスクトップアイコンの表示が大きいため、小さくします。[ホーム]をダブルクリックし、三本線左側の[▼]ボタンからプルダウンを行い、[-]をクリックし、50%にします。

次に、デスクトップ画面に[端末]と[Firefox]を配置します。[他の場所]を選択し、[コンピューター]から[usr]をクリックします。

その後、[share]を選択し、[applications]をクリックします。

[applications]ディレクトリから、[Firefox]と[端末]を探し出し、デスクトップに貼り付けます。
貼り付けには、[ctrl]+[c]、[ctrl]+[v]もしくは[右クリック]、[コピー]、[貼り付け]を使用します。
ドラッグ＆ドロップではできません。

## Firefoxの設定
[applications]ディレクトリは必要ないため閉じます。
閉じた後、[firefox.desktop]をダブルクリックし、[起動を許可する]を選択します。その後、Firefoxが起動するため、右上の[三本線]をクリックし、[設定]を選択します。

次に、[ホームページ]にhttp://www.cs.t-kougei.ac.jp/netsysを記入します。

その後、ネットワークプロキシ設定を行います。設定画面の一番下にあるネットワークプロキシの[接続設定]を選択し、[手動でプロキシを設定する]をクリックします。

［このプロキシーを HTTPSでも使用する］にチェックを入れます。

その後、HTTPプロキシにproxy-a.t-kougei.ac.jpを入力し、ポートに8080を入力します。
次に、[すべてのプロトコルでこのプロキシを使用する]にチェックを入れます。

次に、プロキシなしで接続に*.t-kougei.ac.jpを記入し、[OK]をクリックします。クリック後、家マークを選択し、ネットワークシステム研究室のホームページが表示されれば正しく設定されています。Firefoxはもう必要ないため、×ボタンで閉じます。

## 端末の設定
[org.gnome.Terminal.desktop]をダブルクリックし、[起動を許可する]を選択します。また、今は必要ないため×ボタンでいったん端末を閉じます。

## 入力方式の設定
設定の[keyboard]をクリックし、[日本語]下の[＋]を選択します。次に、[日本語]をクリックし、[日本語(Anthy)]を選択します。

右上[ja]を選択し、[日本語(Anthy)]を選択します。

## コンピュータの設定
[ネットワーク]を選択します。

ネットワークプロキシの[歯車マーク]をクリックし、[手動]を選択します。

その後、すべてのプロキシにproxy-a.t-kougei.ac.jpとポート8080を入力します。
次に、次のホストを無視するに*.t-kougei.ac.jpを入力します。その後、×ボタンを押します。

次に、[電源]を選択し、Screen Blankを[Never]に変更し、×ボタンで閉じます。

# 設定

サーバとしての設定を行うために、[端末]を起動します。

## ネットワークの設定

:::hint
以降の[Enter]はEnterキーを押します。コマンドに入力はしなくてよい
コマンドの実行後、チェックボックスにチェックを入れてください。
:::

ネットワークの設定を行います。IPv6は必要ないため無効化します。

```bash
cd /etc/sysconfig/network-scripts/
```

```bash
ls
```

出力結果:
```
ifcfg-ens3 … … …
```

出力されたifcfg-ens3は機種によって違うため注意してください。

```bash
vi /etc/sysconfig/network-scripts/ifcfg-ens3
```

以下を変更:
```
IPV6INIT="yes" → IPV6INIT="no"に変更する
```

またONBOOT=が"no"となっていた場合は"yes"に変更します。
ネットワーク設定を反映させるためにネットワークサービスを再起動します。

```bash
systemctl restart network
```

## セキュリティなどの設定
SELinuxの無効化を行います。
この設定にミスがあるとコンピュータが起動しなくなる可能性があるため注意してください。

```bash
vi /etc/selinux/config
```

以下を変更:
```
SELINUX=disabled
```

起動などに時間がかかるバグがあるためその対処を行います。

```bash
vi /etc/systemd/system.conf
```

以下を変更:
```
#LogLevel=info → 先頭の#を削除しLogLevel=noticeに変更
#DefaultTimeoutStartSec=90s → 先頭の#を削除しDefaultTimeoutStartSec=30sに変更
#DefaultTimeoutStopSec=90s → 先頭の#を削除しDefaultTimeoutStopSec=10sに変更
```

bashrcの設定を行います。

```bash
cd
```

```bash
vi /root/.bashrc
```

alias mv='mv -i'の下に以下を記入:
```
export PATH=$PATH:.
```

設定を反映させるために、.bashrcを読み込みます。

```bash
source /root/.bashrc
```

## アップデート
アップデート前に、設定を行います。

```bash
vi /etc/yum.conf
```

distroverpkg=RockyLinux-releaseの下に以下を記入:
```
proxy=http://proxy-a.t-kougei.ac.jp:8080/
timeout=900
```

アップデート用のファイルをダウンロードするためのリポジトリの変更を行います。

```bash
vi /etc/yum.repos.d/RockyLinux-Base.repo
```

4つのmirrorlist=の最後に&cc=jpを追加します。

```
[base]
mirrorlist=http://mirrorlist.RockyLinux.org/ ・・・ $infra&cc=jp
[updates]
mirrorlist=http://mirrorlist.RockyLinux.org/ ・・・ $infra&cc=jp
[extras]
mirrorlist=http://mirrorlist.RockyLinux.org/ ・・・ $infra&cc=jp
[RockyLinuxplus]
mirrorlist=http://mirrorlist.RockyLinux.org/ ・・・ $infra&cc=jp
```

アップデート用のファイルのキャッシュの作成を行います。

```bash
yum makecache fast
```

出力結果:
```
読み込んだプラグイン:fastestmirror, langpacks
Loading mirror speeds from cached hostfile
* base: ftp.riken.jp
* extras: ftp.riken.jp
* updates: ftp.riken.jp
base | 3.6 kB 00:00:00
extras | 2.9 kB 00:00:00
updates | 2.9 kB 00:00:00
(1/4): extras/7/x86_64/primary_db | 232 kB 00:00:00
(2/4): base/7/x86_64/group_gz | 153 kB 00:00:00
(3/4): base/7/x86_64/primary_db | 6.1 MB 00:00:03
(4/4): updates/7/x86_64/primary_db | 7.1 MB 00:00:04
メタデータのキャッシュを作成しました
```

アップデートを行います。

```bash
yum -y update --nobest
```

アップデートにはしばらく時間がかかるため待機します。
アップデートが終了したら、再起動を行います。

```bash
systemctl reboot
```

再起動完了後、rootでログインを行います。

## NTPの設定
NTPを使用するためにchronydの設定を行います。

```bash
vi /etc/chrony.conf
```

以下を変更:
```
server 0.RockyLinux.pool.ntp.org iburst ← 先頭に#をつける
server 1.RockyLinux.pool.ntp.org iburst ← 先頭に#をつける
server 2.RockyLinux.pool.ntp.org iburst ← 先頭に#をつける
server 3.RockyLinux.pool.ntp.org iburst ← 先頭に#をつける
server ntp-a.t-kougei.ac.jp iburtst ← 追加
```

設定を反映させるためにchronydの再起動を行います。

```bash
systemctl restart chronyd
```

## IPv6の無効化
再起動後もIPv6の無効化をするために、rc.localファイルにその設定を記入します。

```bash
vi /etc/rc.d/rc.local
```

以下を変更:
```
echo 1 > /proc/sys/net/ipv6/conf/all/disable_ipv6
echo 1 > /proc/sys/net/ipv6/conf/default/disable_ipv6
```

## 電源管理設定
電源管理用のデーモンであるacpidのインストールを行います。

```bash
yum -y install acpid
```

インストール後、acpidの起動を行います。

```bash
systemctl start acpid
```

## ユーザの設定
tomeユーザの削除を行います。

```bash
userdel -r tome
```

staffユーザの作成を行います。パスワード入力時に良くないパスワードと聞かれるが無視してよいです。

```bash
useradd -c staff -d /home/staff -u 1000 -g 100 -s /bin/tcsh staff
```

```bash
passwd staff
```

出力結果:
```
ユーザー staff のパスワードを変更。
新しいパスワード: rootと同じパスワード
よくないパスワード: このパスワードは辞書チェックに失敗しました。 - 辞書の単語に基づいています
新しいパスワードを再入力してください: rootと同じパスワード
passwd: すべての認証トークンが正しく更新できました。
```

checkユーザの作成を行います。パスワード入力時に良くないパスワードと聞かれるが無視してよいです。

```bash
groupadd check -g 1001
```

```bash
useradd -c check -d /home/check -u 1001 -g check -s /bin/tcsh check
```

```bash
passwd check
```

出力結果:
```
ユーザー check のパスワードを変更。
新しいパスワード: check123
よくないパスワード: このパスワードは一部に何らかの形でユーザー名が含まれています。
新しいパスワードを再入力してください: check123
passwd: すべての認証トークンが正しく更新できました。
```

suユーザの設定を行います。

```bash
usermod -G wheel root
```

```bash
usermod -G wheel staff
```

suユーザの設定ファイルの編集を行います。

```bash
vi /etc/pam.d/su
```

以下を変更:
```
#auth sufficient pam_wheel.so trust use_uid ← 先頭の#を削除
```

```bash
vi /etc/login.defs
```

最終行に以下を追加:
```
SU_WHEEL_ONLY yes
```

## ログイン画面の設定
ログイン画面にユーザリストの非表示を行います。実行後、ログアウトを行い、確認後ログインをします。
また、実行後にNo protocol specifiedと表示されることがあるが無視してよいです。

```bash
sudo -u gdm dbus-launch gsettings set org.gnome.login-screendisable-user-list true
```

## Firewallの設定
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
