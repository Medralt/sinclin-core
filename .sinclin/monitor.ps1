while (\True) {
    try {
        Invoke-WebRequest -Uri "https://sinclin-core.onrender.com/api/ia" -TimeoutSec 5 *> \
        Add-Content "C:\Users\home\sinclin\core_auto\.sinclin\monitor.log" "OK \04/14/2026 19:54:55"
    } catch {
        Add-Content "C:\Users\home\sinclin\core_auto\.sinclin\monitor.log" "FAIL \04/14/2026 19:54:55"
    }
    Start-Sleep -Seconds 60
}
