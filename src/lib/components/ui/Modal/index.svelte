<script>
  import Icon from '@iconify/svelte';
  import { browser } from '$app/environment';

  /**
   * @type {boolean}
   */
  export let showModal; // boolean

  /**
   * @type {HTMLDialogElement}
   */
  let dialog; // HTMLDialogElement

  $: if (dialog && showModal) dialog.showModal();

  $: if (browser) {
    const body = document.querySelector('body');
    if (body) {
      if (showModal) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = 'auto';
      }
    }
  }
</script>

<svelte:body style="overflow: hidden;" />

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this="{dialog}"
  on:close="{() => (showModal = false)}"
  on:click|self="{() => dialog.close()}"
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation>
    <slot name="header" />

    <slot />

    <!-- svelte-ignore a11y-autofocus -->
    <button class="close" autofocus on:click="{() => dialog.close()}">
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
