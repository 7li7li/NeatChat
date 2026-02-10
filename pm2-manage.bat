@echo off
:menu
cls
echo ========================================
echo NextChat PM2 管理工具
echo ========================================
echo.
echo 1. 查看应用状态
echo 2. 查看实时日志
echo 3. 重启应用
echo 4. 停止应用
echo 5. 启动应用
echo 6. 删除应用
echo 7. 查看错误日志
echo 8. 清空日志
echo 9. 退出
echo.
set /p choice=请选择操作 (1-9): 

if "%choice%"=="1" goto status
if "%choice%"=="2" goto logs
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto stop
if "%choice%"=="5" goto start
if "%choice%"=="6" goto delete
if "%choice%"=="7" goto errorlogs
if "%choice%"=="8" goto flush
if "%choice%"=="9" goto end
goto menu

:status
cls
echo 应用状态:
echo ========================================
pm2 status
echo.
pause
goto menu

:logs
cls
echo 实时日志 (按 Ctrl+C 退出):
echo ========================================
pm2 logs nextchat
goto menu

:restart
cls
echo 重启应用...
pm2 restart nextchat
echo 完成！
pause
goto menu

:stop
cls
echo 停止应用...
pm2 stop nextchat
echo 完成！
pause
goto menu

:start
cls
echo 启动应用...
pm2 start ecosystem.config.js
echo 完成！
pause
goto menu

:delete
cls
echo 删除应用...
pm2 delete nextchat
echo 完成！
pause
goto menu

:errorlogs
cls
echo 错误日志:
echo ========================================
pm2 logs nextchat --err --lines 50
pause
goto menu

:flush
cls
echo 清空日志...
pm2 flush
echo 完成！
pause
goto menu

:end
exit
