# 17 — Deployment and demo

| Owner | Role | Priority | Phase | Status |
|---|---|---|---|---|
| _(name)_ | C | P0 | 4 (configure in phase 1) | ⚪ Proposed |

## Objective
Let judges and anyone else **play from a public link on a phone**, and complete the hackathon submission on time.

## Why it matters
A game that cannot be opened does not exist for the judges.

## Scope
**Includes:**
- Automatic publishing on every push to `main` (GitHub Pages or Vercel). **Configure early (phase 1)**, not at the end.
- Verify the link works on Android and iPhone.
- QR code for the presentation link.
- Review submission requirements on the official challenge page (video, description, NASA data usage, etc.) and make the checklist.
- Prepare demo materials (screenshots, short session video).

## Acceptance criteria
- [x] Public link works and updates automatically.
- [ ] Hackathon submission checklist complete (recorded in this spec).
- [ ] Tested on ≥ 2 different phones.

## Files
**Owned:** `.github/workflows/*` (or Vercel config), submission materials.
**Contracts:** `vite.config.ts` → notify others if changed.

## Dependencies
**Depends on:** 02 (GitHub repo).

## Submission checklist
Based on the [official project submission guide](https://www.spaceappschallenge.org/resources/project-submission-guide/) (2025 version, latest published as of 2026-11-14). **Confirm against the 2026 guide when available**: numbers may change.

**Demo (required; choose ONE option):**
- [ ] Video **no longer than 30 seconds**, with **English subtitles**, starting with a team introduction, **or**
- [ ] Slide presentation **in English** (the 2020 guide specified a maximum of 7; confirm the current limit).
- [ ] Upload the demo to another platform (YouTube, Drive, etc.) with a **public link**: the Space Apps website does not accept files.
- [ ] Clear images and readable text.

**Project:**
- [ ] Working public game link (this spec) and repository link.
- [ ] Project description and **NASA data** usage (see `docs/DATA_SOURCES.md`).
- [ ] List of resources and references used (already listed on the game's Sources screen).
- [ ] Check whether the 2026 guide requires disclosure of AI tool use.

**Before submitting:**
- [ ] Test the link on ≥ 2 phones (Android and iPhone), in landscape.
- [ ] QR code for the presentation link.
- [ ] Screenshots and a short session video for the demo.

## Deployment status (2026-11-15)
- **Live with GitHub Pages**: `.github/workflows/deploy-pages.yml` runs `npm run check`, builds, and publishes on every push to `main`. The Pages source is set to "GitHub Actions".
- Public link: https://jz-rs.github.io/astronaut-mission-trainer/
- The repo moved to the `jz-rs` account: https://github.com/jz-rs/astronaut-mission-trainer (the old `memocayar` links redirect there).
- **Vercel was ruled out**: its free plan blocks deployments of commits by contributors who are not Vercel project members (happened with `main` merges).
- The repo is now public, so Pages works on the free account.
- `vite.config.ts` already uses `base: './'`, so the build works under the Pages subpath.
- GitHub Actions runs on the new account: the billing lock was on the old owner's account. First successful deploy: 2026-11-15.

## Approval
- [ ] A — _(name)_
- [ ] B — _(name)_
- [ ] C — _(name)_
