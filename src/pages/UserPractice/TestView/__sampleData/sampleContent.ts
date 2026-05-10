// src/components/test/sampleData/sampleContent.ts

// ═══════════════════════════════════════════════════════════
// SAMPLE CONTENT — placeholder text for each layout type
// In production, this comes from your API/database
// ═══════════════════════════════════════════════════════════

export const SAMPLE_PASSAGES = {
  listening: {
    L01: "Un annuncio alla stazione ferroviaria riguardo ai treni in partenza e in arrivo, con informazioni su ritardi e cambi di binario.",
    L02: "Una conversazione tra due amici che parlano dei loro piani per il fine settimana e delle attività disponibili in città.",
    L03: "Cinque brevi messaggi telefonici lasciati in segreteria da diverse persone.",
  },
  reading: {
    R01: `L'inquinamento ambientale è uno dei problemi più gravi del nostro tempo. 
Ogni giorno, milioni di tonnellate di rifiuti vengono prodotti nelle città italiane. 
Il riciclo è diventato una pratica fondamentale per ridurre l'impatto sull'ambiente. 
Molte città hanno introdotto la raccolta differenziata obbligatoria, che permette di 
separare carta, plastica, vetro e rifiuti organici. Secondo recenti studi, le città 
che hanno adottato questi programmi hanno ridotto i rifiuti in discarica del 40%.
I cittadini possono contribuire anche riducendo l'uso di plastica monouso e 
scegliendo prodotti con meno imballaggi.`,
    R02: `A) Il turismo sostenibile in Italia sta crescendo rapidamente...
B) Le nuove tecnologie per il risparmio energetico domestico...
C) L'importanza dell'alimentazione biologica per la salute...
D) I trasporti pubblici nelle città italiane del futuro...
E) La protezione degli animali selvatici nelle riserve naturali...`,
    R03: `Roma è la capitale d'Italia e conta circa 2,8 milioni di abitanti. 
La città è famosa per i suoi monumenti storici come il Colosseo, il Pantheon e 
la Fontana di Trevi. Ogni anno, Roma accoglie più di 10 milioni di turisti 
da tutto il mondo. Il sistema di trasporti pubblici include due linee di 
metropolitana e numerose linee di autobus. La cucina romana è conosciuta per 
piatti come la carbonara, l'amatriciana e il cacio e pepe.`,
  },
};

export const SAMPLE_MCQ_QUESTIONS = {
  L01: [
    { question: "A che ora parte il prossimo treno per Milano?", options: ["Alle 10:30", "Alle 11:15", "Alle 12:00"] },
    { question: "Da quale binario parte il treno?", options: ["Binario 3", "Binario 7", "Binario 12"] },
    { question: "Qual è il motivo del ritardo?", options: ["Lavori sulla linea", "Maltempo", "Guasto tecnico"] },
    { question: "Cosa devono fare i passeggeri per Firenze?", options: ["Aspettare al binario", "Cambiare treno a Bologna", "Prendere l'autobus"] },
    { question: "Quanto dura il viaggio?", options: ["2 ore", "3 ore e mezza", "4 ore"] },
    { question: "Quale servizio è disponibile sul treno?", options: ["Ristorante", "Wi-Fi gratuito", "Cinema"] },
  ],
  L02: [
    { question: "Cosa propone Marco per sabato?", options: ["Andare al cinema", "Fare una gita al lago", "Visitare un museo", "Restare a casa"] },
    { question: "Perché Laura rifiuta la prima proposta?", options: ["Costa troppo", "Ha già un impegno", "Non le interessa", "È troppo lontano"] },
    { question: "Dove decidono di pranzare?", options: ["In pizzeria", "Al ristorante cinese", "A casa di Marco", "Al bar del centro"] },
    { question: "Chi si unirà a loro domenica?", options: ["I colleghi di Laura", "La famiglia di Marco", "I loro amici del corso", "Nessun altro"] },
    { question: "A che ora si incontreranno?", options: ["Alle 9:00", "Alle 10:30", "Alle 12:00", "Alle 14:00"] },
  ],
  R01: [
    { question: "Qual è il problema principale discusso nel testo?", options: ["La crisi economica", "L'inquinamento ambientale", "La disoccupazione", "Il traffico urbano"] },
    { question: "Di quanto si sono ridotti i rifiuti in discarica?", options: ["Del 20%", "Del 30%", "Del 40%", "Del 50%"] },
    { question: "Cosa prevede la raccolta differenziata?", options: ["Bruciare i rifiuti", "Separare i materiali", "Esportare i rifiuti", "Ridurre la produzione"] },
    { question: "Quante tonnellate di rifiuti vengono prodotte?", options: ["Migliaia", "Centinaia", "Milioni", "Miliardi"] },
    { question: "Cosa possono fare i cittadini?", options: ["Produrre più rifiuti", "Ridurre l'uso di plastica", "Ignorare il problema", "Comprare più prodotti"] },
    { question: "La raccolta differenziata è...", options: ["Facoltativa ovunque", "Obbligatoria in molte città", "Solo per le aziende", "Solo nelle grandi città"] },
  ],
  G01: [
    { question: "Ieri Maria _____ al supermercato.", options: ["va", "è andata", "andava", "andrà"] },
    { question: "Se io _____ più tempo, viaggerei di più.", options: ["ho", "avevo", "avessi", "avrò"] },
    { question: "I bambini _____ giocando nel parco.", options: ["sono", "stanno", "hanno", "fanno"] },
    { question: "Non mi piace _____ il caffè è troppo amaro.", options: ["perché", "quindi", "ma", "oppure"] },
    { question: "_____ vai stasera?", options: ["Chi", "Dove", "Quando", "Quale"] },
    { question: "Ho comprato _____ libro molto interessante.", options: ["uno", "un", "il", "lo"] },
    { question: "Maria è più alta _____ suo fratello.", options: ["di", "che", "da", "con"] },
    { question: "Domani _____ bel tempo.", options: ["fa", "farà", "faceva", "farebbe"] },
  ],
};

export const SAMPLE_MATCHING_ITEMS = {
  L03: {
    items: [
      "Messaggio 1: Una donna chiede informazioni su un corso di cucina.",
      "Messaggio 2: Un uomo prenota un tavolo al ristorante per venerdì.",
      "Messaggio 3: Una ragazza conferma la sua partecipazione alla festa.",
      "Messaggio 4: Un signore chiede di spostare un appuntamento dal medico.",
      "Messaggio 5: Una donna ordina dei fiori per un compleanno.",
    ],
    options: [
      "A) Ristorante 'Da Giovanni'",
      "B) Studio medico Rossi",
      "C) Scuola di cucina 'Il Buongustaio'",
      "D) Fioreria 'Bella Rosa'",
      "E) Organizzazione eventi 'FestaPiù'",
      "F) Palestra 'FitLife'",
    ],
  },
  R02: {
    items: [
      "Paragrafo 1: Parla di come i visitatori possono rispettare la natura durante le vacanze.",
      "Paragrafo 2: Descrive i pannelli solari e le pompe di calore per le case.",
      "Paragrafo 3: Spiega i benefici di mangiare frutta e verdura senza pesticidi.",
      "Paragrafo 4: Presenta i progetti per tram e metropolitane nelle città.",
      "Paragrafo 5: Racconta il lavoro dei volontari nelle riserve.",
    ],
    options: [
      "A) Il turismo sostenibile",
      "B) Tecnologie per il risparmio energetico",
      "C) Alimentazione biologica",
      "D) Trasporti pubblici del futuro",
      "E) Protezione degli animali selvatici",
      "F) Sport e salute mentale",
    ],
  },
};

export const SAMPLE_TRUE_FALSE_STATEMENTS = {
  R03: [
    "Roma ha più di 3 milioni di abitanti.",
    "Il Colosseo si trova a Roma.",
    "Roma accoglie circa 5 milioni di turisti all'anno.",
    "La metropolitana di Roma ha due linee.",
    "La carbonara è un piatto tipico napoletano.",
  ],
};

export const SAMPLE_GAP_FILL_SENTENCES = {
  G02: [
    { before: "La settimana scorsa sono", after: "al cinema con i miei amici.", hint: "(andare)" },
    { before: "Se", after: "bel tempo, andremo al mare.", hint: "(fare)" },
    { before: "Maria non", after: "ancora arrivata.", hint: "(essere)" },
    { before: "I ragazzi", after: "studiando per l'esame.", hint: "(stare)" },
    { before: "Non mi piace", after: "la mattina presto.", hint: "(alzarsi)" },
    { before: "Ieri", after: "molto freddo.", hint: "(fare)" },
    { before: "Quando ero piccolo,", after: "sempre al parco.", hint: "(giocare)" },
    { before: "Se avessi più soldi,", after: "una casa al mare.", hint: "(comprare)" },
  ],
};

export const SAMPLE_TRANSFORMATION_SENTENCES = {
  G03: [
    { original: "Non ho potuto venire alla festa perché ero malato.", keyword: "CAUSA", hint: "Use 'a causa di'" },
    { original: "Marco è più alto di tutti i suoi compagni.", keyword: "PIÙ", hint: "Use superlativo" },
    { original: "Ho iniziato a studiare italiano tre anni fa.", keyword: "DA", hint: "Use 'studio... da'" },
    { original: "Se non piove, andremo al parco.", keyword: "A MENO CHE", hint: "Use congiuntivo" },
    { original: "Laura mi ha detto: 'Vengo domani'.", keyword: "CHE", hint: "Use discorso indiretto" },
    { original: "È necessario che tutti partecipino.", keyword: "BISOGNA", hint: "Use forma impersonale" },
  ],
};

export const SAMPLE_ERROR_SENTENCES = {
  G04: [
    { sentence: "Ieri io ho andato al supermercato per comprare il latte.", error: "ho andato", correction: "sono andato" },
    { sentence: "Maria e Luigi è partiti per le vacanze stamattina.", error: "è partiti", correction: "sono partiti" },
    { sentence: "Non mi piace le persone che parlano troppo forte.", error: "piace", correction: "piacciono" },
    { sentence: "Se avrei più tempo, studierei il francese.", error: "avrei", correction: "avessi" },
    { sentence: "Ho comprato un libro molto interessante in la libreria.", error: "in la", correction: "nella" },
    { sentence: "I miei genitori mi hanno detto di non uscendo stasera.", error: "uscendo", correction: "uscire" },
    { sentence: "Questa è la ragazza che il suo padre lavora in banca.", error: "che il suo", correction: "il cui" },
    { sentence: "Domani devo comprare qualcosa cose per la cena.", error: "qualcosa cose", correction: "alcune cose" },
  ],
};

export const SAMPLE_WRITING_PROMPTS = {
  W01: {
    prompt: "Il tuo comune ha deciso di creare un nuovo parco pubblico nel tuo quartiere. Scrivi una lettera al sindaco in cui:",
    points: [
      "Esprimi la tua opinione sul progetto",
      "Suggerisci quali servizi dovrebbe avere il parco",
      "Spiega come il parco potrebbe migliorare la vita del quartiere",
    ],
  },
  W02: {
    prompt: "Hai appena partecipato a un corso interessante. Scrivi un'email a un amico in cui:",
    points: [
      "Descrivi il corso che hai frequentato",
      "Spiega cosa hai imparato",
      "Consiglia al tuo amico di partecipare",
    ],
  },
};

export const SAMPLE_SPEAKING_PROMPTS = {
  S01: {
    scenario: "Immagina di essere a una cena con amici stranieri. Parla dell'importanza della protezione dell'ambiente nella tua vita quotidiana. Descrivi cosa fai per aiutare l'ambiente e cosa pensi che il governo dovrebbe fare.",
  },
  S02: {
    scenario: "Guarda l'immagine e descrivila. Poi parla di come questa scena si collega al tema dell'ambiente nella tua esperienza personale.",
    imageUrl: undefined, // placeholder — Cloudinary URL goes here
  },
};