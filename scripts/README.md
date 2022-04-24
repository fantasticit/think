# scripts

该目录下包含两个脚本。

## `deploy.sh`

在服务端首次部署时使用，依赖 `nodejs`、`pnpm` 和 `pm2`。

## `update.sh`

项目更新时使用，配合 `webhook` 实现自动化部署。

## 自动化部署

当在服务器完成首次部署后，后续如果每次迭代都手动进行更新会很麻烦，这时候就可以利用 `github webhook` 实现自动化部署。

### 第一步：在你的服务器配置 webhook

在你的服务器上安装 [webhook](https://github.com/adnanh/webhook/blob/master/docs/Hook-Examples.md#incoming-github-webhook)，然后编写 `hooks`，然后后台运行 `webhook`。

```shell
# 第一步：编写 hooks.json
touch hooks.json

# 第二步：创建 webhook.log
touch webhook.log

# 第三步：后台运行 webhook
nohup webhook -hooks hooks.json -hotreload -logfile webhook.log &
```

hooks 配置示例：

```json
[
  {
    "id": "think-auto-update",
    "execute-command": "/apps/think/scripts/update.sh", // 注意根据项目修改脚本路径
    "command-working-directory": "/apps/think/",
    "http-methods": ["POST"],
    "pass-arguments-to-command": [
      {
        "source": "payload",
        "name": "head_commit.id"
      },
      {
        "source": "payload",
        "name": "pusher.name"
      },
      {
        "source": "payload",
        "name": "pusher.email"
      }
    ],
    "trigger-rule": {
      "and": [
        {
          "match": {
            "type": "payload-hmac-sha256",
            "secret": "please-rebuild-think",
            "parameter": {
              "source": "header",
              "name": "X-Hub-Signature-256"
            }
          }
        },
        {
          "match": {
            "type": "value",
            "value": "refs/heads/main",
            "parameter": {
              "source": "payload",
              "name": "ref"
            }
          }
        }
      ]
    }
  }
]
```

### 第二步：测试 webhook

本质上，webhook 就是在服务器启动一个服务，然后通过 HTTP 调用相应的 URL 触发执行指定的脚本。

> 例如 think 项目的 webhook：http://124.221.147.83:9000/hooks/think-auto-update

以 Github 为例，在设置中找到 webhooks 配置指定 URL，注意 `Content type` 为 `application/json`。
