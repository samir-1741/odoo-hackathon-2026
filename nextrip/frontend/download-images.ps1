$baseUrl = "https://images.unsplash.com"
$outDir = "src\assets\places"

$downloads = @(
  @{ file = "varanasi.jpg";  url = "$baseUrl/photo-1561361513-2d000a50f0dc?w=800&q=80" },
  @{ file = "ladakh.jpg";    url = "$baseUrl/photo-1626621341517-bbf3d9990a23?w=800&q=80" },
  @{ file = "udaipur.jpg";   url = "$baseUrl/photo-1477587458883-47145ed94245?w=800&q=80" },
  @{ file = "andaman.jpg";   url = "$baseUrl/photo-1507525428034-b723cf961d3e?w=800&q=80" },
  @{ file = "agra.jpg";      url = "$baseUrl/photo-1548013146-72479768bada?w=800&q=80" },
  @{ file = "hampi.jpg";     url = "$baseUrl/photo-1600100397991-3f6382583d08?w=800&q=80" },
  @{ file = "munnar.jpg";    url = "$baseUrl/photo-1602216056096-3b40cc0c9944?w=800&q=80" },
  @{ file = "sikkim.jpg";    url = "$baseUrl/photo-1506905925346-21bda4d32df4?w=800&q=80" },
  @{ file = "jaisalmer.jpg"; url = "$baseUrl/photo-1590518764057-0a427f71587a?w=800&q=80" },
  @{ file = "rishikesh.jpg"; url = "$baseUrl/photo-1608178398319-48f814d0750c?w=800&q=80" }
)

foreach ($item in $downloads) {
  $outPath = Join-Path $outDir $item.file
  try {
    Invoke-WebRequest -Uri $item.url -OutFile $outPath -UseBasicParsing -TimeoutSec 30
    $size = (Get-Item $outPath).Length
    Write-Host "OK: $($item.file) ($size bytes)"
  } catch {
    Write-Host "FAIL: $($item.file) - $_"
  }
}
