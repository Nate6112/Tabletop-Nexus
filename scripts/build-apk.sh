#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID_DIR="$ROOT_DIR/android"
JAVA17_DEFAULT="/root/.local/share/mise/installs/java/17.0.2"

if [[ ! -d "$ANDROID_DIR" ]]; then
  echo "android project not found at: $ANDROID_DIR" >&2
  exit 1
fi

if [[ "${TTN_KEEP_JAVA_HOME:-0}" != "1" && -d "$JAVA17_DEFAULT" ]]; then
  export JAVA_HOME="$JAVA17_DEFAULT"
fi

if ! command -v gradle >/dev/null 2>&1; then
  echo "gradle not found in PATH" >&2
  exit 1
fi

echo "Using JAVA_HOME=${JAVA_HOME:-<unset>}"
echo "Building debug APK..."
set +e
gradle -p "$ANDROID_DIR" :app:assembleDebug
status=$?
set -e

APK_PATH="$ANDROID_DIR/app/build/outputs/apk/debug/app-debug.apk"
if [[ $status -eq 0 && -f "$APK_PATH" ]]; then
  echo "APK built: $APK_PATH"
  exit 0
fi

echo "APK build failed."
echo "Common causes in restricted environments:"
echo "- No access to Google/Maven repositories for Android Gradle Plugin dependencies"
echo "- Missing local Android SDK/Build-Tools"
exit $status
