import type { Locale } from "@/i18n/messages";

type LocalizedText = Record<Locale, string>;

export type ResearcherProfile = {
  id: string;
  name: string;
  institution: string;
  portrait: string;
  portraitAlt: LocalizedText;
  role: LocalizedText;
  focus: LocalizedText;
  contribution: LocalizedText;
  contactLinks: {
    email?: string[];
    linkedin?: string;
  };
};

const role: LocalizedText = {
  en: "Researcher in Predictive Maintenance & Applied Machine Learning",
  fr: "Chercheuse en maintenance prédictive et apprentissage automatique appliqué",
};

export const researchers: ResearcherProfile[] = [
  {
    id: "researcher-01",
    name: "ABDOUL-AZIZ DJIBO Aïchatou",
    institution: "2iE-International Institute for Water and Environmental Engineering",
    portrait: "/images/researchers/aichatou-profile.png",
    portraitAlt: { en: "ABDOUL-AZIZ DJIBO Aïchatou, Aerohealth researcher", fr: "ABDOUL-AZIZ DJIBO Aïchatou, chercheuse Aerohealth" },
    role,
    focus: {
      en: "Remaining Useful Life estimation from turbofan sensor data, with time-series feature engineering and model evaluation.",
      fr: "Estimation de la durée de vie utile restante à partir de données de capteurs de turbofan, avec ingénierie de caractéristiques temporelles et évaluation du modèle.",
    },
    contribution: {
      en: "Implemented code for the Aerohealth FD001 workflow and validated the RUL model.",
      fr: "A contribué au code du workflow Aerohealth FD001 et à la validation du modèle RUL.",
    },
    contactLinks: {
      email: ["aichatou.djibo@2ie-edu.org", "aichatouabdoulazizdjibo@gmail.com"],
      linkedin: "https://www.linkedin.com/in/aichatou-abdoul-aziz-djibo/",
    },
  },
  {
    id: "researcher-02",
    name: "Mahaman Warsou Laouali Zeinab",
    institution: "2iE-International Institute for Water and Environmental Engineering",
    portrait: "/images/researchers/zeinab-profile.png",
    portraitAlt: { en: "Mahaman Warsou Laouali Zeinab, Aerohealth researcher", fr: "Mahaman Warsou Laouali Zeinab, chercheuse Aerohealth" },
    role,
    focus: {
      en: "Turbofan Remaining Useful Life research, with emphasis on dataset selection and workflow testing.",
      fr: "Recherche sur la durée de vie utile restante des turbofans, axée sur le choix du jeu de données et les essais du workflow.",
    },
    contribution: {
      en: "Identified the NASA C-MAPSS dataset for the project and tested the Aerohealth FD001 research workflow.",
      fr: "A identifié le jeu de données NASA C-MAPSS pour le projet et testé le workflow de recherche Aerohealth FD001.",
    },
    contactLinks: {
      email: ["mahamanwarsoulaoualizeinab@gmail.com", "zeinab.warsou@2ie-edu.org"],
      linkedin: "https://www.linkedin.com/in/zeinab-mahaman-warsou-laouali-124514396",
    },
  },
];
