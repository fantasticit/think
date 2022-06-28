#!/bin/sh
### Author:jonnyan404
### date:2022年5月22日

CONFIG_FILE='/app/config/prod.yaml'

if [ ! -f $CONFIG_FILE ]; then
    cp -f /app/config/docker-prod-sample.yaml $CONFIG_FILE
else
    echo ""
fi

pnpm run pm2
pm2 logs
