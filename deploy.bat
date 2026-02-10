@echo off
echo ========================================
echo NextChat 部署脚本
echo ========================================
echo.

echo [1/4] 安装依赖...
call yarn install
if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b %errorlevel%
)
echo.

echo [2/4] 构建项目...
call yarn build
if %errorlevel% neq 0 (
    echo 错误: 项目构建失败
    pause
    exit /b %errorlevel%
)
echo.

echo [3/4] 停止旧的 PM2 进程...
call pm2 delete nextchat 2>nul
echo.

echo [4/4] 启动 PM2 服务...
call pm2 start ecosystem.config.js
if %errorlevel% neq 0 (
    echo 错误: PM2 启动失败
    pause
    exit /b %errorlevel%
)
echo.

echo 保存 PM2 配置...
call pm2 save
echo.

echo ========================================
echo 部署完成！
echo ========================================
echo.
echo 应用已启动在: http://localhost:3000
echo.
echo 常用命令:
echo   查看状态: pm2 status
echo   查看日志: pm2 logs nextchat
echo   重启应用: pm2 restart nextchat
echo   停止应用: pm2 stop nextchat
echo.
pause
