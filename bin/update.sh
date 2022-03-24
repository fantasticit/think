#! /bin/bash

cd /apps/think
git checkout main
git pull

pnpm install
pnpm run build

pm2 restart @think/server
pm2 restart @think/client
