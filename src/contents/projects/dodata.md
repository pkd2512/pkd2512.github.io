---
title: DoData UI Design | Prasanta Kumar Dutta

description: Interface design for DoData mobile app, a nonprofit initiative to enable the donation of internet access towards educational and vocational training for the underprivileged.

keywords: Data Journalist, Graphics Journalist, Reuters Graphics Journalist, Data Visualisation Developer, Data Visualization Developer, Narrative Cartographer, User Interface Designer, User Experience Designer, Communication Designer, Data Storyteller, Information Designer, Graphic Designer, Art Director, User-centered design, UX, UI, Data Artist, Web Designer, Web Developer, Front-end Web Developer, Photographer, Traveller, Creative writer, Electronics and Communication Engineer, National Institute of Design, National Institute of Technology Durgapur, Prasanta, PrasantaKrDutta, Prasanta Kumar Dutta, Prasanta KrDutta, pkddapacific, pkd.dapacific, pkd_da_pacific, daPacific.

image: dodata.webp
type: project
date: '2017-04-09'
published: true

categories:
  - Rupeelog
  - UI Design
  - Visual Identity

links:
  - type: doc
    url: projects/dodata/
    label: 🗒️ Read more

intro:
  hed: DoData

  dek: 'Even though excellent nuggets of knowledge are freely available on the internet, many individuals, especially the underprivileged, do not have access to it. To address the situation, DoData was envisaged — as a not-for-profit organization, whose main objective is to enable the donation of data (internet) for the needy. I worked on the User Interface Design of the mobile app for DoData during my internship at Rupeelog in the summer of 2017.'

  img: projects/dodata/hero.webp

  duration: 4 weeks

  url: '#designing-the-ui-for-the-consumer-app'

  client: Rupeelog Financial Services

  quote: “As our world turns digital, donating data is the most efficient way of donating” — dodata.org
---

<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import OverflowImage from '$lib/components/ui/OverflowingImage/index.svelte';
</script>

<style lang='scss'>

// The site moves a caption beside its figure whenever there is room to the
// right. In rows of several figures, and in the column beside the text, that
// would land it on its neighbour, so keep those captions under the image.
@mixin caption-below {
  figure :global(figcaption),
  figure:global(.side-caption) :global(figcaption) {
    position: static;
    transform: none;
    max-width: none;
    margin-block: var(--space-2xs) 0;
    padding-inline: 0;
  }
}

// The two problem icons, side by side under the text they illustrate.
.icons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--grid-gutter);
  margin-block-start: var(--space-s);

  @media (--sm-n-below) {
    grid-template-columns: 1fr;
  }

  @include caption-below;

  figure {
    margin-block: 0;

    :global(img) {
      width: calc(1.5 * var(--space-3xl));
      max-width: 100%;
    }

    :global(figcaption) {
      text-align: center;
    }
  }
}

// Shared look for photos and screens: the same shadow and edge as the
// OverflowImage cards, so the page reads as one set.
.trio,
.screens,
.phone {
  :global(img) {
    box-shadow: var(--shadow-2);
    border: 1px solid var(--gray-soft);
    border-radius: 0.5rem;
  }
}

// Three logo sketches in a row with one caption beneath. The figure itself is
// the grid, so the caption spans every column.
.trio {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--project-gap);

  @media (--sm-n-below) {
    grid-template-columns: 1fr;
  }

  :global(img) {
    width: 100%;
  }

  &:global(.side-caption) :global(figcaption),
  :global(figcaption) {
    grid-column: 1 / -1;
    position: static;
    transform: none;
    max-width: none;
    margin-block: 0;
    padding-inline: 0;
  }
}

// The four error-state screens side by side, each with its own caption.
.screens {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--grid-gutter);

  @media (--md-n-below) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (--sm-n-below) {
    grid-template-columns: 1fr;
  }

  @include caption-below;

  figure {
    margin-block: 0;
  }

  :global(img) {
    width: 100%;
  }
}

// A single screen that sits in the left column beside the text about it.
.phone {
  @include caption-below;

  figure {
    margin-block: 0;
  }

  :global(img) {
    max-width: var(--xs);
    width: 100%;
  }

  figure :global(figcaption),
  figure:global(.side-caption) :global(figcaption) {
    margin-inline: auto;
    max-width: var(--xs);
  }
}

.palette {
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  margin-block-start: var(--space-s);

  .strip {
    width: calc(50% - var(--space-xs));
    margin-block: var(--space-2xs);
  }

  .strip-full {
    width: 100%;
  }

  .colour {
    height: var(--space-l);
    width: 100%;
    box-shadow: var(--shadow-1);
    border-radius: 0.25rem;
  }

  .name {
    color: var(--black-soft);
    font-style: italic;
    font-size: var(--font-size-0);
    font-family: var(--font-serif);
  }
}

</style>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## The Problem

</div>
<div class="dek col-span-md-7">

With the penetration of technology in our lives, people today have a plethora of services at their fingertips (literally!). For 2017, the number of smartphone users in India is estimated to cross 300 million. This can give access to a huge collection of knowledge available online via smartphones. However, it was found that despite the availability of the devices and the desire to learn, many of the individuals were unable to utilize the resources for learning.

What was needed was a channel that could bridge the following hurdles —

<div class="icons">
<figure>

![Icon of a Wi-Fi signal displayed inside an outline of a mobile phone](/media/projects/dodata/prob1.webp)

<figcaption>
Bandwidth connecting the two is costly and availability is very limited
</figcaption>

</figure>
<figure>

![Icon of a play button displayed inside an outline of a mobile phone](/media/projects/dodata/prob2.webp)

<figcaption>
Bandwidth is available but misused to consume data only for “entertainment”
</figcaption>

</figure>
</div>

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## The Solution

</div>
<div class="dek col-span-md-7">

> Data Donation — The act of donating data to an individual or a family to enable them to access the world of online knowledge using their smartphones.

Here, 'data' refers to the data pack that will provide internet connectivity to the user to bridge the digital divide. This, however, solves only the first half of the challenge.

To ensure the appropriate usage of this data for intended purposes, there needed to be a system that could act as the interface for the curated content and allow monitoring of the data consumption to ensure judicious use of the donated data. It is part of an NGO effort aimed at making informative content consumption via mobile affordable for the masses.
And that interface for the end user is what I got a chance to work on!

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### Understanding the user and app usage

</div>
<div class="dek col-span-md-7">

The app is aimed at helping users consume informative content via mobile data in their native language. It would also capture and report data usage for the DoData app and other indicated apps to ensure effective use of the donated data.

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=480 maxWidth='180%' shadow="{true}" url='media/projects/dodata/user.webp' alt="Handwritten notes about the use cases - children education, vocational training, special kids, organisations for its members, the Japanese government." caption="Based on the concept document I translated the use cases to UI requirements" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

The content to be served is curated by different NGOs for their users. The users can have content from multiple sources — NGOs and third parties. They may be kids trying to learn science or grown-ups trying to pick up a new skill for work.

Before proceeding with the app, I had to work on the branding… It is really fun sketching shapes and choosing colours, not to mention deciding on a typeface!

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### Creating a logo

</div>
<div class="dek col-span-md-7">

I associated keywords with the project and began sketching out ideas that involved WiFi, the internet, people and of course the cursive 'D'.

</div>
</Container>

<Container width="lg">

<figure class="trio">

![Photo of pencil sketches on paper showing logo ideas](/media/projects/dodata/logo1.webp)

![Photo of pencil sketches on paper showing logo ideas](/media/projects/dodata/logo2.webp)

![Photo of pencil sketches on paper showing logo ideas](/media/projects/dodata/logo3.webp)

<figcaption>
Sketching out initial logo ideas for DoData, before moving on to digital drawings in Adobe Illustrator.
</figcaption>

</figure>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

The idea was to integrate the gesture of giving with care with the symbol for the internet and the letter 'D'. I tried to use mostly geometric shapes to ensure pixel-perfection on screens.

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=480 maxWidth='150%' shadow="{false}" url='media/projects/dodata/logo.webp' alt="Digital grayscale renders of nine different variations of logo ideas" caption="" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

The folks at Rupeelog decided to go with the bottom right shape. It is simple and conveys the message.

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=480 maxWidth='150%' shadow="{false}" url='media/projects/dodata/logofinal.webp' alt="The logo and one showing the construction lines" caption="" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### Choosing colours

</div>
<div class="dek col-span-md-7">

I wanted colours that could express growth, prosperity and happiness along with the intellectual aspect of the app. So, I decided to experiment with green, yellow, and blue which could express the above attributes as explained by Timothy Samara in his book.

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=720 maxWidth='180%' shadow="{false}" url='media/projects/dodata/logocolour.webp' alt="The logo with different colour variations" caption="" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

I finally settled with two hues of green — one with yellow and one with blue, using which I developed the colour palette for the app.

<div class=palette>
<div class=strip>
<div class=colour style="background:#45ada8;"></div>
<div class=name>Green Primary <b>#45ADA8</b></div>
</div>

<div class=strip>
<div class=colour style="background:#59C9A5;"></div>
<div class=name>Green Secondary <b>#59C9A5</b></div>
</div>

<div class=strip>
<div class=colour style="background:#2F9599;"></div>
<div class=name>Green Primary Dark <b>#2F9599</b></div>
</div>

<div class=strip>
<div class=colour style="background:#3CB888;"></div>
<div class=name>Green Secondary Dark <b>#3CB888</b></div>
</div>

<div class=strip-full>
<div class=colour style="background: linear-gradient(90deg, rgb(69, 173, 168), rgb(89, 201, 165));"></div>
<div class=name>Green Gradient Primary</div>
</div>

</div>

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### Choosing typefaces

</div>
<div class="dek col-span-md-7">

Now that the logo symbol was finalized, I had to work on finding a suitable typeface that can together make up the logotype.

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=720 maxWidth='180%' shadow="{false}" url='media/projects/dodata/logotype.webp' alt="The logo with different font variations reading DoData" caption="" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

I settled with Bree-Serif for the logotype because of its cheerful and friendly appearance. For the app content, I chose Noto Sans because it can support a multilingual app with its wide coverage of over 30 scripts.

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=720 maxWidth='180%' shadow="{false}" url='media/projects/dodata/type.webp' alt="Typeface sample of Bree Serif" caption="" />

</Container>

<Container width="md">

<OverflowImage breakpoint=480 maxWidth='150%' shadow="{false}" url='media/projects/dodata/splash.webp' alt="A mock-up of a mobile phone showing the DoData logo" caption="" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### Designing the UI for the consumer app

</div>
<div class="dek col-span-md-7">

The backend of the service was already under development when I began the project. So, the basic app flow had already been decided by the project manager which had been conveyed to me via rough sketches. After I had analysed the wireframes, I suggested a few modifications, which were then incorporated into the final UI. I used Sketch to make the screens and created a prototype using Invision App which helped in the smooth hand-off of UI specs and assets.

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=480 maxWidth='180%' shadow="{true}" url='media/projects/dodata/conceptdoc.webp' alt="Handwritten notes about the app concept." caption="I analysed the concept document to derive the functional specifications and content requirements." />

<OverflowImage breakpoint=480 maxWidth='180%' shadow="{true}" url='media/projects/dodata/ia.webp' alt="Handwritten notes about the app information architecture." caption="I analysed the information architecture suggesting modifications to improve the UX." />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

I wanted to keep the UI as close to a standard Android app so that it is intuitive to users familiar with an Android phone. Also, to avoid leaving the users in a state of anguish, it was important to consider edge cases to handle error scenarios efficiently.

</div>
</Container>

<Container width="lg">

<div class="screens">
<figure>

![Screen mockup to create new password](/media/projects/dodata/forgot-password-reset.webp)

<figcaption>
If the user doesn't receive the OTP on the number entered or wishes to change it, he can do so without using the back button.
</figcaption>

</figure>
<figure>

![Screen mockup when incorrect password is entered](/media/projects/dodata/password-error.webp)

<figcaption>
When an incorrect password is entered, the user is asked to either check the password and retry or reset the password.
</figcaption>

</figure>
<figure>

![Screen mockup for invalid mobile number](/media/projects/dodata/invalid-mobile-error.webp)

<figcaption>
When the user enters an invalid mobile number, he is asked to check and enter the number again.
</figcaption>

</figure>
<figure>

![Screen mockup when an unrecognised mobile number is entered](/media/projects/dodata/unregistered-mobile-error.webp)

<figcaption>
When the user enters a valid (10-digit) mobile number that has not been registered as a DoData user, he can either register it or retry with a different number.
</figcaption>

</figure>
</div>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="phone col-span-md-5">
<figure>

![Screen mockup for switching user](/media/projects/dodata/switch-user.webp)

<figcaption>
Dialog box to change the active user
</figcaption>

</figure>
</div>
<div class="dek col-span-md-7">

The dashboard contains the content categorized by the sources, specific to the current user. If a single account is used by an entire family, the account admin can add family members, and they can access their content by simply switching the user from the menu.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="phone col-span-md-5">
<figure>

![Screen mockup of user dashboard](/media/projects/dodata/dashboard.webp)

<figcaption>
User dashboard with content group cards
</figcaption>

</figure>
</div>
<div class="dek col-span-md-7">

The card-grid layout is preferred here as it gives an overview of content categories, without the user having to scroll much. This has an advantage over accordion lists when the number of items is large.

The banner acts as placeholder for advertisements and promotional content from the Government or other sources. It can help instil preferred values (like Nationalism, Cleanliness) in the consumer.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="phone col-span-md-5">
<figure>

![Screen mockup of data usage stats](/media/projects/dodata/data-usage.webp)

<figcaption>
Data usage statistics for the user
</figcaption>

</figure>
</div>
<div class="dek col-span-md-7">

The app can help form effective habits by incentives (in terms of data and other things) and by alerts and reminders, accessible from the notifications section.

Keeping track of data usage is just a swipe away. It can help users use their bandwidth efficiently — balancing between education and entertainment.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### Designing the icons

</div>
<div class="dek col-span-md-7">

Even though many of them are standard icons, I recreated them in Adobe Illustrator using the Material Design Grid to fit the solid visual family.

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=480 maxWidth='150%' shadow="{false}" url='media/projects/dodata/icons.webp' alt="Icons designed for the app" caption="" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

…and then the developers developed.
An early version of the <LinkButton label='App'  url='https://apkpure.com/nl/do-data-dodata-platform-for-donation-of-data/com.dodata.org' /> is available on android devices.

</div>
</Container>
