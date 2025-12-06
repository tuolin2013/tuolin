---
title: Cloudflare R2 图床显示测试
date: 2025-12-06 10:45:00
tags: [测试, 图床]
categories: [技术]
description: 你好！这是一篇测试文章，用来验证 **Cloudflare R2 + 自定义域名** 是否配置成功。

# ⚠️ 注意：不同的博客主题，封面图的字段名可能不同
# 常见的有 cover, banner, thumbnail, image。你可以试试下面这行：
cover: https://img.laotuo.top/avatar.jpg
---

## 📸 图片加载测试

你好！这是一篇测试文章，用来验证 **Cloudflare R2 + 自定义域名** 是否配置成功。

### 1. 标准 Markdown 引用
``下面应该显示我的头像：

![我的头像](https://img.laotuo.top/avatar.jpg)

---

### 2. HTML 标签引用 (居中测试)
如果上面的图能显示，下面的图也应该能显示（并居中）：

<div align="center">
  <img src="https://img.laotuo.top/avatar.jpg" width="150" alt="Avatar HTML" />
  <p><i>(这是通过 HTML 标签引入的图片)</i></p>
</div>

---

**如果你能看到上面的两张图片，说明：**
1. DNS 解析 (`img.laotuo.top`) 正常。
2. R2 存储桶权限 (Public Access) 正常。
3. HTTPS 证书配置正常。

恭喜！🚀
