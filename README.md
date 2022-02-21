# think

## 简介

Think 是一款开源知识管理工具。通过独立的知识库空间，结构化地组织在线协作文档，实现知识的积累与沉淀，促进知识的复用与流通。同时支持多人协作文档。使用的技术如下：

- `MySQL`：数据存储
- `next.js`：前端页面框架
- `nest.js`：服务端框架
- `AliyunOSS`：对象存储
- `tiptap`：编辑器及文档协作

可访问[云策文档帮助中心](https://think.wipi.tech/share/wiki/4e3d0cfb-b169-4308-8037-e7d3df996af3)，查看更多功能文档。

## 链接

[云策文档](https://think.wipi.tech/)已经部署上线，可前往注册使用。

## 预览

![首页](http://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-20/YN67GM4VQMBTZFZ88TYOZX/image.png)
![知识库](http://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-20/YN67GM4VQMBTZFZ88TYP8X/image.png)
![新建文档](http://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-20/YN67GM4VQMBTZFZ88TYPQX/image.png)
![编辑器](http://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-20/YN67GM4VQMBTZFZ88TYPZX/image.png)
![协作](http://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-20/YN67GM4VQMBTZFZ88TYQ8X/image.png)
![收藏](http://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-20/YN67GM4VQMBTZFZ88TYPHX/image.png)

## 项目运行

本项目依赖 pnpm 使用 monorepo 形式进行代码组织，分包如下：

- `@think/config`: 管理项目整体配置
- `@think/share`：数据类型定义、枚举、配置等
- `@think/server`：服务端
- `@think/client`：客户端

### pnpm

项目依赖 pnpm，请安装后运行（`npm i -g pnpm`）。

### 数据库

首先安装 `MySQL`，推荐使用 docker 进行安装。

```bash
docker image pull mysql:5.7
docker run -d --restart=always --name think -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:5.7
```

然后在 `MySQL` 中创建数据库。

```bash
docker container exec -it think bash;
mysql -u root -p;
CREATE DATABASE  `think` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 本地运行

首先，clone 项目。

```bash
git clone --depth=1 https://github.com/fantasticit/think.git your-project-name
```

然后，安装项目依赖。

```bash
pnpm install
```

- 启动项目

```bash
pnpm run dev
```

前台页面地址：`http://localhost:3000`。
服务接口地址：`http://localhost:5001`。
协作接口地址：`http://localhost:5003`。

如需修改配置，可在 `packages/config/yaml` 下进行配置。

### 配置文件

默认加载 `dev.yaml` 中的配置（生产环境使用 `prod.yaml` ）。

```yaml
# 开发环境配置
server:
  prefix: "/api"
  port: 5001
  collaborationPort: 5003

client:
  assetPrefix: "/"
  apiUrl: "http://localhost:5001/api"
  collaborationUrl: "ws://localhost:5003"

# 数据库配置
db:
  mysql:
    host: "127.0.0.1"
    username: "root"
    password: "root"
    database: "think"
    port: 3306
    charset: "utf8mb4"
    timezone: "+08:00"
    synchronize: true

# oss 文件存储服务
oss:
  aliyun:
    accessKeyId: ""
    accessKeySecret: ""
    bucket: ""
    https: true
    region: ""

# jwt 配置
jwt:
  secretkey: "zA_Think+KNOWLEDGE+WIKI+DOCUMENTS@2022"
  expiresIn: "6h"
```

### 项目部署

生产环境部署的脚本如下：

```bash

node -v
npm -v

npm config set registry http://registry.npmjs.org

npm i -g pm2 @nestjs/cli pnpm

pnpm install
pnpm run build
pnpm run pm2

pm2 startup
pm2 save
```

### nginx 配置

采用反向代理进行 `nginx` 配置，**同时设置 `proxy_set_header X-Real-IP $remote_addr;` 以便服务端获取到真实 ip 地址**。

```bash
upstream wipi_client {
  server 127.0.0.1:3000;
  keepalive 64;
}

# http -> https 重定向
server {
  listen  80;
  server_name 域名;
  rewrite ^(.*)$  https://$host$1 permanent;
}

server {
  listen 443 ssl;
  server_name 域名;
  ssl_certificate      证书存放路径;
  ssl_certificate_key  证书存放路径;

  location / {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Nginx-Proxy true;
    proxy_cache_bypass $http_upgrade;
    proxy_pass http://wipi_client; #反向代理
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

## 资料

- next.js 源码：https://github.com/vercel/next.js
- next.js 文档：https://nextjs.org/
- nest.js 源码：https://github.com/nestjs/nest
- nest.js 文档：https://nestjs.com/
