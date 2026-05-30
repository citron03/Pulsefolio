$utf8NoBom = New-Object System.Text.UTF8Encoding $false

[Console]::InputEncoding = $utf8NoBom
[Console]::OutputEncoding = $utf8NoBom
$OutputEncoding = $utf8NoBom
$PSDefaultParameterValues["Get-Content:Encoding"] = "utf8"
$PSDefaultParameterValues["Set-Content:Encoding"] = "utf8"
chcp 65001 > $null

Write-Host "PowerShell UTF-8 input/output is enabled for this session."
