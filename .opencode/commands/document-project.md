# Document Project

Create or update project documentation from a documentation request file.

## Usage

```text
/document-project <file-from-context-documents>
```

Example:

```text
/document-project item-types.md
```

The parameter must reference a Markdown file inside:

```text
@context/documents
```

## Required Parameter

If no parameter is provided, stop immediately and tell the user:

```text
Please provide the documentation request file from @context/documents.
Example: /document-project item-types.md
```

Do not inspect the codebase or create any documentation when the parameter is missing.

## Input File Format

The input file will follow this structure:

```markdown
# <Documentation Topic>

## Output

<!-- file name inside docs folder at the root project. ex: /item-types.md -->

## Research

<!-- description of which files, designs or items will be documented -->

## Include

<!-- what to include in the documentation -->

## Sources

<!-- sources of information to review for getting better documentation -->
```

## Task

1. Read the requested file from `@context/documents/<parameter>`.
2. Parse these sections:
   - `Output`
   - `Research`
   - `Include`
   - `Sources`
3. If `Output` is missing or empty, stop and ask the user to add the `Output` section.
4. Review all files and references listed in `Sources`.
5. Perform the research described in `Research`.
6. Create or update the documentation file inside the root `docs/` folder using the filename from `Output`.
7. Include only the information requested in `Include`.
8. Keep the documentation clear, practical, and project-specific.
9. Do not invent details. If something cannot be verified from the codebase or sources, write it as an explicit TODO or note.
10. Preserve existing useful documentation if the output file already exists, but update outdated or incorrect content.
11. Execute the research using appropriate tools:
   - Read files (Prisma schema, constants, components)
   - Query database via Supabase MCP if needed
   - Search codebase for patterns

### Rules

- This command produces DOCUMENTATION only
- Do NOT modify source code files
- Do NOT create branches or commits
- Use subagents for thorough exploration if needed

## Output Rules

- The generated documentation must be Markdown.
- The output file must be created under:

```text
docs/
```

- Use concise headings and tables when they improve readability.
- Include relative links to relevant project files when useful.
- Do not include implementation speculation unless clearly marked as a TODO.
- Do not modify application code unless the documentation request explicitly asks for it.

## Completion Message

After finishing, report:

- The input request file used.
- The documentation file created or updated.
- Any assumptions, missing sources, or TODOs.
