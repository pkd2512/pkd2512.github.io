# Svelte 5 Runes Migration Guide

## Overview

This guide outlines the systematic migration from Svelte 4 syntax to Svelte 5 runes for all components in the project.

**Current Status:**

- Framework: Svelte 5.55.5 with compatibility mode enabled
- Components: 50+ components using Svelte 4 syntax
- Goal: Migrate to modern Svelte 5 runes (`$props()`, `$derived()`, `$effect()`)

---

## Migration Strategy

### Phase 1: Simple Utility Components (Low Risk)

Start with components that have minimal props and no reactive statements.

### Phase 2: UI Components (Medium Risk)

Components with props and simple reactive statements.

### Phase 3: Complex Interactive Components (High Risk)

Components with stores, complex reactivity, and third-party integrations.

---

## Component Migration Checklist

### Phase 1: Simple Utility Components (Start Here)

#### Basic Components

- [ ] `src/lib/components/ui/Container/index.svelte` - Basic wrapper
- [ ] `src/lib/components/ui/Logo/index.svelte` - Logo component
- [ ] `src/lib/components/ui/Image/index.svelte` - Image wrapper

#### Link Components

- [ ] `src/lib/components/ui/Navlink/index.svelte` - Navigation link
- [ ] `src/lib/components/ui/LinkButton/index.svelte` - Button link

### Phase 2: UI Components with Reactivity

#### Cards & Display

- [ ] `src/lib/components/ui/ReferralCard/index.svelte` - Referral card
- [ ] `src/lib/components/custom/projects/ProjectCard/index.svelte` - Project card
- [ ] `src/lib/components/custom/projects/ProjectHero/index.svelte` - Project hero
- [ ] `src/lib/components/custom/projects/ProjectIntro/index.svelte` - Project intro

#### Simple Interactive

- [ ] `src/lib/components/ui/ImageSlideshow/index.svelte` - Has `$: index = 0`
- [ ] `src/lib/components/ui/OverflowingImage/index.svelte` - Has `$: showNudge = true`
- [ ] `src/lib/components/custom/about/BioCard/index.svelte` - Icon/copy state
- [ ] `src/lib/components/custom/home/Contact/index.svelte` - Icon/copy state

### Phase 3: Components with Stores

#### Navigation

- [ ] `src/lib/components/ui/Navbar/index.svelte` - Uses $page store
- [ ] `src/lib/components/ui/Navbar/NavMobile.svelte` - Multiple reactive states
- [ ] `src/lib/components/ui/Footer/index.svelte` - Footer component

#### Metadata

- [ ] `src/lib/components/ui/MetaTags/index.svelte` - URL derivations from $page

#### Content Display

- [ ] `src/lib/components/custom/home/RecentProjects/index.svelte` - Data filtering from $page

### Phase 4: Complex Interactive Components

#### Scroll & Animation

- [ ] `src/lib/components/custom/projects/AndrettaMap/Map.svelte` - Complex conditional logic
- [ ] `src/lib/components/custom/projects/AndrettaMap/index.svelte` - Scroller integration

#### Media

- [ ] `src/lib/components/ui/Modal/index.svelte` - Dialog state management
- [ ] `src/lib/components/ui/Video/index.svelte` - Progress calculations

---

## Migration Patterns

### Pattern 1: Props Migration

**Before (Svelte 4):**

```svelte
<script>
  export let title = 'Default Title';
  export let description;
  export let optional = false;
</script>
```

**After (Svelte 5):**

```svelte
<script>
  let { 
    title = 'Default Title', 
    description, 
    optional = false 
  } = $props();
</script>
```

### Pattern 2: Simple Reactive Statements

**Before (Svelte 4):**

```svelte
<script>
  export let index = 0;
  $: currentSlide = slides[index];
</script>
```

**After (Svelte 5):**

```svelte
<script>
  let { index = 0 } = $props();
  const currentSlide = $derived(slides[index]);
</script>
```

### Pattern 3: Store-Derived Values

**Before (Svelte 4):**

```svelte
<script>
  import { page } from '$app/stores';
  $: pageId = $page.route.id;
  $: pageHash = $page.url.hash;
</script>
```

**After (Svelte 5):**

```svelte
<script>
  import { page } from '$app/stores';
  const pageId = $derived($page.route.id);
  const pageHash = $derived($page.url.hash);
</script>
```

### Pattern 4: Reactive Side Effects

**Before (Svelte 4):**

```svelte
<script>
  export let showModal;
  let dialog;
  
  $: if (dialog && showModal) {
    dialog.showModal();
  }
</script>
```

**After (Svelte 5):**

```svelte
<script>
  let { showModal } = $props();
  let dialog = $state();
  
  $effect(() => {
    if (dialog && showModal) {
      dialog.showModal();
    }
  });
</script>
```

### Pattern 5: Conditional State Updates

**Before (Svelte 4):**

```svelte
<script>
  let windowWidth;
  let chapters;
  
  $: if (windowWidth < 768) {
    chapters = mobileChapters;
  } else {
    chapters = desktopChapters;
  }
</script>
```

**After (Svelte 5):**

```svelte
<script>
  let windowWidth = $state();
  const chapters = $derived(
    windowWidth < 768 ? mobileChapters : desktopChapters
  );
</script>
```

### Pattern 6: Multiple Reactive Dependencies

**Before (Svelte 4):**

```svelte
<script>
  export let data;
  $: projects = data
    .filter(d => d.type === 'project')
    .slice(0, 3)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
</script>
```

**After (Svelte 5):**

```svelte
<script>
  let { data } = $props();
  const projects = $derived(
    data
      .filter(d => d.type === 'project')
      .slice(0, 3)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  );
</script>
```

---

## Testing Checklist

After migrating each component:

1. **Development Server Check**

   ```bash
   npm run dev
   ```

   - Visit pages using the component
   - Verify visual appearance
   - Test interactive features

2. **Type Check**

   ```bash
   npm run check
   ```

3. **Build Test**

   ```bash
   npm run build
   ```

4. **Browser Console Check**
   - No errors
   - No warnings about deprecated features

---

## Migration Workflow

### For Each Component

1. **Read the component** to understand current structure
2. **Identify patterns** (props, reactive statements, side effects)
3. **Convert to runes** following patterns above
4. **Test immediately** - don't migrate multiple components before testing
5. **Commit** - make small, focused commits for easy rollback

### Example Commit Message

```
refactor: migrate [ComponentName] to Svelte 5 runes

- Convert export let to $props()
- Convert $: reactive to $derived()
- Test: ✅ Dev server working
- Test: ✅ Build successful
```

---

## Common Pitfalls

1. **Don't mix old and new syntax in same component**
   - Either use `export let` OR `$props()`, not both

2. **Use $state() for component-local state**
   - Not just for props!

3. **Use $effect() sparingly**
   - Most reactive statements can be $derived()
   - Only use $effect() for true side effects (DOM manipulation, API calls)

4. **Remember: stores still use $ prefix in templates**

   ```svelte
   <p>Current page: {$page.route.id}</p>
   ```

---

## Order of Execution

Execute in this exact order to minimize risk:

1. **Day 1 Morning**: Phase 1 - Simple utility components (3-5 components)
2. **Day 1 Afternoon**: Phase 2 - UI components (5-8 components)
3. **Day 2 Morning**: Phase 3 - Store-dependent components (5-7 components)
4. **Day 2 Afternoon**: Phase 4 - Complex interactive (3-5 components)
5. **Day 3**: Testing, fixes, remove compatibility mode

---

## Success Criteria

Before removing compatibility mode:

- [ ] All components migrated to Svelte 5 syntax
- [ ] No `export let` statements remaining
- [ ] No `$:` reactive statements remaining
- [ ] Dev server runs without warnings
- [ ] Production build succeeds
- [ ] All pages render correctly
- [ ] All interactive features work

---

## Removing Compatibility Mode

Once all components are migrated:

**Edit `svelte.config.js`:**

```javascript
// Remove this section:
compilerOptions: {
  compatibility: {
    componentApi: 4  // DELETE THIS
  }
}
```

Then test:

```bash
npm run dev
npm run build
```

If successful, commit:

```
feat: remove Svelte 4 compatibility mode

All components now use Svelte 5 runes syntax.
```

---

## Ready to Start?

Let's begin with Phase 1: Simple Utility Components!

Start with: `src/lib/components/ui/Container/index.svelte`
