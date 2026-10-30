---
title: Investigating Sahara Thunder | Prasanta Kumar Dutta

description: How we turned a leak of more than 10,000 emails into a visual narrative that traces how sanctioned Iranian oil moves across the high seas.

keywords: Sahara Thunder, Reuters, Iran oil, shadow fleet, sanctions, ship-to-ship transfers, AIS spoofing, investigative journalism, data visualisation, scrollytelling, Prasanta Kumar Dutta, pkddapacific, daPacific.

categories:
  - Reuters
  - Data Visualisation
  - Art Direction

image: sahara-thunder.webp
type: project
date: '2025-01-30'
published: true

links:
  - type: doc
    url: https://www.reuters.com/graphics/IRAN-OIL/zjpqngedmvx/
    label: 🗒️ Read the story

awards:
  - type: The Sigma Awards
    logo: awards/sigma.webp
    url: https://www.sigmaawards.org/
    label: ⭐ Sahara Thunder

  - type: The Loeb Awards
    logo: awards/loeb.webp
    url: https://www.thelj.org/
    label: 🏆 Sahara Thunder

intro:
  hed: Investigating Sahara Thunder

  dek: "Western oil sanctions on Iran, Russia and Venezuela have spawned a shadow fleet: hundreds of tankers that hide a trade worth hundreds of billions of dollars.

  <br>
  I designed and built the Reuters special report that follows one tanker, the Remy, through the leaked emails of an Iranian firm and shows how sanctioned oil moves from ship to ship."

  img: projects/sahara-thunder/hero.webp

  duration: Almost 2 years

  client: Reuters

  url: '#the-brief'

  quote: “You have to be like the worst tabloid newspaper in the front and the Academy of Science in the back.” — Hans Rosling
---

<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import OverflowImage from '$lib/components/ui/OverflowingImage/index.svelte';
  import PhotoPile from '$lib/components/ui/PhotoPile/index.svelte';
  import Video from '$lib/components/ui/Video/index.svelte';
  import media from '$utils/media';
</script>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## The Brief

</div>
<div class="dek col-span-md-7">

In February 2024, hackers leaked more than 10,000 emails and attachments from an Iranian firm called Sahara Thunder. Reuters reporter Paul Carsten spent almost two years tracing how the firm moved sanctioned oil covertly from vessel to vessel on the high seas, using AI analysis, satellite images, customs and shipping databases, and insider sources.

My job was to turn gigabytes of emails, spreadsheets and GPS coordinates into something a reader could follow from the first scroll to the last, and something officials could use.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

The brief was a hard one for a graphic. The story had dozens of ships, hundreds of transfers and a handful of evasion tactics, all hidden by design. Our answer was to pick one character to follow, the tanker Remy, and to give each tactic its own scene: spoofing its location, forging bills of lading and repainting its name mid-voyage.

Before any design, we sketched the sequence as sticky notes and listed every visual we might need.

</div>
</Container>

<Container width="md">

<PhotoPile
  orientation="landscape"
  items={[
    {
      src: "/media/projects/sahara-thunder/visual-ideas-1.webp",
      alt: "Blue sticky notes listing visual ideas: scale of operation, journey of a ferry, scale of AIS spoofing, connections to Sahara Thunder, photos of ships and STS transfer journeys.",
      caption: "First pass at the visuals the story would need",
    },
    {
      src: "/media/projects/sahara-thunder/visual-ideas-2.webp",
      alt: "Yellow sticky notes with ideas for maps of routes, a network of ships and companies, spoofing techniques and a collage of ship photos.",
      caption: "More ideas: route maps, the network, spoofing patterns",
    },
    {
      src: "/media/projects/sahara-thunder/opener-ideas.webp",
      alt: "A dark map of the Gulf with a highlighted location and a short note.",
      caption: "Exploring ways to open the story",
    },
  ]}
/>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Getting to Know the Data

</div>
<div class="dek col-span-md-7">

Before anyone read the emails line by line, we ran them through Google Pinpoint to pull out ship names, cargo sizes and the coordinates of trades. That gave us a map of the leak.

Names change but IMO numbers mostly don't, so we anchored every ship on its IMO number. We then sorted the emails into sets: one for each cargo, each ship-to-ship transfer, key companies, contracts and keywords such as China, Russia and Venezuela.

</div>
</Container>

<Container width="md">

<PhotoPile
  orientation="portrait"
  items={[
    {
      src: "/media/projects/sahara-thunder/pinpoint.webp",
      alt: "Google Pinpoint listing emails and documents that match the search term MT.",
      caption: "Searching the leak in Google Pinpoint",
    },
    {
      src: "/media/projects/sahara-thunder/email-1.webp",
      alt: "Pinpoint search results with highlighted ship names in email text.",
      caption: "Ship names, cargo sizes and dates highlighted across the documents",
    },
    {
      src: "/media/projects/sahara-thunder/email.webp",
      alt: "A leaked email about a loading arrangement for the vessel MT Lingyang.",
      caption: "A leaked email about a loading arrangement",
    },
  ]}
/>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## From Documents to One Table

</div>
<div class="dek col-span-md-7">

Emails with daily position reports let us pinpoint the GPS coordinates of ship-to-ship transfers, even when ships had switched off or spoofed their AIS.

We recorded the from-ship, to-ship, date, location and volume of every transfer in a single table. That one table drove the reporting, the timeline and the network graphic.

</div>
</Container>

<Container width="lg">

<figure class="embed">
  <iframe src={media('/media/projects/sahara-thunder/embeds/sts-data.html')} title="From 11,476 documents to one table" style="aspect-ratio: 4 / 3" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe>
  <figcaption>From 11,476 documents to one table of ship-to-ship transfers</figcaption>
</figure>

</Container>

<Container width="md">

<PhotoPile
  orientation="landscape"
  items={[
    {
      src: "/media/projects/sahara-thunder/data-gps-sample.webp",
      alt: "A spreadsheet of daily vessel position reports with latitude, longitude and remarks.",
      caption: "Daily position reports in the emails gave us coordinates",
    },
    {
      src: "/media/projects/sahara-thunder/data-allsts.webp",
      alt: "A long spreadsheet listing every ship-to-ship transfer.",
      caption: "The master table of ship-to-ship transfers",
    },
    {
      src: "/media/projects/sahara-thunder/data-stssize.webp",
      alt: "A table of ship-to-ship transfers with cargo sizes.",
      caption: "Transfers by cargo size",
    },
    {
      src: "/media/projects/sahara-thunder/data-shipsizes.webp",
      alt: "A table of ships with their sizes and names.",
      caption: "Ships and their sizes",
    },
    {
      src: "/media/projects/sahara-thunder/data-oil.webp",
      alt: "A table of journeys with oil origin, destination and barrels.",
      caption: "Oil cargoes with origin, destination and volume",
    },
  ]}
/>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Reconstructing the Journeys

</div>
<div class="dek col-span-md-7">

Ships turn off their AIS or spoof it, so we could not rely on a single source. We merged GPS positions from the emails with ship-tracking data from LSEG and Kpler to reconstruct each voyage.

</div>
</Container>

<Container width="lg">

<figure class="embed">
  <iframe src={media('/media/projects/sahara-thunder/embeds/ais-merge.html')} title="Reconstructing the journeys from GPS, LSEG and Kpler positions" style="aspect-ratio: 4 / 3" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe>
  <figcaption>Reconstructing the journeys from GPS, LSEG and Kpler positions</figcaption>
</figure>

</Container>

<Container width="md">

<PhotoPile
  orientation="landscape"
  items={[
    {
      src: "/media/projects/sahara-thunder/remy.webp",
      alt: "The path of the Remy drawn on a globe in Google Earth.",
      caption: "Plotting the Remy's positions in Google Earth",
    },
    {
      src: "/media/projects/sahara-thunder/remy-kpler.webp",
      alt: "The Remy's route from ship tracking data drawn on a light map.",
      caption: "The same journey from ship-tracking data",
    },
  ]}
/>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

With a journey for every ship, we laid them all out in Miro. Each journey became a row of ships, dates and cargoes. This was the first time we could see the whole operation on one canvas.

</div>
</Container>

<Container width="lg">

<figure class="embed">
  <iframe src={media('/media/projects/sahara-thunder/embeds/miro-journeys.html')} title="Every Sahara Thunder journey, mapped" style="aspect-ratio: 16 / 9" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe>
  <figcaption>Every Sahara Thunder journey, mapped</figcaption>
</figure>

</Container>

<Container width="md">

<PhotoPile
  orientation="landscape"
  items={[
    {
      src: "/media/projects/sahara-thunder/journey-12.webp",
      alt: "A branching diagram of all Sahara Thunder journeys in Miro.",
      caption: "All the journeys in one diagram",
    },
    {
      src: "/media/projects/sahara-thunder/journey-14.webp",
      alt: "A diagram of the Remy's journey with transfers between ships.",
      caption: "The Remy's journey, transfer by transfer",
    },
    {
      src: "/media/projects/sahara-thunder/journey-2.webp",
      alt: "A diagram of a journey with several oil transfers off Bandar Abbas.",
      caption: "A journey with several transfers off Bandar Abbas",
    },
    {
      src: "/media/projects/sahara-thunder/journey-5.webp",
      alt: "A diagram of a journey with transfers off Qeshm Island.",
      caption: "Transfers off Qeshm Island",
    },
    {
      src: "/media/projects/sahara-thunder/journey-3.webp",
      alt: "A short journey diagram of a ship loading at Kharg Terminal.",
      caption: "A short journey from Kharg Terminal",
    },
  ]}
/>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Checking the Evidence

</div>
<div class="dek col-span-md-7">

We shared our findings with Roke Intelligence, who independently verified many of the transfers, found satellite images of the ships, identified likely offloading points and confirmed instances of AIS spoofing.

We also checked IMO numbers against public registries, and used hull photos to confirm identities and earlier names.

</div>
</Container>

<Container width="md">

<PhotoPile
  orientation="landscape"
  items={[
    {
      src: "/media/projects/sahara-thunder/roke-1.webp",
      alt: "A Roke Geollect slide showing the Remy's AIS overview for March 2023.",
      caption: "Roke's overview of the Remy's AIS track",
    },
    {
      src: "/media/projects/sahara-thunder/roke-2.webp",
      alt: "A Roke Geollect slide of the Sonia 1 and Remy AIS overview.",
      caption: "The Sonia 1 and the Remy together",
    },
    {
      src: "/media/projects/sahara-thunder/roke-3.webp",
      alt: "A Roke Geollect slide with satellite imagery of a ship-to-ship transfer.",
      caption: "Satellite imagery of a ship-to-ship transfer",
    },
    {
      src: "/media/projects/sahara-thunder/roke-4.webp",
      alt: "A Roke Geollect vessel summary of the Remy with a photograph of the ship.",
      caption: "A vessel summary of the Remy",
    },
  ]}
/>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Art Direction

</div>
<div class="dek col-span-md-7">

We wanted the piece to feel like looking over the shoulder of someone going through the leak: dark, a little clandestine, with the evidence always on screen. A deep blue-black base, a warm gold for the oil and its routes, and annotated documents set against satellite and globe imagery.

</div>
</Container>

<Container width="lg">

<figure class="embed">
  <iframe src={media('/media/projects/sahara-thunder/embeds/moodboard.html')} title="Art direction moodboard" style="aspect-ratio: 4 / 3" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe>
  <figcaption>The art direction moodboard</figcaption>
</figure>

</Container>

<Container width="md">

<PhotoPile
  orientation="landscape"
  items={[
    {
      src: "/media/projects/sahara-thunder/ship-collage.webp",
      alt: "A collage of illustrated tankers, container ships and data screens.",
      caption: "Exploring how to show ships and scale",
    },
    {
      src: "/media/projects/sahara-thunder/dune.webp",
      alt: "A globe centred on the Middle East and Asia.",
      caption: "Globe views from Google Earth set the opening scenes",
    },
    {
      src: "/media/projects/sahara-thunder/abyss.webp",
      alt: "A globe with a red route from the Gulf to East Asia.",
      caption: "A route traced on the globe",
    },
    {
      src: "/media/projects/sahara-thunder/faxxon.webp",
      alt: "A globe with the Gulf highlighted.",
      caption: "Zooming in on the Gulf",
    },
    {
      src: "/media/projects/sahara-thunder/chem.webp",
      alt: "A globe with the Gulf region marked.",
      caption: "Another ship's start point",
    },
  ]}
/>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Type and Email Mockups

</div>
<div class="dek col-span-md-7">

The leaked emails were the evidence, so they had to be both readable and recognisable as emails. We tested variations of the email mockups, changing the type, the size of the highlights and how much of each message to show, until the key phrases stood out without losing the feel of a real inbox.

</div>
</Container>

<Container width="lg">

<figure class="embed">
  <iframe src={media('/media/projects/sahara-thunder/embeds/emails.html')} title="From raw emails to the email animation" style="aspect-ratio: 16 / 9" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe>
  <figcaption>From raw emails to the email animation</figcaption>
</figure>

</Container>

<Container width="md">

<PhotoPile
  orientation="landscape"
  items={[
    {
      src: "/media/projects/sahara-thunder/emails-1.webp",
      alt: "Dark email mockups with key phrases highlighted in yellow.",
      caption: "Highlighted phrases on dark email cards",
    },
    {
      src: "/media/projects/sahara-thunder/emails-2.webp",
      alt: "Layered dark email cards with highlighted text and blurred background messages.",
      caption: "Layering messages to suggest volume",
    },
  ]}
/>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Designing the Visualisations

</div>
<div class="dek col-span-md-7">

Once the datasets were finalised, the charts were made with MS Excel, Datawrapper and RAWGraphs. Maps were built in QGIS, then styled in Illustrator and Photoshop. The page animations were made in After Effects and exported for the web with Lottie, and the page was built with the Reuters Graphics rig on top of Svelte.

Every visual below started as a rough idea, and many did not make it into the final piece.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### The Transfer Network

</div>
<div class="dek col-span-md-7">

The network shows how oil moves from ship to ship, and how a handful of ships sit at the centre of it. Line thickness shows the volume of oil moved between ships.

</div>
</Container>

<Container width="lg">

<figure class="embed">
  <iframe src={media('/media/projects/sahara-thunder/embeds/sts-network.html')} title="How the ship-to-ship transfer network was drawn" style="aspect-ratio: 16 / 9" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe>
  <figcaption>How the ship-to-ship transfer network was drawn</figcaption>
</figure>

</Container>

<Container width="md">

<PhotoPile
  orientation="landscape"
  items={[
    {
      src: "/media/projects/sahara-thunder/sts.webp",
      alt: "A rough network diagram of ships and companies in Miro.",
      caption: "The first network draft in Miro",
    },
    {
      src: "/media/projects/sahara-thunder/sts-1.webp",
      alt: "A dark network of ships connected by gold curves.",
      caption: "Early version of the network",
    },
    {
      src: "/media/projects/sahara-thunder/sts-3.webp",
      alt: "The network with country flags and ship labels.",
      caption: "Adding ships, flags and labels",
    },
    {
      src: "/media/projects/sahara-thunder/sts-5.webp",
      alt: "The network with annotations beside key ships.",
      caption: "Annotating the key ships",
    },
    {
      src: "/media/projects/sahara-thunder/sts-final.webp",
      alt: "The final ship-to-ship transfer network.",
      caption: "The final network",
    },
  ]}
/>

</Container>

<Container width="lg">

<OverflowImage breakpoint=480 maxWidth='180%' url='media/projects/sahara-thunder/chart-sts.webp' alt="A wide chart of the ship-to-ship transfers over time." caption="The transfers laid out over time" />

</Container>

<Container width="md">

<PhotoPile
  orientation="landscape"
  items={[
    {
      src: "/media/projects/sahara-thunder/sts-locs.webp",
      alt: "A world map with the locations of ship-to-ship transfers.",
      caption: "Where the transfers happened",
    },
    {
      src: "/media/projects/sahara-thunder/sts-locs1.webp",
      alt: "Satellite map tiles of the transfer locations off Malaysia and Singapore.",
      caption: "Locating the offshore transfer zones",
    },
  ]}
/>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### Where the Oil Went

</div>
<div class="dek col-span-md-7">

To show how much oil moved, and where it ended up, we used a Sankey that follows each cargo from its origin through the transfer ships to its destination. It started as a sketch in a notebook.

</div>
</Container>

<Container width="md">

<PhotoPile
  orientation="landscape"
  items={[
    {
      src: "/media/projects/sahara-thunder/oil-chart-sketch.webp",
      alt: "A hand-drawn sketch of a stacked timeline and a flow diagram of oil moving between ships.",
      caption: "The first sketch of the oil chart",
    },
    {
      src: "/media/projects/sahara-thunder/oilchart1.webp",
      alt: "A first RAWGraphs Sankey of oil flows in blue, orange and green.",
      caption: "A first Sankey in RAWGraphs",
    },
    {
      src: "/media/projects/sahara-thunder/oilchart2.webp",
      alt: "A simplified Sankey with a few flows.",
      caption: "Simplifying the flows",
    },
  ]}
/>

</Container>

<Container width="sm">

<figure class="embed">
  <iframe src={media('/media/projects/sahara-thunder/embeds/oil-sankey.html')} title="The oil flows Sankey, animated" style="aspect-ratio: 3 / 4" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe>
  <figcaption>The final Sankey, animated</figcaption>
</figure>

</Container>

<Container width="lg">

<Video
  url="media/projects/sahara-thunder/oil-sankey-making-of.mp4"
  poster="media/projects/sahara-thunder/oil-sankey-making-of-poster.webp"
  alt="A screen recording of the oil Sankey being built."
  caption="Making of the oil Sankey"
/>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### Journeys on the Map

</div>
<div class="dek col-span-md-7">

The maps were built in QGIS and then styled by hand. We tried many versions of the journey maps, and settled on thin gold lines on a dark base so that overlapping journeys build into dense routes.

</div>
</Container>

<Container width="md">

<PhotoPile
  orientation="landscape"
  items={[
    {
      src: "/media/projects/sahara-thunder/qgis.webp",
      alt: "A QGIS window showing a dark map of Asia and layers panel.",
      caption: "Drawing the journeys in QGIS",
    },
    {
      src: "/media/projects/sahara-thunder/map-1.webp",
      alt: "A dark world map with thin gold journey lines.",
      caption: "First pass of the journey lines",
    },
    {
      src: "/media/projects/sahara-thunder/journeys-1.webp",
      alt: "A dark world map with many gold arcs fanning out from the Gulf.",
      caption: "Fanning out from the Gulf",
    },
    {
      src: "/media/projects/sahara-thunder/map-2.webp",
      alt: "A dark world map with the Remy's route highlighted.",
      caption: "Following a single ship",
    },
    {
      src: "/media/projects/sahara-thunder/map-final.webp",
      alt: "A dark world map with labelled stops along the Remy's journey.",
      caption: "The final map with labelled stops",
    },
    {
      src: "/media/projects/sahara-thunder/all-journeys.webp",
      alt: "A light map showing every Sahara Thunder journey as dotted lines.",
      caption: "Every journey on one map",
    },
  ]}
/>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### Showing AIS Spoofing

</div>
<div class="dek col-span-md-7">

Spoofing was the hardest tactic to explain. Positions broadcast by the ships form odd shapes instead of routes: circles, grids and tangled scribbles. Roke confirmed these as spoofing. We plotted the raw positions of several ships and picked the clearest patterns for the story.

</div>
</Container>

<Container width="md">

<PhotoPile
  orientation="landscape"
  items={[
    {
      src: "/media/projects/sahara-thunder/spoof-remy-circle.webp",
      alt: "Gold position points of the Remy forming a curve on a blue background.",
      caption: "The Remy's positions forming a curve",
    },
    {
      src: "/media/projects/sahara-thunder/spoof-remy1.webp",
      alt: "Position lines of the Remy forming a tangle on a blue background.",
      caption: "Another stretch of the Remy's track",
    },
    {
      src: "/media/projects/sahara-thunder/spoof-remy2.webp",
      alt: "The Remy's spoofed positions forming a circle.",
      caption: "Positions drawn in a circle",
    },
    {
      src: "/media/projects/sahara-thunder/spoof-remy-oman.webp",
      alt: "The Remy's spoofed positions scattered near Oman.",
      caption: "A spoofed track near Oman",
    },
    {
      src: "/media/projects/sahara-thunder/spoof-cathay.webp",
      alt: "Gold position lines forming a filled circle.",
      caption: "A solid circle of positions",
    },
    {
      src: "/media/projects/sahara-thunder/spoof-abyss.webp",
      alt: "Gold position lines forming a ring.",
      caption: "A ring of positions",
    },
    {
      src: "/media/projects/sahara-thunder/spoof-shanaye-queen.webp",
      alt: "Position lines forming zigzags.",
      caption: "Zigzag positions",
    },
    {
      src: "/media/projects/sahara-thunder/spoof-wenyao-brazil.webp",
      alt: "Position lines forming a perfect grid.",
      caption: "Positions forming a grid",
    },
    {
      src: "/media/projects/sahara-thunder/spoof.webp",
      alt: "A dark map with a spoofed track and a callout of the real location.",
      caption: "Spoofed track with the real location called out",
    },
    {
      src: "/media/projects/sahara-thunder/spoof1.webp",
      alt: "A composition of spoofing patterns for several ships.",
      caption: "Putting the patterns together",
    },
  ]}
/>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### Animation

</div>
<div class="dek col-span-md-7">

The page animations were built in After Effects and exported for the web as Lottie, so they stay sharp and light. We set up the files so that last minute edits to the data flowed through without rebuilding the animations.

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=480 maxWidth='100%' url='media/projects/sahara-thunder/ae.webp' alt="An After Effects project with the animated map composition." caption="The map scene in After Effects" />

</Container>

<Container width="lg">

<Video
  url="media/projects/sahara-thunder/ae.mp4"
  poster="media/projects/sahara-thunder/ae-poster.webp"
  alt="A screen recording of an animation inside After Effects."
  caption="Animating a journey in After Effects"
/>

</Container>

<Container width="lg">

<Video
  url="media/projects/sahara-thunder/remy-demo.mp4"
  poster="media/projects/sahara-thunder/remy-demo-poster.webp"
  alt="A screen recording of the Remy section of the story scrolling on the web page."
  caption="The Remy section, as it plays on the page"
/>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Impact and Learnings

</div>
<div class="dek col-span-md-7">

Officials at the U.S. Office of Foreign Assets Control told Reuters it was the best report they had seen on the topic and that it shaped their approach. The report was cited when a bipartisan Senate bill targeting the Russian and Iranian shadow fleets was introduced in April 2025.

Of the 13 unsanctioned vessels the story identified, 10 have since been sanctioned by Western governments, along with several of the companies behind them. Experts and academics have cited it in research and government testimony.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

The follow-up investigation into New Zealand insurer Maritime Mutual led police to confirm a probe and a raid on its offices. The company pulled out of tanker insurance on the eve of publication, and New Zealand announced shadow-fleet sanctions the next day.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-span-full">

> The visual approach emphasised clarity over complexity. The combination of investigative depth and data-driven interactive narrative design allowed audiences to understand a system engineered to remain invisible.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

What I took from it:

1. **Use graphics to report, not only to publish.** Drawing the data early helped find themes, outliers and holes in the reporting.
2. **Build a process and document it.** The data changed constantly, so every step had to be reproducible.
3. **Set up systems that scale.** Last minute edits should flow through the assets without recreating them.
4. **Explore widely, and don't get attached.** Many visuals did not make the final piece, but they showed us the best way to tell the story.
5. **Be patient.** The story we published is probably a third of what we designed. Be ready for stressful edits, and never lose sight of the purpose of the story.

</div>
</Container>

<style lang="scss">
  .embed {
    margin-block-end: var(--space-l);

    iframe {
      display: block;
      width: 100%;
      border: 0;
    }

    figcaption {
      max-width: var(--md);
      margin-block-start: var(--space-2xs);
      margin-inline: auto;
      font-style: italic;
      font-family: var(--font-serif);
      line-height: var(--line-height-medium);
    }
  }
</style>