\ = Get-Content "C:\Users\home\sinclin\core_auto\.sinclin\monitor.log" -Tail 1
if (\ -match "FAIL") {
    [console]::beep(1000,500)
}
