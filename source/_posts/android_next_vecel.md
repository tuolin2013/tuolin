---
title: Hexo 博客在 Termux 上的终极实战教程（NexT 主题篇）
date: 2025-11-25 07:15:00 
tags:
  - Hexo
  - Termux
  - Vercel
  - Git
  - NexT
---

> **前言：** 本教程总结了在 **Termux (Android)** 环境下，从零开始搭建 Hexo 博客、使用 **NexT 主题** 并成功部署到 **Vercel** 的全过程。本篇侧重于解决移动端部署时最常遇到的 **Gitlink 主题错误** 和 **网络超时** 等实战问题。

---

## 第一部分：核心部署步骤与代码（成功路径）

本部分是 Hexo 博客从 Termux 部署到 Vercel 的标准、无错的完整流程。

### 1. 环境搭建与 Hexo 初始化

```bash
# 1. 安装 Node.js 和 Git
pkg install nodejs git -y

# 2. 创建项目目录并进入
mkdir hexo-blog && cd hexo-blog

# 3. 初始化 Hexo
npm install hexo-cli -g
hexo init
npm install
```

### 2.NexT 主题安装与配置

为确保主题文件能够被 GitHub 正确识别和上传，必须清理主题内的 Git 记录。
```bash
# 1. 克隆主题文件到 themes/next 目录
git clone [https://github.com/next-theme/hexo-theme-next](https://github.com/next-theme/hexo-theme-next) themes/next

# 2. **关键步骤：删除主题内的 .git 文件夹 (避免 Gitlink 错误)**
rm -rf themes/next/.git
```
修改 Hexo 根目录下的配置文件 _config.yml，启用 NexT 主题：
```bash
nano _config.yml
```
找到 theme 字段，修改为：
```bash
# ... (其他配置)
theme: next 
```
### 3.Git 提交与 Vercel 部署
​将项目文件推送到 GitHub，并由 Vercel 自动部署。
```bash
# 1. 初始化 Git 并首次提交
git init
git add .
git commit -m "Initial commit for Hexo project with NexT theme files"

# 2. 关联到你的 GitHub 仓库（请替换为你的实际地址）
git remote add origin [https://github.com/tuolin2013/tuolin.git](https://github.com/tuolin2013/tuolin.git)

# 3. **增大 Git 的 HTTP POST 缓冲区（建议设置为 100MB）**
#    此设置有助于解决 Termux 推送大文件时的网络超时问题。
git config --global http.postBuffer 104857600

# 4. 推送所有文件到 GitHub
git push origin main
```
Vercel 配置： 在 Vercel 平台导入 GitHub 仓库后，设置构建命令和输出目录：

| 设置项 | 值 |
| ----------- | ----------- |
| Build command | hexo generate |
| Output Directory| Public |

## 第二部分：常见异常与解决方案（实战血泪史）
​以下是在移动端部署时最常见的三大异常及其解决方法

### 异常 1：主题显示空白（Gitlink 错误）
​错误现象： 博客部署后显示默认 Hexo 主题或页面空白。
根本原因： Git 将主题目录识别为子模块 (Gitlink)，没有上传实际文件。
​解决方案： 强制删除主题内的 Git 记录，并重新提交。
```bash
# 确保在 hexo-blog 目录下执行
rm -rf themes/next/.git        # 彻底删除错误的Gitlink记录
git rm --cached themes/next    # 从主项目缓存中移除旧引用
git add themes/next            # 将主题文件重新添加为普通文件
git commit -m "Fix: Remove Gitlink and re-add NexT files"
git push origin main           # 重新推送
```
### 异常 2：推送失败，连接超时（HTTP 408）
​错误现象： 推送大文件时，出现 error: RPC failed; HTTP 408 或 fatal: the remote end hung up unexpectedly。
根本原因： 移动端网络不稳定或传输超时。
​解决方案： 更换稳定网络，并再次推送。由于我们在第一部分已增大缓存，此时只需确保网络稳定。
```bash
# 1. **切换到稳定的网络环境（Wi-Fi 换 4G 或反之）**

# 2. 重新推送
git push origin main
```
### 异常 3：推送被拒绝（non-fast-forward）
​错误现象： 尝试 git push 时收到 ! [rejected] (non-fast-forward) 错误提示。
根本原因： 远程仓库（GitHub）的提交历史比你的本地仓库新。
​解决方案： 先拉取远程更新并进行合并 (Rebase)。
```bash
# 1. 拉取远程仓库最新历史并进行 Rebase 合并
git pull --rebase origin main

# 2. 再次推送
git push origin main
```
