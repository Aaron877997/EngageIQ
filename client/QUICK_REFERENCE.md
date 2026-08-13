# EngageIQ Developer Quick Reference

## Quick Component Imports

```jsx
// Hooks
import { useForm, useAsync, useToggle, useLocalStorage, useDebounce } from '../hooks/useCustomHooks';

// API Service
import { apiService, handleApiError } from '../services/apiService';

// Constants
import { COLORS, SPACING, BORDER_RADIUS, TRANSITIONS } from '../constants/designTokens';
```

## Common Patterns

### Form Handling
```jsx
const { values, errors, handleChange, handleSubmit } = useForm(
  { field: '' },
  async (values) => { /* submit */ }
);
```

### API Calls
```jsx
const { data, loading, error } = useAsync(() => 
  apiService.companies.findCompany({ companyName: 'test' })
);
```

### Button States
```jsx
<button className="btn btn-primary" disabled={loading}>
  {loading ? 'Loading...' : 'Click me'}
</button>
```

## CSS Classes Quick Reference

### Buttons
```
.btn                    /* base button */
.btn-primary           /* gradient blue-purple */
.btn-secondary         /* glass button */
.btn-danger            /* red button */
.btn-success           /* green button */
.btn-lg .btn-sm        /* size variants */
.btn-block             /* full width */
```

### Forms
```
.form-container        /* card wrapper */
.form-group            /* input wrapper */
.form-label            /* label style */
.form-label.required   /* required indicator */
.form-hint             /* helper text */
.form-error            /* error message */
.form-row              /* multi-column layout */
```

### Cards
```
.card                  /* base card */
.card-header           /* header section */
.card-content          /* content area */
.card-footer           /* action buttons */
.card-title            /* card heading */
```

### Alerts
```
.alert                 /* base alert */
.alert-success         /* green alert */
.alert-error           /* red alert */
.alert-warning         /* orange alert */
```

### Layout
```
.page-wrapper          /* full page container */
.container             /* max-width container */
.container-sm          /* smaller container */
.grid-2 .grid-3        /* responsive grids */
.flex-center           /* centered flexbox */
.flex-between          /* space-between flex */
```

### Spacing
```
.mb-1 .mb-2 .mb-3      /* margin-bottom */
.mt-1 .mt-2 .mt-3      /* margin-top */
.p-2 .p-3 .p-4         /* padding */
.mb-0                  /* reset margin */
```

### Text
```
.text-center           /* center text */
.text-muted            /* secondary color */
.text-success          /* green text */
.text-danger           /* red text */
.text-sm               /* small text */
.text-lg               /* large text */
.font-bold             /* 700 weight */
.font-semi             /* 600 weight */
```

## Common API Calls

```jsx
// Company
apiService.companies.findCompany({ companyId: '123', companyName: 'Test' })
apiService.companies.getCompanyPosts('Company Name')
apiService.companies.getCompanyAnalytics('Company Name')

// Analytics
apiService.analytics.getAnalytics('linkedin')
apiService.analytics.getPlatformAnalytics('linkedin')
apiService.analytics.getSentimentAnalytics('linkedin')

// AI
apiService.ai.queryAI('query', 'platform')
apiService.ai.getRecommendations('platform')
apiService.ai.predictEngagement({ followers: 100, ... })

// Reports
apiService.reports.generateReport(data)
apiService.reports.getEngagementTimeline('platform')
```

## Error Handling

```jsx
const [error, setError] = useState("");

try {
  const data = await apiService.companies.findCompany(params);
} catch (err) {
  setError(handleApiError(err));  // Automatic error message
}

// Display error
{error && (
  <div className="alert alert-error mb-3">
    <span>⚠️</span>
    <div>{error}</div>
  </div>
)}
```

## Loading States

```jsx
const [loading, setLoading] = useState(false);

// Spinner
<span className="loading-spinner"></span>

// In button
<button disabled={loading}>
  {loading ? 'Loading...' : 'Search'}
</button>

// Disable form
<input disabled={loading} />
```

## Color Variables

```css
var(--accent-primary)     /* #3b82f6 */
var(--accent-secondary)   /* #8b5cf6 */
var(--text-primary)       /* #f8fafc */
var(--text-secondary)     /* #94a3b8 */
var(--border-color)       /* rgba(255,255,255,0.1) */
var(--bg-glass)           /* rgba(30,41,59,0.7) */
```

## Animations

```
.fade-in               /* opacity animation */
.slide-in-left         /* left slide */
.slide-in-right        /* right slide */
.pulse                 /* pulsing effect */
```

## File Structure

```
client/src/
├── components/         /* Reusable components */
├── pages/              /* Page components */
├── styles/             /* Global CSS files */
├── constants/          /* Design tokens, configs */
├── hooks/              /* Custom React hooks */
├── services/           /* API service layer */
├── App.jsx             /* Main component */
└── main.jsx            /* Entry point */
```

## Keyboard Shortcuts

- `Escape` - Close modals/overlays
- `Tab` - Navigate form fields
- `Enter` - Submit forms

## Mobile Responsive

All components are mobile-first and responsive to:
- **Mobile:** 320px - 640px
- **Tablet:** 641px - 1024px  
- **Desktop:** 1025px+

## Dark Mode

The entire system uses a dark theme with blue/purple accents. No light mode implementation needed.

## Performance Tips

✅ Use `useCallback` for event handlers
✅ Use `useAsync` for API calls
✅ Use `useDebounce` for search inputs
✅ Memoize expensive computations
✅ Lazy load components

❌ Don't use inline styles
❌ Don't create functions in renders
❌ Don't forget dependency arrays
❌ Don't ignore loading states

## Testing Checklist

- [ ] Form validation works
- [ ] Error messages display correctly
- [ ] Loading states visible
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] Colors have sufficient contrast
- [ ] No console errors/warnings

## Useful Commands

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Check for errors
npm run lint

# Install dependencies
npm install
```
