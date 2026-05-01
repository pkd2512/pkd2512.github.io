# Svelte 5 Migration Plan for pkd2512.github.io

## Executive Summary

**Current State:**

- Svelte: 4.0.5 (installed) → Target: 5.55.5
- SvelteKit: 1.30.4 (installed) → Target: 2.59.0
- 50+ components using Svelte 4 patterns
- Multiple third-party Svelte libraries requiring updates

**Recommendation:** Phased migration with backward compatibility mode enabled

---

## Phase 1: Dependency Updates (Foundation)

### Critical Updates Required

#### Core Framework

```bash
# SvelteKit ecosystem
@sveltejs/kit: 1.30.4 → 2.59.0
@sveltejs/vite-plugin-svelte: 2.5.3 → 5.1.1
@sveltejs/adapter-static: 2.0.2 → 3.0.10
@sveltejs/adapter-auto: 2.1.0 → 3.3.1 (if needed)

# Svelte itself
svelte: 4.0.5 → 5.55.5
svelte-check: 3.4.5 → 4.4.7
svelte-preprocess: 5.0.4 → 6.0.3
```

#### Third-Party Svelte Libraries - CRITICAL

**High Risk (Major version changes):**

1. `@iconify/svelte`: 3.1.4 → 5.2.1 ⚠️
   - Used in: Navbar, RecentProjects, Contact, ReferralCard, Modal, Video
   - Breaking changes expected

2. `svelte-gestures`: 1.5.2 → 5.2.2 ⚠️
   - Used in: Unknown (need to search)
   - Major version jump - check changelog

3. `svelte-intersection-observer`: 0.10.0 → 1.1.1 ⚠️
   - Dependency: svelte-intersection-observer
   - Major version change

4. `svelte-copy`: 1.4.1 → 2.0.0 ⚠️
   - Used in: Contact, BioCard
   - Breaking changes expected

5. `svelte-fast-marquee`: 0.4.1 → 1.0.2 ⚠️
   - Check for breaking changes

**Medium Risk:**

1. `svelte-inview`: 4.0.1 → 4.0.4 ✓
   - Used in: Navbar, NavMobile
   - Patch update, should be safe

2. `@sveltejs/svelte-scroller`: 2.0.7 (no update shown) ⚠️
   - Used in: RecentProjects, AndrettaMap
   - **CRITICAL**: Need to verify Svelte 5 compatibility

3. `@splidejs/svelte-splide`: 0.2.9 (no update shown) ⚠️
   - Need to check Svelte 5 support

4. `mdsvex`: 0.11.0 → 0.12.7 ✓
   - Important for markdown content
   - Should support Svelte 5

#### Build Tools

```bash
vite: 4.4.2 → 5.4.21 (stay on v5, not v6)
typescript: 5.1.6 → 5.9.3
prettier-plugin-svelte: 2.10.1 → 3.5.1
eslint-plugin-svelte: 2.32.2 → 3.17.1
```

---

## Phase 2: Code Migration Patterns

### Pattern 1: Reactive Declarations (`$:`) → Runes

**Found:** 28 instances across components

#### Migration Examples

**Before (Svelte 4):**

```svelte
<script>
  export let data;
  $: pageId = $page.route.id;
  $: filteredData = data.filter(d => d.type === 'project');
</script>
```

**After (Svelte 5):**

```svelte
<script>
  let { data } = $props();
  const pageId = $derived($page.route.id);
  const filteredData = $derived(data.filter(d => d.type === 'project'));
</script>
```

#### Components Requiring Migration (Priority Order)

**High Priority (Simple Reactivity):**

1. `src/lib/components/ui/ImageSlideshow/index.svelte` - Simple `$: index = 0`
2. `src/lib/components/ui/OverflowingImage/index.svelte` - `$: showNudge = true`
3. `src/lib/components/custom/about/BioCard/index.svelte` - Icon/copy state
4. `src/lib/components/custom/home/Contact/index.svelte` - Icon/copy state

**Medium Priority (Store Dependencies):**

1. `src/lib/components/ui/Navbar/index.svelte` - `$: pageId`, `$: pageHash`
2. `src/lib/components/ui/Navbar/NavMobile.svelte` - Multiple reactive states
3. `src/lib/components/ui/MetaTags/index.svelte` - URL derivations
4. `src/lib/components/custom/home/RecentProjects/index.svelte` - Data filtering

**Low Priority (Complex Logic):**

1. `src/lib/components/custom/projects/AndrettaMap/Map.svelte` - Conditional chapters logic
2. `src/lib/components/ui/Modal/index.svelte` - Dialog state management
3. `src/lib/components/ui/Video/index.svelte` - Progress calculations

### Pattern 2: Props (`export let`) → `$props()`

**Found:** 50+ instances

#### Migration Examples

**Before (Svelte 4):**

```svelte
<script>
  export let title = 'Default Title';
  export let description;
  export let image = 'share.webp';
</script>
```

**After (Svelte 5 - Option 1: Destructuring):**

```svelte
<script>
  let { 
    title = 'Default Title', 
    description, 
    image = 'share.webp' 
  } = $props();
</script>
```

**After (Svelte 5 - Option 2: Accessing props object):**

```svelte
<script>
  const props = $props();
  // Access as props.title, props.description, etc.
</script>
```

#### Components by Complexity

**Simple Props (1-3 props):**

- Logo, Container, Image, Navlink

**Medium Props (4-7 props):**

- MetaTags, ReferralCard, LinkButton, OverflowingImage

**Complex Props (8+ or with nested structures):**

- ProjectIntro, ProjectHero, ProjectCard

### Pattern 3: Event Handlers & Bindings

**Found:** 137 instances of `on:` and `bind:`

#### Bindings Still Work (No Change Needed)

```svelte
<input bind:value={name} />
<svelte:window bind:scrollY={scrollY} />
```

#### Event Handlers (Minimal Changes)

```svelte
<!-- Svelte 4 & 5 both work -->
<button on:click={handleClick}>Click</button>
```

**Note:** Most event handling patterns remain compatible!

### Pattern 4: Stores (Mostly Compatible)

**Svelte stores work in Svelte 5** with minimal changes:

```svelte
<script>
  import { page } from '$app/stores';
  // $page still works in templates
  const pageId = $derived($page.route.id); // New syntax for derived
</script>
```

---

## Phase 3: Third-Party Library Compatibility Checks

### Must Verify Before Migration

1. **@sveltejs/svelte-scroller**
   - Used in: RecentProjects (critical homepage feature), AndrettaMap
   - Action: Check GitHub/npm for Svelte 5 support
   - Fallback: May need custom implementation

2. **@splidejs/svelte-splide**
   - Used in: Awards, Testimonials carousel
   - Action: Check for Svelte 5 version
   - Fallback: Replace with Svelte 5 compatible carousel

3. **svelte-inview** vs **svelte-intersection-observer**
   - Both used for scroll animations
   - Verify which is primary and update

4. **@iconify/svelte v5**
   - Breaking changes from v3 to v5
   - Action: Review migration guide

---

## Phase 4: Migration Execution Plan

### Step 1: Setup & Preparation (Day 1)

```bash
# 1. Create a new branch
git checkout -b feature/svelte5-migration

# 2. Backup current state
git tag backup-before-svelte5

# 3. Install sharp (missing dependency)
npm install sharp

# 4. Update lock file
rm yarn.lock
yarn install
```

### Step 2: Update Dependencies (Day 1-2)

**Strategy:** Update in stages, test between each stage

#### Stage 1: SvelteKit Core (Test After)

```bash
npm install @sveltejs/kit@2.59.0 \
  @sveltejs/adapter-static@3.0.10 \
  @sveltejs/vite-plugin-svelte@5.1.1
```

**Test:** `npm run dev` - ensure site loads

#### Stage 2: Svelte 5 with Compatibility Mode (Test After)

```bash
npm install svelte@5.55.5 svelte-check@4.4.7
```

**Enable compatibility in `svelte.config.js`:**

```javascript
export default {
  compilerOptions: {
    compatibility: {
      componentApi: 4  // Enable Svelte 4 compatibility
    }
  },
  // ... rest of config
}
```

**Test:** `npm run dev` - site should still work with old syntax

#### Stage 3: Update Build Tools

```bash
npm install vite@5.4.21 \
  prettier-plugin-svelte@3.5.1 \
  eslint-plugin-svelte@3.17.1 \
  svelte-preprocess@6.0.3 \
  typescript@5.9.3
```

#### Stage 4: Update mdsvex & Markdown Tools

```bash
npm install mdsvex@0.12.7
```

#### Stage 5: Update Third-Party Svelte Libraries (CAREFUL)

**Before updating each, check compatibility:**

```bash
# Check each package's GitHub/npm for Svelte 5 support
# Example for iconify:
npm info @iconify/svelte@5.2.1

# Update one at a time:
npm install @iconify/svelte@5.2.1
# Test immediately

npm install svelte-inview@4.0.4
# Test

# Continue with others...
```

### Step 3: Code Migration (Day 3-5)

**Order of Migration:**

1. **Utility Components** (Day 3 - Morning)
   - Container
   - Logo  
   - Image
   - Simple components without complex reactivity

2. **UI Components** (Day 3 - Afternoon)
   - LinkButton
   - Navlink
   - ReferralCard
   - Components with props but minimal reactivity

3. **Feature Components** (Day 4)
   - MetaTags
   - Navbar
   - Footer
   - Contact
   - Components with stores and reactive statements

4. **Complex Interactive Components** (Day 5)
   - RecentProjects
   - AndrettaMap
   - ImageSlideshow
   - Modal
   - Video
   - Components with complex state and scroller

### Step 4: Testing Strategy (Throughout)

**After Each Component Migration:**

```bash
# 1. Run dev server
npm run dev

# 2. Visual inspection
# Navigate to pages using the component

# 3. Run type checking
npm run check

# 4. Run tests (if any)
npm run test:unit
```

**After Each Phase:**

```bash
# 1. Build production
npm run build

# 2. Preview production build
npm run preview

# 3. Test all routes
# - Homepage
# - Projects pages
# - About
# - Community
# - Blog
```

### Step 5: Final Cleanup (Day 6)

1. Remove compatibility mode once all components migrated
2. Update documentation
3. Run full test suite
4. Performance audit
5. Accessibility check

---

## Breaking Changes to Watch For

### Svelte 5 Breaking Changes

1. **No more `export let` for props**
   - Must use `$props()`

2. **Reactive statements (`$:`) deprecated**
   - Use `$derived` for derived values
   - Use `$effect` for side effects

3. **Component events changed**
   - `createEventDispatcher` deprecated
   - Use callback props instead

4. **Context API changes**
   - `getContext`/`setContext` still work
   - New `$state` for component state

5. **Script context="module" changes**
   - Still works but use cases reduced
   - Used in: `src/lib/components/ui/Analytics/index.svelte`

### SvelteKit 2 Changes (Already Mostly Applied)

Your project is already structured for SK2:

- ✓ Using `+page.svelte` pattern
- ✓ Using `+layout.js` for data loading
- ✓ Using `export const prerender = true`

---

## Rollback Plan

If migration fails:

```bash
# 1. Rollback to tag
git reset --hard backup-before-svelte5

# 2. Restore dependencies
yarn install

# 3. Verify site works
npm run dev
```

---

## Risk Assessment

### High Risk Items ⚠️

1. **@sveltejs/svelte-scroller** - No visible Svelte 5 version
   - Impact: Homepage and project pages
   - Mitigation: Build custom scroller or find alternative

2. **@iconify/svelte v3→v5** - Major version jump
   - Impact: All icon usage (15+ components)
   - Mitigation: Update all icon components simultaneously

3. **svelte-gestures v1→v5** - Major version jump
   - Impact: Unknown until we find usage
   - Mitigation: Search codebase first

### Medium Risk Items ⚙️

1. **Multiple reactive statements** (28 instances)
   - Impact: Logic bugs if not converted correctly
   - Mitigation: Test each component thoroughly

2. **mdsvex** - Markdown processing
   - Impact: All content pages
   - Mitigation: Test with sample markdown files

### Low Risk Items ✓

1. **Props migration** - Straightforward
2. **Event handlers** - Mostly compatible
3. **Stores** - Continue to work
4. **SvelteKit patterns** - Already modern

---

## Success Criteria

✅ All pages render correctly
✅ All interactive features work (scroll, click, hover)
✅ Build succeeds without errors
✅ Type checking passes
✅ No console errors in browser
✅ Performance metrics maintained or improved
✅ All markdown content renders properly

---

## Estimated Timeline

- **Phase 1 (Dependencies):** 1-2 days
- **Phase 2 (Simple Components):** 1 day  
- **Phase 3 (Complex Components):** 2 days
- **Phase 4 (Testing & Fixes):** 1 day
- **Phase 5 (Documentation):** 0.5 days

**Total: 5.5-6.5 days**

---

## Next Steps

1. **Verify third-party library support** (Start here)
   - Check @sveltejs/svelte-scroller Svelte 5 support
   - Check @splidejs/svelte-splide compatibility
   - Review @iconify/svelte v5 migration guide

2. **Create component inventory**
   - Full list of all components
   - Categorize by complexity
   - Map dependencies

3. **Begin Phase 1** (if ready)
   - Update core dependencies
   - Enable compatibility mode
   - Test basic functionality

**Ready to proceed with verification?**
