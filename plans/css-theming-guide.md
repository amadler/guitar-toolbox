# CSS Custom Properties Theming Guide

All visual styling in `guitar-toolbox-lib` components is controlled via CSS Custom Properties (`--toolbox-*`). This allows host applications to fully control the look and feel without modifying library source code.

---

## Quick Start

Apply a theme by setting CSS variables on the `lib-toolbox-form` element (or any ancestor):

```scss
/* host app styles.scss or component styles */
lib-toolbox-form {
  --toolbox-bg: #ffffff;
  --toolbox-text: #1a1a1a;
  --toolbox-accent: #2563eb;
  --toolbox-accent-text: #ffffff;
  --toolbox-border-color: #e2e8f0;
  --toolbox-radius: 8px;
  --toolbox-radius-sm: 4px;
  --toolbox-gap: 18px;
  --toolbox-accent-bg: rgba(37, 99, 235, 0.08);
  --toolbox-muted: #94a3b8;
}
```

---

## Property Reference

### `--toolbox-bg`

| | |
|---|---|
| **Default** | `transparent` |
| **Affects** | Background of `.toolbox__select`, `.toolbox__input`, `.toolbox__mode-btn` |
| **Example** | `--toolbox-bg: #f8fafc` |

### `--toolbox-text`

| | |
|---|---|
| **Default** | `inherit` |
| **Affects** | Text color of labels, titles, select options, input values, mode buttons |
| **Example** | `--toolbox-text: #334155` |

### `--toolbox-accent`

| | |
|---|---|
| **Default** | `currentColor` |
| **Affects** | Active tab indicator (underline + border), submit button background, input focus border, hover accent on mode buttons |
| **Example** | `--toolbox-accent: #2563eb` |

### `--toolbox-accent-text`

| | |
|---|---|
| **Default** | `inherit` |
| **Affects** | Text color of the submit button |
| **Example** | `--toolbox-accent-text: #ffffff` |

### `--toolbox-accent-bg`

| | |
|---|---|
| **Default** | `transparent` |
| **Affects** | Background of the active mode tab button |
| **Example** | `--toolbox-accent-bg: rgba(37, 99, 235, 0.08)` |

### `--toolbox-border-color`

| | |
|---|---|
| **Default** | `transparent` |
| **Affects** | Border of `.toolbox__select`, `.toolbox__input`, `.toolbox__mode-btn` |
| **Example** | `--toolbox-border-color: #cbd5e1` |

### `--toolbox-radius`

| | |
|---|---|
| **Default** | `0` |
| **Affects** | Outer border radius of `.toolbox__mode-btn` and `.toolbox__submit` |
| **Example** | `--toolbox-radius: 8px` |

### `--toolbox-radius-sm`

| | |
|---|---|
| **Default** | `0` |
| **Affects** | Inner border radius of `.toolbox__select` and `.toolbox__input` |
| **Example** | `--toolbox-radius-sm: 4px` |

### `--toolbox-gap`

| | |
|---|---|
| **Default** | `18px` |
| **Affects** | Grid `gap` between form fields in `.toolbox__form` and `.toolbox__custom-form` |
| **Example** | `--toolbox-gap: 24px` |

### `--toolbox-muted`

| | |
|---|---|
| **Default** | `inherit` |
| **Affects** | Color of helper/hint text in Custom Pattern (`.toolbox__hint`) |
| **Example** | `--toolbox-muted: #94a3b8` |

---

## Theme Examples

### Light theme

```scss
lib-toolbox-form {
  --toolbox-bg: #ffffff;
  --toolbox-text: #1e293b;
  --toolbox-accent: #3b82f6;
  --toolbox-accent-text: #ffffff;
  --toolbox-accent-bg: rgba(59, 130, 246, 0.08);
  --toolbox-border-color: #e2e8f0;
  --toolbox-radius: 6px;
  --toolbox-radius-sm: 4px;
  --toolbox-gap: 16px;
  --toolbox-muted: #94a3b8;
}
```

### Dark theme

```scss
lib-toolbox-form {
  --toolbox-bg: #1e293b;
  --toolbox-text: #f1f5f9;
  --toolbox-accent: #60a5fa;
  --toolbox-accent-text: #0f172a;
  --toolbox-accent-bg: rgba(96, 165, 250, 0.12);
  --toolbox-border-color: #334155;
  --toolbox-radius: 6px;
  --toolbox-radius-sm: 4px;
  --toolbox-gap: 16px;
  --toolbox-muted: #64748b;
}
```

### Minimal / borderless

```scss
lib-toolbox-form {
  --toolbox-bg: transparent;
  --toolbox-text: inherit;
  --toolbox-accent: currentColor;
  --toolbox-accent-text: inherit;
  --toolbox-accent-bg: transparent;
  --toolbox-border-color: transparent;
  --toolbox-radius: 0;
  --toolbox-radius-sm: 0;
  --toolbox-gap: 18px;
  --toolbox-muted: inherit;
}
```

---

## Note: Non-customizable properties

The following are intentionally **not** exposed as CSS variables to maintain consistent component geometry:

- `height` of inputs, selects, and buttons (40px)
- `min-width` of mode buttons (150px) and submit button (88px)
- `padding` of inputs and buttons
- `font-size` of labels and controls (14px)
- `grid-template-columns` layout
- `margin-bottom` of sections

Host apps can always override these using standard CSS if needed, but changing them may break component layout.
