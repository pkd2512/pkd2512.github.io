<script>
  /**
   * @type {{ groupers: Array<{key: string, label: string, multi: boolean}>, active: string, onchange: (key: string) => void }}
   */
  let { groupers, active, onchange } = $props();
</script>

<div class="picker">
  {#each groupers as g}
    <button
      class="pill"
      class:active={active === g.key}
      onclick={() => onchange(g.key)}
    >
      {g.label}
    </button>
  {/each}
</div>

<style lang="scss">
  .picker {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3xs);
    margin-bottom: var(--space-s);

    .pill {
      all: unset;
      cursor: pointer;
      padding: var(--space-3xs) var(--space-s);
      border-radius: 999px;
      font-size: var(--font-size-0);
      font-weight: var(--font-weight-medium);
      color: var(--gray);
      background: var(--white-soft);
      border: 1px solid var(--gray-soft);
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--purple-soft);
        color: var(--purple-soft);
      }

      &.active {
        background: var(--purple-soft);
        color: var(--white);
        border-color: var(--purple-soft);
      }
    }
  }
</style>
