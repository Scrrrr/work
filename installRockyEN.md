# Rocky Linux Installation
Rocky Linux is a highly stable Linux distribution specialized for server use. We will now install Rocky Linux on your computer and build a server with mail server and web server functionality.
The version to be installed is Rocky Linux 9.5.

:::note
This manual contains verification questions throughout. When you answer correctly, the hidden text in the main body will be automatically revealed, allowing you to continue reading. If you are unsure of the answer, **please open a new tab from this manual and search the internet using keywords.**

Try answering the question below.
{question:Enter Linux in katakana}{answer:リナックス}

You can answer the questions as many times as you like.
If you don't know the answer even after 3 minutes have passed since your first attempt, the **"Show Answer" button** will appear.
**!!If you never answer, the button will not appear even after 3 minutes have passed!!**
:::

## Language Selection
When the installation starts, a language selection menu will be displayed. Select [Japanese] from the middle of the left menu, then select [Continue].

## Installation Destination
Determine the system installation destination.
Select [Installation Destination] to automatically determine the installation destination, then click the blue [Done] button in the upper left.

:::note
It's OK if the warning icon on the system's [Installation Destination] has disappeared.
:::

## Kdump
To disable Kdump, select [KDUMP], uncheck [Enable kdump], and select [Done].

## Network Configuration
Next, configure the network. Select [Network & Host Name] and enter `{{serverHostname}}.netsys.cs.t-kougei.ac.jp` in the hostname text box at the bottom left.

After entering the hostname, click [Apply]. The current hostname will then be displayed at the bottom right.
:::caution
Please note that if you don't click [Apply], the settings will not be applied.

If you make a mistake with the hostname, it will cause problems in future configurations.
Please carefully verify the input. We recommend paying special attention to small errors such as confusing "cs" and "sc" or typos like "t-kougei" and "t-kuogei".
:::

Furthermore, select [Configure], click [IPv4 Settings], and change the method from **Automatic (DHCP)** to **Manual**.

Select [Add] for Address and enter values for the following items.

| Item Name | Input Value |
| Address | {{serverIP}} |
| Netmask | 24 |
| Gateway | {{gatewayIP}} |
| DNS Server | {{gatewayIP}} |
| Search Domains | netsys.cs.t-kougei.ac.jp, cs.t-kougei.ac.jp, t-kougei.ac.jp |

After entering, press [Save] to close.

After entering, click the toggle button in the upper right to enable it.

If Ethernet displays "Connected", the network connection is complete.

Press [Done] in the upper left.

## Date & Time Settings
Select **[Date & Time]** from the regional settings.
Click the **gear icon** in the upper left and enter `ntp-a.t-kougei.ac.jp` in **[Add NTP Server]**, then press the **[+] button**.

If there is a check mark in the active field for `ntp-a.t-kougei.ac.jp`, the addition is complete.
Check the "In Use" checkbox on the far right of the `ntp-a.t-kougei.ac.jp` item, and **uncheck all other "In Use" checkboxes.**

Close with OK and press the **[Done]** button in the upper left.

## Software Selection
Select the software to install. Select [Software Selection] and choose [Server with GUI] as the base environment.
Select the following additional software for the selected environment:
- **Mail Server**
- **Basic Web Server**

After making your selections, click **[Done]** in the upper left.

## Root Password Setup
Click **[Root Password]** under [User Settings].

Enter [netsys00] as the root password, and enter the same password again for confirmation.

After entering, click **[Done]** in the upper left.

:::caution
A message saying [This password fails the dictionary check] will be displayed, but in this case, click Done twice.
:::

## User Creation
Create user tome.

|auto|
| Item Name | Input Value | 
| Full Name | tome | 
| Username | tome | 
| Password | netsys00 | 
| Confirm Password | netsys00 |

After entering, click **[Done]** in the upper left.

:::caution
Similar to the root password, a message saying [This password fails the dictionary check] will be displayed, but in this case, click Done twice.
:::

## Begin Installation
After all configuration items are complete, select **[Begin Installation]**.
:::note
The installation will take some time, so please wait until it finishes.
:::

After the installation is complete, select [Reboot System] to restart the server.

# Basic Configuration

## Login
When the login screen is displayed, perform the login. To log in as root, select **[Can't find your account?]** and log in as root.

|auto|
| Item Name | Input Value | 
| Username | root | 
| Password | netsys00 | 

## Terminal Launch
Click [Activities] in the upper left, or press the `Win` key.
Hover your cursor over the icons displayed at the bottom center to see the application names, then find [Terminal] from there. Alternatively, press the <win> key and search for [Terminal], then launch the [Terminal] application that appears.

## Disable SELinux
{question:What is the Linux security feature that distributes administrator privileges across the system to enhance security?}{answer:selinux}{hint:Mandatory Access Control (MAC) Rocky Linux}
Disable SELinux.

```bash
root@{{serverHostname}}:~# vi /etc/selinux/config
```


:::note
Delete the lines marked in **red** and add the lines marked in **green**.
:::
Make the following changes:
```{file=/etc/selinux/config}
-[[SELINUX=enforcing]]
+[[#SELINUX=enforcing]]
+[[SELINUX=disabled]]
```

:::hint
In vi editor, in normal mode, "h" moves left, "j" moves down, "k" moves up, "l" moves right.  
Press "i" to enter insert mode. Press "Esc" to return to normal mode.
In normal mode, ":w" saves, ":q" quits, ":wq" saves and quits.

Also, in normal mode, you can search for text with `/<text to search>`. Press the **Esc** key to stop searching.
:::  

## Power Settings
The default settings will lock the screen after 5 minutes, so we'll disable this in the settings.

Click the power icon in the upper right, then click **[Settings]** from the displayed items to launch the settings menu.
Find and click **[Power]** in the middle of the settings menu sidebar, and change the **[Screen Blank]** setting from `5 minutes` to `Never`.

## Proxy Settings for Each Tool

### NetworkManager Proxy Settings
Find and click **[Network]** in the upper part of the settings menu sidebar, find the **Network Proxy** setting item, and click the **gear icon**.  
Change from **[Off]** to **[Manual]** and enter the following input values for each item.

| Item Name | Input Value | Port |
| HTTP Proxy | proxy-a.t-kougei.ac.jp | 8080 |
| HTTPS Proxy | proxy-a.t-kougei.ac.jp | 8080 |
| FTP Proxy | proxy-a.t-kougei.ac.jp | 8080 |
| SOCKS Host | proxy-a.t-kougei.ac.jp | 8080 |
| Ignore Hosts | *.t-kougei.ac.jp | - |

After entering, close with ×.
Also close the settings menu with ×.


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

### dnf Proxy Settings
{question:What is the name of the advanced package manager used in Red Hat-based Linux?}{answer:dnf}{hint: dandified yum}
Configure the dnf package manager.

```bash
root@{{serverHostname}}:~# vi /etc/dnf/dnf.conf
```

Add the following below `skip_if_unavailable=False`.

```{file=/etc/dnf/dnf.conf}
…
best=True
skip_if_unavailable=False
+[[proxy=http://proxy-a.t-kougei.ac.jp:8080]]
+[[timeout=900]]
```

After saving and exiting, perform an update.

```bash
root@{{serverHostname}}:~# dnf -y update 
```

If the update completes without problems, the proxy configuration is complete.

# Mail Server Setup

A mail server is a server for sending and receiving mail.  
**Postfix** is used for sending mail, and **Dovecot** is used for receiving mail.  

## Postfix
Postfix is an open-source Mail Transfer Agent (MTA) that handles email sending and delivery.

:::note
Postfix was already installed during OS installation, but if you forgot to check this item, please install it using the following command.

```bash
root@{{serverHostname}}:~# dnf -y install postfix
```
:::

### Postfix Configuration

Edit the Postfix configuration file `/etc/postfix/main.cf` using the `vi` editor.

```bash
root@{{serverHostname}}:~# vi /etc/postfix/main.cf
```

Make the following configuration changes.
Red indicates lines to delete, and green indicates lines to add.
Plain text represents surrounding configuration items.

{question:What is the Postfix directive that forwards mail to a specified server?}{answer:relayhost}{hint:relay mail}

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
-[[inet_protocols = all]]
+[[#inet_protocols = all]]
+[[inet_protocols = ipv4]]

#home_mailbox = Mailbox
#home_mailbox = Maildir/
+[[home_mailbox = Maildir/]]
```

### Apply Postfix Configuration
{question:What is the command to operate systemd, the software that manages Linux systems?}{answer:systemctl}{hint:systemd + control}

Restart Postfix using the `systemctl` command.
```bash
root@{{serverHostname}}:~# systemctl restart postfix
```

After restarting, check the status.
```bash
root@{{serverHostname}}:~# systemctl status postfix
```

If you see `Active: active (exited)` along with a green mark, press `q` to exit.

Configure it to start automatically after restart.
```bash
root@{{serverHostname}}:~# systemctl enable postfix
```

## Firewall Configuration
{question:What is the command to operate firewalld, the default firewall in Red Hat-based systems?}{answer:firewall-cmd}
Configure the firewall using the `firewall-cmd` command.

### Check firewall-cmd Status
First, check if firewall-cmd is running.
```bash
root@{{serverHostname}}:~# firewall-cmd --state
running
```

If it displays `running`, it is running.

:::hint
If it's not running, start it using the following method.
```bash
root@{{serverHostname}}:~# systemctl start firewalld
```

Also, configure it to start automatically.
```bash
root@{{serverHostname}}:~# systemctl enable firewalld
```
:::

### Add Allowed Services
Specify services to allow connections from outside. The service to add this time is smtp. Allow it as follows.
```bash
root@{{serverHostname}}:~# firewall-cmd --permanent --add-service=smtp
success
```

If `success` is displayed after executing the command, the addition was successful.

### Apply Allowed Service Settings
Apply the added settings using the following command.
```bash
root@{{serverHostname}}:~# firewall-cmd --reload
success
```

### Verify Settings
You can check the configured content using the following command.
```bash
root@{{serverHostname}}:~# firewall-cmd --list-all
```

```
services: cockpit dhcpv6-client +[[smtp]] ssh
```
If `smtp` appears in the [services] field, the firewall configuration is complete.

## Verification from Client

### Client Launch and Login
After a while, a window asking **"Start the client?"** will appear. Select "Yes".

Launch the client and test email sending using the `mail` command.

From the SSCTS menu, click **[Virtual Computer Operations]**. Click **[Control]** for **[Client]**, then click **[Start]** to launch the client.

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

Restart Postfix.
```bash
root@{{clientHostname}}:~# systemctl restart postfix
```


### Send to tome using mail command 
Launch the terminal and send a message "test" to tome using the `mail` command.  
```bash
root@{{clientHostname}}:~# echo "test" | mail tome@{{serverHostname}}.netsys.cs.t-kougei.ac.jp
```

If a new file has been created in the server's `/home/tome/Maildir/new` directory and the file content is "test", it's successful.
```bash
root@{{serverHostname}}:~# ls /home/tome/Maildir/new
```

### Verify Email Sending to External Network
Test whether mail reaches outside the server.
Send an email from the client to your university email address and verify that the mail arrives.
```bash
root@{{clientHostname}}:~# echo "test" | mail <student ID>@st.t-kougei.ac.jp
```

If a message "test" from root has arrived in your university mailbox, it's successful.

This completes the Postfix setup.

## Dovecot (POP3)
Dovecot is an open-source mail receiving server that supports both IMAP and POP3 protocols.

:::note
It's already installed, but if it's not installed, please install it using the following command.
```bash
root@{{serverHostname}}:~# dnf -y install dovecot
```
:::

### Dovecot Configuration
Open the Dovecot configuration file `/etc/dovecot/dovecot.conf` using the vi editor.
```bash
root@{{serverHostname}}:~# vi /etc/dovecot/dovecot.conf
```

Set protocols to pop3 only.  

```{file=/etc/dovecot/dovecot.conf}
-[[protocols = imap pop3 lmtp submission]]
+[[#protocols = imap pop3 lmtp submission]]
+[[protocols = pop3]]
```

Open the Dovecot configuration file `/etc/dovecot/conf.d/10-ssl.conf` using the vi editor.

```bash
root@{{serverHostname}}:~# vi /etc/dovecot/conf.d/10-ssl.conf
```

Disable SSL.
{question:What setting should be written to disable SSL in Dovecot? Enter the directive name and parameter (include spaces before and after the equals sign)}{answer:ssl = no}{hint:Search the web for "10-ssl.conf ssl disable"}

```{file=/etc/dovecot/conf.d/10-ssl.conf}
-[[ssl = required]]
+[[ssl = no]]
```
Open the Dovecot configuration file `/etc/dovecot/conf.d/10-auth.conf` using the vi editor.

```bash
root@{{serverHostname}}:~# vi /etc/dovecot/conf.d/10-auth.conf
```

Allow plain text authentication.

```{file=/etc/dovecot/conf.d/10-auth.conf}
#disable_plaintext_auth = yes
+[[disable_plaintext_auth = no]]
```

Open the Dovecot configuration file `/etc/dovecot/conf.d/10-mail.conf` using the vi editor.

```shell
root@{{serverHostname}}:~# vi /etc/dovecot/conf.d/10-mail.conf
```

Change `mail_location` to `maildir`.

```{file=/etc/dovecot/conf.d/10-mail.conf}
#   mail_location = maildir:~/Maildir
#   mail_location = mbox:~/mail:INBOX=/var/mail/%u
#   mail_location = mbox:/var/mail/%d/%1n/%n:INDEX=/var/indexes/%d/%1n/%n
#
# <doc/wiki/MailLocation.txt>
#
#mail_location = 
+[[mail_location = maildir:~/Maildir]]
```

### Apply Dovecot Configuration
Restart Dovecot using the `systemctl` command.

```bash
root@{{serverHostname}}:~# systemctl restart dovecot
```

After restarting, check the status to see if it's running.
```bash
root@{{serverHostname}}:~# systemctl status dovecot
```

If you see `Active: active (exited)` along with a green mark, press `q` to exit.

If there are no problems with the status, configure it to start automatically.
```bash
root@{{serverHostname}}:~# systemctl enable dovecot
```

## Firewall Configuration
Configure the firewall using the `firewall-cmd` command.

### Add Allowed Services
Specify services to allow connections from outside. The service to add this time is pop3. Allow it as follows.
```bash
root@{{serverHostname}}:~# firewall-cmd --permanent --add-service=pop3
success
```

If `success` is displayed after executing the command, the addition was successful.

### Apply Allowed Service Settings
Apply the added settings using the following command.
```bash
root@{{serverHostname}}:~# firewall-cmd --reload
success
```

### Verify Settings
You can check the configured content using the following command.
```bash
root@{{serverHostname}}:~# firewall-cmd --list-all
```

```
services: cockpit dhcpv6-client +[[pop3]] smtp ssh
```
If `pop3` appears in the [services] field, the firewall configuration is complete.


## Verification from Client
Launch Client1 and verify mail reception from the client using the `telnet` command.

```bash
root@client1:~$ telnet {{serverHostname}} 110
Trying {{serverIP}}...
Connected to {{serverHostname}}.
Escape character is '^]'.
+[[+OK Dovecto ready.]]
```
From the message `+OK Dovecto ready.`, we can confirm that we've connected to Dovecot.

:::hint
To exit telnet, enter `quit`.
```bash
[root@{{clientHostname}} ~]# telnet {{serverHostname}} 25
…
+OK Dovecot ready.
quit
+OK Logging out
Connection closed by foreign host.
```
:::


### Check Mail Content
Enter Dovecot commands via telnet.
First, log in by specifying `USER` and `PASS`.
```bash
USER tome
+OK
PASS netsys00
+OK Logged in.
```
If `+OK Logged in.` is displayed, you are logged in.

```bash
list
+OK 1 message:
1 792
```

From the message `+OK 1 message:`, we can confirm that there is 1 email.
`1 792` represents the email number and email size in bytes.

```bash
retr 1
+OK 792 octets
Return-Path: root@{{serverHostname}}.netsys.cs.t-kougei.ac.jp
X-Original-TO: tome
<略>
```

If the sent email is displayed, the mail server setup is complete.

# Web Server Setup

:::note
It's already installed, but if it's not installed, please install it using the following command.

```bash
root@{{serverHostname}}:~# dnf -y install httpd
```
:::

## httpd Configuration
{question:Where is the httpd configuration file located? (Enter absolute path)}{answer:/etc/httpd/conf/httpd.conf}{hint:httpd.conf}

```bash
root@{{serverHostname}}:~# vi /etc/httpd/conf/httpd.conf
```

Enter the server name and port number.

```{file=/etc/httpd/conf/httpd.conf}
#ServerName www.example.com:80
+[[ServerName {{serverHostname}}.netsys.cs.t-kougei.ac.jp:80]]
```

## Content Placement
Place the content provided by the server in `/var/www/html/`. The filename should be `index.html`.

```bash
root@{{serverHostname}}:~# vi /var/www/html/index.html
```

```{file=/var/www/html/index.html}
hello world
```

### httpd Restart
Restart httpd to load the configuration file.

```bash
root@{{serverHostname}}:~# systemctl restart httpd
```

After loading, check the status.
```bash
root@{{serverHostname}}:~# systemctl status httpd
```

Verify that it shows `Active: active (exited)` along with a green mark and press `q` to exit.


Configure it to start automatically.
```bash
root@{{serverHostname}}:~# systemctl enable httpd
```

## Verification on Server
Verify that hello world is actually displayed.

Click the application icon in the bottom left, enter `Firefox` in the search bar, and launch the application that appears.

Enter [http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp](http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp) in the navigation bar to access it.

:::hint
If a warning is displayed, access it using the following steps.

**[Advanced...]** -> **[Accept the Risk and Continue]**
:::

If "hello world" is displayed on a plain white background, the verification from the server is successful.

## Firewall Configuration
Configure the firewall using the `firewall-cmd` command.

### Add Allowed Services
Specify services to allow connections from outside. The service to add this time is http. Allow it as follows.
```bash
root@{{serverHostname}}:~# firewall-cmd --permanent --add-service=http
success
```

If `success` is displayed after executing the command, the addition was successful.

### Apply Allowed Service Settings
Apply the added settings using the following command.
```bash
root@{{serverHostname}}:~# firewall-cmd --reload
success
```

### Verify Settings
You can check the configured content using the following command.
```bash
root@{{serverHostname}}:~# firewall-cmd --list-all
```

```
services: cockpit dhcpv6-client +[[http]] pop3 smtp ssh
```
If `http` appears in the [services] field, the firewall configuration is complete.

## Verification from Client
Launch {{clientHostname}} and access the following URL from Firefox.
[http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp](http://{{serverHostname}}.netsys.cs.t-kougei.ac.jp)

If "hello world" appears on a plain white page, it's complete.

This completes the OS installation and configuration.

