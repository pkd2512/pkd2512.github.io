<script>
  /**
   * @type {{ groupers: Array<{key: string, label: string, multi: boolean}>, active: string, onchange: (key: string) => void }}
   */
  let { groupers, active, onchange } = $props();
</script>

<!-- Folder tabs for the chart below: the active tab shares the windows'
     ground colour and runs down into the sheet, so it reads as that
     sheet's tab. -->
<div class="tabs" role="tablist">
  {#each groupers as g}
    <button
      class="tab"
      role="tab"
      aria-selected={active === g.key}
      class:active={active === g.key}
      onclick={() => onchange(g.key)}
    >
      {g.label}
    </button>
  {/each}
</div>

<style lang="scss">
  .tabs {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 6px;
  }

  .tab {
    all: unset;
    cursor: pointer;
    padding: 0.55em 1.6em;
    border-radius: 8px 8px 0 0;
    font-family: var(--font-sans);
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-medium);
    color: rgba(255, 255, 255, 0.75);
    background: rgba(255, 255, 255, 0.14);
    transition:
      background 0.2s ease,
      color 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.24);
      color: var(--white, #fff);
    }

    &:focus-visible {
      outline: 2px solid var(--white, #fff);
      outline-offset: 2px;
    }

    &.active {
      color: var(--purple-soft);
      background: var(--white-soft);
      cursor: default;
    }
  }
</style>
