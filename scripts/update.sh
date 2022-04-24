#! /bin/bash

cd /apps/think
git checkout main
git pull

pnpm install
pnpm run build

pm2 reload @think/server
pm2 reload @think/client
