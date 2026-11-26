# Tennis Match Recorder – PWA 部署说明

文件夹内容：index.html（主程序）、manifest.json、sw.js（离线支持）、icons/（图标）。四样要一起上传，保持原有目录结构。

## 放到网上（GitHub Pages，免费）
1. 注册/登录 GitHub，新建一个仓库（Public），例如 `tennis-recorder`。
2. 把本文件夹里的所有文件和 icons 文件夹上传到仓库根目录。
3. 仓库 Settings → Pages → Source 选 "Deploy from a branch"，分支选 main，目录选 /(root)，保存。
4. 等 1–2 分钟，得到网址：`https://你的用户名.github.io/tennis-recorder/`

## 在 iPhone 上安装
用 **Safari** 打开网址 → 点分享按钮 → "添加到主屏幕" → 添加。
**第一次必须联网打开一次**，等页面完整加载后，之后无网络也能使用。

## 在安卓上安装
用 Chrome 打开网址 → 右上角菜单 → "添加到主屏幕 / 安装应用"。

## 以后更新程序
1. 替换 index.html。
2. 打开 sw.js，把第 2 行 `CACHE_VERSION = 'v1'` 改成 `'v2'`（每次更新加 1），一起上传。
3. 手机上打开 app 两次（第一次下载新版，第二次生效）。

## 注意
- 比赛数据保存在手机本机的浏览器存储里，建议每场比赛结束后保存导出的文件。
- 在手机上点导出时，会弹出系统分享面板，可存到"文件"或发送给他人。
- 样式脚本（Tailwind）来自 cdn.tailwindcss.com，第一次联网时会被缓存到手机里。
