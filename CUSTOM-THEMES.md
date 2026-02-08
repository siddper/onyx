# Custom Themes

You can add your own themes to the Markdown Editor by importing a **theme config JSON file**. Custom themes are stored in your browser’s sync storage and appear in the **Theme** dropdown in Settings alongside the built-in themes.

## How to add a custom theme

1. Open **Settings** (click **Settings** in the side panel).
2. In the **Themes** section, click **Import theme**.
3. Choose a `config.json` (or any `.json`) file that follows the [config format](#config-format) below.
4. The theme is validated and, if valid, saved and added to the Theme dropdown. You can select it immediately.

Imported themes persist across sessions and sync across devices (if you use Chrome sync).

## Config format

The JSON file must be an object with at least:

| Field          | Type   | Required | Description |
|----------------|--------|----------|-------------|
| `name`         | string | Yes      | Display name of the theme (e.g. `"Midnight Blue"`). |
| `colorScheme`  | string | Yes      | Either `"light"` or `"dark"`. Affects browser UI (e.g. scrollbars). |
| `colors`       | object | Yes      | CSS variable values. Keys must match the list below. |

### `colors` object

All keys are required. Use the same names as in the example.

| Key             | Example value                    | Description |
|-----------------|----------------------------------|-------------|
| `--bg`          | `"#0d1117"`                      | Page background. |
| `--panel`       | `"#161b22"`                     | Panels, toolbar, cards. |
| `--panel-strong`| `"#21262d"`                     | Inputs, stronger surfaces. |
| `--ink`         | `"#e6edf3"`                     | Primary text. |
| `--muted`       | `"#8b949e"`                     | Secondary text, labels. |
| `--accent`      | `"#30363d"`                     | Buttons, triggers, default accent. |
| `--accent-hover`| `"#484f58"`                     | Hover state for accent elements. |
| `--overlay`     | `"rgba(0,0,0,0.5)"`             | Modal/backdrop overlay. |
| `--shadow`      | `"0 4px 20px rgba(0,0,0,0.4)"` | Standard shadow. |
| `--shadow-modal`| `"0 8px 32px rgba(0,0,0,0.5)"` | Modal/dropdown shadow. |

- Colors can be any valid CSS value: hex (`#fff`), `rgb()`, `rgba()`, etc.
- Shadows are full `box-shadow` values.

### Example config

See **`example-theme-config.json`** in the project root for a full example you can copy and edit.

### Theme ID

The theme’s internal ID is derived from the **name** (lowercased, spaces and invalid characters replaced). If you import another theme with the same effective name, it will overwrite the previous one.

## Removing a custom theme

If you no longer want a custom theme, use **Settings** and remove it via the **Custom themes** list: each imported theme has a **Remove** control. Removing it only deletes the theme from the app; it does not delete your config file.

## Tips

- Start from `example-theme-config.json` and change the `name` and `colors` to match your theme.
- Keep contrast in mind so text (`--ink`, `--muted`) is readable on `--bg` and `--panel`.
- Use `--accent` and `--accent-hover` for buttons and interactive areas so they’re visible but not harsh.
