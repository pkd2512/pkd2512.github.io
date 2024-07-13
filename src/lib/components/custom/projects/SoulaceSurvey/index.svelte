<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import { assets } from '$app/paths';
  import Modal from '$lib/components/ui/Modal/index.svelte';

  let showModal = false;
</script>

<Container width="md" style="text-align:center;">
  <button on:click="{() => (showModal = true)}"> Check out the survey </button>

  <div class="survey">
    <Modal bind:showModal="{showModal}">
      <Container width="md" id="survey">
        <p>
          The questionnaire has two parts — Experience of dealing with death and
          Views on Death-care service. If the answer to the first question is
          'NO', then the respondent skips to Section 3 of the survey.
        </p>
        <img src="{assets}/media/projects/soulace/survey.webp" alt="" />
      </Container>
    </Modal>
  </div>
</Container>

<style lang="scss">
  @import 'src/lib/styles/mixins/';
  button {
    margin: var(--space-s) auto;
  }

  img {
    max-width: 100%;
  }

  .survey {
    :global(#survey) {
      @include fullheight(0.9);
      padding: 0;
      background: var(--white);
    }

    p {
      font-style: italic;
      line-height: var(--line-height-tight);
      text-align: left;
      padding: var(--space-l);
      padding-block-end: var(--space-xs);
    }
  }
</style>
