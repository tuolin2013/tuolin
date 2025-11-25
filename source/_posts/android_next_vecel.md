---
title: Hexo 博客在 Android Termux 上的终极部署教程（NexT 主题篇）
date: 2025-11-25 07:15:00
tags:
  - Hexo
  - Termux
  - Vercel
  - Git
  - NexT
---

# Hexo 博客在 Android Termux 上的终极部署教程（NexT 主题篇）

> 经过多轮尝试和错误排除，本教程总结了在 **Termux (Android)** 环境下，从零开始搭建 Hexo 博客、使用 **NexT 主题** 并成功部署到 **Vercel** 的关键步骤和常见错误解决方案。

## 🚀 核心思路：从本地到云端的四步流程

我们的部署流程可以概括为：

1.  **环境准备**：Termux 安装 Node.js 和 Git。
2.  **本地构建**：创建 Hexo 项目并安装 NexT 主题。
3.  **Git 推送**：将本地文件（特别是 NexT 主题文件）推送到 GitHub。
4.  **云端部署**：Vercel 关联 GitHub 仓库并自动发布。

---

## 第一步：环境搭建与 Hexo 初始化

确保 Termux 环境干净，并安装 Node.js 和 Git。

### 1. 安装 Node.js 和 Git

```bash
# 1. 切换到更快的源（可选）
# source <(curl -fsSL [https://git.io/JTS5i](https://git.io/JTS5i))

# 2. 安装基本工具、Node.js 和 Git
pkg install nodejs git -y
