---
title: idem — a people-centric identity model | Prasanta Kumar Dutta

description: Imagining a people-centric identity model for sustainable governance in India.

keywords: System Design, UX Design, Identity, Aadhar, Self-sovereign identity, Privacy, Blockchain, Distributed ledger, National Institute of Design, NID, Prasanta Kumar Dutta, pkddapacific, daPacific.

categories:
  - NID
  - System Design
  - UX Design

image: idem.webp
type: project
date: '2018-05-01'
published: true

links:
  - type: doc
    url: projects/idem/
    label: 🗒️ Read more

intro:
  hed: idem

  dek: "The Indian Government issues multiple identities for its citizens which are owned and stored by the Government. These IDs, when shared with various agencies, may pose threats to privacy.

  <br>
  In this project, I have attempted to understand the concept of identity, analyse the Aadhar system to identify key problems and propose a modified people-centric identity model that can help India achieve its goals of sustainable governance."

  img: projects/idem/hero.webp

  duration: 4 weeks

  client: National Institute of Design, Bangalore

  url: '#understanding-identity'

  quote: “Information is the new currency of the digital age. Treasure it as you would your money and assets”
---

<script>
  import Container from '$lib/components/ui/Container/index.svelte';
  import OverflowImage from '$lib/components/ui/OverflowingImage/index.svelte';
</script>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Understanding identity

</div>
<div class="dek col-span-md-7">

We live in a society that is transactional by nature. Our very means of survival lies on how we exchange information and services in our daily lives.

</div>
</Container>

<Container width="xl">

<OverflowImage breakpoint=960 maxWidth='180%' shadow="{false}" url='media/projects/idem/transactional.webp' alt="A simple transactional system: two parties exchanging information and services." caption="A simple transactional system" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

Such transactions depend on “trust”, which when reinforced, builds credibility. However, what forms the basis of trust is “identity”.

In terms of the web, Trust is the mechanism that is used to decide that a key is valid. A key is valid if it is actually owned by the person who claims to own it.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Models of trust

</div>
<div class="dek col-span-md-7">

Let us take a scenario where Kriti shares a certificate with Prafulla.

- **Direct Trust** — Prafulla trusts that the certificate is Kriti’s because Kriti gave it to him. Direct trust is the most straightforward type of trust and is most trustworthy.
- **Hierarchical Trust** — Prafulla considers Kriti’s certificate to be valid because the Dean signed it. Prafulla trusts the Dean to be an authority on accurate signing. Prafulla can trace a chain of certificates so on to verify the authenticity of the hierarchy. The drawback of Hierarchies is that they are brittle; because they are brittle, there is a natural tendency to limit the scope of a hierarchy. In general, passports and drivers’ licenses are not unified, for example. They cannot be used interchangeably as they originate from different hierarchies which may not have established a mutual trust.
- **Cumulative Trust** — Prafulla considers the certificate, signed by the Dean, valid only after Kriti shows her institute identity card. The simplest cumulative trust system is the question, “may I see two forms of ID, please?” The security assumption is that it is much harder to have two erroneous trust paths than one.

We are aware of the repercussions of falsification of identity. There are numerous instances of identity theft, financial frauds, medical malpractices and even governance by criminals.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## What is identity?

</div>
<div class="dek col-span-md-7">

1. Philosophically speaking, identity is a reflection of the conscious self, its ideas and beliefs 
2. The Oxford English Dictionary (2nd edition, 1989) defines it as – “The sameness of a person or thing at all times or in all circumstances; the condition or fact that a person or thing is itself and not something else; individuality, personality.” 
3. In the world of transactions, an identity may be defined as a representation of an entity in a specific application domain. 

The third definition establishes identity as pluralistic relationships which can be of the following nature —

**Personal/Existential Identity**

- Your self view arrived at by simple self awareness
- Nobody else’s business, it is private within the mind, emotions and body
- It is what must be protected against all harassment and violence
- Day to day awareness of different aspects of self-change

**Self Declared Identity**

- Who you say you are
- May be different on different days
- Is different to different people
- Taken by others on trust

**Social Identity**

- Who others say you are
- The collective impressions you receive from and have upon society
- But you are a different person to different people with different relationships

**Imposed Identity**

- Imposed upon you by an authority
- Different authorities impose identities based on some presented fact or proof of some other identity

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Why is identity a problem?

</div>
<div class="dek col-span-md-7">

Identity is only a problem for other people and institutions. It is never such a problem for people of sound self-aware minds. For the likes of a government, the requirements of holding an identity are artificial in the sense that in the absence of the government, the identity is meaningless. It is something that is imposed upon an individual to distinguish between individuals. The natural presumption is that an individual is a ‘body’ and so some biometric data would seem a suitable identifier of individuals.

- But the very presumption that an identity has an associated physical body is ever being challenged in the modern world of commerce and technology. It has long been anti-intuitive nonsense that a ‘corporation’ can have legal status as a ‘person’ when no two things could be more dissimilar. —  Any trust that an identity must be a person is further blown away by the internet ecology where a perceived identity may be a person or maybe a toaster.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Why talk about identity now?

</div>
<div class="dek col-span-md-7">



</div>
</Container>

<Container width="md">

<OverflowImage breakpoint=480 maxWidth='100%' shadow="{false}" url='media/projects/idem/societal-system.webp' alt="The six sectors of a societal system and their major relationships." caption="Six sectors of a societal system and their major relationships" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

- The Sustainable Development Goals by the United Nations outline different areas that need sustainable systems for the future. It talks about transforming them with design thinking such that they can be sustainable. Goal 16 of the Sustainable Development Goals is dedicated to the promotion of peaceful and inclusive societies for sustainable development, the provision of access to justice for all, and building effective, accountable institutions at all levels. Among its many targets, one is to provide legal identity for all, including birth registration by 2030, which is crucial to the achievement of other socio-economic targets. —  Aadhar is an attempt by The Unique Identification Authority of India (UIDAI) to achieve this target.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### Identity documents

</div>
<div class="dek col-span-md-7">



</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-span-full">

> An identity document (also called a piece of identification or ID, or colloquially as papers) is any document which may be used to prove a person's identity. If issued in a small, standard credit card size form, it is usually called an identity card (IC, ID card, Citizen Card) or Passport Card. Some countries issue formal identity documents, as national identification cards which may be compulsory or non-compulsory, while others may require identity verification using regional identification or informal documents. When the identity document incorporates a person's photograph, it may be called photo ID.
> <cite> — Wikipedia</cite>

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=480 maxWidth='150%' shadow="{false}" url='media/projects/idem/identity-world.webp' alt="Common features of identity documents across the world." caption="Common features of identity documents across the world" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

Every government has three fundamental responsibilities towards its citizens —

- The oldest and simplest justification for government is as protector: protecting citizens from violence.
- Government as provider of goods and services that individuals cannot provide individually for themselves, thus solving collective action problems.
- The most important priority of government as investor is indeed education, but education cradle-to-grave.

Need for government issued national identity documents —

- An unidentified population inhibits the state’s capacity for effective governance. Targeted design and delivery of government services rest on a state’s ability to identify (who are you?) and authenticate (are you who you say you are?) individuals.
- There should be a way to prove a person’s identity securely, in order to avoid mismatching people, and to fight fraud.
- Private alternatives, such as id cards issued by banks, inherently lack consistency regarding issuance policies which can lead to downstream problems. For example, in Sweden private companies such as banks (citing security reasons) refused to issue ID cards to individuals without a Swedish card. This forced the government to start issuing national cards. It is also harder to control information usage by private companies, such as when credit card issuers or social media companies map purchase behaviour in order to assist ad targeting.

However, there are numerous arguments against national identity documents as such —

- The development and administration costs of an identity card system can be very high.
- Rather than relying on government-issued ID cards, one can use the variety of identification systems that already exist, such as driver's or firearms licences or private cards.
- Cards reliant on a centralized database, especially if managed by private organisations, can be used to track anyone's physical movements and private life, thus infringing on personal freedom and privacy.
- If religion or ethnicity is registered on mandatory ID documents, this data can enable racial profiling.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Identity systems in India

</div>
<div class="dek col-span-md-7">

India has a plethora of identity systems that cater to different purposes. They can be categorised based on the kind of purpose they primarily serve. Apart from the Passport, Identity Certificate and OCI card, the rest are accepted only inside the nation.

</div>
</Container>

<Container width="xl">

<OverflowImage breakpoint=960 maxWidth='180%' shadow="{false}" url='media/projects/idem/indian-identity.webp' alt="Common identity documents in India, grouped by the purpose they serve." caption="Common identity documents in India" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

The validity of these identity documents is based on hierarchical trust on the authority issuing them. The Certificate of Birth is the first identity document that needs to be issued when a child is born. School certificates are independently issued by the institutes upon completion of Secondary/Higher Secondary education.

Most of the other documents require the verification of an individual’s identity using other documents from one or multiple categories (Proof of Identity, Address, Relationships and Date of Birth) – an example of how cumulative trust is preferable because of its enhanced reliability.

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=480 maxWidth='150%' shadow="{false}" url='media/projects/idem/identity-ecosystem.webp' alt="Indian identity documents arranged by the proofs they attest: identity, address, relationship and date of birth." caption="Indian identity documents by the proofs they attest" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

The identity documents are broadly used among three stakeholders — the citizen, the government and the service providers.

</div>
</Container>

<Container width="md">

<OverflowImage breakpoint=480 maxWidth='100%' shadow="{false}" url='media/projects/idem/stakeholder-relationship.webp' alt="Relationships between the citizen, the government and service providers in the identity ecosystem." caption="Stakeholder relationships in the identity ecosystem" />

</Container>

<Container width="lg">

<OverflowImage breakpoint=480 maxWidth='150%' shadow="{false}" url='media/projects/idem/kyc-services.webp' alt="Various agencies that require Know-Your-Customer (KYC) to deliver services." caption="Various agencies that require Know-Your-Customer (KYC) to deliver services" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Primary Research

</div>
<div class="dek col-span-md-7">

Before delving deeper into specific systems, I decided to get an understanding of how people perceived the existing identity systems in India, in terms of usage, trust and privacy. The respondents were mostly from within the institute.

- Most of the respondents encountered the need for an identity document during admissions to school/college, followed by opening bank accounts and getting a passport.
- When asked about the most common document they use to identify themselves, the highest response was for Aadhar card, followed by Pan Card and Driving license. For online identification, the clear winner was email id.
- The majority responded negatively to how they feel about sharing their identity documents with 3rd-parties like hotels.
- Most of the people digitised their documents for safekeeping. However, only a fraction of them used online storage systems, while the rest showed security concerns. Nearly none of the respondents was familiar with DigiLocker - the national Digital Locker System launched by Govt. of India.
- The rest of the questions were about their understanding of trust in the digital age and Aadhar in particular and expectations from an identity system, the responses to which are summarised below.

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=480 maxWidth='150%' shadow="{true}" url='media/projects/idem/survey.webp' alt="Summary of the survey: how respondents use, trust and share their identity documents." caption="Apprehensions and expectations of the survey takers" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Secondary Research

</div>
<div class="dek col-span-md-7">



</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### Overview of the Indian Passport system

</div>
<div class="dek col-span-md-7">

The Indian Passport is the most credible and powerful identity document, even with Aadhar trying to steal the show, as it serves both as a proof of Identity and Indian Citizenship, thus enabling the citizens to travel throughout the world. Hence, I chose to take a quick look at the system of passports to understand what makes it sufficiently trustworthy.

</div>
</Container>

<Container width="xl">

<OverflowImage breakpoint=960 maxWidth='180%' shadow="{true}" url='media/projects/idem/passport-system.webp' alt="Process map of getting an Indian passport, with points of strength and vulnerability." caption="Getting an Indian Passport" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

Points of strength/vulnerability along the process —

- Passport enrolment happens at Passport Seva Kendra (PSK), which are specialised centres set up by the government for the process. This can assure the citizen that their application is being handled by a credible authority and not some street vendor.
- The proof documents furnished by the citizen may be fake. Since they are usually not tied to any digital database (the scenario excludes Aadhar), verification of the documents is usually pivoted on the verification officer at the Passport Seva Kendra (PSK).
- Before the application is approved, the citizen is interviewed to test the authenticity of the documents and the information provided. Document verification happens at multiple checkpoints to minimise human errors.
- The passport office and its database of the applicant’s personal information may be prone to attacks. Also, this is the point where one might attempt to forge a passport using their resources.
- The physical police verification serves as a final firewall that can attest the credibility of the applicant. This comes from the fact the local police would be able to vouch for a resident, besides checking for criminal records, in a more efficient way than an official sitting in another city. However, in practical situations, resorting to unfair means like taking bribes for clearing the verification ticket of the applicant threatens to defeat the purpose of the exercise.
- Passports are delivered via Registered India Post, a reliable organisation suited to the purpose.

The authenticity of a passport is primarily due to a number of security features present in the current Indian passport i.e. background printing (e.g. guilloches and micro printing), security printing (e.g. fugitive and fluorescent ink), stitching thread, gothic numbering, Heat Applied Ultra Violet (HAUV) film, dicuts, fibres, watermark, barcode, Letter Screen Image (LSI) etc. Counterfeiting of passport is not a new problem. In fact, it starts from the manufacturing of passport itself. This problem is very common in India due to various loopholes in security features, which can be overcome with security features such as LSI, barcode, double lamination, etc. A layman may not be aware about any of the security features of his/her passport. Only a trained eye can detect a fake passport.

Biometric e-passports are the next generation of passports containing a security chip with all personal data and digital images. The chip can be read only after it is unlocked using an access code when it is skimmed through a reader. With rising global security threats and international travel risks rising, e-Passports that are much harder to duplicate or fake will help increase security assurance of all travellers and immigration authorities around the world.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### Overview of the Aadhar identity system

</div>
<div class="dek col-span-md-7">



</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-span-full">

> The most sophisticated ID programme in the world
> <cite> — Paul Romer, World Bank Chief Economist</cite>

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

- Aadhaar meaning “foundation” in Sanskrit, is a unique biometric form of identification backed by a 12-digit random number, issued by The Unique Identification Authority of India (UIDAI) - a statutory authority under the Ministry of Electronics and Information Technology. It is governed as per the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act. —  _The implementation of the UID scheme entails_ —
- generation and assignment of UIDs to residents
- defining mechanisms and processes for interlinking UIDs with partner databases
- operation and management of all stages of the UID life cycle
- framing policies and procedures for updating mechanism and defining usage and applicability of UIDs for delivery of various services, among others.

The number is linked to the resident's basic demographic and biometric information such as a photograph, ten fingerprints and two iris scans, which are stored in a centralised database.

**Why Aadhar?**

Starting with issuing of first UID in September 2010, 1.19 billion Indians have been enrolled in Aadhaar as of 30 November 2017, representing over 99% of the total population, which makes Aadhaar is the world’s largest national digital identity platform.

- The Government of India aims to provide social protection to alleviate poverty and provide for basic needs – including food and essential commodity subsidies, employment guarantees, and targeted cash transfers. Aadhar claims to streamline the process by helping to eliminate duplicate and fake identities.
- According to the UIDAI, compared to traditional identity documents, an all-purpose biometric identity proof has the potential to increase user convenience, lower transaction costs for service providers, and reduce the time spent in identity verification, as the number can be verified and authenticated in an easy and cost-effective way online anywhere, anytime.
- The unique ID also qualifies as a valid ID while availing various government services such as a LPG connection, a subsidised ration, kerosene from the Public distribution system (PDS), or benefits under National Social Assistance Scheme (NSAP) or pension schemes, e-sign, a digital locker, a Universal Account Number (UAN) under Employees' Provident Fund Organisation (EPFO), and some other services such as a SIM card or opening a bank account.

**Aadhaar as digital identity**

A number of features make the Aadhaar card a digital identity and facilitate digital identity. The document of the card itself is electronic in PDF format, wherein a QR Code provides digital XML representation of some core details of the card - the number and some limited details can be validated online, updating details can be done electronically using a mobile phone number and/or email as the second factor of authentication.

**Aadhar enrolment**

The UIDAI conducts Aadhaar enrolment using a tiered model of Registrars and Enrolment Agencies. It enters into agreements with Registrars, which are entities recognised by the UIDAI for the purpose of enrolling residents.

- _Registrars_ are commonly departments of the central or state government, banks, or public sector organisations. An example of a Registrar could be the Rural Development Department of a state government, or a public-sector insurance company such as the Life Insurance Corporation of India. Registrars carry out enrolment themselves, or appoint Enrolment Agencies to do so.
- _Enrolment Agencies_ may take two forms: third-party private entities empanelled by the UIDAI based on technical and financial capabilities, or existing offices of the Registrar. Enrolment Agencies receive payment from Registrars for successful Aadhaar generation. These agencies are required to use devices and follow technical processes delineated by the UIDAI.
- Enrolment Agencies set up _Enrolment Centres_, which function as touch-points for resident enrolment. The UIDAI is also meant to partner with civil society organisations and community networks to broaden the reach of these enrolment touch-points and enable enrolment of marginalised populations.

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=480 maxWidth='150%' shadow="{true}" url='media/projects/idem/aadhar-system.webp' alt="Process map of getting an Aadhar card, from enrolment to issue." caption="Getting an Aadhar card" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

**Aadhar usage**

The Aadhaar database allows government and private sector entities to authenticate individuals against their Aadhaar records.

</div>
</Container>

<Container width="xl">

<OverflowImage breakpoint=1080 maxWidth='250%' shadow="{true}" url='media/projects/idem/aadhar-auth.webp' alt="Process of user authentication using Aadhar." caption="Process of user authentication using Aadhar" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

The UIDAI allows Aadhaar authentication to be performed in three ways: demographic, biometric, and One-Time Pin authentications. Combinations of these three authentication methods form five distinct authentication services.

- _Type 1 Authentication — _ Purely demographic authentication using Aadhar number.
- _Type 2 Authentication — _ One-Time Pin (OTP) authentication using registered mobile number.
- _Type 3 Authentication — _ Single-factor biometric authentication, usually fingerprint.
- _Type 4 Authentication — _ Two-factor authentication, using OTP and single biometric scan.
- _Type 5 Authentication — _ Three-factor authentication, wherein an Aadhaar holder is authenticated using finger print, iris scan, and OTP authentications.

All authenticating agencies are required to obtain the consent of an individual before collecting her or his identity information, in a manner specified by UIDAI regulations. They are also required to ensure that the identity information of an individual is used only for submission to the CIDR.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## System analysis of Aadhar

</div>
<div class="dek col-span-md-7">

The Aadhar ecosystem can be broadly divided in two segments —

- Enrolment, where an individual gets his/her UID
- Usage, where the UID is used to avail services from the government or private instituitions

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=480 maxWidth='150%' shadow="{true}" url='media/projects/idem/stakeholder.webp' alt="Aadhar stakeholders and their inter-dependencies." caption="Aadhar stakeholders and their inter-dependencies" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

Based on the relationships, it is also important to assess the kind of power and participation that stakeholders have in the system. For this purpose, they were plotted in a Mendelow Matrix, which categorises them into four quadrants based on the level of power they hold in the system and the level of interest they have in exercising it in the system.

</div>
</Container>

<Container width="md">

<OverflowImage breakpoint=480 maxWidth='100%' shadow="{true}" url='media/projects/idem/mendelow.webp' alt="Aadhar stakeholders plotted on a Mendelow matrix of power against interest." caption="Analysis of Aadhar stakeholders using Mendelow's Matrix" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

The fact that UIDAI holds complete authority over Aadhar with minimal power to the citizens is a matter of concern from the point of security and privacy.

If a given system is to be viable in its system environment, it imposes certain requirements on its design, which are termed as “Basic Orientors” and represent the interests of the system. Application of the supreme orientor “viability” to the global characteristics of the system and its environment results in a set of basic orientors. The system (in its ideal proposed structure) has been analysed based on these orientors to assess the viability of the system. The satisfaction level of the orientors have then been analysed based on actual state of the system, derived from various sources including news reports, scams and controversies.

</div>
</Container>

<Container width="md">

<OverflowImage breakpoint=480 maxWidth='100%' shadow="{true}" url='media/projects/idem/orientor.webp' alt="Analysis of Aadhar against the basic orientors that decide the viability of a system." caption="Analysis of Aadhar to check for viability of the system" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

Since the orientors have failed to reach the aspired state of satisfaction, we can infer the existence of issues in the system. In order to assess the problems, I have taken the case of Prafulla, who wishes to purchase a new SIM card, for which he enrols for an Aadhar card. The entire journey is mapped and the touchpoints are probed for probed for pain points and system vulnerabilities.

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=480 maxWidth='150%' shadow="{true}" url='media/projects/idem/journey.webp' alt="User journey map of Prafulla enrolling for Aadhar to buy a SIM card." caption="User journey map" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

From the pain points, I mapped key problems, which can lead to opportunity areas for intervention that pertain to the enrolment and usage of Aadhar card.

</div>
</Container>

<Container width="lg">

<OverflowImage breakpoint=480 maxWidth='150%' shadow="{true}" url='media/projects/idem/opportunity-map.webp' alt="Problem areas in the Aadhar system and the opportunity hooks for intervention." caption="Identifying problem areas and opportunity hooks" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

The problems are categorised as —

- Wicked — complex and ambiguous
- Critical — urgent but procedural
- Tame — complicated but eventually solvable

If we look at the problems carefully, they mostly stem from improper planning and execution of the Aadhar scheme. The tame problems can be solved through proper strategic planning using insights obtained from the current system state. The critical problems need better management from UIDAI to enforce strict operational guidelines for quality control and reliability of the system. However, for the wicked problems, just a simple structural change will not suffice. It requires a paradigm shift using the understanding of basic principles of identity and trust. It may also require proper legislative measures for effective implementation.

- The problems arising from loopholes in the current legislation (Aadhar Act) are an equal matter of concern in a system that deals with such critical data and can threaten individuals and the nation alike. A rethinking of the system structure may help eliminate some of them, however, appropriate legislation needs to be put in place to ascertain compliance. —  Some of the loopholes are stated here for consideration.
- Even though Aadhar is considered a proof of both identity and address, the POA document for Aadhar enrolment is optional. If one doesn’t have (or choose not to give) an address proof, the person can choose Introducer or Head of Family based verification and get any address updated in Aadhaar.
- Aadhaar is not a proof of citizenship, but can be used to either apply for a passport or obtain other identity documents that can then be used to apply for a passport.
- Possession of a physical Aadhaar card cannot be considered as identification in airports, trains and other places as does not include any certificate of authenticity (holograms or physical signatures or any other security information).
- Aadhaar numbers are probably meant to be secret to avoid misuse, but UIDAI does not stop organisations from putting Aadhaar information out in public.
- Lack of privacy laws. The Aadhaar Act puts in place some safeguards to protect biometric and identity information, however, it says nothing about personal information. The term “personal information” (not used in the Act) can be understood in a broader sense, which includes not only identity information but also other information about a person, for instance where she travels, whom she talks to on the phone, how much she earns, what she buys, her Internet browsing history, and so on. With the linking of various services to Aadhar, and the framework that allows access to identity information to “requesting entities”, there may not be much left to prevent mining of personal information and state surveillance.

</div>
</Container>

<Container width="xl">

<OverflowImage breakpoint=960 maxWidth='180%' shadow="{true}" url='media/projects/idem/auth.webp' alt="Problems in each of the five Aadhar authentication methods." caption="Identifying problem in the authentication methods" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

It is evident that no single method of authentication can be completely trusted. Type 4 (using Type 2, 3) is relatively secure and Type 5 (using Type 2, 4) is the most reliable method of authentication. The potential gains from Aadhaar related fraud are huge, so one should expect people to invest their time, effort and money to stay ahead of the system.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

### Current scenario of security and privacy

</div>
<div class="dek col-span-md-7">

From the system analysis, it is evident that security and privacy are the two stepping stones for the Aadhar project to be sustainable. The Aadhar data being held at the CIDR, under the single authority of UIDAI makes it a single point of failure in case of security breaches and hacks (internal or external). Also, currently the people have very low control over their data or how it is used, which raises privacy concerns. The privacy of an individual can be compromised in the current system in multiple ways such as correlation of identities across domains, identification without consent using Aadhaar data and illegal tracking of individuals.

According to a famous study of the 1990 census data showed that 87% of the population in the United States reported characteristics that likely made them unique based only on gender, 5-digit ZIP code and full date of birth (day, month and year). The study further reported that 53% of the U.S. population is uniquely identified only by (gender, place, date of birth), where “place” is basically the city, town, or municipality in which the person resides. Even at the county level, (gender, county, date of birth) uniquely identifies 18% of the U.S. population. In general, it shows that “few characteristics are needed to uniquely identify a person.” Data holders often collect person-specific data and then release derivatives of collected data on a public or semi-public basis after removing all explicit identifiers, such as name, address and phone number. Evidence is provided in this study that this practice of de-identifying data and of ad-hoc generalization are not sufficient to render data anonymous because combinations of attributes often combine uniquely to re-identify individuals.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-span-full">

> **Case of Rohingya Muslims biometric database**
>
> The UN Refugee Agency along with the Bangladesh government has collected the fingerprints and iris scans of 4.4 million refugees fleeing from Myanmar in order to provide aid. The Rohingya are fleeing violence and persecution on the basis of their identities. Just months after they barely escaped with their lives, the Bangladeshi government is in negotiations with the Myanmar government to send the refugees back – despite evidence that Myanmar is continuing to burn Rohingya villages, bulldozing mass graves to hide the evidence and refusing to allow UN human rights investigators to enter the area. Sending the Rohingya, and all their data, back to Myanmar places their lives in great peril.
>
> For refugees fleeing violence or persecution, the possibility of biometric data falling into the wrong hands is a very real threat. Criminals, conflict actors and state-sponsored hackers could all have interests in accessing their information, placing their safety and perhaps also the safety of their friends and family still in countries of origin at stake.
>
> For the agencies charged with protecting some of the world’s most vulnerable people, the case also raises a deep dilemma – is collecting biometric data always in the best interests of refugees themselves? And if not, should the data be collected in the first place?
> <cite> — Elise Thomas, Monday 12 March 2018, wired.co.uk</cite>

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-span-full">

> **Case of Aadhar seeding**
>
> A public online dashboard on a website maintained by the Andhra Pradesh government allows anyone with an internet connection to use "religion" or "caste" as a search criterion to identify the homes of 5,166,698 families in 13 districts in Andhra Pradesh. On using the dashboard, HuffPost India found the precise latitude and longitude of homes inhabited by Muslim families, Dalit families, Hindu homes and even Zorastrian families. The dashboard uses Aadhaar numbers as a unique identifier to compile detailed information about beneficiaries of a widely-promoted government subsidy programme. "Creating public, searchable, digital profiles of minorities makes them potential targets of attack," said Kavita Srivastava, who has investigated scores of communal riots as National Secretary of the People's Union for Civil Liberties.
>
> "A database like this, means anyone can simply Whatsapp the locations of the homes of victims to rioters. It is very scary," Srivastava concluded.
> <cite> — Aman Sethi, Monday 25 April 2018, huffingtonpost.in</cite>

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Towards a self-sovereign identity

</div>
<div class="dek col-span-md-7">

- Self-sovereign identity is an identity that is created and maintained by the person and not controlled by any central authority. —  In this model, an identity comprises of —
- _Claims_ - An identity claim is an assertion made by the person or business
- _Proofs_ - A proof is some form of document that provides evidence for the claim.
- _Attestations_ - An attestation is when a third party validates that according to their records, the claims are true.
- What we seek with Self-Sovereign identity systems is an anonymising layer of distinct, purpose specific identity relationships with different counter-parties. — For this we can explore and develop the following notions of identity relationships —

**Transactional Identities**

- A growing record of transactions of an entity or agent with another entity
- Economic footprints which could be used as evidence for an attested identity
- Many identities can be run in parallel by a single agent

**Reputational Identity**

- A more formalised social identity
- Identities built upon a history of third-party ratings of interactions
- Can act as abstracts of Transactional Identities

**Attested Identity**

- Identity by ‘accepted’ attestation of facts by third-parties such as an attendance record or certificate
- An aggregated identity from proofs of different identity sources
- Attested identity networks could build up ‘webs of trust’
- Can involve preferential attachment to trusted webs for efficient trust routing

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## The principles of self-sovereignty

</div>
<div class="dek col-span-md-7">

As compiled by Christopher Allen based on Kim Cameron’s “Laws of Identity”, Respect Network policy and W3C Verifiable Claims Task Force FAQ

</div>
</Container>

<Container width="xl">

<OverflowImage breakpoint=1080 maxWidth='250%' shadow="{true}" url='media/projects/idem/self-sovereign.webp' alt="The principles of self-sovereignty." caption="Principles of self-sovereignty" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

With the basic framework in place, we can look into how a self-sovereign identity system can be achieved for India.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Proposed model for 'idem' Identity System for India

</div>
<div class="dek col-span-md-7">



</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-span-full">

> _idem_ is a Latin term meaning "the same". It symbolises the sameness of a person or thing at all times or circumstances — his true identity. It contains the 'id' — the only component of personality that is present from birth and according to Freud, is the source of all our basic instincts and drives.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

- The data pertaining to identity (demographics, biometrics etc.) should be owned by the people, thus eradicating the need for a centralised data repository. —  The user would have the idem app on a smartphone or computer, some sort of “identity wallet” where identity data would be stored on the hard drive of the device, maybe backed up on another device or on a personal backup solution, but crucially not stored in a central repository. The identity wallet would start off empty with only a self-generated identification number (idem) derived from public key and a corresponding private key (like a password, used to create digital signatures) using a randomness algorithm that ensures that every number is unique. This is different from generating username-password using third party. The person can then use this identification number, along with identity claims, and get attestations from relevant authorities. These attestations can then be used as identity information. Since identity information like residential address can change from time to time, this system will eliminate the need to run to every organisation to update information and help in keeping the data updated and consistent across all identity relationships.  In case the person loses his mobile, one would need a PIN to access the data in the app. Also, there will be ways to raise a flag to prevent fraudulent transactions from the app.  In case the idem is stolen, another person cannot use it as an identity, because the actual identity lies in the attestations of the identity documents which were locally stored in the original phone.  In case the same user needs to log into the app from a different mobile, he would have to transfer all attested documents from his previous phone. The same account can be accessed from only a single device at a time.  As for the attesting agencies, they will also have their identity verified and attested by authorities that trust them. For example, banks and telecom companies can be attested by the particular Ministry of the Indian Government and can be authorised to attest identity claims of their customers.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Technological framework for idem

</div>
<div class="dek col-span-md-7">

The system can be built using a Distributed Ledger system, that can generate Digital signatures and manage certificates that need to be issued, revoked or refreshed. The India Stack can be rebuilt using this technology to support the identity system.

</div>
</Container>

<Container width="xl">

<OverflowImage breakpoint=960 maxWidth='180%' shadow="{true}" url='media/projects/idem/dlt.webp' alt="Stakeholder relationships in Aadhar (centralised) compared with idem (distributed)." caption="Comparing the relationship between stakeholders in Aadhar (centralised) and idem (distributed)" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

The decentralised system would also require a decentralised database. The requirements to the ideal decentralized database that would be suitable for the decentralized applications needs can be summarised as —

- Distribution and decentralization - as the applications are decentralized the database should be either.
- Publicity – DLT allows anyone to contribute to the network. So, the database should do.
- Byzantine Fault Tolerance and tolerance for other types of attacks in the public network - to create a secure consensus protocol and maintain credibility of the system
- Sharding support - if we expect that an application will be popular and is going to store large amount of data then it would be great to make use of the total network power to increase maximum storage capacity. Full data replication on each node, of course, diminishes risk of data loss in the case of problems with a particular node. However, in a large network of hundreds of thousands of nodes full data replication on all nodes is too redundant, and the level of replication can be decreased in favour of increasing total storage capacity. That is if we have N nodes then each record should be replicated to m nodes, where m is less than N. It allows linearly scale total storage capacity with adding new nodes.
- Ability to store structured data - the storage should be able to understand internal structure of the stored data to allow applications to link records to each other.
- Ability to delete data - the database should be able to delete records that applications do not need any more to conserve space.
- Secondary indexes, full-text search - applications should be able to perform fast searches of records taking into account their internal structure.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-span-full">

> **Syrian refugees could regain legal identities that were lost when they fled their homes**
>
> A few times a month, Bassam pushes a shopping cart through the aisles of a grocery store stocked with bags of rice, a small selection of fresh vegetables, and other staples. At the checkout counter, a cashier tallies the total, but Bassam doesn’t pay with cash or a credit card. Instead he lifts his head to a black box and gazes into the mirror and camera at its center. A moment later, an image of Bassam’s eye flashes on the cashier’s screen. Bassam collects his receipt—which reads “EyePay” and “World Food Programme Building Blocks” across the top—and walks out into the noonday chaos of the Zaatari refugee camp.
>
> Though Bassam may not know it, his visit to the supermarket involves one of the first uses of blockchain for humanitarian aid. By letting a machine scan his iris, he confirmed his identity on a traditional United Nations database, queried a family account kept on a variant of the Ethereum blockchain by the World Food Programme (WFP), and settled his bill without opening his wallet.
>
> Started in early 2017, Building Blocks, as the program is known, helps the WFP distribute cash-for-food aid to over 100,000 Syrian refugees in Jordan. By the end of this year, the program will cover all 500,000 refugees in the country. If the project succeeds, it could eventually speed the adoption of blockchain technologies at sister UN agencies and beyond. It will tackle a central problem in any humanitarian crisis: how do you get people without government identity documents or a bank account into a financial and legal system where those things are prerequisites to getting a job and living a secure life?
>
> At the heart of such systems is a concept known as “self-sovereign identity.” It was popularized in 2016 by Christopher Allen, an American technologist, who outlined principles for a digital proof of existence owned by the individual. In such a scheme, identity would be portable and not dependent on any state or central authority. And the consensus is growing that a blockchain should be at its center.
> <cite> — Russ Juskalian, 12 April 2018, MIT Technology review</cite>

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## idem solves Aadhar issues

</div>
<div class="dek col-span-md-7">

Let us now look into how this system can solve the problems identified earlier in the current scenario.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Credibility of identity documents

</div>
<div class="dek col-span-md-7">

- In regular scenario, it is very difficult to verify the authenticity of documents like Birth certificates, driving license and so on, because they can be easily forged. One way to verify them is to get them attested by the issuing authority or a person/institute of considerable credibility. Also, just furnishing identity documents cannot establish the identity of a person with sufficient credibility. One way to do that is by physical verification (like in the case of Passports), or if the person is vouched for by multiple credible sources (like the place he works, or the bank where he holds accounts) as it builds up cumulative trust. —  Using idem, identity claims will be attested by digital certificates, possibly time-bound. A digitally signed proof is as good as an attestation because the digital signature cannot be forged. Digital signatures have two properties that make them inherently better than paper document —
- Digital signatures become invalid if there are any changes to the signed document. In other words, they guarantee the integrity of the document.
- Digital signatures cannot be ‘lifted’ and copied from one document to another.
- These attestations, provided by different agencies that have already verified the documents, will help in establishing trust on the UID of the person by building “webs of trust”, without the need for verifying them again. —  The system will automatically root out fake identities that attempts to leach away government benefits and subsidies, because an identity in this system can survive only if it has sufficient credible attestations.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Authenticity of transactions

</div>
<div class="dek col-span-md-7">

- According to standard notions of digital authentication, a security principal (a user or a computer), while requesting access to a service, must provide two independent pieces of information - identity and authentication. Whereas identity provides an answer to the question “who are you?”, authentication is a challenge-response process that provides a “proof of the claim of identity”, typically using an authentication credential. —  In the case of Prafulla purchasing a SIM card, the POS device cannot tell if it is a fraudulent transaction using stolen fingerprints and Aadhar number. However, using idem, the POS system would request authentication from Prafulla’s mobile app and he would respond to it using the appropriate attested identity that validates his identity claim. He doesn’t need to share any actual identity document with the service provider.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Access and control of user information

</div>
<div class="dek col-span-md-7">

The ANSI/NASPO Identity Proofing and Verification (IDPV) Standard Development Project (ANSI/NASPO-IDPV-2013) identifies sets of core identity attributes across the dimensions of Name, Location, Time and Identifier that in most cases, allows for resolution to a single identity. In selecting a particular set, it recommends that the following factors be used to choose one particular attribute over another —

</div>
</Container>

<Container width="xl">

<OverflowImage breakpoint=1080 maxWidth='250%' shadow="{true}" url='media/projects/idem/idpv.webp' alt="IDPV test used to choose identification attributes." caption="IDPV test to choose identification attributes" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-start-md-6 col-span-md-7">

- In the current Aadhar system, there are no checks regarding what information is actually required by the AUA and service providers. Also, they collect people’s identity information as a part of their KYC. —  In the proposed model of idem, checks would be in place as to ensure that the institution gets only that information about a person that it actually needs, as per the IDPV standards and not what it seeks. Any unauthorised requests will be automatically declined by the system. In case the requests are validated, the user still can decide whether he wants to give access to that information. Also, all information requests and permissions will be time-bound and will expire if not used within a that time window. Additionally, the user will be able view and authorize identity authentication requests from various public / private entities, view all existing linkages of national identity with public / private agencies and update (data points shared or discontinue) these linkages.  The purpose of KYC will also be solved when the institutions can safely rely on the attestations and identity of the enrolled individuals, without the need for collecting and storing identity data separately. This will definitely reduce risks of data collections and breach of privacy.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Carrying forward the vision of Aadhar

</div>
<div class="dek col-span-md-7">

Despite the various flaws in the implementation, Aadhar is one of the most ambitious identity projects undertaken. It has the potential to influence good governance. Some of its visions include —

- Increasing access to financial services to improve economic prospects for poor individuals and communities.
- Direct Benefit Transfers (DBTs) from Government to Citizens
- Providing a comprehensive set of safety nets to India’s poor, including food subsidies, employment guarantees, and targeted cash transfers.
- Developing a diverse set of uses in healthcare, education, and governance among others like Digitisation of Health and Education records, directed benefits and scholarships.
- Rooting out corruption to improve the economy.
- It is currently difficult to express banking account information, education qualifications, healthcare data, and other sorts of machine-readable personal information that has been verified by a 3rd party digitally or on the web. These sorts of data are often referred to as verifiable claims. —  The idem system will incorporate the infrastructure of the Verifiable Claims Working Group, who are currently trying to make expressing, exchanging, and verifying claims easier and more secure on the Web.  Architectural goals for the Verifiable Claims work include —

</div>
</Container>

<Container width="xl">

<OverflowImage breakpoint=960 maxWidth='180%' shadow="{true}" url='media/projects/idem/claims.webp' alt="Architectural goals for the Verifiable Claims work." caption="Architectural goals for the Verifiable Claims" />

</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="hed col-span-md-5">

## Conclusion

</div>
<div class="dek col-span-md-7">

Aadhaar or any trustworthy Unique Identity System (as in the one proposed) may not only enable efficient design, delivery, monitoring and evaluation of services in each domain individually, but may also offer the possibility of using modern data analytics and machine learning techniques for finding large scale correlations in user data. This, in turn, may facilitate an improved design of social policy strategies, including targeting, and early detection and warning systems for anomalies. For example, it may be tremendously insightful to be able to correlate education levels, family incomes and nutrition across the entire population or disease spread with income and education. More generally, it may enable macro level analysis from high frequency micro level data, econometric analysis, epidemiological studies, automatic discovery of latent topics and finding both predictive and causal relationships across multiple domains of the economy.

</div>
</Container>

<Container grid style="margin-block-start:var(--space-xl)">
<div class="col-span-full">

> **Indra and Vironchana Seek the ‘Self’**
>
> In the Hindu sacred text call the Chandogya Upanishad, is a story where Indra, the king of the gods and Virochana, the king of the demons seek knowledge of the true self at the ashram of Prajapati, the lord of all beings…
>
> Prajapati asks, “Desiring what have you come to live here?”
>
> Indra and Virochana reply, “We seek that self which is free from evil, free from old age, free from death, free from grief, free from hunger and thirst. He who has found out, he who understands that self, he obtains all worlds and all desires.”
>
> Parajapati says, “That person which is seen in the eye, that is the self. That is the immortal, the fearless. Look at yourself in this pan of water. What do you see?”
>
> “We see ourselves as we are in every detail, our clothes, our hair, even to the lines in our eyes and even the whirls on our fingers.”
>
> Prajapati replies, “Thank you for your enrolment. Here is your Aadhaar number. It is free from evil, free from old age, free from death free from grief, free from hunger and thirst. Understanding this self you will obtain all worlds and desires.”
>
> As Indra and Virochana go, Prajapati thinks, “Without perceiving, they go away not knowing the self. Who ever follows such a doctrine will surely perish.”
>
> Virochana declares that Aadhaar is the immortal self which must be served to enjoy life and grow. He grows rich and powerful until Bali, his son, hacks UADAI and deletes Virochana’s Aadhaar profile. Aadhaar no longer authenticates for him and he perishes.
>
> But Before reaching the gods, Indra realises that when the eyes grow cloudy and the fingerprints worn, this Aadhaar will lead one to perish. He comes back to Prajapati and asks, “Can you teach me about blockchain self-sovereignty instead?”
>
> (And returned a third time to learn the true self also, the Atma!)
> <cite> — Darryl Morris, Independent Ethereum Developer, Medium</cite>

</div>
</Container>

