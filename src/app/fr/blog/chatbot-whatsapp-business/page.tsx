import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Steps } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Recherches visées : "chatbot whatsapp business" (55, 3/3), "chatbot whatsapp
// gratuit" (46, 3/3), "bot whatsapp" (30, 3/3), "créer un chatbot whatsapp
// gratuitement" (24), "chatbot whatsapp ia" (19), "créer un chatbot whatsapp"
// (18), autocomplétion FR 2026-10-30 (docs/seo-blog-europe-research.mjs fr).
// Tarifs : grille EUR de Meta pour la France au 1er octobre 2026 (FlowCall et
// Kanal concordent) ; prix Landbot et Kanal relevés sur leurs propres pages.
// Meta change ses tarifs chaque trimestre (1er jan/avr/juil/oct) : revérifier
// et mettre `updated` à jour. Version anglaise : /blog/what-is-a-whatsapp-chatbot.
const href = "/fr/blog/chatbot-whatsapp-business";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "fr", article: { publishedTime: post.published, modifiedTime: post.updated } });

const kinds = [
  ["Comment il répond", "Le client choisit dans un menu ou tape un mot-clé", "Il comprend la question et répond avec vos informations"],
  ["Question imprévue", "« Je n’ai pas compris », retour au menu", "Une vraie réponse, ou le relais à un humain"],
  ["Mise en place", "Dessiner chaque parcours, bouton par bouton", "Écrire des consignes et ajouter vos documents"],
  ["Entretien", "Modifier les parcours à chaque changement", "Mettre à jour la base de connaissances"],
  ["Idéal pour", "Des démarches fixes : suivi de colis, choix d’un service", "Les questions libres : prix, horaires, disponibilités, conseils"],
];

const ways = [
  ["Numéro", "Un numéro inscrit sur l’API", "Un numéro inscrit sur l’API", "Votre numéro actuel, l’appli reste utilisable"],
  ["Mise en route", "Quelques jours (vérification Meta)", "Plusieurs jours, plus le développement", "Quelques minutes"],
  ["Frais Meta", "Par message", "Par message", "Aucun pour les réponses"],
  ["Abonnement", "Celui de la plateforme", "n8n ou Make, plus l’hébergement", "Gratuit pour démarrer"],
  ["Campagnes et newsletters", "Oui", "Oui", "Non"],
  ["Compétences", "Aucune", "Techniques", "Aucune"],
];

const rates = [
  ["Marketing", "0,0712 €"],
  ["Utilitaire", "0,0248 €"],
  ["Authentification", "0,0248 €"],
  ["Service", "Gratuit pour les 1 000 premiers par mois et par numéro, puis 0,0248 €"],
];

const tools = [
  ["Ce que c’est", "Créateur de chatbots à parcours et IA", "Messagerie WhatsApp pour e-commerce, sur l’API", "Agent IA sur votre numéro, sans API"],
  ["Prix pour WhatsApp", "160 €/mois en annuel (offre Professional WA, 1 numéro)", "89 €/mois ; agent IA avec l’offre Scale à 149 €/mois", "Gratuit pour démarrer"],
  ["Réponses IA", "500 chats IA par mois, puis 0,10 € le chat", "Avec l’offre Scale", "Incluses, chats et appels WhatsApp"],
  ["Frais Meta", "En plus, par message", "En plus, refacturés au coût", "Aucun pour les réponses"],
  ["Campagnes", "Oui", "Oui", "Non"],
];

const steps = [
  { title: "Créez votre agent", body: "Inscrivez-vous, créez un agent de chat et donnez-lui un nom et une consigne : qui il est, ce qu’il fait, quand il passe la main à un humain, et qu’il se présente comme un assistant IA." },
  { title: "Ajoutez vos informations", body: "Collez votre FAQ, vos tarifs et vos horaires, ou importez un PDF ou un document Word. L’agent s’appuie sur ce contenu pour répondre." },
  { title: "Connectez votre numéro", body: "Depuis un ordinateur, ouvrez WhatsApp sur votre téléphone, puis Appareils connectés, et scannez le QR code. Depuis un téléphone, Wapzen vous donne un code d’association à saisir." },
  { title: "Testez depuis un autre téléphone", body: "Posez les questions de vos clients, repérez les réponses imprécises et complétez la base de connaissances." },
  { title: "Activez les appels si besoin", body: "Ajoutez un agent vocal : il répond aux appels WhatsApp en français et rappelle les nouveaux contacts." },
];

const faqs = [
  { q: "Un chatbot WhatsApp Business est-il gratuit ?", a: "L’appli WhatsApp Business est gratuite, mais elle n’offre que des messages automatiques fixes (accueil, absence), pas un vrai chatbot. Un chatbot sur l’API coûte un abonnement à une plateforme plus les frais de Meta par message. Wapzen, qui fonctionne sur votre numéro actuel sans l’API, est gratuit pour démarrer." },
  { q: "Combien coûte un message WhatsApp Business en France ?", a: "Depuis le 1er octobre 2026, Meta facture 0,0712 € un message marketing et 0,0248 € un message utilitaire ou d’authentification vers un numéro français, hors taxes et hors frais de la plateforme. Les réponses aux clients sont gratuites jusqu’à 1 000 par mois et par numéro, puis coûtent 0,0248 € chacune." },
  { q: "Faut-il l’API WhatsApp Business pour avoir un chatbot ?", a: "Pas forcément. L’API est nécessaire pour envoyer des campagnes à des milliers de contacts ou brancher WhatsApp sur un CRM. Pour répondre automatiquement aux messages entrants, un agent IA connecté à votre numéro comme appareil, à la manière de WhatsApp Web, suffit et évite les frais par message." },
  { q: "Le chatbot doit-il dire qu’il est une IA ?", a: "Oui. Depuis le 2 août 2026, l’article 50 de l’AI Act européen impose d’informer les personnes qu’elles échangent avec une IA, sauf si c’est évident. Le Digital Omnibus n’a pas reporté cette obligation. Une phrase dans le message d’accueil suffit, par exemple : « Bonjour, je suis l’assistant IA de [entreprise]. »" },
  { q: "Peut-on utiliser ChatGPT comme chatbot WhatsApp pour ses clients ?", a: "Pas directement. Le contact 1-800-ChatGPT, de retour dans l’Espace économique européen depuis juillet 2026, est un assistant personnel : il ne répond pas à vos clients sur votre numéro et ne connaît pas vos prix. Pour votre entreprise, il faut un chatbot construit sur vos informations, qui peut utiliser un modèle comme GPT ou Claude." },
  { q: "Un chatbot peut-il répondre aux appels WhatsApp ?", a: "La plupart des chatbots WhatsApp ne gèrent que le texte. Wapzen ajoute un agent vocal IA qui décroche les appels WhatsApp, répond avec les mêmes informations et rappelle les nouveaux contacts. Il ne répond pas aux appels d’une ligne fixe classique." },
];

const sources = [
  { label: "Meta : tarifs de la WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Grille EUR au 1er octobre 2026 : FlowCall", href: "https://www.flowcall.co/blog/whatsapp-business-api-pricing" },
  { label: "Tarifs pour la France : Kanal", href: "https://getkanal.com/fr/blog/guide-tarifs-whatsapp-business" },
  { label: "Landbot : tarifs", href: "https://landbot.io/pricing" },
  { label: "Kanal : comparatif des chatbots WhatsApp et offres Kanal", href: "https://getkanal.com/fr/blog/meilleur-chatbot-whatsapp" },
  { label: "Cookiebot : article 50 de l’AI Act en août 2026", href: "https://www.cookiebot.com/en/eu-ai-act-article-50-transparency-compliance/" },
];

const sections = [
  {
    id: "definition",
    title: "Qu’est-ce qu’un chatbot WhatsApp Business ?",
    body: <>
      <p>Un <strong>chatbot WhatsApp Business</strong> est un programme qui répond aux messages que vos clients envoient sur le WhatsApp de votre entreprise, sans qu’un salarié tape la réponse. Il en existe deux familles, et elles n’ont pas grand-chose à voir :</p>
      <Comparison caption="Chatbot à menus et chatbot IA comparés" columns={["Chatbot à menus", "Chatbot IA"]} rows={kinds} />
      <p>Les messages d’accueil et d’absence de l’appli WhatsApp Business ne sont pas des chatbots : ce sont des textes fixes, envoyés quelle que soit la question. Ils font patienter le client, ils ne lui répondent pas.</p>
    </>,
  },
  {
    id: "fonctionnement",
    title: "Comment ça marche : du message du client à la réponse",
    body: <>
      <p>Pour un chatbot IA, le trajet d’un message prend quelques secondes :</p>
      <ol>
        <li><strong>Le client écrit</strong> sur votre numéro WhatsApp : « Vous êtes ouverts dimanche ? Vous livrez à Villeurbanne ? »</li>
        <li><strong>Le message arrive au chatbot</strong>, soit par l’API de Meta, soit parce que le chatbot est connecté à votre numéro comme un appareil, à la manière de WhatsApp Web.</li>
        <li><strong>Le chatbot cherche dans vos informations</strong> les passages utiles : horaires, zones de livraison, tarifs.</li>
        <li><strong>Un modèle d’IA rédige la réponse</strong> en suivant vos consignes : ton, longueur, ce qu’il ne doit jamais promettre.</li>
        <li><strong>La réponse part</strong> sur WhatsApp. Si la demande sort de son rôle, le chatbot le dit et un membre de l’équipe prend le relais.</li>
      </ol>
      <p>La qualité dépend surtout de deux choses que vous maîtrisez : la base de connaissances et les consignes. Un chatbot qui invente est presque toujours un chatbot à qui il manque une information.</p>
    </>,
  },
  {
    id: "trois-facons",
    title: "Les trois façons de créer un chatbot WhatsApp",
    body: <>
      <p>Selon votre budget et vos besoins, trois chemins s’offrent à vous :</p>
      <Comparison caption="Les trois façons de créer un chatbot WhatsApp Business" columns={["API + plateforme", "API + n8n ou Make", "IA sur votre numéro"]} rows={ways} />
      <ul>
        <li><strong>API + plateforme</strong> : vous souscrivez à un fournisseur qui inscrit votre numéro sur l’API et vous donne un outil pour créer le bot et une boîte de réception partagée. C’est la voie des entreprises qui envoient aussi des campagnes.</li>
        <li><strong>API + n8n ou Make</strong> : vous assemblez vous-même le webhook WhatsApp, le modèle d’IA et la base de connaissances. Souple, mais c’est un projet technique (<Link href="/blog/n8n-whatsapp-ai-agent">notre guide n8n, en anglais</Link>).</li>
        <li><strong>IA sur votre numéro</strong> : un outil comme Wapzen se connecte à votre WhatsApp actuel comme appareil, sans inscription à l’API. Vous gardez l’appli et vos conversations, sans frais Meta par réponse, mais sans campagnes de masse.</li>
      </ul>
    </>,
  },
  {
    id: "prix",
    title: "Combien coûte un chatbot WhatsApp en France ?",
    body: <>
      <p>Sur l’API, la facture a deux lignes : les <strong>frais de Meta</strong>, par message, et l’<strong>abonnement à la plateforme</strong>. Voici la grille de Meta en euros pour les numéros français, en vigueur depuis le <strong>1er octobre 2026</strong>, par message livré, avant remises de volume, taxes et frais de la plateforme :</p>
      <Comparison caption="Tarifs Meta par message vers des numéros français au 1er octobre 2026" columns={["Prix par message"]} rows={rates} />
      <p>Depuis le 1er octobre 2026, les réponses d’un chatbot sur l’API ne sont plus gratuites au-delà de 1 000 par mois et par numéro. Exemple : <strong>un restaurant à Lyon</strong> qui reçoit 1 200 conversations par mois, avec environ 4 réponses chacune, envoie 4 800 messages de service. Les 3 800 au-delà du quota coûtent 3 800 × 0,0248 € = <strong>94,24 € par mois</strong> de frais Meta, avant l’abonnement.</p>
      <p>Côté plateformes, deux exemples avec les prix affichés sur leurs propres sites, comparés à Wapzen :</p>
      <Comparison caption="Prix de Landbot, Kanal et Wapzen pour un chatbot WhatsApp" columns={["Landbot", "Kanal", "Wapzen"]} rows={tools} />
      <Note>Les prix des plateformes sont hors taxes et changent souvent. Meta révise sa grille chaque trimestre (1er janvier, avril, juillet et octobre). Vérifiez-les avant de signer.</Note>
    </>,
  },
  {
    id: "regles",
    title: "RGPD et AI Act : les règles à respecter",
    body: <>
      <ul>
        <li><strong>Dites que c’est une IA.</strong> Depuis le 2 août 2026, l’article 50 de l’AI Act impose d’informer vos clients qu’ils échangent avec une IA, sauf si c’est évident. Le Digital Omnibus, qui a repoussé d’autres obligations, n’a pas touché à celle-ci.</li>
        <li><strong>Encadrez vos sous-traitants.</strong> Chaque outil qui traite les messages de vos clients pour vous (plateforme, service d’IA) est un sous-traitant au sens du RGPD : il vous faut un contrat de sous-traitance avec lui.</li>
        <li><strong>Informez vos clients.</strong> Mentionnez WhatsApp et vos outils dans votre politique de confidentialité.</li>
        <li><strong>Pas de marketing sans accord.</strong> Les campagnes ne vont qu’aux contacts qui ont accepté de les recevoir. Meta l’exige aussi, et c’est ce qui protège votre numéro d’un blocage.</li>
        <li><strong>Limitez les données.</strong> Un chatbot qui n’a besoin que d’un nom et d’un créneau ne doit pas demander plus, surtout dans la santé.</li>
      </ul>
      <Note>Cette section est un aperçu, pas un conseil juridique. Pour votre cas, interrogez votre DPO ou consultez les recommandations de la CNIL.</Note>
    </>,
  },
  {
    id: "exemples",
    title: "Exemples de chatbots WhatsApp par secteur",
    body: <>
      <ul>
        <li><strong>Restaurant</strong> : horaires, menu du jour, zones de livraison, demandes de réservation enregistrées pour l’équipe.</li>
        <li><strong>Boutique en ligne</strong> : délais de livraison, retours, tailles. Le suivi d’une commande demande un outil relié à votre boutique par API.</li>
        <li><strong>Cabinet médical ou dentaire</strong> : horaires, tarifs, documents à apporter, demandes de rendez-vous. Jamais de conseil médical : les urgences sont renvoyées vers le 15.</li>
        <li><strong>Artisan</strong> : zones d’intervention, délais, prise d’informations pour un devis, pendant que vous êtes sur le chantier.</li>
        <li><strong>Agence immobilière</strong> : questions sur les annonces à partir de vos fiches, qualification des acheteurs, demandes de visite.</li>
      </ul>
    </>,
  },
  {
    id: "creer",
    title: "Créer un chatbot WhatsApp IA en 5 étapes",
    body: <>
      <p>Avec Wapzen, la mise en route prend quelques minutes, sur le numéro que vos clients connaissent déjà :</p>
      <Steps items={steps} />
      <InlineCta title="Votre chatbot WhatsApp, sur votre numéro actuel" body="Créez un agent IA, ajoutez vos informations et connectez votre numéro par QR code. Il répond tout de suite, sans frais Meta par message." label="Commencer gratuitement" />
      <p>Ses limites, en toute transparence : Wapzen n’est pas un produit de Meta. Il répond aux messages individuels, pas aux groupes, et ne lit pas les photos ni les messages vocaux. Il n’envoie pas de campagnes. Comme appareil connecté, ses serveurs lisent chaque message reçu et l’envoient à un modèle d’IA pour rédiger la réponse : prévenez vos clients qu’un assistant répond en premier.</p>
      <Choose locale="fr" items={[
        { name: "une plateforme sur l’API", points: ["vous envoyez des campagnes à des milliers de contacts", "une grande équipe partage la même boîte de réception", "WhatsApp doit être relié à votre CRM ou à votre boutique"] },
        { name: "Wapzen", points: ["vous voulez surtout répondre plus vite aux questions de vos clients", "vous préférez garder votre numéro et l’appli WhatsApp", "vous voulez aussi répondre aux appels WhatsApp"] },
      ]} />
    </>,
  },
];

export default function ChatbotWhatsAppBusinessPage() {
  return <BlogPost
    href={href}
    heading={<>Chatbot WhatsApp Business.<br /><span>Fonctionnement, prix, solutions.</span></>}
    lead="Ce qu’est vraiment un chatbot WhatsApp Business, comment il répond à vos clients, les trois façons d’en créer un, ce qu’il coûte en France depuis le 1er octobre 2026 et les règles de l’AI Act à respecter."
    summary={{
      title: "En bref",
      items: [
        <><strong>Deux familles :</strong> le chatbot à menus suit des parcours fixes ; le chatbot IA comprend les questions et répond avec vos informations.</>,
        <><strong>Prix en France :</strong> sur l’API, 0,0712 € le message marketing et 0,0248 € le message utilitaire, plus un abonnement, souvent de 89 € à 160 € par mois.</>,
        <><strong>Obligation :</strong> depuis le 2 août 2026, le chatbot doit dire qu’il est une IA (AI Act, article 50).</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/what-is-a-whatsapp-chatbot", "/blog/n8n-whatsapp-ai-agent"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Un chatbot IA sur votre WhatsApp.<br /><span>En quelques minutes.</span></>, body: "Créez votre agent, ajoutez vos informations et connectez votre numéro. Gratuit pour démarrer, sans carte bancaire." }}
  />;
}
