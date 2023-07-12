---
title: First post
description: First post.
date: '2023-4-14'
categories:
  - sveltekit
  - svelte
published: true
---



## Markdown

<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import tree from '$assets/media/tree.jpg'
import { importAssets } from 'svelte-preprocess-import-assets';
  console.log(tree)
  import Image from '$lib/components/ui/Image/index.svelte';
</script>


<Container width="sm">

Hey friends! 


<Image src={tree}/>


</Container>