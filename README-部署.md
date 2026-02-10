# NextChat Windows IIS 部署完整指南

## 📦 已创建的文件

| 文件名 | 说明 |
|--------|------|
| `ecosystem.config.js` | PM2 进程管理配置 |
| `web.config` | IIS 反向代理配置 |
| `deploy.bat` | 一键部署脚本 |
| `pm2-manage.bat` | PM2 管理工具（图形化菜单） |
| `check-env.bat` | 环境检查工具 |
| `.env.local` | 环境变量配置文件 |
| `快速开始.md` | 快速开始指南 |
| `IIS配置说明.md` | IIS 详细配置说明 |

## 🎯 部署流程

### 方式一：使用一键部署脚本（推荐）

1. **配置 API Key**
   
   编辑 `.env.local` 文件：
   ```env
   OPENAI_API_KEY=sk-your-real-api-key-here
   CODE=your-password
   ```

2. **运行部署脚本**
   
   双击 `deploy.bat`，等待完成

3. **访问应用**
   
   浏览器打开: http://localhost:3000

### 方式二：手动部署

```cmd
# 1. 安装依赖
yarn install

# 2. 构建项目
yarn build

# 3. 启动 PM2
pm2 start ecosystem.config.js

# 4. 保存配置
pm2 save
```

## 🌐 配置 IIS（可选）

如果需要通过 IIS 访问（如使用域名、80 端口等），请按以下步骤操作：

### 前置要求

1. **安装 URL Rewrite 模块**
   - 下载: https://www.iis.net/downloads/microsoft/url-rewrite
   - 双击安装即可

2. **安装 Application Request Routing (ARR)**
   - 下载: https://www.iis.net/downloads/microsoft/application-request-routing
   - 安装后需要启用代理功能

### 配置步骤

#### 1. 启用 ARR 代理

1. 打开 IIS 管理器（Win+R 输入 `inetmgr`）
2. 点击服务器节点（最顶层）
3. 双击 "Application Request Routing Cache"
4. 点击右侧 "Server Proxy Settings..."
5. 勾选 "Enable proxy"
6. 点击 "Apply"

#### 2. 创建网站

1. 右键 "网站" → "添加网站"
2. 配置：
   - 网站名称: `NextChat`
   - 物理路径: `D:\Project\Github\neatchat`（你的项目路径）
   - 端口: `80`（或其他）
3. 点击确定

#### 3. 配置应用程序池

1. 点击 "应用程序池"
2. 找到 `NextChat` 对应的池
3. 右键 → "高级设置"
4. 设置 ".NET CLR 版本" 为 "无托管代码"
5. 确定

#### 4. 测试

- 直接访问: http://localhost:3000 ✓
- IIS 访问: http://localhost ✓

详细说明请查看 `IIS配置说明.md`

## 🔍 验证部署

### 检查 PM2 状态
```cmd
pm2 status
```

应该看到：
```
┌─────┬──────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name     │ mode    │ ↺      │ status  │ cpu      │
├─────┼──────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ nextchat │ fork    │ 0       │ online  │ 0%       │
└─────┴──────────┴─────────┴─────────┴─────────┴──────────┘
```

### 查看日志
```cmd
pm2 logs nextchat
```

### 访问测试
浏览器打开 http://localhost:3000，应该能看到 NextChat 界面

## 🛠️ 日常管理

### 使用管理工具（推荐）
双击运行 `pm2-manage.bat`，提供以下功能：
- 查看应用状态
- 查看实时日志
- 重启/停止/启动应用
- 查看错误日志
- 清空日志

### 命令行操作

```cmd
# 查看状态
pm2 status

# 重启应用
pm2 restart nextchat

# 停止应用
pm2 stop nextchat

# 启动应用
pm2 start nextchat

# 查看日志
pm2 logs nextchat

# 查看错误日志
pm2 logs nextchat --err

# 清空日志
pm2 flush
```

## 🔄 更新应用

当代码更新后：

```cmd
# 方式一：使用部署脚本
deploy.bat

# 方式二：手动更新
git pull
yarn install
yarn build
pm2 restart nextchat
```

## 🚀 开机自启

### 使用 pm2-installer（推荐）

1. 下载 pm2-installer
   - 地址: https://github.com/jessety/pm2-installer/releases
   - 下载最新的 `.exe` 文件

2. 运行安装程序
   - 双击安装
   - 按提示完成安装

3. PM2 将作为 Windows 服务运行
   - 开机自动启动
   - 后台运行，不需要保持命令行窗口

### 验证服务

1. 打开服务管理器（Win+R 输入 `services.msc`）
2. 找到 "PM2" 服务
3. 确认状态为 "正在运行"，启动类型为 "自动"

## ⚙️ 配置说明

### 环境变量 (.env.local)

```env
# 必填：OpenAI API Key
OPENAI_API_KEY=sk-xxxxx

# 可选：访问密码（多个用逗号分隔）
CODE=password1,password2

# 可选：代理设置
PROXY_URL=http://localhost:7890

# 可选：Google API Key
GOOGLE_API_KEY=

# 可选：自定义模型
CUSTOM_MODELS=

# 更多配置请查看 .env.template
```

### PM2 配置 (ecosystem.config.js)

```javascript
{
  name: 'nextchat',           // 应用名称
  instances: 1,               // 实例数量（可改为 'max' 使用所有核心）
  max_memory_restart: '1G',   // 内存限制
  env: {
    PORT: 3000                // 端口号
  }
}
```

### IIS 配置 (web.config)

反向代理到 `http://localhost:3000`，如果修改了 PM2 端口，需要同步修改此处。

## 🔧 故障排查

### 问题 1: 应用无法启动

**检查步骤**：
```cmd
# 1. 检查依赖
yarn install

# 2. 检查构建
yarn build

# 3. 查看错误日志
pm2 logs nextchat --err --lines 50
```

### 问题 2: 端口被占用

**解决方案**：
1. 修改 `ecosystem.config.js` 中的 `PORT`
2. 如果配置了 IIS，同步修改 `web.config` 中的端口
3. 重启应用：`pm2 restart nextchat`

### 问题 3: IIS 502 错误

**原因**：PM2 应用未运行或端口不匹配

**解决方案**：
```cmd
# 检查 PM2 状态
pm2 status

# 重启应用
pm2 restart nextchat

# 检查端口是否匹配
# PM2: ecosystem.config.js 中的 PORT
# IIS: web.config 中的 url
```

### 问题 4: API Key 无效

**解决方案**：
1. 检查 `.env.local` 中的 `OPENAI_API_KEY`
2. 确保 API Key 有效且有余额
3. 修改后重启：`pm2 restart nextchat`

### 问题 5: 无法访问

**检查清单**：
- [ ] PM2 应用状态为 online：`pm2 status`
- [ ] 端口未被占用：`netstat -ano | findstr :3000`
- [ ] 防火墙允许访问
- [ ] 如果通过 IIS，检查 ARR 代理是否启用

## 📊 性能优化

### 1. 多实例部署（多核 CPU）

编辑 `ecosystem.config.js`：
```javascript
{
  instances: 'max',        // 使用所有 CPU 核心
  exec_mode: 'cluster'     // 集群模式
}
```

### 2. IIS 压缩

在 IIS 管理器中启用：
- 动态内容压缩
- 静态内容压缩

### 3. 缓存配置

为静态资源设置适当的缓存策略

## 🔒 安全建议

1. **设置访问密码**
   ```env
   CODE=your-strong-password
   ```

2. **配置 HTTPS**
   - 在 IIS 中配置 SSL 证书
   - 强制 HTTPS 访问

3. **限制 API 访问**
   - 使用 `HIDE_USER_API_KEY=1` 禁止用户输入自己的 Key
   - 设置 `DISABLE_GPT4=1` 限制模型使用

4. **定期更新**
   ```cmd
   git pull
   yarn install
   yarn build
   pm2 restart nextchat
   ```

## 📚 相关文档

- [快速开始指南](快速开始.md)
- [IIS 配置说明](IIS配置说明.md)
- [PM2 官方文档](https://pm2.keymetrics.io/)
- [NextChat 项目](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web)

## 💡 提示

- 使用 `pm2-manage.bat` 进行日常管理，更方便
- 日志文件位于 `logs/` 目录
- 建议配置开机自启，确保服务稳定运行
- 定期备份 `.env.local` 配置文件

---

**部署完成后，记得配置真实的 API Key！** 🎉
