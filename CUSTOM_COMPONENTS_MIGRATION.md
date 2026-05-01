# Custom Components Migration Status

## Home Components (src/lib/components/custom/home/)

### 1. ✅ Awards/index.svelte

- **Status**: No migration needed (already compatible)

### 2. ⏳ BlogFeed/index.svelte

- **Changes needed**:
  - `onMount` → `$effect()`

### 3. ⏳ Contact/index.svelte

- **Changes needed**:
  - `$: icon/copymessage/copied` → `$state()`
  - `on:click` → `onclick`

### 4. ⏳ RecentProjects/index.svelte

- **Changes needed**:
  - `$: data` → `$derived()`

### 5. ✅ Colophone/index.svelte

- **Status**: Check if compatible

### 6. ✅ HomeIntro/index.svelte

- **Status**: Check if compatible

### 7. ✅ Shop/index.svelte

- **Status**: Check if compatible

### 8. ✅ Testimonials/index.svelte

- **Status**: Check if compatible

## Projects Components (src/lib/components/custom/projects/)

### 1. 🔴 AndrettaMap/Map.svelte (HIGH PRIORITY - Complex)

- **Changes needed**:
  - `export let activeChapter` → `$props()`
  - `$: chapters` (conditional) → `$derived()`
  - `$: if (activeChapter && map)` → `$effect()`
  - `onMount` → `$effect()`
  - `afterUpdate` → `$effect()`
  - `onDestroy` → `$effect()` with cleanup

### 2. ⏳ AndrettaMap/index.svelte

- **Changes needed**:
  - `$: activeChapter` → `$derived()`

### 3. ⏳ ProjectAward/index.svelte

- **Changes needed**:
  - `export let img/notes/url` → `$props()`

### 4. ⏳ ProjectCard/index.svelte

- **Changes needed**: (see subagent report)

### 5. ⏳ ProjectHero/index.svelte

- **Changes needed**: (see subagent report)

### 6. ⏳ ProjectIntro/index.svelte

- **Changes needed**: (see subagent report)

### 7. ⏳ ProjectList/index.svelte

- **Changes needed**: (see subagent report)

### 8. ⏳ ProjectNav/index.svelte

- **Changes needed**: (see subagent report)

### 9. ⏳ SoulaceScreens/index.svelte

- **Changes needed**: (see subagent report)

### 10. ⏳ SoulaceSurvey/index.svelte

- **Changes needed**: (see subagent report)

## About/Community Components

### 1. ⏳ BioCard/index.svelte

- **Changes needed**:
  - `export let hed/dek` → `$props()`
  - `$: icon/copied` → `$state()`
  - `on:click` → `onclick`
  - `setInterval` → wrap in `$effect()` with cleanup

### 2. ⏳ List/index.svelte

- **Changes needed**: (see subagent report)

## Legend

- ✅ No migration needed / Already compatible
- ⏳ Needs migration
- 🔴 Complex component - requires careful migration
