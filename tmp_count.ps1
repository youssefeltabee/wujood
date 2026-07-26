Get-ChildItem -Path 'C:\Users\youssef besheer\wujood-app\src\app\api' -Filter 'route.ts' -Recurse | ForEach-Object {
    try {
        \ = Get-Content -LiteralPath \.FullName
        \ = (\ | Measure-Object -Line).Lines
        Write-Output "\  \"
    } catch {
        Write-Output "ERR  \"
    }
} | Sort-Object -Property Length -Descending
