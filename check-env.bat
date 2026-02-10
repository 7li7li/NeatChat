@echo off
chcp 65001 >nul
echo ========================================
echo NextChat 环境检查工具
echo ========================================
echo.

set ERROR_COUNT=0

echo [检查 1/5] Node.js...
where node >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✓ Node.js 已安装: %NODE_VERSION%
) else (
    echo ✗ Node.js 未安装
    echo   请从 https://nodejs.org/ 下载安装
    set /a ERROR_COUNT+=1
)
echo.

echo [检查 2/5] Yarn...
where yarn >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('yarn --version') do set YARN_VERSION=%%i
    echo ✓ Yarn 已安装: %YARN_VERSION%
) else (
    echo ✗ Yarn 未安装
    echo   运行: npm install -g yarn
    set /a ERROR_COUNT+=1
)
echo.

echo [检查 3/5] PM2...
where pm2 >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('pm2 --version') do set PM2_VERSION=%%i
    echo ✓ PM2 已安装: %PM2_VERSION%
) else (
    echo ✗ PM2 未安装
    echo   运行: npm install -g pm2
    set /a ERROR_COUNT+=1
)
echo.

echo [检查 4/5] 项目依赖...
if exist "node_modules" (
    echo ✓ 项目依赖已安装
) else (
    echo ⚠ 项目依赖未安装
    echo   运行: yarn install
    set /a ERROR_COUNT+=1
)
echo.

echo [检查 5/5] 环境配置...
if exist ".env.local" (
    echo ✓ 环境配置文件存在
    findstr /C:"OPENAI_API_KEY=sk-" .env.local >nul 2>&1
    if %errorlevel% equ 0 (
        echo ⚠ 请配置真实的 API Key
    )
) else (
    echo ⚠ 环境配置文件不存在
    echo   请复制 .env.template 为 .env.local 并配置
)
echo.

echo ========================================
if %ERROR_COUNT% equ 0 (
    echo ✓ 环境检查通过！可以开始部署
    echo.
    echo 下一步：
    echo   1. 编辑 .env.local 配置 API Key
    echo   2. 运行 deploy.bat 部署应用
) else (
    echo ✗ 发现 %ERROR_COUNT% 个问题，请先解决
)
echo ========================================
echo.
pause
