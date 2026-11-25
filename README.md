# VyuhStack example: Node.js (Express)

An Express app run by systemd. The page and `/health` show the commit the
process was started from, so you can see each push go live.

## One-time VM setup

Run on the VM with sudo:

```bash
apt update && apt install -y git
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt install -y nodejs

# deploys run as vyuh-user in a non-interactive shell: this must print a path
runuser -l vyuh-user -c 'command -v npm && node -v'
```

Then connect the repo in VyuhStack (settings below) and click **Verify**, which
clones it into `/opt/app`. After that, install the service:

```bash
cp /opt/app/deploy/app.service /etc/systemd/system/app.service
systemctl daemon-reload
systemctl enable app
```

The first deploy installs the dependencies and starts it.

## Deploy from Git settings

| Field | Value |
|---|---|
| Repository URL | `https://github.com/Vyuhstack/vyuhstack-example-node.git` |
| Branch | `main` |
| Folder on VM | `/opt/app` |
| Run as user | `vyuh-user` |
| Build | `npm ci --omit=dev` |
| Release | `sudo -n systemctl restart app` |

Application port in VyuhStack: `3000`.

`sudo -n` needs passwordless sudo for `vyuh-user`. VyuhStack VMs have it by
default; check with `runuser -l vyuh-user -c 'sudo -n true && echo ok'`.
Otherwise add a rule with `visudo -f /etc/sudoers.d/vyuhstack-deploy`:

```
vyuh-user ALL=(root) NOPASSWD: /usr/bin/systemctl restart app
```

## Check it

```bash
curl -s http://<vm-hostname>/health
```

Push a change and the `commit` value updates after the deploy finishes.

## Try a failed build

Add a dependency that doesn't exist to `package.json` (for example
`"no-such-package-vyuh": "1.0.0"`) and push. The deploy fails at `npm ci`, the
release step doesn't run, and the running app keeps serving the old commit.
