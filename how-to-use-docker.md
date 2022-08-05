# 使用 docker-compose 进行项目部署

> 目标：使用 http://dev.think.codingit.cn 访问客户端；使用 http://dev.api.codingit.cn 访问服务端。

## 1. 新建 config/prod.yaml

```yaml
# 开发环境配置
client:
  port: 5001
  assetPrefix: '/'
  apiUrl: 'http://dev.api.codingit.cn/api'
  collaborationUrl: 'ws://dev.api.codingit.cn/think/wss'
  # 以下为页面 meta 配置
  seoAppName: '云策文档'
  seoDescription: '云策文档是一款开源知识管理工具。通过独立的知识库空间，结构化地组织在线协作文档，实现知识的积累与沉淀，促进知识的复用与流通。'
  seoKeywords: '云策文档,协作,文档,fantasticit,https://github.com/fantasticit/think'
  # 预先连接的来源，空格分割（比如图片存储服务器）
  dnsPrefetch: '//wipi.oss-cn-shanghai.aliyuncs.com'
  # 站点地址（如：http://think.codingit.cn/），一定要设置，否则会出现 cookie、跨域等问题
  siteUrl: 'http://dev.think.codingit.cn'
  siteDomain: ''

server:
  prefix: '/api'
  port: 5002
  collaborationPort: 5003
  maxDocumentVersion: 20 # 最大版本记录数
  logRetainDays: 3 # 日志保留天数，比如只保留近三天日志
  enableRateLimit: true # 是否限流
  rateLimitWindowMs: 60000 # 限流时间
  rateLimitMax: 1000 # 单位限流时间内单个 ip 最大访问数量
  email: # 邮箱服务，参考 http://help.163.com/09/1223/14/5R7P6CJ600753VB8.html?servCode=6010376 获取 SMTP 配置
    host: ''
    port: 465
    user: ''
    password: ''
  admin:
    name: 'admin' # 注意修改
    password: 'admin' # 注意修改
    email: 'admin@think.com' # 注意修改为真实邮箱地址

# 数据库配置
db:
  mysql:
    host: 'mysql-for-think'
    username: 'think'
    password: 'think'
    database: 'think'
    port: 3306
    charset: 'utf8mb4'
    timezone: '+08:00'
    synchronize: true
  redis:
    host: 'redis-for-think'
    port: '6379'
    password: 'root'

# oss 文件存储服务
oss:
  local:
    enable: true
    # 线上更改为服务端地址（如：https://api.codingit.cn）
    server: 'http://dev.api.codingit.cn'
  # 以下为各厂商 sdk 配置，不要修改字段，填入值即可
  tencent:
    enable: false
    config:
      SecretId: ''
      SecretKey: ''
      Bucket: ''
      Region: ''
  aliyun:
    enable: false
    config:
      accessKeyId: ''
      accessKeySecret: ''
      bucket: ''
      https: true
      region: ''

# jwt 配置
jwt:
  secretkey: 'zA_Think+KNOWLEDGE+WIKI+DOCUMENTS@2022'
  expiresIn: '6h'
```

## 2. 新建 nginx.conf

```shell
upstream think_client {
  server 127.0.0.1:5001;
  keepalive 64;
}

upstream think_server {
  server 127.0.0.1:5002;
  keepalive 64;
}

upstream think_wss {
  server 127.0.0.1:5003;
  keepalive 64;
}

server {
  listen 80;
  server_name dev.api.codingit.cn;

  client_max_body_size 100m;

  location /api {
    proxy_pass http://think_server;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  location /think/wss {
    proxy_pass http://think_wss;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  location /static/ {
    proxy_pass http://think_server;
  }
}

server {
  listen 80;
  server_name dev.think.codingit.cn;

  location / {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header X-Nginx-Proxy true;
    proxy_cache_bypass $http_upgrade;
    proxy_pass http://think_client;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

3. 构建项目

```shell
cd think
docker-compose up -d
```

4. 可选：配置 hosts

```shell
127.0.0.1 dev.api.codingit.cn
127.0.0.1 dev.think.codingit.cn
```

5. 访问

浏览器访问：http://dev.think.codingit.cn。
