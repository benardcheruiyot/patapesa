<#
PowerShell helper: encode a JKS keystore to base64 for GitHub secret upload.
Usage: .\encode-keystore.ps1 -KeystorePath 'C:\path\to\upload-keystore.jks' -OutFile keystore.base64.txt
#>
param(
    [Parameter(Mandatory=$true)]
    [string]$KeystorePath,
    [string]$OutFile = 'keystore.base64.txt'
)
if (-Not (Test-Path $KeystorePath)) {
    Write-Error "Keystore not found: $KeystorePath"
    exit 1
}
$bytes = [System.IO.File]::ReadAllBytes($KeystorePath)
$base64 = [System.Convert]::ToBase64String($bytes)
[System.IO.File]::WriteAllText($OutFile, $base64)
Write-Output "Wrote base64 keystore to $OutFile. Paste its contents into the GitHub secret UPLOAD_KEYSTORE_BASE64."
