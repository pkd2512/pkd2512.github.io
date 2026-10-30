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

  duration: 9 months

  client: Reuters

  url: '#the-brief'

  quote: “You have to be like the worst tabloid newspaper in the front and the Academy of Science in the back.” — Hans Rosling
---

<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import OverflowImage from '$lib/components/ui/OverflowingImage/index.svelte';
  import PhotoPile from '$lib/components/ui/PhotoPile/index.svelte';
  import Video from '$lib/components/ui/Video/index.svelte';
  import ReferralCard from '$lib/components/ui/ReferralCard/index.svelte';
  import LinkButton from '$lib/components/ui/LinkButton/index.svelte';
  import media from '$utils/media';
</script>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## The brief

</div>
<div class="dek col-span-md-7">

In February 2024, hackers leaked more than 10,000 emails and attachments from an Iranian firm called Sahara Thunder. Reuters reporter Paul Carsten spent almost two years tracing how the firm moved sanctioned oil covertly from vessel to vessel on the high seas, using AI analysis, satellite images, customs and shipping databases, and insider sources.

My job was to turn gigabytes of emails, spreadsheets and GPS coordinates into something a reader could follow from the first scroll to the last, and something officials could use.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

The brief was a hard one for a graphic. The story had dozens of ships, hundreds of transfers and a handful of evasion tactics, all hidden by design. Our answer was to pick one character to follow, the tanker Remy, because one ship's journey makes a complex network understandable. Each evasion tactic then got its own scene (spoofing its location, forging bills of lading and repainting its name mid-voyage), so readers experience the deception step by step instead of reading a list of techniques.

Before any design, we sketched the sequence as sticky notes and listed every visual we might need.

</div>
</Container>

<Container width="md">

<PhotoPile
  orientation="widescreen"
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

## Getting to know the data

</div>
<div class="dek col-span-md-7">

The emails come from the Sahara Thunder leak published by <LinkButton label='PRANA Network' url='https://simorgh.io/' />. Before anyone read them line by line, we ran them through <LinkButton label='Google Pinpoint' url='https://journaliststudio.google.com/pinpoint' /> to pull out ship names, cargo sizes and the coordinates of trades. That gave us a map of the leak.

We then sorted the emails into sets: one for each cargo, each ship-to-ship transfer, vessels, key companies, contracts and keywords such as China, Russia, Venezuela and Middle East countries. Each set worked as its own small investigation.

Names change but IMO numbers mostly don't, so we anchored every ship on its IMO number. The Remy used the fake name Deep Ocean when loading Iranian oil, sailed earlier as Asian Spirit, and now goes by Wilma II.

Searching for revealing phrases turned up both evidence and quotable material: “Not to use any Iranian name/point/word”, “Change the name of vessel on the hull” and “this vessel is black listed”.

All the data was stored on our internal cloud infrastructure, and personal data such as an ID card was redacted from the public report.

</div>
</Container>

<Container width="md">

<PhotoPile
  orientation="square"
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

## From documents to one table

</div>
<div class="dek col-span-md-7">

Emails with daily position reports let us pinpoint the GPS coordinates of ship-to-ship transfers, even when ships had switched off or spoofed their AIS.

We built that table early, recording the from-ship, to-ship, date, location and volume of every transfer. That one table drove the reporting, the timeline and the network graphic.

We then matched contracts, invoices and messages to each voyage to build a timeline of Sahara Thunder's activity.

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
  ]}
/>

</Container>

<Container width="md">

<PhotoPile
  orientation="portrait"
  items={[
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

## Reconstructing the journeys

</div>
<div class="dek col-span-md-7">

Ships turn off their AIS or spoof it, so we could not rely on a single source. We merged GPS positions from the emails with ship-tracking data from <LinkButton label='LSEG' url='https://www.lseg.com/en/data-analytics/products/workspace/updates/lseg-launches-vessel-tracking-solution' /> and <LinkButton label='Kpler' url='https://www.kpler.com/solutions/fundamental-intelligence/ship-tracking' /> to reconstruct each voyage, and checked the routes on <LinkButton label='Google Earth' url='https://earth.google.com/web/' />.

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

With a journey for every ship, we laid them all out in <LinkButton label='Miro' url='https://miro.com/' />. Each journey became a row of ships, dates and cargoes, and the whole operation fit on one canvas.

This is where graphics worked as a reporting tool rather than a publishing one. Seeing every journey side by side helped identify themes and questions for the rest of the reporting, spot outliers, find typical examples and expose holes in what we knew.

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
  orientation="widescreen"
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
      src: "/media/projects/sahara-thunder/journey-3.webp",
      alt: "A short journey diagram of a ship loading at Kharg Terminal.",
      caption: "A short journey from Kharg Terminal",
    },
  ]}
/>

</Container>

<Container width="md">

<PhotoPile
  orientation="portrait"
  items={[
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
  ]}
/>

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Checking the evidence

</div>
<div class="dek col-span-md-7">

We shared our findings with <LinkButton label='Roke Intelligence' url='https://www.roke.co.uk/products/geollect/' />, who independently verified many of the transfers, found satellite images of the ships, identified likely offloading points and confirmed instances of AIS spoofing.

We also cross-checked IMO numbers against public registries such as <LinkButton label='Equasis' url='https://www.equasis.org/EquasisWeb/public/HomePage' />, used LSEG and Kpler ship-tracking data alongside the emails, and used hull photos on <LinkButton label='MarineTraffic' url='https://www.marinetraffic.com/' /> to confirm identities and earlier names.

We reached out to 79 companies and couldn't reach 13. Ten replied: eight said they weren't involved, and two said they only handled technical management. Iraqi customs called the Remy's “Iraqi” certificates of origin and bills of lading poor forgeries, and SOMO, Iraq's state oil marketer, said it had no record of the ship loading. We also spoke with the hackers to understand their motivation, which can speak to the authenticity of the data.

</div>
</Container>

<Container width="md">

<PhotoPile
  orientation="widescreen"
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

## Art direction

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

## Type and email mockups

</div>
<div class="dek col-span-md-7">

The leaked emails were the evidence, so they had to be both readable and recognisable as emails. We tested variations of the email mockups, changing the type, the size of the highlights and how much of each message to show, until the key phrases stood out without losing the feel of a real inbox.

Showing the evidence on screen was a principle throughout. Annotated email screenshots, forged documents and satellite images sit right in the narrative, so the reader sees the proof and not just our description of it.

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
  orientation="widescreen"
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

## Designing the visualisations

</div>
<div class="dek col-span-md-7">

Once the datasets were finalised, the charts were made with MS Excel, <LinkButton label='Datawrapper' url='https://www.datawrapper.de/' /> and <LinkButton label='RAWGraphs' url='https://app.rawgraphs.io/' />. Maps were built in <LinkButton label='QGIS' url='https://www.qgis.org/' /> with <LinkButton label='Natural Earth' url='https://www.naturalearthdata.com/' /> data, then styled in <LinkButton label='Illustrator' url='https://www.adobe.com/uk/products/illustrator/' /> and Photoshop. The page animations were made in <LinkButton label='After Effects' url='https://www.adobe.com/uk/products/aftereffects.html' /> and exported for the web with <LinkButton label='Lottie' url='https://airbnb.io/lottie/' /> using <LinkButton label='Bodymovin' url='https://aescripts.com/bodymovin/' />, and the page was built with the Reuters Graphics rig on top of <LinkButton label='Svelte' url='https://svelte.dev/' />.

There are many ways to visualise the same data and tell the same story, so we explored widely. Every visual below started as a rough idea, and many did not make it into the final piece.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### The transfer network

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
  orientation="widescreen"
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
  orientation="widescreen"
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

### Where the oil went

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

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

The animation walks through how the chart came together: the table of journeys, the first Sankey in RAWGraphs, and the styled version we published. Each flow is one journey, from where the oil was loaded to where it ended up.

<figure class="embed">
  <iframe src={media('/media/projects/sahara-thunder/embeds/oil-sankey.html')} title="The oil flows Sankey, from data table to final chart" style="aspect-ratio: 3 / 4" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe>
</figure>

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### Journeys on the map

</div>
<div class="dek col-span-md-7">

The maps were built in QGIS and then styled by hand. We tried many versions of the journey maps, and settled on thin gold lines on a dark base so that overlapping journeys build into dense routes.

</div>
</Container>

<Container width="md">

<PhotoPile
  orientation="widescreen"
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

### Showing AIS spoofing

</div>
<div class="dek col-span-md-7">

Spoofing was the hardest tactic to explain. Positions broadcast by the ships form odd shapes instead of routes: circles, grids and tangled scribbles. Roke confirmed these as spoofing. We plotted the raw positions of several ships and picked the clearest patterns for the story.

</div>
</Container>

<Container width="md">

<PhotoPile
  orientation="golden"
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

The page animations were built in After Effects and exported for the web as <LinkButton label='Lottie' url='https://airbnb.io/lottie/' /> with <LinkButton label='Bodymovin' url='https://aescripts.com/bodymovin/' />, so they stay sharp and light. We set up the files so that last minute edits to the data flowed through without rebuilding the animations.

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

## The stories

</div>
<div class="dek col-span-md-7">

The visual report, and the investigations that grew out of it.

<Container width="fluid" style="text-align:center; margin-block-end:var(--space-l)">

<ReferralCard
  url="https://www.reuters.com/graphics/IRAN-OIL/zjpqngedmvx/"
  image="https://www.reuters.com/graphics/IRAN-OIL/zjpqngedmvx/cdn/images/share.jpg"
  title="How Iran moves sanctioned oil around the world"
  description="Inside the secret operations of Iranian company Sahara Thunder, revealed and visually reconstructed from more than 10,000 leaked emails."
/>

<ReferralCard
  url="https://www.reuters.com/investigations/iran-russia-new-zealand-insurer-that-kept-their-sanctioned-oil-flowing-2025-10-28/"
  image="/media/projects/sahara-thunder/maritime-mutual.webp"
  title="Iran, Russia and the New Zealand insurer that kept their sanctioned oil flowing"
  description="How Maritime Mutual insured almost one in six of the shadow fleet tankers sanctioned by Western governments."
/>

<ReferralCard
  url="https://www.reuters.com/investigations/how-dark-fleet-tankers-helped-mexican-cartel-build-fuel-smuggling-empire-2025-10-22/"
  image="/media/projects/sahara-thunder/dark-fleet-cartel.webp"
  title="How a ‘dark fleet’ of tankers helped a Mexican cartel build a fuel-smuggling empire"
  description="Reuters investigation into the dark fleet and a Mexican cartel."
/>

</Container>

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Impact of the story

</div>
<div class="dek col-span-md-7">

Officials at the U.S. Office of Foreign Assets Control told Reuters it was the best report they had seen on the topic and that it shaped their approach. The report was cited when a bipartisan Senate bill targeting the Russian and Iranian shadow fleets was introduced in April 2025.

Of the 13 unsanctioned vessels the story identified, 10 have since been sanctioned by Western governments, along with several of the companies behind them. Experts and academics have cited it in research and government testimony.

The follow-up investigation into New Zealand insurer Maritime Mutual led police to confirm a probe and a raid on its offices. The company pulled out of tanker insurance on the eve of publication, and New Zealand announced shadow-fleet sanctions the next day.

</div>
</Container>

<Container grid>
<div class="col-span-full">

> The visual approach emphasised clarity over complexity. The combination of investigative depth and data-driven interactive narrative design allowed audiences to understand a system engineered to remain invisible.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Learnings

</div>
<div class="dek col-span-md-7">

What a project this long taught us about using graphics in an investigation.

</div>
</Container>

<Container width="lg">

<figure class="notes">
<div class="card"><b>Tell a story that engages without confusing.</b> Follow one ship: its journey makes a complex network understandable, lets you reveal the side plots, and keeps the evidence on screen.</div>
<div class="card"><b>Think in terms of data.</b> To make graphics, work out early how to structure your information in a spreadsheet. Our table of transfers drove the reporting, the timeline and the network graphic.</div>
<div class="card"><b>Use graphics to report and research.</b> They help identify themes and questions, spot outliers (good stories, or perhaps errors in the data) and typical examples, and expose holes in the reporting.</div>
<div class="card"><b>Use graphics to publish.</b> They illustrate a point more compellingly by removing technical detail from the prose. Interactive ones let readers explore and see how the reporting was done.</div>
<div class="card"><b>Build a process and document it.</b> Data changes drastically over a long project. Whether you use code or Excel, make sure the analysis can be reproduced.</div>
<div class="card"><b>Set up systems that scale.</b> Make sure last-minute edits flow through your images, animations and code without recreating them each time.</div>
<div class="card"><b>Play to your strengths, and use AI as a tool.</b> There are many ways to visualise the same data. Pick the one that does justice to the content.</div>
<div class="card"><b>Explore without getting attached.</b> Many of our visuals never made the final piece, but they helped us find the best way to tell the story.</div>
<div class="card"><b>Be patient.</b> Fatigue gets in the way on long projects. The story we published is probably a third of what we designed. Be ready for stressful edits, and don’t lose sight of its purpose.</div>
</figure>

</Container>

<style lang="scss">
  .notes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-xs);
    margin-block-start: 0;
    font-family: var(--font-serif);
    font-style: italic;
    line-height: var(--line-height-medium);
    color: var(--black-soft);
    text-align: left;
    text-wrap: pretty;

    @media (--md-n-below) {
      grid-template-columns: 1fr;
    }

    .card {
      padding: var(--space-s);
      background-color: var(--gray-soft);
      border-radius: 0.25rem;
    }
  }

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
