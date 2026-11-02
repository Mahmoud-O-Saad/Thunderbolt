# Sa'ka Academy Promotion System (نظام الترقيات)

Integrate the official Egyptian Thunderbolt Military Promotion System (نظام الترقيات) into Sa'ka Academy as a dedicated tab (`PROMOTIONS · نظام الترقيات`), featuring an interactive milestone roadmap, live qualification progress tracking for the selected operator, custom tactical vest name-tag rewards, and leadership command appointment tiers.

## User Review & Critical Decisions

> [!IMPORTANT]
> - **Confirmed Placement**: Dedicated `PROMOTIONS` tab inside Sa'ka Academy alongside `DASHBOARD`, `QUALIFICATIONS`, `ASSESSMENT`, `RECORDS`, and `EXPORT`.
> - **Confirmed Presentation Style**: Interactive milestone roadmap with live progress meters calculated in real time against the selected operator's certified qualifications (`completed / target`).
> - **Tactical Vest Reward Preview**: For PFC (جندي أول - 8 qualifications), renders an interactive ARMA III Thunderbolt tactical vest preview displaying the operator's personalized military name tag (`Name Tag`).
> - **Prerequisite SFQ-001 Check**: For CPL (عريف - 12 qualifications), automatically verifies if `01.9 Special Forces Qualification (SFQ-001)` has been certified.

---

## 1. Overview & Core Concept

- **What It Does**:
  Provides an official, authoritative, and interactive career progression roadmap directly within Sa'ka Academy. Operators and commanders can view exactly how certified qualifications translate into rank advancement, insignia recognition, custom tactical vest name tags, and command appointments.
- **Target Audience / Persona**:
  - **Recruits & Squad Operators**: Track their qualification count towards PFC (8 quals) and CPL (12 quals including SFQ-001), visualizing their next milestone.
  - **Instructors & Commander Maj. Gen. Dragon**: Reference standard commissioning benchmarks when reviewing recruit clearance and rank promotions in the Command Room.
- **Core Doctrine Text Integrated**:
  - 🇪🇬 **أكاديمية الصاعقة | نظام الترقيات**: General promotion philosophy emphasizing commitment, skill development, and leadership over mere seniority.
  - 🔰 **جندي أول (PFC) — 8 تأهيلات**: Core + Combat Roles + Specialist modules, unlocking a personalized Thunderbolt combat vest with name tag.
  - 🎖️ **عريف (CPL) — 12 تأهيل**: Requires 12 qualifications including `SFQ-001`.
  - 🎖️ **رقيب (SGT) — قائد جماعة نيران (Fireteam Leader)**: Dedicated fireteam command billet.
  - 🎖️ **رقيب أول (SSG) — قائد فصيلة قتالية (Squad Leader)**: Dedicated squad command billet.
  - 🇪🇬 **فلسفة الترقيات في وحدة الصاعقة**: Ranks are earned through discipline, verified field capability, and tactical responsibility.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Navigating to Promotions**: Operator or Instructor opens Sa'ka Academy and taps `PROMOTIONS` (or `نظام الترقيات` in Arabic) in the navigation toolbar.
2. **Reviewing Promotion Milestones**:
   - Operator sees their current certified count (e.g. `12 / 31 Certified · 38%`) and an interactive vertical progression line connecting the 4 ranks:
     - **Milestone 1: PFC (جندي أول)**: 8 Modules. Visual meter shows current count vs 8. Shows personalized Tactical Vest with name tag badge (`[PFC] Mahmoud`).
     - **Milestone 2: CPL (عريف)**: 12 Modules (including SFQ-001). Shows status of SFQ-001 requirement (`✓ SFQ-001 Certified` or `⚠ SFQ-001 Required`).
     - **Milestone 3: SGT (رقيب)**: Fireteam Leader command billet.
     - **Milestone 4: SSG (رقيب أول)**: Squad Leader command billet.
3. **Switching Operators**: Changing the selected operator in the top strip dynamically recalculates the milestone progress bars, eligible rank badges, and name tags.
4. **Promotion Philosophy Card**: An Egyptian military brass-bordered doctrine card at the bottom reiterating the Thunderbolt merit-based promotion philosophy.

### Visual Identity & Theme
- **Theme Tokens**: Dark tactical camo background `#0c0f0d`, deep gold accents `#f2c14e`, emerald milestone completion `#52b788`, tactical amber `#f59e0b`.
- **Milestone Roadmap Design**:
  ```
  [ Recruit / PVT ]
         │
         ▼ (8 Modules)
  ┌────────────────────────────────────────────────────────┐
  │ 🔰 PFC · جندي أول (8 Modules)                          │
  │ Progress: [██████████░░] 8/8 Certified · ELIGIBLE ✓    │
  │ Reward: Custom Thunderbolt Vest with [Name Tag]        │
  └────────────────────────────────────────────────────────┘
         │
         ▼ (12 Modules + SFQ-001)
  ┌────────────────────────────────────────────────────────┐
  │ 🎖️ CPL · عريف (12 Modules + SFQ-001)                   │
  │ Progress: [██████░░░░░░] 6/12 Modules · In Progress    │
  │ Prerequisite: 01.9 Special Forces Qual (SFQ-001)       │
  └────────────────────────────────────────────────────────┘
         │
         ▼ (Command Appointment)
  ┌────────────────────────────────────────────────────────┐
  │ 🎖️ SGT · رقيب (Fireteam Leader · قائد جماعة نيران)    │
  │ Direct tactical fireteam command billet                │
  └────────────────────────────────────────────────────────┘
         │
         ▼ (Command Appointment)
  ┌────────────────────────────────────────────────────────┐
  │ 🎖️ SSG · رقيب أول (Squad Leader · قائد فصيلة قتالية)   │
  │ Multi-fireteam operations coordination                 │
  └────────────────────────────────────────────────────────┘
  ```
- **Mobile Responsiveness**: Fits 100% of the mobile screen cleanly, with touchable cards, legible Arabic typography (`font-arabic`), and clear progress rings.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dynamic Operator Milestone Evaluation**:
  - *Chosen Approach*: The roadmap calculates real-time eligibility for the currently inspected operator in Sa'ka Academy (e.g. Mahmoud vs Dragon vs Tariq).
  - *Why*: Allows instructors to instantly see if an operator qualifies for PFC or CPL, and allows members to see their immediate path to their next rank.
- **Decision 2: Dedicated Tab vs Modal Popup**:
  - *Chosen Approach*: A dedicated permanent tab `PROMOTIONS` in the Academy toolbar, plus an optional promotion doctrine banner in the Dashboard.
  - *Why*: Keeps the Academy organized and allows operators to revisit the promotion rules anytime without intrusive popups.

---

## 4. Technical Architecture & Implementation Steps

```
┌─────────────────────────────────────────────────────────────────────────┐
│ SakaAcademyModal.tsx                                                    │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Top Nav: DASHBOARD | QUALIFICATIONS | PROMOTIONS | RECORDS | EXPORT │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ When activeTab === 'PROMOTIONS':                                        │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ PromotionsView                                                      │ │
│ │  ├─ Doctrine Header & Philosophy Banner (فلسفة الترقيات)            │ │
│ │  ├─ Active Candidate Status & Service ID                            │ │
│ │  ├─ Interactive Milestone Roadmap:                                  │ │
│ │  │   ├─ PFC Card (8 Quals + Tactical Vest Name Tag Preview)         │ │
│ │  │   ├─ CPL Card (12 Quals + SFQ-001 Prerequisite Check)            │ │
│ │  │   ├─ SGT Card (Fireteam Leader Billet Directives)                │ │
│ │  │   └─ SSG Card (Squad Leader Billet Directives)                   │ │
│ │  └─ Merit Doctrine Footer Quote (Thunderbolt Unit 🇪🇬)               │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Files to Modify:
1. `src/components/SakaAcademyModal.tsx`:
   - Extend `activeTab` type union to include `'PROMOTIONS'`.
   - Add `PROMOTIONS` tab button in the responsive navigation toolbar (both mobile horizontal scroll and desktop sidebar).
   - Render the complete `PROMOTIONS` view with Arabic text, milestone roadmap cards, progress bars, vest name-tag badge, and SFQ-001 verification.
2. Verification:
   - Run `lint_applet` (`tsc --noEmit`) and `compile_applet`.
   - Verify mobile and desktop responsiveness.
