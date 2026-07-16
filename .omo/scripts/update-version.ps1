param(
    [string]$ProjectDir = "E:\user\Desktop\Project\blog",
    [string]$VersionType = "patch",
    [string]$ChangeDescription = "",
    [string]$Features = ""
)

$utf8 = [System.Text.Encoding]::UTF8
$goalFile = Join-Path $ProjectDir "PROJECT_GOAL.md"
$readmeFile = Join-Path $ProjectDir "README.md"

# ===== 1. Update PROJECT_GOAL.md =====
$goalContent = [System.IO.File]::ReadAllText($goalFile, $utf8)

$pattern = '\| v(\d+)\.(\d+)\.(\d+) \| 已完成 \|'
$match = [regex]::Match($goalContent, $pattern)

if (-not $match.Success) {
    Write-Error "Cannot find version table in PROJECT_GOAL.md"
    exit 1
}

$major = [int]$match.Groups[1].Value
$minor = [int]$match.Groups[2].Value
$patch = [int]$match.Groups[3].Value

switch ($VersionType) {
    "major" { $major++; $minor = 0; $patch = 0 }
    "minor" { $minor++; $patch = 0 }
    "patch" { $patch++ }
}

$newVersion = "v{0}.{1}.{2}" -f $major, $minor, $patch
$date = Get-Date -Format "yyyy-MM-dd"

$newRow = "| $newVersion | 已完成 | $($ChangeDescription -replace '\|', '/') |"
$goalContent = $goalContent -replace '(\| v\d+\.\d+\.\d+ \| 已完成 \|.*\n)(\n)', ('$1' + $newRow + "`n`n")

[System.IO.File]::WriteAllText($goalFile, $goalContent, $utf8)
Write-Output "PROJECT_GOAL.md: added $newVersion"

# ===== 2. Update README.md =====
if ([string]::IsNullOrEmpty($Features)) {
    $Features = "- 自动更新至 $newVersion"
}

$readmeContent = [System.IO.File]::ReadAllText($readmeFile, $utf8)
$newSection = "## $newVersion 已实现`n$Features`n`n"
$readmeContent = $readmeContent -replace '(## v0\.1\.0 已实现)', ($newSection + '## v0.1.0 已实现')

[System.IO.File]::WriteAllText($readmeFile, $readmeContent, $utf8)
Write-Output "README.md: added section for $newVersion"
Write-Output "OK: Updated to $newVersion"
