# CashLens on Android

The Android app is the **same React UI** as the website, wrapped with
[Capacitor](https://capacitorjs.com/). The difference is where the data lives:

| Target | Data source |
| --- | --- |
| Browser | The Django API (`/api/main/`, `/api/txns/…`, `/api/txn/add/`) |
| Android | SQLite on the device — **no network needed** |

Both go through one seam, `frontend/src/data/adapters/`. Nothing above that
directory knows which is in use, because both adapters return the exact same
JSON shapes the Django views return.

```
src/data/adapters/
├── index.js          the ONLY platform check (Capacitor.isNativePlatform)
├── httpAdapter.js    browser → Django
├── sqliteAdapter.js  Android  → device SQLite
├── schema.js         DDL mirroring the Django tables
└── txnRules.js       the accounting rules, shared by both
```

`txnRules.js` is a line-for-line port of `txn_handler` in
`backend/api/views.py`. It decides how a transaction moves your current value,
investments, debt, income and 1% contribution — so if it ever drifts from the
server, your phone and the website disagree about your money. `npm run test:rules`
guards that, and CI fails the build if it breaks.

---

## Getting an APK from CI (no local setup)

The workflow at `.github/workflows/android.yml` builds a debug APK on every push
to `main`, and on demand.

1. Push, or open **Actions → Android APK → Run workflow**.
2. Open the finished run.
3. Download the **`cashlens-debug-apk`** artifact.
4. Unzip it and copy `app-debug.apk` to your phone.
5. Open it on the phone. Android will ask you to allow installs from this
   source the first time — this is expected for a debug build that is not from
   the Play Store.

The artifact is kept for 30 days.

---

## Building locally

This needs about 8 GB of tooling, which is why CI is the default path.

**Prerequisites**

- **JDK 17** (Temurin is fine). Gradle 8.11 will not run on JDK 8 or 11.
- **Android Studio**, or just the command-line SDK tools, with the **API 35**
  platform and build-tools installed.
- `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) pointing at the SDK, or an
  `frontend/android/local.properties` containing `sdk.dir=/path/to/sdk`.

**Build**

```bash
cd frontend
npm ci
npm run android:apk
```

That runs `vite build` → `cap sync android` → `gradlew assembleDebug`. The APK
lands at:

```
frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

**Day-to-day**

```bash
npm run android:sync   # rebuild web assets and push them into the native project
npx cap open android   # open the project in Android Studio to run on a device
```

Any change to `frontend/src` needs an `android:sync` before it shows up in the
app — the native project serves a *copy* of `dist/`.

---

## Release signing (not automated, on purpose)

`assembleDebug` produces an APK signed with Android's shared debug key. It
installs and runs, but it cannot go to the Play Store and should not be treated
as a trusted build.

A release build needs a keystore you generate and keep. That keystore is not in
this repository and is not in CI secrets, because adding it is your decision —
whoever holds it controls updates to the app. When you want it:

1. `keytool -genkey -v -keystore cashlens.keystore -alias cashlens -keyalg RSA -keysize 2048 -validity 10000`
2. Store it somewhere safe and back it up. **Losing it means you can never
   update the app under the same identity.**
3. Add it and its passwords as repository secrets, add a `signingConfigs` block
   to `frontend/android/app/build.gradle`, and switch the workflow to
   `assembleRelease`.

---

## Project facts

| | |
| --- | --- |
| App ID | `in.cashlens.app` |
| App name | CashLens |
| min SDK | 23 (Android 6.0) |
| compile / target SDK | 35 |
| Gradle | 8.11.1 |
| Capacitor | 7 |

**Plugins:** `@capacitor-community/sqlite` (storage), `@capacitor/app`
(hardware back button closes the Add Record sheet rather than exiting),
`@capacitor/status-bar` (keeps content out from under the status bar),
`@capacitor/keyboard` (lifts the sheet above the keyboard).

**Database.** `main_maindata` and `main_transactions`, named and shaped to match
Django's tables so a future phone↔server sync has a straight path. A fresh
install creates the singleton `main_maindata` row with zeros, mirroring the
server's `get_or_create(id=1)`. Inserting a transaction and updating the totals
happens in one SQLite transaction.

**Currency.** USD display needs a live USD/INR rate, which the offline build
cannot fetch. It falls back to a fixed rate. INR — the default — is unaffected.

**Uninstalling the app deletes its database.** There is no export or backup yet;
the data lives only on the device.
