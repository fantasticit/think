#!/bin/sh
### Author:jonnyan404
### date:2022年5月22日

pnpm run pm2
pm2 startup
pm2 save
pm2 logs
