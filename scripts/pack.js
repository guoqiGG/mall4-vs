const fs = require('fs')
const tar = require('tar')
const moment = require('moment')
const distName = `./dist/mall4vs_${moment().format('YYYYMMDDHHmmss')}.tar.gz`

tar.c(
  {
    /* 配置打包的根目录 */
    cwd: `${process.cwd()}/dist`,
    gzip: true
  },
  /* 数组，包含需要打包的文件/目录 */
  fs.readdirSync(`${process.cwd()}/dist/`)
)
  .pipe(fs.createWriteStream(distName))
  .on('finish', () => {
    // eslint-disable-next-line no-console
    console.log(`打包完成，请查看 ./dist 目录下的 scyx.tar.gz`)
    // eslint-disable-next-line no-console
    console.log(`服务器发布时，将压缩包移动到页面容器根目录，并执行tar zxf scyx.tar.gz`)
  })
