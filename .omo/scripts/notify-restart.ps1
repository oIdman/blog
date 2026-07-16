param(
    [string]$NewVersion,
    [int]$CountdownSeconds = 10
)

$msg = "服务器将在 {0} 秒后重启更新至 {1}，请保存工作！" -f $CountdownSeconds, $NewVersion
Write-Output "=== 通知用户 ==="
Write-Output $msg
Write-Output "=== 倒计时 ==="
for ($i = $CountdownSeconds; $i -ge 0; $i--) {
    Write-Output ("{0} 秒..." -f $i)
    if ($i -gt 0) { Start-Sleep -Seconds 1 }
}
Write-Output ("=== 重启中，版本: {0} ===" -f $NewVersion)
