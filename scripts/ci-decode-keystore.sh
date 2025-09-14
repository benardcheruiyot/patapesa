#!/usr/bin/env bash
set -euo pipefail

if [ -z "${UPLOAD_KEYSTORE_BASE64:-}" ]; then
  echo "ERROR: UPLOAD_KEYSTORE_BASE64 is not set"
  exit 2
fi

mkdir -p android/app
echo "$UPLOAD_KEYSTORE_BASE64" | base64 --decode > android/app/upload-keystore.jks
chmod 600 android/app/upload-keystore.jks

cat > android/key.properties <<EOF
storePassword=${UPLOAD_KEYSTORE_STOREPASS}
keyPassword=${UPLOAD_KEYSTORE_KEYPASS}
keyAlias=${UPLOAD_KEYSTORE_ALIAS}
storeFile=app/upload-keystore.jks
EOF

echo "Decoded keystore to android/app/upload-keystore.jks and wrote android/key.properties"
