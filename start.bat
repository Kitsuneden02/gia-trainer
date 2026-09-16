@echo off
setlocal
echo ===================================================
echo     GIA Trainer - Starting Local Dev Server
echo ===================================================

cd /d "%~dp0"

:: Check if Python is installed
where python >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python detected. Starting server at http://localhost:8000 ...
    start "" http://localhost:8000
    python -m http.server 8000
    goto end
)

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js detected. Starting server at http://localhost:8000 ...
    start "" http://localhost:8000
    npx -y serve . -l 8000
    goto end
)

:: Fallback using PowerShell built-in HTTP listener
echo [INFO] Falling back to lightweight PowerShell web server...
start "" http://localhost:8000
powershell -NoProfile -ExecutionPolicy Bypass -Command "$listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8000/'); $listener.Start(); Write-Host 'Server running at http://localhost:8000 (Press Ctrl+C to terminate)'; while($listener.IsListening){ $ctx = $listener.GetContext(); $path = Join-Path (Get-Location) ($ctx.Request.RawUrl.TrimStart('/')); if($path.EndsWith('\') -or $path -eq (Get-Location)){ $path = Join-Path $path 'index.html' }; if(Test-Path $path){ $bytes = [IO.File]::ReadAllBytes($path); $ext = [IO.Path]::GetExtension($path); $types = @{'.html'='text/html';'.js'='text/javascript';'.css'='text/css';'.svg'='image/svg+xml'}; $ctx.Response.ContentType = if($types[$ext]){$types[$ext]}else{'application/octet-stream'}; $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length) } else { $ctx.Response.StatusCode = 404 }; $ctx.Response.Close() }"

:end
pause
