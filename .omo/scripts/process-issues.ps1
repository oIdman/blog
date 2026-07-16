param(
    [string]$RepoPath = "E:\user\Desktop\Project\blog",
    [string]$Action = "check"
)

if ($Action -eq "check") {
    $gh = Get-Command "gh" -ErrorAction SilentlyContinue
    if ($gh) {
        Write-Output "gh CLI available - use 'gh issue list' to check open issues"
    } else {
        Write-Output "gh CLI not available. Issues management requires gh CLI."
    }
}
