<div align="center">


![](https://raw.githubusercontent.com/tianzhentech/static/main/images/NeatChat-Dark.svg)

![Stars](https://img.shields.io/github/stars/tianzhentech/neatchat)
![Forks](https://img.shields.io/github/forks/tianzhentech/neatchat)
![Web](https://img.shields.io/badge/Web-PWA-orange?logo=microsoftedge)
![Web](https://img.shields.io/badge/-Windows-blue?logo=windows)
![Release Badge](https://img.shields.io/github/v/release/tianzhentech/neatchat.svg)
![License](https://img.shields.io/github/license/tianzhentech/neatchat.svg)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tianzhentech/NeatChat.git)



简体中文 | [English](README.en.md)

基于 NextChat 深度重构，一个更优雅、更强大的 AI 对话解决方案
</div>

## ✨ 新特性

🎨 **UI 焕新升级**

✨ 全面适配 Lobe-UI 设计系统，微调大量交互细节
🌿 更清爽的界面布局，沉浸式无干扰聊天体验

🔌 **插件生态扩展**

🧩 原生兼容官方插件协议，无缝接入 NextChat 插件生态
📦 预置绘图/计算/搜索等高频插件，一键即用免配置

📱 **全端畅快交互**

🔄 深度适配移动端触控操作，手势操作丝滑流畅
📲 响应式布局智能适配手机/平板/桌面，处处皆自然

🌀 **思维链可视化**

🧠 支持折叠式思维链与渐进式思考过程展示
🎭 为复杂推理场景设计的高颜值可视化交互

⚡ **极速开箱体验**

🚀 支持从服务端/客户端 API 自动拉取模型列表
📦 智能分类 & 快捷筛选，3 秒开启第一段对话

⚙️ **配置灵活自由**

🔗 全新设计的 `CUSTOM_MODELS` 变量逻辑，服务端→客户端配置无缝衔接
🌐 本地优先原则，同时完美兼容 Web 端用户配置

🧪 **智能模型探针**

✅ 独创多协议测试方案，一键检测代理通道可用性
🔋 支持服务端/客户端双模式健康检查，稳定性一目了然

🖼️ **模型头像工坊**

🎨 本地化头像匹配规则引擎，支持正则表达式深度定制
🔄 自动同步官方模型库，再也不怕新模型「无头可用」

🚧 **即将震撼来袭**

🌉 原生多通道负载均衡功能（无需部署 OneAPI/NewAPI）
🏆 打造 All-in-One 智能对话中枢，重新定义生产力边界

## 🖼️ 界面预览

![](https://raw.githubusercontent.com/tianzhentech/static/main/images/%7B326DD837-A2FE-4603-A289-47FD5FED329A%7D.png)
![](https://raw.githubusercontent.com/tianzhentech/static/main/images/%7B1FB6B249-72D5-42F0-B861-7FE95ADCEEEE%7D.png)
![](https://raw.githubusercontent.com/tianzhentech/static/main/images/%7B6656232E-09F3-472D-A2B4-621DDD57D9CC%7D.png)

![](https://raw.githubusercontent.com/tianzhentech/static/main/images/20250312232933.png)

![](https://raw.githubusercontent.com/tianzhentech/static/main/images/20250312223248.png)

![](https://raw.githubusercontent.com/tianzhentech/static/main/images/20250313011331.png)

> 更多内容请移步[演示站](https://nc.tianz.me)

## ⚡ 快速开始

我重新定义了CUSTOM_MODELS中@之后的变量，比如原来你可以使用gpt-4o@OpenAI，其中OpenAI作为providers存在，也约束了请求方式是openai格式，但是当后来越来越多的模型都以openai格式作为规范，再@openai就显得很奇怪，也会出现一些问题。现在，我建议在我的版本中，使用`@模型类别`这个方式来约束模型。（当然原来的方式仍然保留，只是扩充了@的用法）

> 当然你不用自己操作，客户端我已经做了自动配置，我只是建议在服务端设置变量的时候就`@模型类别`，后续我将围绕这个类别做一些更新。

所有类别：

| 类别         | 匹配规则           | 类别       | 匹配规则         |
| ------------ | ------------------ | ---------- | ---------------- |
| Claude       | `claude`           | DALL-E     | `dall`           |
| DeepSeek     | `deepseek`         | Grok       | `grok`           |
| Gemini       | `gemini`           | MoonShot   | `moonshot\|kimi` |
| WenXin       | `wenxin\|ernie`    | DouBao     | `doubao`         |
| HunYuan      | `hunyuan`          | Cohere     | `command`        |
| GLM          | `glm`              | Llama      | `llama`          |
| Qwen         | `qwen\|qwq\|qvq`   | ChatGPT    | `gpt\|o1\|o3`    |
| Mistral      | `mistral`          | Yi         | `yi`             |
| SenseNova    | `sensenova\|sense` | Spark      | `spark`          |
| MiniMax      | `minimax\|abab`    | HaiLuo     | `hailuo`         |
| Gemma        | `gemma`            | StepFun    | `stepfun`        |
| Ollama       | `ollama`           | ComfyUI    | `comfyui`        |
| VolcEngine   | `volcengine`       | VertexAI   | `vertexai`       |
| SiliconCloud | `siliconcloud`     | Perplexity | `perplexity`     |
| Stability    | `stability`        | Flux       | `flux`           |

1. 支持vercel一键部署：[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tianzhentech/NeatChat.git)

2. docker只需要替换官方**yidadaa/chatgpt-next-web:版本号**为**tianzhentech/chatgpt-next-web:latest**即可

> 其余配置与官方一致，详细使用请参考[NextChat](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web)

## 🚢 版本说明

| 类型           | 状态   | 标识规则                         | 稳定性 | 生命周期           | 原分支替代关系     |
| -------------- | ------ | -------------------------------- | ------ | ------------------ | ------------------ |
| **预发行版**   | 🔄 活跃 | 与正式版版号一致，但有预发行标签 | ⚠️ 测试 | 会多次合并提交     | 替代原preview分支  |
| **正式发行版** | ✅ 稳定 | `vX.Y.Z`                         | ✔️ 生产 | 由预发行稳定后诞生 | 合并原mini分支特性 |
| preview分支    | 🚫 废弃 | -                                | -      | 已合并到main分支   | 功能由预发行版承接 |
| mini分支       | 🚫 废弃 | -                                | -      | 特性已整合到正式版 | 不再独立维护       |
