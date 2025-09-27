# Ubuntuのインストール
UbuntuはLinuxディストリビューションの中でもサーバ向け、デスクトップ向け共に人気の高いディストリビューションです。これからUbuntuをコンピュータにインストールしてメール、ウェブ、ファイル共有、リモートログイン機能を持ったサーバを構築していきます。
今回インストールするバージョンはUbuntu 24.04.2 - Desktopです。

## インストールする前に
このマニュアルは設定内容と基本説明のみで構成されています。 そのため、コマンドの操作などは実際に調べて設定してもらいます。 コマンドの調べ方は「[コマンドの名前] 操作方法」または「[コマンドの名前] 使い方」で検索してブログ記事やオンラインマニュアルから探してください。
## ブートローダーの起動
黒い画面が現れたら`「Try or Install Ubuntu」`に矢印キーでカーソルを合わせて[Enter]
しばらくの時間、起動の準備が行われます。

## 言語の選択
使用する言語を選択します。デフォルトでは[英語]に設定
されているので、左のリストを下にスクロールして、[日本語]を選択します。
[Ubuntuをインストール]を選択します。

## キーボードレイアウトの設定
キーボードの配列を設定します。
デフォルトでは日本語配列になっています。
問題がなければ、[続ける]を選択します。

## アップデートと他のソフトウェア
[通常のインストール]を選択し、[続ける]を選択します。

## インストールの種類
[ディスクを削除してUbuntuをインストール]を選択し、[インストール]を選択します。
※警告が表示されますが、無視してください。

[ディスクに変更を書き込みますか]と問われるので、[続ける]を選択します。

## どこに住んでいますか
時刻の設定をします。  
世界地図で日本にピンが刺されてあり、下の入力欄に「Tokyo」とあったら[続ける]を選択します。

## あなたの情報を入力してください
```{shell}
あなたの名前：tome  
コンピュータの名前：{{serverHostname}}  
ユーザ名の入力：tome  
パスワードの入力：netsys00
パスワードの確認：netsys00
```
[ログイン時にパスワードを要求する]で[続ける]


## インストールの開始
全ての設定項目を終えると、インストールが開始されます。
しばらくすると、再起動を促されます。

再起動をすると、「Please remove the installation medium, then press ENTER:(インストールメディアを取り出し、ENTER キーを押してください。)」と表示されます。指示通り、Enterを押すとマシンが完全に停止します。

# Ubuntuサーバの設定

## 基本設定

### vi の設定
`Ctrl+Alt+T`でターミナルを開きます。

ホームディレクトリで `~/.vimrc` を作成して互換モードを無効化します。

```bash
tome@{{serverHostname}}:~$ vi ~/.vimrc
```

以下を追記します。
```
set nocompatible
```

:::hint
viは「i」でインサートモード。「Esc」を押して通常モードに戻る。
「:w」で保存「:q」で終了、「:wq」で保存して終了。
:::  

### 省電力設定（デスクトップ環境）
右上のスピーカーアイコン → 設定 → 電源管理 から、以下を設定します。
- 画面のブランク: しない

## root に関する設定
### root パスワードの設定
端末を開き、root のパスワードを設定します。

```bash
tome@{{serverHostname}}:~$ sudo passwd root [Enter]
tomeのパスワード:
新しいパスワード:(tomeと同じ)
新しいパスワードを再入力してください:(tomeと同じ)
```
※パスワードの入力中は文字が何も表示されません。

### PAMの設定
続いて `su`コマンドが使用できるユーザを制御します。

```bash
tome@{{serverHostname}}:~$ sudo vi /etc/pam.d/su
```

15行目付近にある以下のコメントを外し、末尾に `group=adm` を付けます。

```
auth required pam_wheel.so group=adm
```

:::hint
vimは通常モードで
「h」で左に移動、「j」で下に移動、「k」で上に移動、「l」で右に移動
:::  

## ネットワーク設定（root 権限で実施）

### IPアドレスの設定（nmtui）
`nmtui`コマンドを用いてIPアドレスを手動で設定します。

```bash
sudo nmtui
```

- 接続の編集 → 対象インターフェースを選択 → 編集
- IPv4 の設定: 手作業
- アドレス: `{{serverIP}}/24`
- ゲートウェイ: `{{gatewayIP}}`
- DNS サーバー: `{{gatewayIP}}`
- 検索ドメイン: `netsys.cs.t-kougei.ac.jp cs.t-kougei.ac.jp t-kougei.ac.jp`

設定後、OK → 戻る → 終了。

### ホスト名の設定

`hostnamectl`コマンドを使用してホスト名を変更します。

```bash
tome@{{serverHostname}}:~$ hostnamectl set-hostname {{serverHostname}}.netsys.cs.t-kougei.ac.jp [Enter]
```

### 設定確認とネットワーク再起動

IPアドレスが適切にenp10のinetに割り当てられているか確認します。
```bash
tome@{{serverHostname}}:~$ ip a
```

もしも割り当てられていなかったらNetworkManagerを再起動します。

```bash
tome@{{serverHostname}}:~$ sudo systemctl restart NetworkManager
```

### APTのプロキシ設定
APTパッケージマネージャーが大学内のプロキシサーバを経由できるように設定を行います。

```bash
tome@{{serverHostname}}:~$ sudo vi /etc/apt/apt.conf
```

以下を設定します。

```
Acquire::http::Proxy "http://proxy-a.t-kougei.ac.jp:8080";
Acquire::https::Proxy "http://proxy-a.t-kougei.ac.jp:8080";
```

## 便利ツールの追加
ネットワークの利用状況を確認する
`netstat`コマンドなどを使用するために `net-tools` を導入します。

```bash
tome@{{serverHostname}}:~$ sudo apt -y install net-tools
```

# NFS クライアント

NFSはネットワーク上でファイルの送受信を行うためのプロトコルです。  
NFSクライアントはNFSサーバからファイルを取得するためのソフトです。

## NFSのインストール
```bash
tome@{{serverHostname}}:~$ sudo apt -y install nfs-common
```
## NFSマウントの例
初めにマウントポイントを作成します。  
`mount`コマンドの`-t`オプションでnfsであることを明記します。  
使用後は`umount`コマンドでアンマウントを行います。
```bash
tome@{{serverHostname}}:~$ sudo mkdir -p /jpc1
tome@{{serverHostname}}:~$ sudo mount -t nfs 172.21.14.1:/home1/unix/install /jpc1
tome@{{serverHostname}}:~$ sudo umount /jpc1
```

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

# ファイアウォールの設定（UFW）

25 番ポート（IPv4）を許可:
```bash
sudo ufw allow proto tcp to 0.0.0.0/0 port 25
```

特定のIPアドレスを許可:
```bash
sudo ufw allow proto tcp from {{clientIP}}
```

状態確認とルール削除:
```bash
sudo ufw status numbered
sudo ufw delete <番号>
```

有効化/無効化:
```bash
sudo ufw enable
sudo ufw disable
```

起動/停止は `systemctl` でも制御可能です。


# ログインサーバ（SSH）
SSHは離れたコンピュータをセキュアに遠隔操作することが出来ます。

## インストールと起動確認
```bash
tome@{{serverHostname}}:~$ sudo apt -y install openssh-server
```

```bash
tome@{{serverHostname}}:~$ sudo systemctl status sshd
```

## rootログインの許可（必要な場合のみ）

```bash
sudo vi /etc/ssh/sshd_config
```

以下を追加/変更します。

```
PermitRootLogin yes
```

反映:

```bash
sudo systemctl restart ssh
```

接続例:

```bash
# サーバからクライアントへ  
ssh -l root {{clientIP}}  
# クライアントからサーバへ  
ssh -l root {{serverIP}}  
```

## telnet サーバ

```bash
sudo apt -y install telnetd
telnet {{serverHostname}}
```

## rsh サーバ

```bash
sudo apt -y install rsh-client rsh-server
```

パスワードなし接続の例（検証用途）:

```bash
# サーバ側（{{serverHostname}}）
sudo sh -c 'echo "root {{clientIP}}" > /root/.rhosts'
sudo vi /root/.rhosts
```

以下を記入
```
root {{clientIP}}
```
クライアントからサーバへ接続

```bash
# クライアント側（client1）
sudo sh -c 'echo "root {{serverIP}}" > /root/.rhosts'
```

# 参考
（参考）suができるユーザの設定
（参考）# usermod -aG adm ユーザ名



