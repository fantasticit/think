/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common';
import * as cluster from 'cluster';
import * as os from 'os';

const numCPUs = os.cpus().length - 2;

@Injectable()
export class AppClusterService {
  static clusterize(callback): void {
    // @ts-ignore
    if (cluster.isMaster) {
      console.log(`[think] 主进程 ${process.pid} 启动`);
      for (let i = 0; i < numCPUs; i++) {
        // @ts-ignore
        cluster.fork();
      }
      // @ts-ignore
      cluster.on('exit', (worker) => {
        console.log(`[think] ，重启工作进程 ${worker.process.pid}，重启中...`);
        // @ts-ignore
        cluster.fork();
      });
    } else {
      console.log(`[think] 工作进程 ${process.pid} 启动`);
      callback();
    }
  }
}
