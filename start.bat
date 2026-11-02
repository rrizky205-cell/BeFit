@echo off
title Be Fit Gym CRM
echo ======================================================
echo    BE FIT GYM & FITNESS CENTER CRM
echo    High-Performance Athletic Dark UI
echo ======================================================
echo.

set AGY_NODE="C:\Users\RIZKY MUHAMMAD RIADY\AppData\Roaming\Antigravity\bin\agy-node.cmd"

if exist %AGY_NODE% (
    echo Menjalankan local server via Antigravity Node...
    start http://localhost:3000
    %AGY_NODE% server.js
) else (
    where node >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        start http://localhost:3000
        node server.js
    ) else (
        echo Membuka index.html langsung di browser...
        start "" index.html
    )
)
