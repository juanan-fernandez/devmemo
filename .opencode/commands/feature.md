# `/feature` Command

A workflow command for implementing features end-to-end: from specification to merged and pushed code.

---

## Usage

```
/feature <action> [argument]
```

### Available Actions

| Action                | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| `instructions <file>` | Load a spec file and populate the current feature template    |
| `doit`                | Create a branch and implement the feature                     |
| `review`              | Verify the implementation against goals; lint and build       |
| `explain`             | Explain what was done, file by file, in Spanish               |
| `test`                | Write and run unit tests for new server actions and utilities |
| `done`                | Commit, merge, push, and clean up                             |

---

## Action Details

### `instructions <file>`

**Purpose:** Load a feature specification file and populate `@context/current-feature.md`.

**Argument:** Path to a spec file inside `@context/feature/`. Example:

```
/feature instructions @context/feature/user-spec.md
```

**If no argument is provided:** Stop immediately and ask the user to include a spec file path.

**Steps:**

1. Read the spec file passed as the argument.
2. Use its content to fill in the following template at `@context/current-feature.md`:

```markdown
# <source-filename-without-extension>

# Current Feature

<!-- Feature Name -->

## Status

Not Started

## Goals

<!-- Goals & requirements derived from the spec file -->

## Notes

<!-- Any extra notes and other file references found in the spec -->

## History

<!-- refers to the file @context/history.md -->
```

> **Note on the H1 heading:** The very first `# heading` must be the name of the source spec file, **without its extension** (e.g., `user-spec` for `user-spec.md`). This value is used later by the `doit` action as the Git branch name.

3. Display the full contents of `@context/current-feature.md`.
4. **Stop and wait** for the next instruction.

---

### `doit`

**Purpose:** Create a Git branch and implement the feature.

**Steps:**

1. Review `@context/current-feature.md` to fully understand the feature goals and requirements.
2. **Ask the user about any open questions or important decisions** before starting implementation. Wait for answers before proceeding.
3. Read the branch name from the first `# H1` in `@context/current-feature.md`. Sanitize it to be a valid Git branch name (replace spaces with `-`, remove special characters not allowed in branch names, etc.).
4. Create and switch to a new Git branch with that name.
5. Update the `## Status` field in `@context/current-feature.md` to `In Progress`.
6. Implement the feature following the goals in `@context/current-feature.md`.
7. As you work, **list each completed step** so progress is visible.
8. ⚠️ Once you've finished warn me to run `review` and `test` before `done` to ensure the feature is complete and stable. It's not an strict rule but a recommended practice.

---

### `review`

**Purpose:** Verify the implementation is correct and the codebase is healthy.

**Steps:**

1. Read `@context/current-feature.md` to recall what was supposed to be implemented.
2. Check each goal and requirement and verify it has been addressed.
3. Run the project linter (e.g., `npm run lint`) and fix any errors or warnings.
4. Run the project build (e.g., `npm run build`) and confirm it succeeds with no errors.
5. Deliver a **final verdict**:
   - ✅ **Completed** — all goals are met, lint and build pass.
   - ⚠️ **Needs adjustments** — list what is missing or broken.

---

### `explain`

**Purpose:** Explain what was implemented, file by file. Respond **in Spanish**.

**Steps:**

1. Read `@context/current-feature.md` to understand the scope of the feature.
2. Run `git diff main --name-only` to get the list of changed or created files.
3. For each file in the output:
   - Show the **full path**.
   - Write a **short summary (1–2 sentences)** explaining what the change does and why it was implemented that way.

---

### `test`

**Purpose:** Write and run unit tests for the new logic introduced by this feature.

**Steps:**

1. Read `@context/current-feature.md` to understand what was built.
2. Identify all **server actions** and **utility functions** added as part of this feature.
3. Check whether tests already exist for each of them.
4. For functions that contain testable logic and are **not yet covered**, write unit tests using **Vitest**:
   - Focus on **server actions** and **utility functions** (not UI components).
   - Cover the **happy path** (expected inputs → expected outputs).
   - Cover **edge cases** (empty inputs, invalid data, boundary values, error conditions).
5. Run `npm run test` and confirm all tests pass.
6. Report the **test coverage** for the new feature code.

---

### `done`

**Purpose:** Finalize the feature — commit everything, merge to `main`, push, and clean up.

<!-- AI-IGNORE-START
> ⚠️ Run `review` and `test` before `done` to ensure the feature is complete and stable.
   Reason to ignore: test scripts are not created yet.
AI-IGNORE-END -->

**Steps:**

1. **Update history:** Open `@context/history.md`, read its formatting instructions, and add a brief summary of the changes made in this feature. Follow the format defined in that file.
2. **Commit the feature:** Stage all changes and create a single descriptive commit on the feature branch.
3. **Merge to main:**
   - Switch to `main`.
   - Merge the feature branch into `main`. Do **not** push yet.
4. **Restore the feature template:** Reset `@context/current-feature.md` to its original blank state (all comment placeholders restored, status back to `Not Started`).
5. **Commit the restore:** Create a commit with the message `restore current-feature`.
6. **Delete the feature branch** (it has been merged and is no longer needed).
7. **Push:** Push `main` to the remote. This is the **only push** in the entire workflow.

---

## Typical Workflow

```
/feature instructions @context/feature/my-spec.md
# → Review the populated template, confirm or adjust

/feature doit
# → Answer any questions, then implementation runs

/feature review
# → Fix issues if flagged

/feature test
# → Fix failing tests if any

/feature explain
# → Optional: understand what changed

/feature done
# → Merge, push, and clean up
```

---

## File References

| File                          | Purpose                                                                   |
| ----------------------------- | ------------------------------------------------------------------------- |
| `@context/feature/<name>.md`  | Input spec files written by the developer                                 |
| `@context/current-feature.md` | Active feature template; the single source of truth during implementation |
| `@context/history.md`         | Changelog; updated by `done`; contains its own formatting instructions    |
