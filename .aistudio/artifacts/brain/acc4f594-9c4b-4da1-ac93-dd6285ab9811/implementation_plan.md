# Qualification Training Booking Calendar & Companion Invitations

A tactical training booking system integrated directly into the **Sa'ka Academy** qualification modules. Allows operators to schedule qualification assessment sessions with specific dates (Year, Month, Day) and time slots, invite a fellow operator via Gmail/Google Calendar, and submit booking requests for Instructor validation.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design decisions were aligned during Phase 1 interactive scoping:
> - **Module Access**: Embedded directly inside the **Sa'ka Academy** modal for all 31 qualification modules (e.g. 01.1 Basic Combat, 01.2 Land Navigation, 03.1 Combat Medic, etc.).
> - **Companion Invitations**: Operators can add a comrade's Gmail address to generate synchronized **Google Calendar events** with automated email invitations and tactical event briefs.
> - **Instructor Verification**: Bookings submit as `status: 'pending'`, requiring a Thunderbolt Instructor (such as Commander Dragon) to approve the training slot from the Command Clearance Desk before final confirmation.

---

## 1. Overview & Core Concept

- **What It Does**: Provides operators with a dedicated **"Book Training Session" (حجز موعد تدريب)** interface within each Sa'ka Academy qualification module. Operators select a training date (Year, Month, Day) and time slot, specify optional companion operators by email, and submit their dossier. Instructors review upcoming slots in a centralized **Training Schedule Queue**, with one-click approval that generates synchronized Google Calendar invites and Gmail alerts.
- **Target Audience**: Thunderbolt Unit recruits, operators pursuing specialized badges, and Tactical Instructors running assessment lanes.
- **Key Value**: Eliminates manual scheduling chaos, keeps training rosters synchronized in Google Calendar, and enforces instructor oversight on all qualification attempts.

---

## 2. User Experience & Visual Design

### Key User Flows

```
[ Operator in Sa'ka Academy ] ──► Select Qualification (e.g. 01.2 Land Nav)
                                        │
                                        ▼
                           Click [ Book Training Session ]
                                        │
                                        ▼
                  ┌──────────────────────────────────────────────┐
                  │          Tactical Booking Console            │
                  │  • Date Picker: Year / Month / Day           │
                  │  • Time Slot: 06:00 / 10:00 / 16:00 UTC+2    │
                  │  • Companion: Comrade's Gmail Address        │
                  │  • Objectives & Pre-exercise Notes           │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                      [ Submit Request -> Firestore (pending) ]
                                         │
                                         ▼
[ Instructor in Command Desk ] ──► Review Slot & Companion
                                         │
                                         ├─► [ Reject / Reschedule ]
                                         │
                                         └─► [ Approve Session ]
                                                   │
                                                   ▼
                                ┌──────────────────────────────────────┐
                                │ • Google Calendar Event Created      │
                                │ • Companion Gmail Invite Dispatched  │
                                │ • Status Updated: Confirmed (Active) │
                                └──────────────────────────────────────┘
```

1. **Academy Booking Trigger**:
   - Inside any qualification view in Sa'ka Academy, a prominent gold action button: `[ Schedule Training Session / حجز موعد تدريب ]`.
2. **Tactical Date & Time Selector**:
   - Clean military calendar interface allowing explicit selection of **Year (2026)**, **Month (October/November)**, and **Day (1-31)**.
   - Tactical operational time slots: Morning Lane (06:00 UTC+2), Midday Range (12:00 UTC+2), Dusk Infiltration (18:00 UTC+2).
3. **Comrade / Companion Invites**:
   - Input for companion Gmail address with tactical squad search helper.
   - Generates Google Calendar attendee invite and pre-formatted military invitation email.
4. **Instructor Command Desk Queue**:
   - Instructors view all pending qualification session requests with candidate name, qualification module, requested date/time, and companion.
   - Quick **Approve Session** and **Google Calendar Sync** action buttons.

### Visual Identity & Theme

- **Aesthetic Direction**: Tactical dark HUD theme (`#070a08` background, `#0e1310` cards, `#f2c14e` gold highlights).
- **Typography**: Clean display sans (`Plus Jakarta Sans`), tabular figures for dates and times (`JetBrains Mono`, `tabular-nums`), zero pill clutter.
- **Calendar Layout**: High-density grid with intuitive day tiles, active selection markers, and clear vacancy status indicators.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual Google Calendar Integration (1-Click Google Calendar URL + Direct Google Workspace API)**:
  - *Chosen Approach*: Implement direct Google Calendar Event creation links (`https://calendar.google.com/calendar/render?action=TEMPLATE...`) alongside Google Workspace OAuth integration for seamless instant calendar adds with companion email delivery.
  - *Why*: Guarantees instant 100% reliable calendar event creation on mobile, desktop, and iframe environments without auth friction, while supporting full API sync when OAuth is authorized.
- **Decision 2: Firestore Persistence with Instructor Approval**:
  - *Chosen Approach*: Store bookings in a dedicated `trainingBookings` collection in Firestore with real-time listeners.
  - *Why*: Allows both operators and instructors to see real-time status updates without manual page refreshes.
- **Decision 3: Embedded Academy Modal Integration**:
  - *Chosen Approach*: Render the booking scheduler directly inside `SakaAcademyModal.tsx` as a focused view mode rather than forcing navigation away to an external page.
  - *Why*: Keeps the operator focused on the specific qualification curriculum, manual, and prerequisites they are training for.

---

## 4. Technical Architecture & Data Strategy

### System Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Thunderbolt Tactical Web App                    │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                     SakaAcademyModal.tsx                       │   │
│   │   ┌───────────────────────────┐  ┌─────────────────────────┐   │   │
│   │   │   Qualification Modules   │  │ TrainingBookingCalendar │   │   │
│   │   │   (01.1 - 07.1 Details)   │  │ (Year, Month, Day, Slot)│   │   │
│   │   └─────────────┬─────────────┘  └────────────┬────────────┘   │   │
│   └─────────────────┼─────────────────────────────┼────────────────┘   │
│                     │                             │                    │
│                     ▼                             ▼                    │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                    LeaderApprovalModal.tsx                     │   │
│   │                    (Command Training Queue)                    │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │                                    │
│                                   ▼                                    │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                  Firestore (`trainingBookings`)                │   │
│   │   - id, moduleCode, candidateId, candidateName, candidateEmail │   │
│   │   - scheduledDate (YYYY-MM-DD), timeSlot, companionEmail       │   │
│   │   - status: 'pending' | 'confirmed' | 'cancelled'              │   │
│   │   - approvedBy, approvedAt, calendarEventUrl                   │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Firestore Schema Blueprint Update

```json
{
  "entities": {
    "TrainingBooking": {
      "title": "TrainingBooking",
      "description": "Qualification training appointment booking",
      "type": "object",
      "properties": {
        "id": { "type": "string", "maxLength": 128 },
        "qualificationId": { "type": "string", "maxLength": 32 },
        "qualificationTitle": { "type": "string", "maxLength": 128 },
        "candidateId": { "type": "string", "maxLength": 128 },
        "candidateName": { "type": "string", "maxLength": 64 },
        "candidateEmail": { "type": "string", "maxLength": 256 },
        "scheduledDate": { "type": "string", "maxLength": 32 },
        "timeSlot": { "type": "string", "maxLength": 32 },
        "companionEmail": { "type": "string", "maxLength": 256 },
        "status": { "type": "string", "enum": ["pending", "confirmed", "rejected"] },
        "notes": { "type": "string", "maxLength": 512 }
      },
      "required": ["id", "qualificationId", "candidateId", "scheduledDate", "timeSlot", "status"]
    }
  },
  "firestore": {
    "/trainingBookings/{bookingId}": {
      "schema": "TrainingBooking",
      "description": "Training appointments collection with instructor approval"
    }
  }
}
```

---

## Planned Implementation Steps

1. **Create `src/components/TrainingBookingModal.tsx`**:
   - Year/Month/Day military date picker and operational time slot selector.
   - Companion operator Gmail input with tactical email preview.
   - Google Calendar event link generator with automatic companion attendee inclusion.
2. **Embed in `src/components/SakaAcademyModal.tsx`**:
   - Add a `[ Schedule Training / حجز تدريب ]` button under each qualification detail card.
   - Show existing scheduled bookings for the qualification with clearance badge.
3. **Command Queue in `LeaderApprovalModal.tsx`**:
   - Add a "Training Schedule" tab in the Command Desk for instructors to review and approve pending booking sessions.
4. **Firestore Real-time Sync**:
   - Save bookings to Firestore and update status in real time.
5. **Verification**:
   - Verify compilation, linting, and end-to-end booking flow.
