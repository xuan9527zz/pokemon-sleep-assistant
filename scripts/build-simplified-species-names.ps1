param(
  [string]$DataPath = (Join-Path $PSScriptRoot '..\data\raenonx-species.json'),
  [string]$OutputPath = (Join-Path $PSScriptRoot '..\data\species-name-simplified.json')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName Microsoft.VisualBasic

$source = Get-Content -LiteralPath $DataPath -Raw | ConvertFrom-Json
$result = [ordered]@{}

foreach ($pokemon in $source.pokemon) {
  $result[[string]$pokemon.id] = [Microsoft.VisualBasic.Strings]::StrConv(
    [string]$pokemon.nameZh,
    [Microsoft.VisualBasic.VbStrConv]::SimplifiedChinese,
    2052
  )
}

$json = $result | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText((Resolve-Path (Split-Path -Parent $OutputPath)).Path + '\' + (Split-Path -Leaf $OutputPath), $json + "`n", [System.Text.UTF8Encoding]::new($false))
Write-Output "Generated $($result.Count) simplified species names -> $OutputPath"
