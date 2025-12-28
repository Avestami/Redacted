#!/bin/bash
set -e

echo "Starting deployment on VPS..."

# 1. Update and install dependencies
echo "Cleaning up package conflicts..."
sudo apt-get remove -y containerd containerd.io || true
sudo apt-get update
sudo apt-get install -y docker.io nginx certbot python3-certbot-nginx ufw

# 2. Firewall setup
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3002/tcp
sudo ufw --force enable

# 3. Clone/Update repository
if [ -d "Redacted" ]; then
    echo "Updating existing repository..."
    cd Redacted
    git fetch --all
    git reset --hard origin/main
else
    echo "Cloning repository..."
    git clone https://github.com/Avestami/Redacted.git
    cd Redacted
fi

# 4. Docker Build & Run (Frontend)
echo "Building and running Docker container..."
cd frontend
sudo docker build -t redacted-frontend .
sudo docker stop redacted-frontend-cont || true
sudo docker rm redacted-frontend-cont || true
sudo docker run -d --name redacted-frontend-cont --restart always -p 3002:3002 redacted-frontend

# 5. Nginx Configuration for blckbrd.ir/redacted
echo "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/redacted <<EOF
server {
    listen 80;
    server_name blckbrd.ir;

    location /redacted/ {
        proxy_pass http://localhost:3002/redacted/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/redacted /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# 6. HTTPS with Certbot
echo "Running Certbot for HTTPS..."
# Non-interactive attempt for blckbrd.ir
sudo certbot --nginx -d blckbrd.ir --non-interactive --agree-tos --email avesta.mi@gmail.com || echo "Certbot failed, please check manually."

echo "Deployment finished successfully. Visit https://blckbrd.ir/redacted"
