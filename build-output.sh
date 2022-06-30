#! /bin/bash
# 该脚本只保留生产环境运行所需文件到统一目录
if [ ! -f './config/prod.yaml' ]; then
  echo "缺少 config/prod.yaml 文件，可参考 docker-prod-sample.yaml 进行配置"
  exit 1
fi

# 构建
pnpm fetch --prod
pnpm install
pnpm run build

outputDir="output"

# 新建输出目录
if [ -d ${outputDir} ]; then
  rm -rfv ${outputDir}
fi
mkdir -p ${outputDir}
cd ${outputDir}
mkdir -p packages
mkdir -p packages/config
mkdir -p packages/constants
mkdir -p packages/domains
mkdir -p packages/client
mkdir -p packages/server
cd ../

# 复制文件
cp -v -L -r config ${outputDir}
cd ${outputDir}/config
rm -f dev.yaml
cd ../../
cp -v -L package.json ${outputDir}  
cp -v -L pnpm-lock.yaml ${outputDir}  
cp -v -L pnpm-workspace.yaml ${outputDir}  

# packages/config
cd packages/config
configOutput="../../${outputDir}/packages/config"
cp -v -L package.json ${configOutput}
cp -v -L -r lib ${configOutput}
cd ../../

# packages/constants
cd packages/constants
constantsOutput="../../${outputDir}/packages/constants"
cp -v -L package.json ${constantsOutput}
cp -v -L -r lib ${constantsOutput}
cd ../../

# packages/domains
cd packages/domains
domainsOutput="../../${outputDir}/packages/domains"
cp -v -L package.json ${domainsOutput}
cp -v -L -r lib ${domainsOutput}
cd ../../

# packages/client
cd packages/client
clientOutput="../../${outputDir}/packages/client"
cp -v -L package.json ${clientOutput}
cp -v -L prod-server.js ${clientOutput}
cp -v -L -r public ${clientOutput}
cp -v -L -r .next ${clientOutput}
cd ../../

# packages/server
cd packages/server
serverOutput="../../${outputDir}/packages/server"
cp -v -L package.json ${serverOutput}
cp -v -L nest-cli.json ${serverOutput}
cp -v -L -r dist ${serverOutput}
cd ../../

# @see https://github.com/typicode/husky/issues/914#issuecomment-826768549
cd ${outputDir}
npm set-script prepare ""
pnpm install -r --offline --prod
cd ../

echo "${outputDir} 打包完成"
