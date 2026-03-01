#!/bin/bash
set -euo pipefail
exec > /var/log/user-data.log 2>&1

# ── System ────────────────────────────────────────────────────────────────────
apt-get update -y
apt-get install -y git curl gnupg

# ── Node.js 20 ────────────────────────────────────────────────────────────────
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# ── MongoDB 8 (Ubuntu 24.04 / Noble) ─────────────────────────────────────────
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
  gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] \
  https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | \
  tee /etc/apt/sources.list.d/mongodb-org-8.0.list
apt-get update -y
apt-get install -y mongodb-org
systemctl enable --now mongod

# ── cloudflared ───────────────────────────────────────────────────────────────
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb \
  -o /tmp/cloudflared.deb
dpkg -i /tmp/cloudflared.deb

# ── Clone + build app ─────────────────────────────────────────────────────────
git clone https://github.com/${github_repo}.git /opt/hq
cd /opt/hq

# Write client production env BEFORE building (baked into the Vite bundle)
echo "VITE_SERVER_URL=https://${hostname}" > /opt/hq/app/client/.env.production

# Write server runtime env
cat > /opt/hq/app/server/.env <<'DOTENV'
PORT=4000
MONGODB_URI=mongodb://localhost:27017/heroquest
DOTENV
echo "CLIENT_URL=https://${hostname}" >> /opt/hq/app/server/.env

npm install
npm run build

# ── systemd service ───────────────────────────────────────────────────────────
cat > /etc/systemd/system/hq-server.service <<'SVCEOF'
[Unit]
Description=HQ Companion Server
After=network.target mongod.service
Wants=mongod.service

[Service]
Type=simple
WorkingDirectory=/opt/hq
ExecStart=/usr/bin/node app/server/dist/index.js
Restart=always
RestartSec=5
EnvironmentFile=/opt/hq/app/server/.env

[Install]
WantedBy=multi-user.target
SVCEOF

systemctl daemon-reload
systemctl enable --now hq-server

# ── Cloudflare Tunnel ─────────────────────────────────────────────────────────
# Installs cloudflared as a systemd service using the tunnel token.
# Ingress rules are read from the Cloudflare API (managed by cloudflare_tunnel_config).
cloudflared service install ${tunnel_token}
systemctl enable --now cloudflared
