# NextChat IIS 配置说明

## 前置要求

1. **安装 IIS URL Rewrite 模块**
   - 下载地址: https://www.iis.net/downloads/microsoft/url-rewrite
   - 或使用 Web Platform Installer 安装

2. **安装 Application Request Routing (ARR)**
   - 下载地址: https://www.iis.net/downloads/microsoft/application-request-routing
   - 安装后需要启用代理功能

## IIS 配置步骤

### 1. 启用 ARR 代理功能

1. 打开 IIS 管理器
2. 选择服务器节点（最顶层）
3. 双击 "Application Request Routing Cache"
4. 点击右侧 "Server Proxy Settings..."
5. 勾选 "Enable proxy"
6. 点击 "Apply"

### 2. 创建网站

1. 在 IIS 管理器中，右键点击 "网站" -> "添加网站"
2. 配置如下：
   - **网站名称**: NextChat
   - **物理路径**: 选择项目根目录（包含 web.config 的目录）
   - **绑定类型**: HTTP
   - **端口**: 80（或其他可用端口，如 8080）
   - **主机名**: 留空或填写域名

3. 点击 "确定"

### 3. 配置应用程序池

1. 在 IIS 管理器中，点击 "应用程序池"
2. 找到刚创建的网站对应的应用程序池
3. 右键点击 -> "高级设置"
4. 设置：
   - **.NET CLR 版本**: 无托管代码
   - **启动模式**: AlwaysRunning（可选）
   - **标识**: ApplicationPoolIdentity

5. 点击 "确定"

### 4. 验证 web.config

确保项目根目录有 `web.config` 文件，内容应包含反向代理规则。

### 5. 测试配置

1. 确保 PM2 应用正在运行：
   ```cmd
   pm2 status
   ```

2. 在浏览器访问：
   - 直接访问: http://localhost:3000
   - 通过 IIS: http://localhost（或配置的端口）

## 常见问题

### 问题 1: 502 Bad Gateway

**原因**: PM2 应用未运行或端口不匹配

**解决方案**:
```cmd
pm2 status
pm2 restart nextchat
```

### 问题 2: 404 Not Found

**原因**: URL Rewrite 模块未安装或规则配置错误

**解决方案**:
1. 确认已安装 URL Rewrite 模块
2. 检查 web.config 文件是否存在
3. 在 IIS 中查看 "URL 重写" 功能是否可见

### 问题 3: 500 Internal Server Error

**原因**: web.config 配置错误

**解决方案**:
1. 检查 web.config 语法
2. 查看 IIS 详细错误信息
3. 检查应用程序池配置

### 问题 4: 静态资源加载失败

**原因**: 反向代理未正确传递请求头

**解决方案**:
确保 web.config 中包含 serverVariables 配置

## 端口配置

如果需要修改端口：

1. **修改 PM2 端口** (ecosystem.config.js):
   ```javascript
   env: {
     PORT: 3000  // 改为其他端口
   }
   ```

2. **修改 web.config**:
   ```xml
   <action type="Rewrite" url="http://localhost:3000/{R:1}" />
   <!-- 将 3000 改为对应端口 -->
   ```

3. 重启服务：
   ```cmd
   pm2 restart nextchat
   ```

## 设置开机自启

使用 pm2-installer（推荐）:

1. 下载 pm2-installer: https://github.com/jessety/pm2-installer
2. 运行安装程序
3. PM2 将作为 Windows 服务运行，开机自动启动

## 监控和日志

- 查看 PM2 状态: `pm2 status`
- 查看实时日志: `pm2 logs nextchat`
- 查看错误日志: `pm2 logs nextchat --err`
- 使用管理工具: 运行 `pm2-manage.bat`

## 性能优化

1. **启用 IIS 压缩**:
   - 在 IIS 管理器中启用动态和静态内容压缩

2. **配置缓存**:
   - 为静态资源设置适当的缓存策略

3. **增加 PM2 实例**（多核 CPU）:
   ```javascript
   instances: 'max',  // 使用所有 CPU 核心
   exec_mode: 'cluster'
   ```

## 安全建议

1. 配置 HTTPS（推荐）
2. 设置访问密码（在 .env.local 中配置 CODE）
3. 限制 API 访问
4. 定期更新依赖包

## 更新应用

运行部署脚本即可：
```cmd
deploy.bat
```

或手动执行：
```cmd
git pull
yarn install
yarn build
pm2 restart nextchat
```
