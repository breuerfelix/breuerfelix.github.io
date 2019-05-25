---
layout: page
title: SSH - shortcut
---

Open `~/.ssh/config` on your computer.  

Insert:
```config
Host shortcut_name
	HostName ip_of_server
	Port server_port
	User user_to_login
	IdentityFile path_to_key_file //optional
```

Use your new commmand:
```bash
$ ssh shortcut_name
```

You will be prompted to enter the password for given user.