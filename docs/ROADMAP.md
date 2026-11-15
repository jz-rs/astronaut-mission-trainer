# Roadmap — milestones for validation and testing

The game progresses through **milestones**. Each milestone ends with **something testable** and explicit **validation**. Do not move on until the previous milestone is validated (if something fails, fix it or decide to cut scope and record it in `DECISIONS.md`).

The specs describe **what to build**; this roadmap describes **the order and how we verify it works**.

---

## How we test: 5 levels

| Level | What it is | When | Who |
|---|---|---|---|
| **T1 — Automated** | `npm run check`: lint + types + game logic tests. Runs automatically on each PR (CI). | Every PR | The machine |
| **T2 — PR review** | Another team member checks out the branch, tests the **spec's acceptance criteria**, and approves. | Every PR | Another team member |
| **T3 — Real phone** | Play from the published link on **1 Android + 1 iPhone**, in landscape. | End of each milestone | Milestone owner + 1 |
| **T4 — New player** | Someone who **has never seen the game** (ideally a child aged 7–12) plays **without any explanation from us**. Observe and take notes. | H3, H4, H5 | Any of the 3 |
| **T5 — Balance** | Play several sessions to see whether it is too easy or too hard. | H2, H3, H4 | A |

### T4 worksheet (new player)
Copy to `docs/playtests/AAAA-MM-DD-nombre.md`:
```
Age: … · Device: …
How many seconds until the first correct tap?                 …   (target: < 5 s)
Did they understand the bars without asking?                  yes / no
Did they understand they should go to the flashing room?      yes / no
Did they use the bots? Did they understand auto mode?          yes / no
What did they ask? (write down their exact words)              …
Where did they get stuck?                                     …
Did they want another session without being prompted?         yes / no   ← the most important metric
Do they remember any real fact at the end?                    …
```

### T5 criteria (balance)
- Do nothing in Jezero → lose **before sol 3**.
- Play well in Jezero → survive with **2–3 stars**.
- All bots on auto and the player doing nothing → **not enough** to win.
- Gale is noticeably harder than Jezero.

---

## Milestones

### H0 — Alignment 🟣 (phase 0)
**Specs:** 01 (stages 1–2), 02 (backend review), 06.
**What can be tested:** decisions, nothing playable yet.
**Validation:**
- [ ] All 3 approved (✅) every P0 spec.
- [ ] Visual style chosen by vote; no pending items in `STYLE_GUIDE.md`.
- [ ] Minigame contract agreed between A and B.
- [ ] GitHub repo with all 3 as collaborators.

### H1 — Published skeleton 🔴
**Specs:** 02 (skeleton + CI), 17 (deployment, brought forward).
**What can be tested:** a **public link** with Start → Base → Result navigation (empty screens).
**Validation:**
- [ ] T1: CI runs on PRs.
- [ ] T3: the link opens on Android and iPhone, in landscape and without zoom.

> Publishing the link early lets us test everything that follows directly on phones.

### H2 — First playable session 🔴
**Specs:** 03, 04, 05 (auto mode), 06, 07.
**What can be tested:** a complete 5-sol session with **simple shapes** (no final art): walk to rooms, panels is a real minigame, the other 3 rooms use the temporary minigame, bots work on auto, win or lose and see the result.
**Validation:**
- [ ] T1 + T2 for each spec.
- [ ] T3 on both phones.
- [ ] T5: first balance round (record numbers in `DECISIONS.md`).

### H3 — Complete minimum game (all P0) 🔴
**Specs:** 01 (stage 3: art), full 05, 08, 09, 10, 11, 13.
**What can be tested:** the game **with its visual style**: 4 real minigames, bot orders, training between sessions, final start and result screens, ES/EN, real facts.
**Validation:**
- [ ] T3 on both phones.
- [ ] **T4 with at least 2 new players** → fix what blocked them.
- [ ] T5: second balance round.
- [ ] **This milestone is ready to submit.** If time runs out, submit this.

### H4 — What makes us different (P1) 🟠
**Specs:** 12, 14, 15.
**What can be tested:** Mars map with 5 locations and stars, events with Earth warnings (or no warning), rover expedition and real NASA photos.
**Validation:**
- [ ] T4: does the new player **want another session**? Do they try to earn the 3rd star?
- [ ] Two consecutive sessions at the same location feel different.
- [ ] T5: Gale is harder than Jezero.

### H5 — Release candidate 🟡
**Specs:** 16 (if ready), polish, 17.
**What can be tested:** the final version.
**Validation:**
- [ ] **Freeze code ~3 h before submission**: bug fixes only after that.
- [ ] Bug bash: all 3 play for 15 min trying to break it; record and prioritize every bug.
- [ ] T3 on every phone available.
- [ ] Hackathon submission checklist complete (spec 17).

### H6 — Submission 🏁
- [ ] Final public link works.
- [ ] Submission materials uploaded.
- [ ] Demo rehearsed (with a QR code for the link).

---

## Plan B by milestone
| If we cannot finish… | We do this… |
|---|---|
| A minigame in H3 | Keep the temporary minigame in that room |
| All the art in H3 | Submit with the available pieces + shapes in palette colors |
| All of H4 | Prioritize: map (12) > events (14) > rover (15) |
| H5 (spec 16) | Cut it and present it in the pitch as a “next step” |
