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

# Hexo 博客在 Android Termux 上的终极实战教程（NexT 主题篇）

> **前言：** 本教程总结了在 **Termux (Android)** 环境下，从零开始搭建 Hexo 博客、使用 **NexT 主题** 并成功部署到 **Vercel** 的全过程。与常规教程不同，本篇侧重于解决移动端部署时最常遇到的 **Gitlink 主题错误** 和 **网络超时** 等实战问题。

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

### 2. NexT 主题安装与配置
​为确保主题文件能够被 GitHub 正确识别和上传，必须清理主题内的 Git 记录。
# 1. 克隆主题文件到 themes/next 目录
git clone [https://github.com/next-theme/hexo-theme-next](https://github.com/next-theme/hexo-theme-next) themes/next

# 2. **关键步骤：删除主题内的 .git 文件夹 (避免 Gitlink 错误)**
rm -rf themes/next/.git

修改 Hexo 根目录下的配置文件 _config.yml，启用 NexT 主题：
nano _config.yml
# ... (其他配置)
theme: next 
3. Git 提交与 Vercel 部署
​将项目文件推送到 GitHub，并由 Vercel 自动部署。

# 1. 初始化 Git 并首次提交
git init
git add .
git commit -m "Initial commit for Hexo project with NexT theme files"

# 2. 关联到你的 GitHub 仓库（请替换为你的实际地址）
git remote add origin [https://github.com/tuolin2013/tuolin.git](https://github.com/tuolin2013/tuolin.git)

# 3. 推送所有文件到 GitHub
git push origin main


