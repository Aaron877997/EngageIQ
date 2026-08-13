# EngageIQ UI/UX Style Guide

## Overview

This style guide provides comprehensive documentation for the EngageIQ design system, ensuring consistency and professionalism across all components and pages.

---

## Design System Principles

### 1. **Visual Hierarchy**
- Use consistent font sizes and weights to establish clear hierarchy
- Headings: Outfit (700 weight)
- Body text: Inter (400 weight)
- Always maintain sufficient contrast for accessibility

### 2. **Glassmorphism**
- Use the glass effect (`backdrop-filter: blur(12px)`) for layered depth
- Combine with semi-transparent backgrounds for elegance
- Border color: `var(--border-color)` for subtle separation

### 3. **Color Palette**

**Primary Colors:**
- Main Blue: `#3b82f6`
- Secondary Purple: `#8b5cf6`
- Success Green: `#10b981`
- Warning Orange: `#f59e0b`
- Danger Red: `#ef4444`

**Background:**
- Primary: `#0f172a`
- Secondary: `#1e293b`
- Glass: `rgba(30, 41, 59, 0.7)`

**Text:**
- Primary: `#f8fafc`
- Secondary: `#94a3b8`
- Muted: `#64748b`

### 4. **Spacing System**
```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
xxl: 3rem (48px)
```

### 5. **Border Radius**
```
sm: 8px (for small elements)
md: 12px (standard buttons)
lg: 16px (cards and containers)
xl: 20px (large sections)
full: 9999px (pills and badges)
```

---

## Component Library

### Buttons

**Primary Button**
```jsx
<button className="btn btn-primary">Action</button>
```
- Uses gradient from blue to purple
- Hover: Lifted effect with glow
- Disabled: Reduced opacity

**Secondary Button**
```jsx
<button className="btn btn-secondary">Action</button>
```
- Glass effect with border
- Hover: Increased opacity, border highlight
- Best for alternative actions

**Button Variants**
```jsx
<button className="btn btn-primary btn-lg">Large Button</button>
<button className="btn btn-primary btn-sm">Small Button</button>
<button className="btn btn-primary btn-block">Full Width</button>
<button className="btn btn-danger">Danger Action</button>
<button className="btn btn-success">Success Action</button>
```

### Forms

**Form Container**
```jsx
<div className="form-container">
  <form>
    <div className="form-group">
      <label className="form-label">Label</label>
      <input type="text" placeholder="..." />
      <span className="form-hint">Optional hint text</span>
    </div>
  </form>
</div>
```

**Form Layout**
```jsx
<div className="form-row">
  <div className="form-group">...</div>
  <div className="form-group">...</div>
</div>
```

### Cards

**Basic Card**
```jsx
<div className="card">
  <div className="card-header">
    <h3 className="card-title">Title</h3>
  </div>
  <div className="card-content">
    {/* Content here */}
  </div>
  <div className="card-footer">
    <button className="btn btn-secondary">Cancel</button>
    <button className="btn btn-primary">Save</button>
  </div>
</div>
```

### Alerts

**Success Alert**
```jsx
<div className="alert alert-success mb-3">
  <span>✓</span>
  <div>Success message here</div>
</div>
```

**Error Alert**
```jsx
<div className="alert alert-error mb-3">
  <span>⚠️</span>
  <div>Error message here</div>
</div>
```

### Badges

**Badge Variants**
```jsx
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-danger">Danger</span>
```

### Grid Layouts

**2-Column Grid**
```jsx
<div className="grid-2">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

**3-Column Grid**
```jsx
<div className="grid-3">...</div>
```

**4-Column Grid**
```jsx
<div className="grid-4">...</div>
```

---

## Utility Classes

### Spacing
```
mb-0, mb-1, mb-2, mb-3, mb-4   /* margin-bottom */
mt-0, mt-1, mt-2, mt-3, mt-4   /* margin-top */
p-2, p-3, p-4                   /* padding */
```

### Text
```
.text-center       /* text-align: center */
.text-right        /* text-align: right */
.text-muted        /* color: var(--text-secondary) */
.text-success      /* color: #10b981 */
.text-danger       /* color: #ef4444 */
.text-warning      /* color: #f59e0b */

.text-sm           /* font-size: 0.875rem */
.text-lg           /* font-size: 1.125rem */
.text-xl           /* font-size: 1.25rem */

.font-bold         /* font-weight: 700 */
.font-semi         /* font-weight: 600 */
.font-normal       /* font-weight: 400 */
```

### Flexbox
```
.flex-center       /* centered flex */
.flex-between      /* space-between flex */
.flex-gap-1, .flex-gap-2, .flex-gap-3   /* gap utilities */
```

---

## Advanced Utilities

### Loading Spinner
```jsx
<span className="loading-spinner"></span>
<span className="loading-spinner sm"></span>
<span className="loading-spinner lg"></span>
```

### Empty State
```jsx
<div className="empty-state">
  <div className="empty-state-icon">📭</div>
  <h3 className="empty-state-title">No Data</h3>
  <p className="empty-state-text">Description here</p>
  <button className="btn btn-primary">Action</button>
</div>
```

### Animations
```jsx
<div className="fade-in">Content</div>
<div className="slide-in-left">Content</div>
<div className="slide-in-right">Content</div>
<div className="pulse">Pulsing content</div>
```

---

## Code Examples

### Professional Login Component
```jsx
import { useState } from 'react';

function Login({ onNavigate, onBack }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <button onClick={onBack} className="btn btn-secondary">
        ← Back
      </button>
      <div className="login-card">
        <h1>Welcome</h1>
        {error && <div className="alert alert-error mb-3">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
        </form>
      </div>
    </div>
  );
}
```

### Professional Form Component
```jsx
import { useForm } from '../hooks/useCustomHooks';

function ProfileForm() {
  const { values, errors, touched, handleChange, handleSubmit } = useForm(
    { name: '', email: '' },
    async (values) => {
      // Submit logic
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label required">Name</label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
        />
        {touched.name && errors.name && (
          <span className="form-error">{errors.name}</span>
        )}
      </div>
      <button type="submit" className="btn btn-primary btn-block">
        Submit
      </button>
    </form>
  );
}
```

---

## Responsive Design

### Breakpoints
```
xs: 320px
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
xxl: 1536px
```

### Mobile-First Approach
```css
/* Default: mobile */
.grid-2 {
  grid-template-columns: 1fr;
}

/* Tablet and up */
@media (min-width: 768px) {
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## Best Practices

### ✅ DO
- Use the design tokens for consistency
- Leverage utility classes to reduce custom CSS
- Implement proper error handling with alerts
- Use semantic HTML elements
- Test components on multiple screen sizes
- Add proper loading states
- Use proper spacing and hierarchy

### ❌ DON'T
- Inline CSS styles (use classes instead)
- Hardcode colors (use CSS variables)
- Use `alert()` for notifications (use alert components)
- Ignore form validation
- Create components without error states
- Mix different button styles in the same page
- Use excessive animations

---

## Accessibility

All components include:
- Proper focus states (outline on focus)
- ARIA labels where needed
- Keyboard navigation support
- Sufficient color contrast
- Semantic HTML structure
- Loading indicators for async operations

---

## Resources

- **Design Tokens:** `src/constants/designTokens.js`
- **Custom Hooks:** `src/hooks/useCustomHooks.js`
- **API Service:** `src/services/apiService.js`
- **Global Styles:** `src/index.css`
- **Utilities:** `src/styles/utilities.css`

---

## Support

For questions or contributions to the design system, please refer to the project documentation or contact the development team.
