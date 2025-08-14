// Auto-generated modules data for Calculations page
// Types
export type NoteField = "td" | "tp" | "exam" | "cc";

export interface ModuleDef {
  code: string;
  name: string;
  coeff: number;
  credit: number;
  has_td: boolean;
  has_tp: boolean;
  has_cc: boolean;
  has_exam: boolean;
}

export interface UEDef {
  ue: string;
  type: string;
  credit: number;
  coeff: number;
  modules: ModuleDef[];
}

export type SemesterData = UEDef[]; // array of UEs
export interface ProgramData {
  [semester: number]: SemesterData; // 1 | 2
}

export type ProgramKey =
  | "L1"
  | "L2"
  | "L3-ISIL"
  | "L3-SI"
  | "M1-IA"
  | "M1-SID"
  | "M1-RSID"
  | "M2-IA"
  | "M2-SID"
  | "M2-RSID";


export type ProgramsMap = Record<ProgramKey, ProgramData>;

// Data provided by user (transformed to a unified map)

export const programsData: Partial<ProgramsMap> = {
  L1: {
    1: [
      {
        ue: "UF 1",
        type: "UE Fondamentale 1",
        credit: 11,
        coeff: 7,
        modules: [
          { code: "ANALYSE1", name: "Analyse 1", coeff: 4, credit: 6, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "ALGEBRE1", name: "Algèbre 1", coeff: 3, credit: 5, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UF 2",
        type: "UE Fondamentale 2",
        credit: 11,
        coeff: 7,
        modules: [
          { code: "ASD1", name: "Algorithmique et structure de données 1", coeff: 4, credit: 6, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "SM1", name: "Structure machine 1", coeff: 3, credit: 5, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UM",
        type: "UE Méthodologie",
        credit: 4,
        coeff: 2,
        modules: [
          { code: "TIC", name: "Terminologie Scientifique et expression écrite", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
          { code: "LANG1", name: "Langue Etrangère 1", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
      {
        ue: "UD",
        type: "UE Découverte",
        credit: 2,
        coeff: 4,
        modules: [
          { code: "PHYS1", name: "Physique 1", coeff: 2, credit: 4, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
    ],
    2: [
      {
        ue: "UF1",
        type: "UE Fondamentale 1",
        credit: 10,
        coeff: 6,
        modules: [
          { code: "ANALYSE2", name: "Analyse 2", coeff: 4, credit: 6, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "ALGEBRE2", name: "Algèbre 2", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UF2",
        type: "UE Fondamentale 2",
        credit: 10,
        coeff: 6,
        modules: [
          { code: "ASD2", name: "Algorithmique et structure de données 2", coeff: 4, credit: 6, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "SM2", name: "Structure machine 2", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UM",
        type: "UE Méthodologie",
        credit: 7,
        coeff: 4,
        modules: [
          { code: "IPSD", name: "Introduction aux probabilités et statistiques descriptive", coeff: 2, credit: 3, has_td: true, has_tp: false, has_cc: false, has_exam: true },
          { code: "TECH1", name: "Technologie de l'Information et de la Communication", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
          { code: "OPM", name: "Outils de probabilités pour l'Informatique", coeff: 1, credit: 2, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UD",
        type: "UE Découverte",
        credit: 3,
        coeff: 2,
        modules: [
          { code: "PHYS2", name: "Physique 2", coeff: 2, credit: 3, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
    ],
  },
  "L2": {
    1: [
      {
        ue: "UF1",
        type: "UE Fondamentale 1",
        credit: 11,
        coeff: 6,
        modules: [
          { code: "AO", name: "Architecture des ordinateurs", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "ASD3", name: "Algorithmique et structures de données 3", coeff: 3, credit: 6, has_td: true, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UF2",
        type: "UE Fondamentale 2",
        credit: 9,
        coeff: 5,
        modules: [
          { code: "SI", name: "Systèmes d'information", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "THG", name: "Théorie des graphes", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UM",
        type: "UE Méthodologie",
        credit: 8,
        coeff: 4,
        modules: [
          { code: "MN", name: "Méthodes Numériques", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: false, has_exam: true },
          { code: "LM", name: "Logique mathématique", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: false, has_exam: true },
        ],
      },
      {
        ue: "UD",
        type: "UE Découverte",
        credit: 1,
        coeff: 1,
        modules: [
          { code: "ANGLAIS3", name: "Anglais 3", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
    ],
    2: [
      {
        ue: "UF1",
        type: "UE Fondamentale 1",
        credit: 10,
        coeff: 5,
        modules: [
          { code: "THL", name: "Théorie des langages", coeff: 2, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "SE1", name: "Systèmes d'exploitation 1", coeff: 3, credit: 5, has_td: false, has_tp: true, has_cc: false, has_exam: true },
        ],
      },
      {
        ue: "UF2",
        type: "UE Fondamentale 2",
        credit: 10,
        coeff: 6,
        modules: [
          { code: "BD", name: "Bases de données", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "RESEAUX", name: "Réseaux", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UM",
        type: "UE Méthodologie",
        credit: 8,
        coeff: 4,
        modules: [
          { code: "POO", name: "Programmation orientée objet", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
          { code: "DWEB", name: "Développement d'applications web", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UD",
        type: "UE Découverte",
        credit: 1,
        coeff: 1,
        modules: [
          { code: "ANGLAIS3", name: "Anglais 3", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
    ],
  },
  "L3-ISIL": {
    1: [
      {
        ue: "UF1",
        type: "UE Fondamentale 1",
        credit: 10,
        coeff: 6,
        modules: [
          { code: "SID", name: "Systèmes d'Information distribué", coeff: 4, credit: 6, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "SAD", name: "Systèmes d'aide à la décision", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UF2",
        type: "UE Fondamentale 2",
        credit: 10,
        coeff: 6,
        modules: [
          { code: "GL", name: "Génie Logiciel", coeff: 4, credit: 6, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "IHM", name: "Interfaces Homme-Machine", coeff: 2, credit: 4, has_td: true, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UM",
        type: "UE Méthodologie",
        credit: 8,
        coeff: 4,
        modules: [
          { code: "ASI", name: "Administration des Systèmes d'information", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "PWEB", name: "Programmation orientée objet web", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UD",
        type: "UE Découverte",
        credit: 1,
        coeff: 1,
        modules: [
          { code: "ENVS", name: "Economie et numérique et veille stratégique", coeff: 1, credit: 2, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
    ],
    2: [
      {
        ue: "UF1",
        type: "UE Fondamentale 1",
        credit: 10,
        coeff: 6,
        modules: [
          { code: "RI", name: "Recherche d'information", coeff: 3, credit: 5, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "SECU2", name: "Sécurité Informatique", coeff: 3, credit: 5, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UF2",
        type: "UE Fondamentale 2",
        credit: 10,
        coeff: 6,
        modules: [
          { code: "DSS", name: "Données semi structurées", coeff: 3, credit: 5, has_td: false, has_tp: true, has_cc: true, has_exam: true },
          { code: "SE2", name: "Systèmes d!exploitation 2", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UM",
        type: "UE Méthodologie",
        credit: 9,
        coeff: 9,
        modules: [
          { code: "PFE", name: "Projet", coeff: 3, credit: 6, has_td: false, has_tp: false, has_cc: false, has_exam: true },
          { code: "BI", name: "Business Intelligence", coeff: 1, credit: 2, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UD",
        type: "UE Découverte",
        credit: 1,
        coeff: 1,
        modules: [
          { code: "RS", name: "Réduction Scientifique", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
    ],
  },
  "L3-SI": {
    1: [
      {
        ue: "UF1",
        type: "UE Fondamentale 1",
        credit: 10,
        coeff: 6,
        modules: [
          { code: "SE2", name: "Systèmes d!exploitation 2", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "COMPIL", name: "Compilation", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UF2",
        type: "UE Fondamentale 2",
        credit: 10,
        coeff: 6,
        modules: [
          { code: "GL", name: "Génie Logiciel", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "IHM", name: "Interfaces Homme-Machine", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UM",
        type: "UE Méthodologie",
        credit: 8,
        coeff: 4,
        modules: [
          { code: "PROGAV", name: "Programmation Avancée", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "PROBA", name: "Probabilités", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UD",
        type: "UE Découverte",
        credit: 1,
        coeff: 1,
        modules: [
          { code: "ENVS", name: "Economie et numérique et veille stratégique", coeff: 1, credit: 2, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
    ],
    2: [
      {
        ue: "UF1",
        type: "UE Fondamentale 1",
        credit: 10,
        coeff: 6,
        modules: [
          { code: "APM", name: "Applications Mobiles", coeff: 3, credit: 5, has_td: false, has_tp: true, has_cc: true, has_exam: true },
          { code: "SI", name: "Sécurité Informatique", coeff: 3, credit: 5, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UF",
        type: "UE Fondamentale",
        credit: 10,
        coeff: 6,
        modules: [
          { code: "IA", name: "Intelligence Artificielle", coeff: 3, credit: 5, has_td: false, has_tp: true, has_cc: true, has_exam: true },
          { code: "DONNEES", name: "Données web & sémantique", coeff: 3, credit: 5, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UM",
        type: "UE Méthodologie",
        credit: 9,
        coeff: 9,
        modules: [
          { code: "PFE", name: "Projet", coeff: 3, credit: 6, has_td: false, has_tp: false, has_cc: false, has_exam: true },
          { code: "RS", name: "Réduction Scientifique", coeff: 1, credit: 2, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UD",
        type: "UE Découverte",
        credit: 1,
        coeff: 1,
        modules: [
          { code: "CS", name: "Créer une start-up", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
    ],
  },
  "M1-IA": {
    1: [
      {
        ue: "UF111",
        type: "UE Fondamentale",
        credit: 12,
        coeff: 12,
        modules: [
          { code: "AND", name: "Analyse de données", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "MODSIM", name: "Modélisation et Simulation", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
          { code: "ROC", name: "Recherche opérationnelle et combinatoire", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UF112",
        type: "UE Fondamentale",
        credit: 6,
        coeff: 6,
        modules: [
          { code: "AA", name: "Apprentissage Automatique", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
          { code: "FLI", name: "Fondements logiques pour l'informatique", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
          { code: "TNS", name: "Traitement Numérique du Signal", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
      {
        ue: "UM111",
        type: "UE Méthodologie",
        credit: 9,
        coeff: 9,
        modules: [
          { code: "BDDA", name: "Bases de Données", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "ASR", name: "Algorithmiques et Systèmes Répartis", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UD111",
        type: "UE Découverte",
        credit: 1,
        coeff: 1,
        modules: [
          { code: "OIRS", name: "Outils de rédaction scientifique", coeff: 1, credit: 1, has_td: true, has_tp: true, has_cc: true, has_exam: false },
        ],
      },
      {
        ue: "UT111",
        type: "UE Transversales",
        credit: 2,
        coeff: 2,
        modules: [
          { code: "SFAP", name: "Sémantique Formelle et analyse des programmes", coeff: 2, credit: 2, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
    ],
    2: [
      {
        ue: "UF121",
        type: "UE Fondamentales",
        credit: 10,
        coeff: 10,
        modules: [
          { code: "TP", name: "Traitement de la Parole", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
          { code: "TALN", name: "Traitement Automatique du Langage naturel", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "TI", name: "Théorie de l'Information ", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
      {
        ue: "UF122",
        type: "UE Fondamentales",
        credit: 8,
        coeff: 8,
        modules: [
          { code: "GA", name: "Géométrie Algorithmique", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "VA", name: "Vision Artificielle", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UM121",
        type: "UE Méthodologie",
        credit: 9,
        coeff: 9,
        modules: [
          { code: "TIma", name: "Traitement d'Images", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
          { code: "M3D", name: "Modélisation 3D", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UD121",
        type: "UE Découverte",
        credit: 2,
        coeff: 2,
        modules: [
          { code: "ASMA", name: "Agents et systèmes Multi agents", coeff: 2, credit: 2, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UT121",
        type: "UE Transversales",
        credit: 1,
        coeff: 1,
        modules: [
          { code: "RF", name: "Reconnaissance des Formes", coeff: 1, credit: 1, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
    ],
  },
  "M1-SID": {
    1: [
      {
        ue: "UF311",
        type: "UE Fondamentales",
        credit: 12,
        coeff: 12,
        modules: [
          { code: "AND", name: "Analyse de données", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "MODSIM", name: "Modélisation et Simulation", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
          { code: "ROC", name: "Recherche opérationnelle et combinatoire", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UF312",
        type: "UE Fondamentales",
        credit: 6,
        coeff: 6,
        modules: [
          { code: "AA", name: "Apprentissage Automatique", coeff: 2, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
          { code: "FLI", name: "Fondements logiques pour l'informatique", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
          { code: "SFSI", name: "Spécification Formelle des SI", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
      {
        ue: "UM311",
        type: "UE Méthodologie",
        credit: 9,
        coeff: 9,
        modules: [
          { code: "BDDA", name: "Bases de Données Avancées", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "ASR", name: "Algorithmiques et Systèmes Répartis", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UD311",
        type: "UE Découverte",
        credit: 1,
        coeff: 1,
        modules: [
          { code: "OIRS", name: "Outils pour la rédaction scientifique", coeff: 1, credit: 1, has_td: true, has_tp: true, has_cc: true, has_exam: false },
        ],
      },
      {
        ue: "UT311",
        type: "UE Transversales",
        credit: 2,
        coeff: 2,
        modules: [
          { code: "SFAP", name: "Sémantique Formelle et analyse des programmes", coeff: 2, credit: 2, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
    ],
    2: [
      {
        ue: "UF321",
        type: "UE Fondamentales",
        credit: 10,
        coeff: 10,
        modules: [
          { code: "SQDL", name: "Sécurité et qualité des Données et Logiciels", coeff: 3, credit: 6, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "CC", name: "CloudComputing", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UF322",
        type: "UE Fondamentales",
        credit: 8,
        coeff: 8,
        modules: [
          { code: "ASMA", name: "Agents et systèmes Multi agents", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "IM", name: "Ingénierie des Modèles", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UM321",
        type: "UE Méthodologie",
        credit: 9,
        coeff: 9,
        modules: [
          { code: "BDMED", name: "Bases de données multidimensionnelles et ent de données", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "GI", name: "Grilles Informatiques", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UD321",
        type: "UE Découverte",
        credit: 1,
        coeff: 1,
        modules: [
          { code: "OIE", name: "Optimisation industriels et économiques", coeff: 1, credit: 1, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
      {
        ue: "UT321",
        type: "UE Transversales",
        credit: 2,
        coeff: 2,
        modules: [
          { code: "TJ", name: "Théorie des Jeux", coeff: 2, credit: 2, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
    ],
  },
  "M1-RSID": {
    1: [
      {
        ue: "UF211",
        type: "UE Fondamentales",
        credit: 12,
        coeff: 12,
        modules: [
          { code: "AND", name: "Analyse de données", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "MODSIM", name: "Modélisation et Simulation", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
          { code: "ROC", name: "Recherche opérationnelle et combinatoire", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UF212",
        type: "UE Fondamentales",
        credit: 6,
        coeff: 6,
        modules: [
          { code: "AA", name: "Apprentissage Automatique", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
          { code: "FLI", name: "Fondements logiques pour l'informatique", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
          { code: "TNS", name: "Traitement Numérique du Signal", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
      {
        ue: "UM211",
        type: "UE Méthodologie",
        credit: 9,
        coeff: 9,
        modules: [
          { code: "BD", name: "Bases de Données", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "ASR", name: "Algorithmiques et Systèmes Répartis", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UD211",
        type: "UE Découverte",
        credit: 1,
        coeff: 1,
        modules: [
          { code: "OIRS", name: "Outils pour la rédaction scientifique", coeff: 1, credit: 1, has_td: true, has_tp: true, has_cc: true, has_exam: false },
        ],
      },
      {
        ue: "UT211",
        type: "UE Transversales",
        credit: 2,
        coeff: 2,
        modules: [
          { code: "SFAP", name: "Sémantique Formelle et analyse des programmes", coeff: 2, credit: 2, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
    ],
    2: [
      {
        ue: "UF221",
        type: "UE Fondamentales",
        credit: 10,
        coeff: 10,
        modules: [
          { code: "TSE", name: "Technologie des Systèmes Embarqués", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "GC", name: "Grille de calcul", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
          { code: "GRCP", name: "Gestion des Réseaux et Contrôle par Politique", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
      {
        ue: "UF222",
        type: "UE Fondamentales",
        credit: 8,
        coeff: 8,
        modules: [
          { code: "ASMA", name: "Agents et systèmes Multiagents", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "PAP", name: "Programmation et Architectures Parallèles", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UM221",
        type: "UE Méthodologie",
        credit: 9,
        coeff: 9,
        modules: [
          { code: "SR", name: "Sécurité Réseaux", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "RH", name: "Réseaux hertziens", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UD221",
        type: "UE Découverte",
        credit: 1,
        coeff: 1,
        modules: [
          { code: "OIE", name: "Optimisation industrielle et économique", coeff: 1, credit: 1, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
      {
        ue: "UT221",
        type: "UE Transversales",
        credit: 2,
        coeff: 2,
        modules: [
          { code: "FD", name: "Fondements de la Décision", coeff: 2, credit: 2, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
    ],
  },
  "M2-IA": {
    1: [
      {
        ue: "UF131",
        type: "UE Fondamentales",
        credit: 8,
        coeff: 8,
        modules: [
          { code: "AMRV", name: "Applications multimédias et Réalité virtuelle", coeff: 2, credit: 4, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "CM", name: "Communication Multimédia", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UF132",
        type: "UE Fondamentales",
        credit: 10,
        coeff: 10,
        modules: [
          { code: "BI", name: "Bio-informatique", coeff: 3, credit: 6, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "CAMA", name: "Conception d'applications multimédia animées", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UM131",
        type: "UE Méthodologie",
        credit: 9,
        coeff: 9,
        modules: [
          { code: "IMed", name: "Imagerie médicale", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "ISat", name: "Imagerie Satellitaires", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UD131",
        type: "UE Découverte",
        credit: 1,
        coeff: 1,
        modules: [
          { code: "MP", name: "Management des Projets", coeff: 1, credit: 1, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
      {
        ue: "UT131",
        type: "UE Transversales",
        credit: 2,
        coeff: 2,
        modules: [
          { code: "PeL", name: "Plate-formes e-learning", coeff: 2, credit: 2, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
    ],
    2: [
      {
        ue: "PFE",
        type: "Projet de Fin d'Études",
        credit: 30,
        coeff: 30,
        modules: [
          { code: "PFE", name: "Projet de Fin d'Études", coeff: 30, credit: 30, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
    ],
  },
  "M2-SID": {
    1: [
      {
        ue: "UF331",
        type: "UE Fondamentales",
        credit: 8,
        coeff: 8,
        modules: [
          { code: "FDMS", name: "Fouille de Données et Média Sociaux", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
          { code: "OWS", name: "Ontologie et Web Services", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UF332",
        type: "UE Fondamentales",
        credit: 10,
        coeff: 10,
        modules: [
          { code: "BDSM", name: "Big Data et Systèmes Multi échelles", coeff: 3, credit: 6, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "SIS", name: "Systèmes d'Information Spatiale", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UM331",
        type: "UE Méthodologie",
        credit: 9,
        coeff: 9,
        modules: [
          { code: "IRDM", name: "Indexation et recherche de données multimédia", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
          { code: "DAWS", name: "Développement avec l'Approche Web Services", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UD331",
        type: "UE Découverte",
        credit: 1,
        coeff: 1,
        modules: [
          { code: "MP", name: "Management des Projets", coeff: 1, credit: 1, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
      {
        ue: "UT331",
        type: "UE Transversales",
        credit: 2,
        coeff: 2,
        modules: [
          { code: "PEW", name: "Processus d'Entreprise et Work-Flow", coeff: 2, credit: 2, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
    ],
    2: [
      {
        ue: "PFE",
        type: "Projet de Fin d'Études",
        credit: 30,
        coeff: 30,
        modules: [
          { code: "PFE", name: "Projet de Fin d'Études", coeff: 30, credit: 30, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
    ],
  },
  "M2-RSID": {
    1: [
      {
        ue: "UF231",
        type: "UE Fondamentales",
        credit: 10,
        coeff: 10,
        modules: [
          { code: "SFS", name: "Sureté de Fonctionnement de Systèmes", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "PQCM", name: "Protocoles et QoS communication multimédia", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
          { code: "CM", name: "Communication multimédia", coeff: 1, credit: 2, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
      {
        ue: "UF232",
        type: "UE Fondamentales",
        credit: 8,
        coeff: 8,
        modules: [
          { code: "MFSD", name: "Modèles Formels des Systèmes Distribués", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
          { code: "ASTR", name: "Architecture et Système Temps Réel", coeff: 2, credit: 4, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UM231",
        type: "UE Méthodologie",
        credit: 9,
        coeff: 9,
        modules: [
          { code: "CC", name: "Cloud Computing", coeff: 2, credit: 4, has_td: false, has_tp: true, has_cc: true, has_exam: true },
          { code: "SRA", name: "Systèmes Répartis Avancés", coeff: 3, credit: 5, has_td: true, has_tp: true, has_cc: true, has_exam: true },
        ],
      },
      {
        ue: "UD231",
        type: "UE Découverte",
        credit: 1,
        coeff: 1,
        modules: [
          { code: "MP", name: "Management des Projets", coeff: 1, credit: 1, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
      {
        ue: "UT231",
        type: "UE Transversales",
        credit: 2,
        coeff: 2,
        modules: [
          { code: "RA", name: "Réseaux avancés", coeff: 2, credit: 2, has_td: true, has_tp: false, has_cc: true, has_exam: true },
        ],
      },
    ],
    2: [
      {
        ue: "PFE",
        type: "Projet de Fin d'Études",
        credit: 30,
        coeff: 30,
        modules: [
          { code: "PFE", name: "Projet de Fin d'Études", coeff: 30, credit: 30, has_td: false, has_tp: false, has_cc: false, has_exam: true },
        ],
      },
    ],
  },
};
