# Ubuntu Installation
Ubuntu is a highly popular Linux distribution for both server and desktop use. We will now install Ubuntu on your computer and build a server with mail server and web server functionality.
The version to be installed is Ubuntu 22.04.2 - Desktop.

:::note
This manual contains verification questions throughout. When you answer correctly, the hidden text in the main body will be automatically revealed, allowing you to continue reading. If you are unsure of the answer, **please open a new tab from this manual and search the internet using keywords.**

Try answering the question below.
{question:Enter Linux in katakana}{answer:リナックス}

You can answer the questions as many times as you like.
If you don't know the answer even after 3 minutes have passed since your first attempt, the **"Show Answer" button** will appear.
**!!If you never answer, the button will not appear even after 3 minutes have passed!!**
:::

## Language Selection
Select the language to use. By default, it is set to Japanese.
Scroll down the left list and select a language according to the language you want to use.
After selecting the language, select **[ Install Ubuntu ]**.

## Keyboard Layout Settings
Configure the keyboard layout.
By default, it is set to Japanese layout.
If there are no problems, select **[ Continue ]**.

## Updates and Other Software
Select **[ Normal installation ]** and select **[ Continue ]**.

## Installation Type
Select **[ Erase disk and install Ubuntu ]** and select **[ Install ]**.

A window asking **[ Write the changes to disks? ]** will appear. If there are no problems, select **[ Continue ]**.

## Where Are You?
Configure the time settings.  
If a pin is placed on Japan on the world map and "Tokyo" appears in the input field below, select [Continue].

## Enter Your Information
Configure the displayed items according to the following table.
|auto|
|Item|Input Value|
|Your Name|tome  |
|Computer Name|{{serverHostname}}  |
|Username|tome  |
|Password|netsys00|
|Confirm Password|netsys00|
Check [Require my password to log in] and select [Continue].

## Begin Installation
Once the installation preparation is complete, the installation will begin.
The installation will take some time.

When the installation is complete, you will be prompted to restart along with a popup saying [Installation Complete].

Select **[ Restart Now ]** to restart.

:::note
While the Ubuntu logo and loading mark are displayed, you will see "Please remove the installation medium, then press ENTER: (Please remove the installation medium and press the ENTER key.)". Follow the instructions and press Enter, and the machine will completely shut down.
:::

From the SCTS menu, select "Start Installation Server" and select Ubuntu to start it again.

# Basic Configuration

## Login
When the startup is complete, a login screen will be displayed.

Click the `tome` icon in the center, enter the password you set `netsys00`, and press Enter to log in.

## Initial Setup Window
When you log in for the first time, the Livepatch security setup will be displayed.
Click [Next] on the left and press [Done].

## Terminal Launch
Click the [Applications] icon at the bottom left and click [Terminal] from the items. Alternatively, enter [Terminal] in the [Search Keywords] field and click [Terminal].

:::hint
You can also open the terminal with `Ctrl+Alt+T`
:::

## Root Password Setup
Open the terminal and set the root password.
Set the root password to `netsys00`.

{question:What command is used when a regular user executes commands with administrator privileges?}{answer:sudo}{hint:abbreviation of super user do}

```bash
tome@{{serverHostname}}:~$ sudo passwd root
Password for tome:
New password:
Retype new password:
```
:::caution
No characters will be displayed while entering the password.
After entering with the keyboard, press Enter.
:::

## Login as Root User
Currently, you are logged in as tome, but to work as root in the future, log in as root.
```bash
tome@{{serverHostname}}:~# su -
Password:
root@{{serverHostname}}:~#
```
In root privileges, the shell prompt changes from `$` to `#`.
Since root privileges have all system permissions, please operate carefully.

## Network Configuration
Launch nmtui to configure the network.
```bash
root@{{serverHostname}}:~# nmtui
```

Edit the network configuration file with `Edit Connection` -> `Edit`.
:::hint
TUI (Terminal User Interface) operations are mainly performed with `Tab key`, `Arrow keys`, and `Enter key`.
:::

Press [Enter] on `**Automatic**` under **IPv4 Configuration** and change it to `**Manual**`.
Move the cursor to `**<Show>**` on the right and press [Enter].

Enter the following for each item:
| Item Name | Input Value |
| Address | {{serverIP}}/24 |
| Gateway | {{gatewayIP}} |
| DNS Server | {{gatewayIP}} |
| Search Domain | netsys.cs.t-kougei.ac.jp
| Search Domain | cs.t-kougei.ac.jp
| Search Domain | t-kougei.ac.jp

Next, press [Enter] on `**Automatic**` under **IPv6 Configuration** and change it to `**Disable**`.

After all settings are complete, select `**<OK>**` at the bottom and press [Enter].
Press `**<Back>**` to return to the beginning.

:::caution
If you cannot connect to the network after restarting, go to Settings -> Network Settings -> IPv4 and change "Automatic" to "Manual".
:::

### Hostname Configuration
Select `Set System Hostname` from the first option selection menu in `nmtui`.
Change the hostname from `{{serverHostname}}` to `{{serverHostname}}.netsys.cs.t-kougei.ac.jp` and press [Enter] on `**<OK>**`.
:::caution
If you make a mistake with the hostname, it will cause problems in future configurations.
Please carefully verify the input. We recommend paying special attention to small errors such as confusing "cs" and "sc" or typos like "t-kougei" and "t-kuogei".
:::

When "Set hostname to '{{serverHostname}}.netsys.cs.t-kougei.ac.jp'" is displayed, it's complete. Press [Enter] on `**<OK>**`.

After all settings are complete, press [Enter] on `**<OK>**` at the end of the first option selection menu.

### Verify Network Configuration
Use the `ip` command to verify that the network connection is working correctly.
```bash
root@{{serverHostname}}:~# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
…
2: enp1s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 52:54:00:62:e8:57 brd ff:ff:ff:ff:ff:ff
    inet {{serverIP}}/24 brd 10.10.1.255 scope global noprefixroute enp1s0
       valid_lft forever preferred_lft forever
```

If the `inet` of the network device `enp1s0` shows `{{serverIP}}/24`, it is configured correctly.
Also, if there is no ipv6 item for enp1s0, ipv6 has been disabled.

### Verify Hostname Configuration
```bash
root@{{serverHostname}}:~# cat /etc/hostname
```
If the hostname is displayed correctly, the configuration is complete.

## NTP Configuration
By default, it is connected to European NTP servers, so we will configure it to connect to `ntp-a.t-kougei.ac.jp` installed on campus.

### Create Configuration File Directory
The NTP protocol is managed by Systemd. Creating `timesyncd.conf.d` allows us to place configuration files.
```bash
root@{{serverHostname}}:~# mkdir -p /etc/systemd/timesyncd.conf.d/
```

### Create Configuration File
Create a new NTP configuration file `ntp-kougei.conf` using vi.
```bash
root@{{serverHostname}}:~# vi /etc/systemd/timesyncd.conf.d/ntp-kougei.conf
```

```{file=/etc/systemd/timesyncd.conf.d/ntp-kougei.conf}
[Time]
NTP=ntp-a.t-kougei.ac.jp
```

### Restart systemd-timesyncd
{question:What is the command to operate systemd, the software that manages Linux systems?}{answer:systemctl}{hint:systemd + control}
Restart `systemd-timesyncd` using the `systemctl` command.
```bash
root@{{serverHostname}}:~# systemctl restart systemd-timesyncd
```

### Verify NTP Connection
Use the `timedatectl` command to verify that it is connected to the university's NTP server.
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
If `ntp-a.t-kougei.ac.jp` is written in the [Server] field, it's complete.


## Proxy Settings for Each Tool

### NetworkManager Proxy Settings
Click the power icon in the upper right and select [Settings] from the displayed items.
Click the gear icon for `Network Proxy` in the network settings.
Change from **Off** to **Manual** and enter the following items:
| Item Name | Input Value | Port |
| HTTP Proxy | proxy-a.t-kougei.ac.jp | 8080 |
| HTTPS Proxy | proxy-a.t-kougei.ac.jp | 8080 |
| FTP Proxy | proxy-a.t-kougei.ac.jp | 8080 |
| SOCKS Host | proxy-a.t-kougei.ac.jp | 8080 |
| Ignore Hosts | *.t-kougei.ac.jp | - |

After entering, close with ×.
Also close the settings window with ×.

### Bash Proxy Settings
Return to the terminal to configure.  
Create a new `/etc/profile.d/proxy.sh` file and write the proxy settings.

```bash
root@{{serverHostname}}:~# vi /etc/profile.d/proxy.sh
```

:::hint
In vi editor, in normal mode, "h" moves left, "j" moves down, "k" moves up, "l" moves right.  
Press "i" to enter insert mode. Press "Esc" to return to normal mode.
In normal mode, ":w" saves, ":q" quits, ":wq" saves and quits.
:::  

```{file=/etc/profile.d/proxy.sh}
HTTP_PROXY=http://proxy-a.t-kougei.ac.jp:8080
HTTPS_PROXY=http://proxy-a.t-kougei.ac.jp:8080

http_proxy=http://proxy-a.t-kougei.ac.jp:8080
https_proxy=http://proxy-a.t-kougei.ac.jp:8080
```

Load the created configuration file using the `source` command.

```bash
root@{{serverHostname}}:~# source /etc/profile.d/proxy.sh
```
### apt Proxy Settings
{question:What is the command for the advanced package manager used in Debian-based Linux?}{answer:apt}{hint:abbreviation of advanced package tool}
Create a new `30proxy.conf` file under `/etc/apt/apt.conf.d`.
```bash
root@{{serverHostname}}:~# vi /etc/apt/apt.conf.d/30proxy.conf
```

Write the following in the file.

```{file=/etc/apt/apt.conf.d/30proxy.conf}
Acquire::http::Proxy "http://proxy-a.t-kougei.ac.jp:8080";
Acquire::https::Proxy "http://proxy-a.t-kougei.ac.jp:8080";
```

### Package Update and Installation
Update the available package information using the following command.
```bash
root@{{serverHostname}}:~# apt update
```
Status is displayed at the beginning. If **Hit** is displayed, it means packages have been updated from existing repositories.
If you can see the **Hit** text, it's successful.

:::note
After package updates, a "Software Updates" popup may appear. Select **"Remind Me Later"** to dismiss it.
:::

Upgrade the packages.
Update the packages using the following command.
```bash
root@{{serverHostname}}:~# apt upgrade -y
```
:::note
The upgrade will take some time, so please be patient
:::

# Mail Server Setup

A mail server is a server for sending and receiving mail.  
**Postfix** is used for sending mail, and **Dovecot** is used for receiving mail.  

## Postfix
Postfix is an open-source Mail Transfer Agent (MTA) that handles email sending and delivery.

### Postfix Installation

```bash
root@{{serverHostname}}:~# apt install -y postfix
```

During installation, [Package Configuration] will be displayed.
Press Done, select **[ Internet Site ]**, verify that the configured hostname is written, and select **<OK>**.

### Postfix Configuration
Edit the Postfix configuration file `/etc/postfix/main.cf` using the `vi` editor.

```bash
root@{{serverHostname}}:~# vi /etc/postfix/main.cf
```

Make the following configuration changes.

:::note
Delete the lines marked in red and add the lines marked in green.
:::

```{file=/etc/postfix/main.cf}
smtpd_relay_restrictions = permit_mynetworks permit_sasl_authenticated defer_unauth_destination
myhostname = {{serverHostname}}.netsys.cs.t-kougei.ac.jp
alias_maps = hash:/etc/aliases
alias_database = hash:/etc/aliases
myorigin = /etc/mailname
mydestination = $myhostname, {{serverHostname}}.netsys.cs.t-kougei.ac.jp, localhost.netsys.cs.t-kougei.ac.jp, , localhost
-[[relayhost = ]]
+[[relayhost = [smtp-a.t-kougei.ac.jp]]]
-[[mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128]]
+[[#mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128]]
+[[mynetworks = 10.10.0.0/16]]
mailbox_size_limit = 0
recipient_delimiter = +
inet_interfaces = all
-[[#inet_protocols = all]]
+[[inet_protocols = ipv4]]
+[[home_mailbox = Maildir/]]
```

{question:What is the Postfix directive that forwards mail to a specified server?}{answer:relayhost}{hint:relay mail}

### Apply Postfix Configuration
Restart Postfix using the `systemctl` command.

```bash
root@{{serverHostname}}:~# systemctl restart postfix
```

Also, configure it so that the service starts after server restart.
```bash
root@{{serverHostname}}:~# systemctl enable postfix
```

## Firewall Configuration
{question:What is the command to easily configure a firewall in Ubuntu?}{answer:ufw}{hint:abbreviation of uncomplicated firewall}
Configure the firewall using the `ufw` command.

### Enable ufw
First, activate ufw.
```bash
root@{{serverHostname}}:~# ufw enable
Firewall is active and enabled on system startup.
```

Verify that ufw is in an active state.
```bash
root@{{serverHostname}}:~# ufw status
Status: active
```
If the status is active, it's complete.

### Add Allowed Services
Specify services to allow connections from outside. The services to add this time are smtp and pop3. Allow them as follows.
```bash
root@{{serverHostname}}:~# ufw allow smtp
Rule added
Rule added (v6)
```

### Verify Firewall Configuration Items
Check the current firewall configuration with the `status` option.
If the Action field for `25` in the To column is `ALLOW` and the From field is `Anywhere`, it's successful.

```bash

root@{{serverHostname}}:~# ufw status
Status: active

To                         Action      From
--                         ------      ----
25/tcp                     ALLOW       Anywhere                  
25/tcp (v6)                ALLOW       Anywhere (v6)             
```

## Verification from Client

### Client Launch and Login

After a while, a window asking **"Start the client?"** will appear. Select "Yes".
Launch the client, install the `mail` command, and test email sending.

Log in with username `root` and password `netsys00`.

### Specify Client relayhost
Change the Postfix mail delivery destination on the client to the server you built.
```bash
root@{{clientHostname}}:~# vi /etc/postfix/main.cf
```

Comment out all existing `relayhost` directives in main.cf and add the newly built server.

```{file=/etc/postfix/main.cf}
#relayhost = [smtp-a.t-kougei.ac.jp]
relayhost = [{{serverHostname}}.netsys.cs.t-kougei.ac.jp]
```

### Send to tome using mail command 
Launch the terminal and send a message "test" to tome using the `mail` command.  
```bash
root@{{clientHostname}}:~# echo "test" | mail tome@{{serverHostname}}.netsys.cs.t-kougei.ac.jp
```

If a new file has been created in the server's `/home/tome/Maildir/new` directory and the file content is "test", it's successful.
```bash
root@{{serverHostname}}:~# ls /home/tome/Maildir/new/
```
:::caution
If it's not in `/home/tome/Maildir/new/`, please check `/home/tome/Maildir/cur`.
:::

### Verify Email Sending to External Network
Test whether mail reaches outside the server.
Send an email from the client to your university email address and verify that the mail arrives.
```bash
root@{{clientHostname}}:~# echo "test" | mail <student ID>@st.t-kougei.ac.jp
```

If a message "test" from root has arrived in your university mailbox, it's successful.


## Dovecot (POP3)
Dovecot is an open-source mail receiving server that supports both IMAP and POP3 protocols.

### Dovecot Installation
```bash
root@{{serverHostname}}:~# apt install -y dovecot-core dovecot-pop3d
```

### Dovecot Configuration
Open the Dovecot configuration file `/etc/dovecot/conf.d/10-ssl.conf` using the vi editor.
```bash
root@{{serverHostname}}:~# vi /etc/dovecot/conf.d/10-ssl.conf
```

Disable SSL.

{question:What setting should be written to disable SSL in Dovecot? Enter the directive name and parameter (include spaces before and after the equals sign)}{answer:ssl = no}{hint:Search the web for "10-ssl.conf ssl disable"}

Comment out `ssl = yes` and add `ssl = no`.
```
-[[ssl = yes]]
+[[#ssl = yes]]
+[[ssl = no]]
```
Open the Dovecot configuration file `/etc/dovecot/conf.d/10-auth.conf` using the vi editor.

```bash
root@{{serverHostname}}:~# vi /etc/dovecot/conf.d/10-auth.conf
```

Uncomment to allow plain text authentication.

```
#disable_plaintext_auth = yes
+[[disable_plaintext_auth = no]]
```

Open the Dovecot configuration file `/etc/dovecot/conf.d/10-mail.conf` using the vi editor.

```bash
root@{{serverHostname}}:~# vi /etc/dovecot/conf.d/10-mail.conf
```

Change `mail_location` to `maildir:~/Maildir`.

```markdown
#   mail_location = maildir:~/Maildir
#   mail_location = mbox:~/mail:INBOX=/var/mail/%u
#   mail_location = mbox:/var/mail/%d/%1n/%n:INDEX=/var/indexes/%d/%1n/%n
#
# <doc/wiki/MailLocation.txt>
#
-[[mail_location = mbox:~/mail:INBOX=/var/mail/%u]]
+[[#mail_location = mbox:~/mail:INBOX=/var/mail/%u]]
+[[mail_location = maildir:~/Maildir]]
```

### Apply Dovecot Configuration
Restart Dovecot using the `systemctl` command.

```bash
root@{{serverHostname}}:~# systemctl restart dovecot
```

Also, configure it so that the service starts after server restart.
```bash
root@{{serverHostname}}:~# systemctl enable dovecot
```

## Firewall Configuration
Configure the firewall using the `ufw` command.

### Add Allowed Services
Specify services to allow connections from outside. The service to add this time is pop3. Allow it as follows.
```bash
root@{{serverHostname}}:~# ufw allow pop3
Rule added
Rule added (v6)
```

### Verify Firewall Configuration Items
Check the current firewall configuration with the `status` option.
If the Action field for `110` in the To column is `ALLOW` and the From field is `Anywhere`, it's successful.

```bash

root@{{serverHostname}}:~# ufw status
Status: active

To                         Action      From
--                         ------      ----
25/tcp                     ALLOW       Anywhere                  
110/tcp                    ALLOW       Anywhere                  
25/tcp (v6)                ALLOW       Anywhere (v6)             
110/tcp (v6)               ALLOW       Anywhere (v6) 
```

## Verification from Client
Launch {{clientHostname}} and verify mail reception from the Client using the `telnet` command.

```bash
root@client1:~$ telnet {{serverHostname}} 110
Trying {{serverIP}}...
Connected to {{serverHostname}}.
Escape character is '^]'.
+[[+OK Dovecto (Ubuntu) ready.]]
```
From the message `+OK Dovecto (Ubuntu) ready.`, we can confirm that we've connected to Dovecot.


### Check Mail Content
Enter Dovecot commands via telnet.
First, log in by specifying `USER` and `PASS`.
```
USER tome
+OK
PASS netsys00
+OK Logged in.
```
If `+OK Logged in.` is displayed, you are logged in.

```bash
list
+OK 1 message:
1 516
```

From the message `+OK 1 message:`, we can confirm that there is 1 email.
`1 516` represents the email number and email size in bytes.

```bash
retr 1
+OK 516 octets
Return-Path: root@{{serverHostname}}.netsys.cs.t-kougei.ac.jp
X-Original-TO: tome
<略>
```

:::hint
To exit telnet, enter `quit`.
```bash
…
+OK Dovecto (Ubuntu) ready.
quit
221 2.0.0 Bye
Connection closed by foreign host.
```
:::

If the sent email is displayed, the mail server setup is complete.

# Web Server Setup

## Apache2 Installation

Install apache2 using the `apt` command.

```bash
root@{{serverHostname}}:~# apt install -y apache2
```

## Apache2 Configuration
Write the apache2 configuration file. The configuration file for the site to be created will be `mywebsite.conf`.

{question:When creating a new website in apache2, in which directory should the configuration file be created? (Enter absolute path)}{answer:/etc/apache2/sites-available}{hint:Search the web for "directory for unique settings of available websites apache2"}
```bash
root@{{serverHostname}}:~# vi /etc/apache2/sites-available/mywebsite.conf
```

Enter the server name.
```{file=/etc/apache2/sites-available/mywebsite.conf}
ServerName {{serverHostname}}.netsys.cs.t-kougei.ac.jp
```

Enable the created configuration file using the `a2ensite` command.
{question:What is the command to enable a website configuration file created in apache2?}{answer:a2ensite}{hint:The command starts with "a2"}

```bash
root@{{serverHostname}}:~# a2ensite mywebsite
```

Reload the Apache2 configuration using the `systemctl` command.
```bash
root@{{serverHostname}}:~# systemctl reload apache2
```

## Content Placement
Place the content provided by the server in `/var/www/html/`. Since `index.html` already exists, delete its contents and write new content.

```bash
root@{{serverHostname}}:~# vi /var/www/html/index.html
```

:::hint
In vi, you can delete all text with `:%d`.
:::

```{file=/var/www/html/index.html}
hello world
```

## Verification on Server
Verify that hello world is actually displayed.

Click the application icon in the bottom left, enter `Firefox` in the search bar, and launch the application that appears.

Enter [http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp](http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp) in the navigation bar to access it.

If "hello world" is displayed on a plain white background, the verification from the server is successful.

## Firewall Configuration
Configure the firewall using the `ufw` command.
```bash
root@{{serverHostname}}:~# ufw allow http
```
:::note
If you haven't activated ufw with Postfix, activate it with the following command.
```bash
root@{{serverHostname}}:~# ufw enable
```
:::

### Verify Firewall Configuration Items
```bash

root@{{serverHostname}}:~# ufw status
Status: active

To                         Action      From
--                         ------      ----
25/tcp                     ALLOW       Anywhere                  
110/tcp                    ALLOW       Anywhere                  
80/tcp                     ALLOW       Anywhere                  
25/tcp (v6)                ALLOW       Anywhere (v6)             
110/tcp (v6)               ALLOW       Anywhere (v6) 
80/tcp (v6)                ALLOW       Anywhere (v6) 
```

If `80/tcp` has been added, the firewall configuration is complete.

## Verification from Client
Launch {{clientHostname}} and verify that you can access the web server.  

Access [http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp](http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp) from Firefox.

If "hello world" is displayed on a plain white background, similar to the server verification, the client verification is successful.

