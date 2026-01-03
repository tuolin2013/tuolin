---
title: "[实战] EchoMimic 避坑部署指南 V2.0：从爆显存到完美运行的血泪SOP"
date: 2026-01-03 20:00:00
tags:
  - ComfyUI
  - EchoMimic
  - AI数字人
  - RunPod
  - 教程
categories:
  - AI实战复盘
excerpt: "全网最实诚的 EchoMimic 部署教程。本文修正了网上教程'版本错乱'的问题，解决了 NumPy 2.0 冲突、RunPod 磁盘爆满 (Disk Quota)、FFmpeg 缺失等五大核心故障。包含一套基于 PyTorch 2.4 的'代码+模型'黄金组合方案，助你 10 分钟内跑通数字人唱歌工作流。"
---

## 前言

EchoMimic 是目前开源界音频驱动人像的顶流项目。但在 RunPod 等云环境部署时，由于代码更新极快（V3版本）而模型文件滞后（V2版本），导致新手极容易陷入报错循环。

本教程基于 **ComfyUI 插件版 (V3架构)** 配合 **稳定版模型 (V2权重)** 的“混合部署方案”，这也是目前性价比最高、最稳定的方案。

---

## 核心避坑逻辑（必读）

在开始敲代码前，请记住我们是用什么策略成功的：

1.  **环境地基**：放弃旧环境，直接上 **PyTorch 2.4**，兼容未来所有新插件。
2.  **版本策略**：使用最新的 **V3 插件代码**（为了兼容性），但加载 **V2 模型权重**（为了稳定和速度）。
3.  **空间管理**：下载完模型后强制删除 `.git` 历史记录，**节省 30GB 空间**，防止 RunPod 磁盘写满报错。

---

## 部署 SOP (标准作业程序)

请新建一个 Terminal，按顺序执行以下步骤。

### 第一步：创建现代化环境 (PyTorch 2.4)

旧的 PyTorch 2.2 已经带不动新版 Diffusers 了，我们直接新建环境一步到位。
```bash
cd /workspace

# 1. 创建并激活新环境
python -m venv venv_echo
source venv_echo/bin/activate

# 2. 【核心】安装 PyTorch 2.4 (兼容 CUDA 12.1)
# 这一步文件较大(2G+)，请耐心等待
pip install torch==2.4.0 torchvision==0.19.0 torchaudio==2.4.0 --index-url [https://download.pytorch.org/whl/cu121](https://download.pytorch.org/whl/cu121)

# 3. 预先锁死 NumPy，这是保命第一条
pip install "numpy<2.0" --upgrade pip
```
第二步：部署 ComfyUI 与插件
```
# 1. 克隆 ComfyUI 主程序
git clone [https://github.com/comfyanonymous/ComfyUI.git](https://github.com/comfyanonymous/ComfyUI.git) ComfyUI_Echo
cd ComfyUI_Echo
pip install -r requirements.txt

# 2. 进入节点目录
cd custom_nodes

# 3. 克隆 EchoMimic (使用 Smthemex 封装版)
git clone [https://github.com/Smthemex/ComfyUI_EchoMimic.git](https://github.com/Smthemex/ComfyUI_EchoMimic.git) EchoMimic

# 4. 克隆 VHS 视频合成插件 (否则无法保存视频)
git clone [https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite.git](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite.git)

```
第三步：一键安装全套依赖 (核弹级修复)
​这条命令解决了 diffusers、transformers、mediapipe 之间的所有版本打架问题。

```
# 进入 EchoMimic 目录
cd EchoMimic

# 【关键指令】一次性对齐所有依赖，并锁死 numpy<2.0
pip install "diffusers>=0.30.0" "transformers>=4.41.2" "huggingface-hub>=0.23.0" "accelerate>=0.31.0" "mediapipe==0.10.8" "protobuf==3.20.3" librosa soundfile imageio-ffmpeg opencv-python-headless scikit-image "numpy<2.0"

# 安装 VHS 插件依赖
cd ../ComfyUI-VideoHelperSuite
pip install -r requirements.txt
```
第四步：补齐系统级工具 (解决 FFmpeg 报错)
​VHS 节点需要调用系统底层的 FFmpeg，Python 包是不够的。
```
apt-get update && apt-get install -y git-lfs ffmpeg

```
第五步：下载模型与空间清理 (防止磁盘爆满)
​这是最关键的一步。我们下载 V2 模型，并清理垃圾文件。

```
# 1. 开启 LFS
git lfs install

# 2. 回到 EchoMimic 目录下载权重
cd ../EchoMimic
# 下载 V2 完整权重 (约 30GB)
git clone [https://huggingface.co/BadToBest/EchoMimic](https://huggingface.co/BadToBest/EchoMimic) pretrained_weights

# 3. 【极重要】删除 .git 目录释放 30G 空间
# 如果不执行这一步，RunPod 很容易报 "Disk quota exceeded"
rm -rf pretrained_weights/.git

```
第六步：启动服务
​注意： 因为更新了 PyTorch 底层，强烈建议先去 RunPod 控制台重启 Pod (Restart Pod)。
​重启回来后：

```
# 激活环境
source /workspace/venv_echo/bin/activate

# 进入目录启动
cd /workspace/ComfyUI_Echo
python main.py --listen

```

运行配置指南 (节点避坑手册)
​环境跑通后，如果在 ComfyUI 里配置不对，依然会报错（如 config.json not found）。请严格按照以下清单配置节点。
​1. 核心节点：Echo_LoadModel
​由于我们下载的是 V2 模型 (.pth)，但代码是 V3 版，必须手动指定版本。
​version: 必须选 V2 (选 V3 会报错缺文件)。
​infer_mode: 选 audio_drived (音频驱动)。
​use_mmgp: 显存够大选 None，显存小选 LowRAM。
​lowvram: 24G 显存用户选 false (速度更快)。
​2. 连线逻辑 (Audio Drive 模式)
​音频: 必须新建 Load Audio 节点，并连入 Echo_Predata 的 audio 端口。不连没声音，不动嘴。
​视频: Echo_Predata 的 video_images 端口必须悬空 (不要连 Load Video，否则会干扰 V2 模型)。
​3. 动物/宠物唱歌技巧
​如果你用猫狗照片制作视频：
​在 Echo_Sampler 节点中，将 facemask_ratio (面部遮罩) 调大至 0.15 或 0.2。
​动物嘴巴动作幅度大，默认的 0.1 可能会导致嘴边有虚影。
​结语
​至此，你拥有了一套坚不可摧的数字人环境。这套配置既利用了 PyTorch 2.4 的高性能，又保留了 EchoMimic V2 模型的稳定性，是目前生产环境的最优解。
​Happy Mimicking!
