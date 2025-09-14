Production signing best practices

- Keep private keystore files (JKS) out of source control. Store them in a secure vault or local encrypted folder.
- Use CI secrets to store a base64-encoded keystore and passwords. Reconstruct the keystore at build time only.
- Rotate the upload key with Play Console if the private key is lost; follow Google's upload-key reset process.
- Use the included GitHub Actions workflows to produce signed AABs. Add the following secrets to your repo:
  - UPLOAD_KEYSTORE_BASE64: base64 of the JKS file
  - UPLOAD_KEYSTORE_STOREPASS
  - UPLOAD_KEYSTORE_KEYPASS
  - UPLOAD_KEYSTORE_ALIAS

How to create the base64 secret on Windows PowerShell:

```powershell
$bytes = [System.IO.File]::ReadAllBytes('C:\path\to\upload-keystore.jks')
[System.Convert]::ToBase64String($bytes) | Out-File -Encoding ascii keystore.base64.txt
Get-Content keystore.base64.txt
```

Once secrets are set, run the `Build Release AAB` GitHub Action to produce a signed AAB artifact.
