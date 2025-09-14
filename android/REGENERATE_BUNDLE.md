How to deterministically regenerate the Android production JS bundle and assets

Run these steps on a clean, conflict-free checkout (or in CI) to regenerate the
Metro bundle and assets that were intentionally removed because they contained
merge conflict markers. Do not hand-edit minified production bundles.

1) Install dependencies

   npm ci

2) Build the production JS bundle and copy assets into the Android project

   npx react-native bundle --platform android --dev false --entry-file index.js \
     --bundle-output android/app/src/main/assets/index.android.bundle \
     --assets-dest android/app/src/main/res/

3) Typecheck (optional but recommended)

   npx tsc --noEmit

4) Build Android release AAB locally (or in CI after reconstructing keystore)

   cd android; ./gradlew clean bundleRelease

CI keystore reconstruction (recommended - keep keystore out of git)

- Put the following secrets in your CI (GitHub Actions secrets recommended):
  - UPLOAD_KEYSTORE_BASE64  (base64-encoded upload-keystore.jks)
  - UPLOAD_KEYSTORE_STOREPASS
  - UPLOAD_KEYSTORE_KEYPASS
  - UPLOAD_KEYSTORE_ALIAS

- In CI decode the keystore and write `android/key.properties` just for the
  build step. Example (posix shell):

  echo "$UPLOAD_KEYSTORE_BASE64" | base64 -d > android/app/upload-keystore.jks
  cat > android/key.properties <<EOF
  storePassword=$UPLOAD_KEYSTORE_STOREPASS
  keyPassword=$UPLOAD_KEYSTORE_KEYPASS
  storeFile=app/upload-keystore.jks
  keyAlias=$UPLOAD_KEYSTORE_ALIAS
  EOF

  ./gradlew clean bundleRelease

After the CI job finishes, securely delete the decoded keystore from the build
host. Do not check the keystore into source control.

If Google Play requires a new upload key, export the upload certificate (pem)
from the reconstructed keystore with:

  keytool -export -rfc -alias "$UPLOAD_KEYSTORE_ALIAS" -file upload_cert.pem -keystore android/app/upload-keystore.jks -storepass "$UPLOAD_KEYSTORE_STOREPASS"

Then upload `upload_cert.pem` to Play Console to request an upload-key reset.

Notes
- Rebuild the bundle from source using the steps above to restore a clean generated file.
