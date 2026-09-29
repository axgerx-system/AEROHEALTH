export type Locale = "en" | "fr";

export const messages = {
  en: {
    skip: "Skip to content",
    data: { loading: "Loading research data…", error: "Data is temporarily unavailable.", retry: "Try again", empty: "No records are available.", apiReady: "API CONNECTED · MODEL READY", apiPartial: "API CONNECTED · MODEL UNAVAILABLE", apiUnavailable: "API UNAVAILABLE", samples: "cycles", engine: "Engine", engineCycle: "current cycle", latestReading: "Latest reading", cycle: "Cycle", selectEngine: "SELECT TEST ENGINE", liveEstimate: "LIVE MODEL ESTIMATE / FD001", estimateCaveat: "Model estimate from the simulated FD001 benchmark. It is not a failure-time prediction or maintenance recommendation.", excludedInputs: "EXCLUDED FROM MODEL INPUTS", testProtocol: "OFFICIAL TEST PROTOCOL", scopeLimitations: "RESEARCH LIMITATIONS", modelFeatures: "ENGINEERED FEATURES", validationContext: "FD001 / 80:20 ENGINE HOLDOUT", officialContext: "FD001 / OFFICIAL TEST SET", inferencePath: "INFERENCE PATH / FD001" },
    nav: { platform: "Platform", research: "Research", methodology: "Methodology", researchers: "Researchers", explore: "Explore", open: "Open navigation", close: "Close navigation" },
    hero: {
      eyebrow: "ENGINEERING INTELLIGENCE / FD001",
      title: "Predict what remains.",
      titleAccent: "Understand what changed.",
      description: "A research platform for studying turbofan degradation and estimating remaining useful life from engine telemetry.",
      action: "Explore the research",
      engineLabel: "TURBOFAN / ENGINEERING VISUAL",
      engineSub: "C-MAPSS · FD001 RESEARCH CONTEXT",
      annotation: "ENGINE HISTORY",
      annotationBody: "Telemetry across operating cycles",
      status: "RESEARCH PROTOTYPE",
    },
    flow: { machine: "Machine", signal: "Signal", model: "Model", prediction: "Prediction", research: "Research", researchers: "Researchers", explore: "Explore", progress: "Research story progress" },
    machine: {
      number: "01 / MACHINE", label: "THE SYSTEM", kicker: "A SIMULATED ENGINE. A MEASURABLE HISTORY.",
      title: "Start with the machine.", body: "Aerohealth studies NASA C-MAPSS, a simulated turbofan degradation dataset. The first research scope is FD001: one operating condition and one simulated fault mode.",
      factA: "DATASET", factB: "INITIAL SCOPE", factC: "SIGNALS", factD: "ENGINE HISTORIES", valueA: "NASA C-MAPSS", valueB: "FD001", valueC: "21 sensors", valueD: "100 units",
      detailAlt: "Illustrative close-up of compressor blades and machined metal surfaces", turbineAlt: "Illustrative close-up of turbine blades and the inner casing", compressorCaption: "COMPRESSOR / ILLUSTRATIVE VISUAL", turbineCaption: "TURBINE / ILLUSTRATIVE VISUAL", detailKicker: "COMPRESSOR / HARDWARE DETAIL", detailTitle: "The machine behind the signal.", detailBody: "A visual study of compressor geometry and engineered surfaces. Select a schematic channel marker to follow its feature path; C-MAPSS does not publish physical sensor mounting positions.", sensor: "Sensor channel", schematic: "Schematic control, not a physical sensor location", selectedChannel: "SELECTED CHANNEL", flowEngine: "ENGINE", flowSignal: "SIGNAL", flowFeatures: "FEATURES",
    },
    signal: {
      number: "02 / SIGNAL", label: "THE MEASUREMENTS", kicker: "FROM OPERATION TO OBSERVATION", title: "Every cycle leaves a signal.",
      body: "Three operational settings and 21 sensor measurements describe each simulated engine cycle. The final model uses verified variable sensors and features built only from current and past observations.",
      traceLabel: "MEASURED SENSOR TRACE", traceNote: "FD001 test engine telemetry · measured by cycle", cycleStart: "CYCLE 001", cycleEnd: "OBSERVED HISTORY", callout: "CAUSAL FEATURES", calloutBody: "Past and present observations only", selectSensor: "Select sensor channel", featureMap: "FEATURES FOR SELECTED CHANNEL", modelInput: "MODEL INPUT",
    },
    model: {
      number: "03 / MODEL", label: "THE METHOD", kicker: "A FROZEN, EXAMINABLE REPRESENTATION", title: "78 features. One causal path.",
      body: "The predictive representation combines operating settings, variable sensor values, backward-looking summaries and cycle age. Exploratory relative life is excluded from model inputs.",
      featureLabel: "PREDICTIVE FEATURES", familyA: "settings", familyB: "variable sensors", familyC: "rollmean · 5 cycles", familyD: "rollstd · 5 cycles", familyE: "first difference", familyF: "cycle age", familyG: "trend · 10 cycles", targetLabel: "RUL TARGET", targetValue: "Final cycle − current cycle", modelLabel: "FINAL MODEL", modelValue: "LightGBM quantile regression · α 0.40", splitLabel: "VALIDATION SPLIT", splitValue: "80 / 20 by engine · seed 42",
    },
    prediction: {
      number: "04 / PREDICTION", label: "THE OUTPUT", kicker: "REMAINING USEFUL LIFE", title: "An estimate in operating cycles.",
      body: "Aerohealth estimates remaining cycles for a truncated engine history. It does not determine an exact failure cycle, assess safety or prescribe maintenance.",
      official: "OFFICIAL TEST / FD001", validation: "ENGINE-LEVEL VALIDATION", mae: "MAE", maeHelp: "Average absolute error, in cycles", rmse: "RMSE", rmseHelp: "Larger errors count more, in cycles", phm: "PHM08 SCORE", range: "TEST PREDICTIONS", cycles: "cycles", pathInput: "ENGINE HISTORY", pathInputDetail: "Observed cycles", pathModel: "MODEL", pathModelDetail: "LightGBM · α 0.40", pathOutput: "RUL ESTIMATE", pathOutputDetail: "Remaining cycles", viewResearch: "Read the evaluation context",
    },
    research: {
      number: "05 / RESEARCH", label: "THE EVIDENCE", kicker: "RESULTS WITH THEIR CONTEXT", title: "Evidence before assurance.",
      body: "Reported values belong to specific FD001 splits and metrics. Benchmark results describe this experiment; they are not operational guarantees.",
      validationTitle: "Validation · held-out engines", officialTitle: "Official test · FD001", note: "MAE is the average absolute difference between estimated and true RUL, in cycles. RMSE is also in cycles and gives larger errors more weight. PHM08 adds asymmetric penalties across evaluated engines: lower is better, and late estimates are penalized more heavily. It is a total score, so it can be much larger than the cycle-based errors. Official test targets come from RUL_FD001.txt.",
      limitsTitle: "Interpretation boundary", limits: "Research prototype · simulated data · no safety classification · no maintenance recommendation · no validated uncertainty interval claimed.",
    },
    researchers: {
      number: "06 / RESEARCHERS", label: "THE PEOPLE", kicker: "RESEARCH TEAM", title: "People behind the system.", body: "Aerohealth is a research project built by an identified team. Each profile connects a researcher’s contribution to the FD001 workflow.", profile: "RESEARCHER", role: "ROLE", institution: "INSTITUTION", focus: "RESEARCH FOCUS", contribution: "AEROHEALTH CONTRIBUTION", contact: "Researcher contact links", email: "EMAIL", linkedin: "LINKEDIN",
    },
    explore: {
      number: "07 / EXPLORE", label: "THE PLATFORM", kicker: "FROM RESEARCH TO INTERACTION", title: "Follow the evidence into the interface.",
      body: "Review the dataset scope, feature construction, model setup and evaluation documented in this research overview.",
      action: "Explore methodology",
    },
    footer: { line: "Engineering intelligence for remaining life.", note: "NASA C-MAPSS · FD001 · RESEARCH PROTOTYPE", top: "BACK TO TOP" },
  },
  fr: {
    skip: "Aller au contenu",
    data: { loading: "Chargement des données de recherche…", error: "Les données sont temporairement indisponibles.", retry: "Réessayer", empty: "Aucun enregistrement disponible.", apiReady: "API CONNECTÉE · MODÈLE PRÊT", apiPartial: "API CONNECTÉE · MODÈLE INDISPONIBLE", apiUnavailable: "API INDISPONIBLE", samples: "cycles", engine: "Moteur", engineCycle: "cycle actuel", latestReading: "Dernière mesure", cycle: "Cycle", selectEngine: "CHOISIR UN MOTEUR TEST", liveEstimate: "ESTIMATION DU MODÈLE / FD001", estimateCaveat: "Estimation du modèle sur le benchmark simulé FD001. Ce n’est ni une prédiction exacte de défaillance ni une recommandation de maintenance.", excludedInputs: "EXCLUS DES ENTRÉES DU MODÈLE", testProtocol: "PROTOCOLE DU TEST OFFICIEL", scopeLimitations: "LIMITES DE LA RECHERCHE", modelFeatures: "CARACTÉRISTIQUES INGÉNIÉRÉES", validationContext: "FD001 / VALIDATION 80:20 PAR MOTEUR", officialContext: "FD001 / TEST OFFICIEL", inferencePath: "PARCOURS D’INFÉRENCE / FD001" },
    nav: { platform: "Plateforme", research: "Recherche", methodology: "Méthode", researchers: "Chercheurs", explore: "Explorer", open: "Ouvrir la navigation", close: "Fermer la navigation" },
    hero: {
      eyebrow: "INTELLIGENCE D’INGÉNIERIE / FD001",
      title: "Estimer ce qu’il reste.",
      titleAccent: "Comprendre ce qui change.",
      description: "Une plateforme de recherche pour étudier la dégradation des turbofans et estimer leur durée de vie utile restante à partir de la télémétrie moteur.",
      action: "Explorer la recherche",
      engineLabel: "TURBOFAN / VISUEL D’INGÉNIERIE",
      engineSub: "C-MAPSS · CONTEXTE DE RECHERCHE FD001",
      annotation: "HISTORIQUE MOTEUR",
      annotationBody: "Télémétrie au fil des cycles de fonctionnement",
      status: "PROTOTYPE DE RECHERCHE",
    },
    flow: { machine: "Machine", signal: "Signal", model: "Modèle", prediction: "Prédiction", research: "Recherche", researchers: "Équipe", explore: "Explorer", progress: "Progression du parcours de recherche" },
    machine: {
      number: "01 / MACHINE", label: "LE SYSTÈME", kicker: "UN MOTEUR SIMULÉ. UN HISTORIQUE MESURABLE.",
      title: "Partir de la machine.", body: "Aerohealth étudie C-MAPSS de la NASA, un jeu de données simulant la dégradation d’un turbofan. Le premier périmètre de recherche est FD001 : une condition de fonctionnement et un mode de défaillance simulé.",
      factA: "JEU DE DONNÉES", factB: "PÉRIMÈTRE INITIAL", factC: "SIGNAUX", factD: "HISTORIQUES MOTEUR", valueA: "NASA C-MAPSS", valueB: "FD001", valueC: "21 capteurs", valueD: "100 unités",
      detailAlt: "Gros plan illustratif des aubes du compresseur et des surfaces métalliques usinées", turbineAlt: "Gros plan illustratif des aubes de turbine et du carter intérieur", compressorCaption: "COMPRESSEUR / VISUEL ILLUSTRATIF", turbineCaption: "TURBINE / VISUEL ILLUSTRATIF", detailKicker: "COMPRESSEUR / DÉTAIL MATÉRIEL", detailTitle: "La machine derrière le signal.", detailBody: "Étude visuelle de la géométrie du compresseur et des surfaces techniques. Sélectionnez un repère schématique pour suivre son chemin de caractéristiques ; C-MAPSS ne publie pas les positions physiques de montage des capteurs.", sensor: "Canal capteur", schematic: "Commande schématique, pas une position physique de capteur", selectedChannel: "CANAL SÉLECTIONNÉ", flowEngine: "MOTEUR", flowSignal: "SIGNAL", flowFeatures: "CARACTÉRISTIQUES",
    },
    signal: {
      number: "02 / SIGNAL", label: "LES MESURES", kicker: "DU FONCTIONNEMENT À L’OBSERVATION", title: "Chaque cycle laisse une trace.",
      body: "Trois réglages de fonctionnement et 21 mesures de capteurs décrivent chaque cycle moteur simulé. Le modèle final utilise les capteurs variables vérifiés et des caractéristiques calculées uniquement à partir des observations présentes et passées.",
      traceLabel: "TRACE DE CAPTEUR MESURÉ", traceNote: "Télémétrie du moteur test FD001 · mesures par cycle", cycleStart: "CYCLE 001", cycleEnd: "HISTORIQUE OBSERVÉ", callout: "CARACTÉRISTIQUES CAUSALES", calloutBody: "Observations passées et présentes uniquement", selectSensor: "Sélectionner un capteur", featureMap: "CARACTÉRISTIQUES DU CAPTEUR CHOISI", modelInput: "ENTRÉE DU MODÈLE",
    },
    model: {
      number: "03 / MODÈLE", label: "LA MÉTHODE", kicker: "UNE REPRÉSENTATION FIXÉE ET EXAMINABLE", title: "78 caractéristiques. Une démarche causale.",
      body: "La représentation prédictive combine réglages de fonctionnement, mesures de capteurs variables, statistiques rétrospectives et âge du cycle. La durée de vie relative exploratoire est exclue des entrées du modèle.",
      featureLabel: "CARACTÉRISTIQUES PRÉDICTIVES", familyA: "réglages", familyB: "capteurs variables", familyC: "moyenne mobile · 5 cycles", familyD: "écart-type mobile · 5 cycles", familyE: "première différence", familyF: "âge du cycle", familyG: "tendance · 10 cycles", targetLabel: "CIBLE RUL", targetValue: "Cycle final − cycle actuel", modelLabel: "MODÈLE FINAL", modelValue: "Régression quantile LightGBM · α 0,40", splitLabel: "PARTITION DE VALIDATION", splitValue: "80 / 20 par moteur · graine 42",
    },
    prediction: {
      number: "04 / PRÉDICTION", label: "LA SORTIE", kicker: "DURÉE DE VIE UTILE RESTANTE", title: "Une estimation en cycles de fonctionnement.",
      body: "Aerohealth estime les cycles restants à partir d’un historique moteur tronqué. Il ne détermine pas un cycle exact de défaillance, n’évalue pas la sécurité et ne prescrit pas de maintenance.",
      official: "TEST OFFICIEL / FD001", validation: "VALIDATION PAR MOTEUR", mae: "MAE", maeHelp: "Écart absolu moyen, en cycles", rmse: "RMSE", rmseHelp: "Donne plus de poids aux grandes erreurs, en cycles", phm: "SCORE PHM08", range: "PRÉDICTIONS TEST", cycles: "cycles", pathInput: "HISTORIQUE MOTEUR", pathInputDetail: "Cycles observés", pathModel: "MODÈLE", pathModelDetail: "LightGBM · α 0,40", pathOutput: "ESTIMATION RUL", pathOutputDetail: "Cycles restants", viewResearch: "Lire le contexte d’évaluation",
    },
    research: {
      number: "05 / RECHERCHE", label: "LES ÉLÉMENTS PROBANTS", kicker: "DES RÉSULTATS AVEC LEUR CONTEXTE", title: "Les preuves avant les assurances.",
      body: "Les valeurs rapportées correspondent à des partitions FD001 et à des métriques précises. Ces résultats de référence décrivent l’expérience ; ils ne garantissent pas une performance opérationnelle.",
      validationTitle: "Validation · moteurs réservés", officialTitle: "Test officiel · FD001", note: "La MAE mesure l’écart absolu moyen entre la RUL estimée et la RUL réelle, en cycles. La RMSE s’exprime aussi en cycles et donne plus de poids aux grandes erreurs. Le score PHM08 additionne des pénalités asymétriques sur les moteurs évalués : plus il est faible, mieux c’est, les estimations tardives étant davantage pénalisées. C’est un score total, qui peut donc être beaucoup plus élevé que les erreurs exprimées en cycles. Les cibles du test officiel proviennent de RUL_FD001.txt.",
      limitsTitle: "Limites d’interprétation", limits: "Prototype de recherche · données simulées · aucune classification de sécurité · aucune recommandation de maintenance · aucun intervalle d’incertitude validé revendiqué.",
    },
    researchers: {
      number: "06 / CHERCHEURS", label: "LES PERSONNES", kicker: "ÉQUIPE DE RECHERCHE", title: "Les personnes derrière le système.", body: "Aerohealth est un projet de recherche mené par une équipe identifiée. Chaque profil relie la contribution d’une personne au workflow FD001.", profile: "CHERCHEUR·EUSE", role: "RÔLE", institution: "INSTITUTION", focus: "AXE DE RECHERCHE", contribution: "CONTRIBUTION À AEROHEALTH", contact: "Coordonnées des chercheurs", email: "EMAIL", linkedin: "LINKEDIN",
    },
    explore: {
      number: "07 / EXPLORER", label: "LA PLATEFORME", kicker: "DE LA RECHERCHE À L’INTERACTION", title: "Suivre les preuves jusqu’à l’interface.",
      body: "Parcourez le périmètre du jeu de données, la construction des caractéristiques, le modèle et son évaluation dans cette présentation de la recherche.",
      action: "Explorer la méthodologie",
    },
    footer: { line: "L’intelligence d’ingénierie au service de la durée de vie restante.", note: "NASA C-MAPSS · FD001 · PROTOTYPE DE RECHERCHE", top: "HAUT DE PAGE" },
  },
} as const;

export type Messages = (typeof messages)[Locale];
