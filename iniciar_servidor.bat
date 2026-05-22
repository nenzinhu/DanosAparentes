@echo off
title Servidor de Vistoria Veicular (Puter.js & Mobile)
echo =====================================================================
echo    Servidor de Desenvolvimento Local - Vistoria Veicular
echo =====================================================================
echo.
echo Para acessar do COMPUTADOR:
echo   -> http://localhost:8000/index.html
echo   -> http://localhost:8000/inspecao_veicular.html
echo.
echo Para acessar do CELULAR (conectado no mesmo Wi-Fi):
echo   -> http://192.168.3.23:8000/index.html
echo   -> http://192.168.3.23:8000/inspecao_veicular.html
echo.
echo =====================================================================
echo Mantenha esta janela aberta enquanto estiver testando.
echo Pressione Ctrl + C para fechar o servidor.
echo =====================================================================
echo.
python -m http.server 8000
pause
