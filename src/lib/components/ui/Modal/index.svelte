<script>
  import Icon from '@iconify/svelte';
  import { browser } from '$app/environment';

  let { showModal = $bindable(false), header = undefined, children } = $props();

  /**
   * @type {HTMLDialogElement | undefined}
   */
  let dialog = $state();

  $effect(() => {
    if (dialog && showModal) dialog.showModal();
  });

  $effect(() => {
    if (browser) {
      const body = document.querySelector('body');
      if (body) {
        if (showModal) {
          body.style.overflow = 'hidden';
        } else {
          body.style.overflow = 'auto';
        }
      }
    }
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this="{dialog}"
  onclose="{() => (showModal = false)}"
  onclick="{(e) => {
    if (e.target === e.currentTarget) dialog?.close();
  }}"
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    onclick="{(e) => {
      e.stopPropagation();
    }}"
  >
    {#if header}
      {@render header()}
    {/if}

    {@render children?.()}

    <!-- svelte-ignore a11y_autofocus -->
    <button class="close" autofocus onclick="{() => dialog?.close()}">
      <Icon
        icon="iconamoon:close-duotone"
        width="36"
        height="36"
        style="color: var(--purple)"
      />
    </button>
  </div>
</dialog>

<style>
  dialog {
    background: transparent;
    border: none;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.85);
  }

  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  button {
    border: none;
    background: transparent;
    position: absolute;
    top: 0;
    right: 0;
    z-index: var(--layer-1);

    &:hover,
    &:focus,
    &:focus-visible,
    &:active {
      border: none;
      background: transparent;
      outline: none;
    }
  }
</style>
