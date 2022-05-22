#!/bin/sh
### Author:jonnyan404
### date:2022年5月22日
CONFIG_FILE='/app/config/prod.yaml'

if [ ! -f $CONFIG_FILE ]; then
    echo "#####Generating configuration file#####"
    cp /app/docker/prod-sample.yaml $CONFIG_FILE
else
    echo "#####Configuration file already exists#####"
fi
redis-server  --daemonize yes
pnpm run pm2
pm2 logs
