@echo off
echo 正在设置 GitHub 连接...
echo.
echo 步骤1：确保您已经登录 GitHub
echo 步骤2：创建仓库后运行以下命令
echo.

:: 暂停让用户创建GitHub仓库
pause

echo.
echo 正在推送代码到 GitHub...
git push -u origin main

echo.
echo ✅ 推送完成！
echo 🌐 您的仓库地址：https://github.com/www11234faa/snake-game
echo 📖 请确保您已经：
echo    1. 在GitHub上创建了名为 'snake-game' 的仓库
echo    2. 仓库设置为公开（Public）
echo    3. 没有初始化README文件（因为本地已有）
echo.
pause