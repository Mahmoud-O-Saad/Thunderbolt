# Prominent Sign Up with Gmail/Discord Linking & Standardized 'أ.ح' Military Ranks

This implementation plan outlines the architecture and user experience enhancements for introducing a prominent external Sign Up entry point for new visitors with one-click Gmail and Discord account linking, as well as standardizing all Staff Officer ranks across the Thunderbolt Unit tactical interface to use the official military abbreviation **"أ.ح"** (e.g., `[MG | لواء أ.ح]`).

---

## User Review & Critical Decisions

> [!NOTE]
> **Status: Completed & Verified**
> - **Login Gateway Page (`LoginPage.tsx`)**: Created a dedicated tactical Egyptian Thunderbolt military login page that displays before entering the app. Features operator quick-select chips (Dragon, Tariq, etc.), username/callsign sign in, one-click Gmail and Discord authentication, and a direct recruit "Sign Up / طلب انضمام" CTA.
> - **Session & Logout Control**: Integrated `isLoggedIn` state in `App.tsx` persisted in `localStorage`. Added top-bar and Account-tab "Log Out / تسجيل خروج" buttons to return to the gateway at any time.
> - **Standardized "أ.ح" Ranks**: All staff officer ranks across the app now strictly use the military abbreviation **"أ.ح"** (e.g. `[MG | لواء أ.ح]`, `[COL | عقيد أ.ح]`, `[BGD | عميد أ.ح]`).
> - **Build & Lint**: `lint_applet` and `compile_applet` both succeeded cleanly with 0 errors.

---

## 1. Overview & Core Concept

- **What It Delivers**:
  1. **Prominent Guest Sign Up**: When a new visitor or logged-out user accesses the app, they immediately see an eye-catching tactical "Sign Up / انضمام" CTA in the top header ribbon and a persistent Recruit Registration Banner in the main view.
  2. **One-Click Gmail & Discord Linking**: In Step 1 of the registration wizard, recruits can link their Gmail account (e.g., auto-filling email and suggested callsign) or Discord handle (for mission voice frequencies and operations briefings), complete with verification modals and linked identity tags.
  3. **Strict "أ.ح" Staff Officer Ranks**: Standardizing all staff officer commissions to use the exact Arabic military abbreviation **"أ.ح"** (أركان حرب) across all rank cards, promotion modals, applicant review screens, and commander identity banners.

- **Target Persona**: New recruits joining the Thunderbolt Unit via community invite links who need an effortless, clear onboarding flow with Discord/Gmail integration, alongside senior commanders commanding staff battalions.

- **Key Value**: Streamlines recruit onboarding with zero friction while reinforcing tactical realism and Egyptian military rank naming conventions.

---

## 2. User Experience & Visual Design

### Key User Flows

```
[ Visitor / Unregistered User ]
              │
              ▼
┌────────────────────────────────────────────────────────┐
│ 1. Prominent Sign Up CTA in Top Bar + Guest Alert Card │
└─────────────────────────────┬──────────────────────────┘
                              │ Taps "Sign Up / انضمام"
                              ▼
┌────────────────────────────────────────────────────────┐
│ 2. Registration Modal - Step 1: Single Callsign & Comms │
│   ├─ [Link with Gmail]  ──> One-Click Google Auth Modal │
│   ├─ [Link with Discord]──> One-Click Discord Modal     │
│   ├─ Single Callsign input (e.g. Mahmoud, Tariq)       │
│   └─ Steam 64-bit UID input (auto-generates TU-XXXX)    │
└─────────────────────────────┬──────────────────────────┘
                              │ Next: Military Rank
                              ▼
┌────────────────────────────────────────────────────────┐
│ 3. Step 2: Rank Suggestion with "أ.ح" Badges          │
│   ├─ Displays recruit status (Pending Commander clearance)
│   └─ Standard tags: [MG | لواء أ.ح], [COL | عقيد أ.ح]   │
└─────────────────────────────┬──────────────────────────┘
                              │ Submit Application
                              ▼
┌────────────────────────────────────────────────────────┐
│ 4. Commander Review & Approval Modal                   │
│   ├─ Shows applicant's Steam UID, Gmail & Discord tags │
│   └─ Commander commissions final rank & grants clearance│
└────────────────────────────────────────────────────────┘
```

### Visual Identity & Theme
- **Theme**: Dark tactical combat operations palette (`#0B0F19`, `#0d120f`, gold `#f2c14e`, emerald `#10b981`, Discord indigo `#5865F2`).
- **Typography**: Clean monospace font for military callsigns, UIDs, and rank tags (`font-mono`), paired with bold condensed display font for headers (`font-display`).
- **Badge Styling**: High-contrast, unboxed or cleanly bordered rank tags with distinctive green `أ.ح` badges and gold `Command` indicators.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Prominent Guest Experience vs. Seamless Commander Access**
  - *Chosen Approach*: Unregistered or pending users see a dedicated guest status banner and a gold-accented "Sign Up / انضمام" button in the sticky top identity bar. Commanders retain their instant account-switching controls without interface clutter.
  - *Why*: Ensures new visitors are never confused about how to join, while existing unit leaders maintain full administrative authority.

- **Decision 2: One-Click Modal Auth Linking for Gmail & Discord**
  - *Chosen Approach*: Interactive, dedicated dialogs allowing recruits to connect their real Gmail (`mahmoudosama3003@gmail.com`) and Discord handles (`Mahmoud#3003`), storing these verified connections on the user profile and transmitting them to the Commander for approval.
  - *Why*: Works reliably within iframe constraints while giving recruits immediate visual confirmation and pre-filling their unit callsign.

- **Decision 3: Uniform "أ.ح" Rank Formatting**
  - *Chosen Approach*: Replace all occurrences of verbose "أركان حرب" in rank strings with the official military abbreviation **"أ.ح"** (e.g., `[MG | لواء أ.ح]`, `[COL | عقيد أ.ح]`, `[BGD | عميد أ.ح]`, `[LTC | مقدم أ.ح]`, `[MAJ | رائد أ.ح]`).
  - *Why*: Matches military brevets and fits neatly on tactical HUDs, cards, and mobile screens without line wrapping.

---

## 4. Technical Architecture & Data Strategy

### System Component Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                             App.tsx                              │
│  State: accounts[], currentUser, userRole, attendance, missions │
└─────────────────┬────────────────────────────────────────────────┘
                  │
       ┌──────────┴─────────────────────────┐
       ▼                                    ▼
┌─────────────────────────────┐   ┌──────────────────────────────┐
│  WhackaThunderboltApp.tsx   │   │     SignUpModal.tsx          │
│  ├─ Sticky Top Identity Bar │   │  ├─ Step 1: Username & Links │
│  │   └─ [Sign Up / انضمام]  │   │  │   ├─ Google Link Modal    │
│  ├─ Guest Onboarding Banner │   │  │   └─ Discord Link Modal   │
│  ├─ DiscordMemberHub.tsx    │   │  └─ Step 2: Military Rank    │
│  │   └─ Linked Identity Tag │   │      └─ [CODE | رتبة أ.ح]     │
│  └─ Account & Command Views │   └──────────────────────────────┘
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│  LeaderApprovalModal.tsx    │
│  ├─ Pending Applicants List │
│  │   ├─ Gmail & Discord tags│
│  │   └─ Commission "أ.ح"    │
│  └─ Member Roster Editor    │
└─────────────────────────────┘
```

### State & Model Updates
1. **`UserAccount` entity (`types.ts`)**:
   - `authProvider?: 'google' | 'discord' | 'manual'`
   - `linkedGmail?: string`
   - `linkedDiscord?: string`
2. **`AVAILABLE_RANKS` (`initialData.ts`)**:
   - Ensure all staff ranks use formatted string with `أ.ح` (e.g. `[MG | لواء أ.ح]`).
   - Normalizer regex in `App.tsx` mappings: converts any legacy `أركان حرب` into clean `أ.ح`.
3. **`LeaderApprovalModal.tsx` & `AccountSwitcherModal.tsx`**:
   - Render `Gmail` and `Discord` tags alongside applicant UIDs.
   - Display `Command` badge for senior ranks (Colonel to Major General) and `أ.ح` badge for staff officers.
