# Design System: App Deployer Web

## Foundation

The web UI uses Material Design through MUI.

## Visual Tone

- Quiet admin dashboard.
- Dense enough for repeated use.
- No marketing sections.
- No decorative hero layout.
- No repeated pages showing the same data.

## Layout

- Top app bar for primary navigation.
- Main content uses a constrained `lg` container.
- Page title appears once per page.
- Cards are used only for stats, lists, and forms.
- Border radius is 8px or less unless MUI default requires otherwise.

## Navigation

Primary pages:

- Dashboard: system summary only.
- Apps: app list and app creation entry.
- Releases: release upload and recent release list.
- Settings: environment and storage configuration.

Do not create another page that repeats these same summaries.

## Typography

- Short headings.
- Body text should be one or two sentences.
- Changelog previews should be clipped or collapsed when long.
- Button labels should be direct: `New App`, `Upload APK`, `Save`.

## Color

- Primary: blue for main actions.
- Secondary: teal for status and storage context.
- Background: neutral light gray.
- Avoid a single-color dominated interface.

## Components

- Buttons use icons when the command is concrete.
- Upload actions use `CloudUpload`.
- App records use Android or app icons.
- Tables are acceptable for release history.
- Forms should group only related fields.

## Content Rules

- No long explanatory paragraphs in the UI.
- No duplicated descriptions across Dashboard, Apps, and Releases.
- Empty states should explain the next action in one sentence.
