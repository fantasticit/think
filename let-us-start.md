# think

## 项目结构

本项目依赖 pnpm 使用 monorepo 形式进行代码组织，分包如下：

- `@think/config`: 客户端、服务端、OSS、MySQL、Redis 等配置管理
- `@think/domains`：领域模型数据定义
- `@think/constants`：常量配置
- `@think/server`：服务端
- `@think/client`：客户端

## 项目依赖

为了将项目运行起来，至少需要以下依赖。

- nodejs >=16.5.0：推荐使用 nvm 安装
- pnpm：安装 nodejs 后，运行 `npm i -g pnpm` 即可安装
- pm2：安装 nodejs 后，运行 `npm i -g pm2` 即可安装
- MySQL 5.7
- Redis

## 配置文件

项目所有的配置文件都在 `config` 目录下，其中 `dev.yaml` 中各字段均有解释，生产环境打包依赖 `prod.yaml`（需要自行修改为所需配置）。如果运行不起来，请对比 `dev.yaml` 检查配置。

**如果部署遇到问题，首先请确认相应配置是否正确！**

## 项目运行

无论是开发环境，还是生产环境，项目运行成功后会在 3 个端口启动相应服务（默认 5001、5002、5003），具体端口号由 `config` 文件夹下的配置文件决定。

- 前台页面地址：`http://localhost:5001`
- 服务接口地址：`http://localhost:5002`
- 协作接口地址：`http://localhost:5003`

### 本地开发

1. 安装数据库

首先安装 `MySQL` 和 `Redis`，推荐使用 docker 进行安装。

```bash
docker image pull mysql:5.7
# m1 的 mac 可以用：docker image pull --platform linux/x86_64 mysql:5.7
docker run -d --restart=always --name mysql-for-think-dev -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_USER=think -e MYSQL_PASSWORD=think -e MYSQL_DATABASE=think mysql:5.7 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

docker pull redis:latest
docker run --name redis-for-think-dev -p 6379:6379 -d redis --appendonly yes --requirepass "root"
```

2. 安装依赖并运行

```bash
git clone  https://github.com/fantasticit/think.git
cd think
pnpm install
pnpm run dev
```

### 生产部署

首先确认在 `config` 文件夹下新建 `prod.yaml` 配置文件，然后运行以下命令。

**编译打包过程比较吃内存（大约 2G），小内存服务器建议本地构建后上传，可以在配置文件完成后，运行 build-output.sh，将打包后的 output 压缩发送到服务器后运行**。

```bash
git clone  https://github.com/fantasticit/think.git
cd think
pnpm install # 安装依赖
pnpm run build # 项目打包

# 以下如果没有安装 pm2，直接 pnpm run start，推荐使用 pm2
pnpm run pm2
pm2 startup
pm2 save
```

#### swc 导致打包失败

要么根据报错安装相关系统环境依赖，要么在`think/packages/client`目录下加入 **.babelrc** 文件。

文件内容：

```
{
  "presets": ["next/babel"]
}
```

### docker-compose

也可以使用 docker-compose 进行项目部署。首先，根据需要修改 `docker-compose.yml` 中的数据库、Redis 相关用户名、密码等配置，然后，从 `config/docker-prod-sample.yaml` 复制出 `config/prod.yaml` 并修改其中对应的配置。

```bash
# 首次安装
git clone https://github.com/fantasticit/think.git
cd think
docker-compose up -d

# 二次更新升级
cd think
git pull
docker-compose build
docker-compose up -d

# 如果二次更新有问题
docker-compose kill
docker-compose rm
docker image rm think # 删掉构建的镜像
docker-compose up -d
```

更多细节可以查看 [how-to-use-docker.md](./how-to-use-docker.md)。

### nginx 配置参考

无论以何种方式进行项目部署，项目运行成功后会在 3 个端口启动服务（默认 5001、5002、5003，具体由配置文件决定）。`nginx` 配置参考 <[think/nginx.conf.sample](https://github.com/fantasticit/think/blob/main/nginx.conf.sample)>。

特别强调，在 `config` 文件夹的配置中 `client.siteUrl` 一定要配置正确，否则客户端可能无法正常运行。

```yaml
# 站点地址（如：http://think.codingit.cn/），一定要设置，否则会出现 cookie、跨域等问题
siteUrl: 'http://localhost:5001'
```
