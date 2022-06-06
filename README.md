# think

## 简介

Think 是一款开源知识管理工具。通过独立的知识库空间，结构化地组织在线协作文档，实现知识的积累与沉淀，促进知识的复用与流通。同时支持多人协作文档。使用的技术如下：

- `MySQL`：数据存储
- `next.js`：前端页面框架
- `nest.js`：服务端框架
- `AliyunOSS`：对象存储
- `tiptap`：编辑器及文档协作

可访问[云策文档帮助中心](https://think.codingit.cn/share/wiki/eb520cdf-aa4b-4af2-ae4a-7140e21403ab)，查看更多功能文档。

## 链接

[云策文档](https://think.codingit.cn)已经部署上线，可前往注册使用。

## 预览

![知识库](http://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-20/YN67GM4VQMBTZFZ88TYP8X/image.png)
![新建文档](http://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-20/YN67GM4VQMBTZFZ88TYPQX/image.png)
![编辑器](http://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-20/YN67GM4VQMBTZFZ88TYPZX/image.png)

## 项目结构

本项目依赖 pnpm 使用 monorepo 形式进行代码组织，分包如下：

- `@think/config`: 客户端、服务端、OSS、MYSQL、Redis 等配置管理
- `@think/domains`：领域模型数据定义
- `@think/constants`：常量配置
- `@think/server`：服务端
- `@think/client`：客户端

## 项目依赖

- nodejs ≥ 16.5
- pnpm
- pm2
- mysql ≥ 5.7
- redis (可选)

依赖安装命令: `npm i -g pm2 @nestjs/cli pnpm`


#### 数据库

首先安装 `MySQL`，推荐使用 docker 进行安装。

```bash
docker image pull mysql:5.7
# m1 的 mac 可以用：docker image pull --platform linux/x86_64 mysql:5.7
docker run -d --restart=always --name think -p 3306:3306 -e MYSQL_DATABASE=think -e MYSQL_ROOT_PASSWORD=root mysql:5.7 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
```

#### 可选：Redis

如果需要文档版本服务，请在根目录 `yaml` 配置中进行 `db.redis` 的配置。

```
docker pull redis:latest
docker run --name think-redis -p 6379:6379 -d redis --appendonly yes --requirepass "root"
```

## Docker-compose 一键构建安装

- 实测腾讯轻量云 2C4G 机器构建需 8 分钟左右

**请注意修改 `docker-compose.yml` 中的 `EIP` 参数,否则无法正常使用!!!**


```
# 首次安装
git clone  https://github.com/fantasticit/think.git
cd think
docker-compose up -d

# 二次更新升级
cd think
git pull
docker-compose build
docker-compose up -d

# FAQ
如遇二次更新有问题,请更新代码重新构建,然后删除本地配置文件并重启容器.
如果还不能解决,1.有能力可自行解决|2.等待更新|3.去mrdoc.fun站点留言
```

然后访问 `http://ip:5001` 即可.



## 手动安装教程

- 前台页面地址：`http://localhost:5001`
- 服务接口地址：`http://localhost:5002`
- 协作接口地址：`http://localhost:5003`

如需修改配置，开发环境编辑 `config/dev.yaml`。生产环境编辑 `config/prod.yaml` (如没有,可复制开发环境的配置修改即可.)

### 本地源代码运行(开发环境)


```bash
git clone  https://github.com/fantasticit/think.git
cd think
pnpm install
pnpm run dev
```

然后访问 `http://ip:5001` 即可.



### 本地源代码运行(生产环境)

生产环境部署的脚本如下：

```bash
git clone  https://github.com/fantasticit/think.git
cd think
pnpm install
pnpm run build
pnpm run pm2

pm2 startup
pm2 save
```

### nginx 配置参考

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

## 自动化部署

> 思路：在服务器部署 webhook，然后在 github setting 中配置相应钩子，实现自动化部署

参考：[webhook](https://github.com/adnanh/webhook/blob/master/docs/Hook-Examples.md#incoming-github-webhook)

## 资料

- next.js 源码：https://github.com/vercel/next.js
- next.js 文档：https://nextjs.org/
- nest.js 源码：https://github.com/nestjs/nest
- nest.js 文档：https://nestjs.com/
