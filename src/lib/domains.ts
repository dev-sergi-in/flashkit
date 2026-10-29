import { Domain, DomainId } from '@/types'

export const DOMAINS: Domain[] = [
  {
    id: 'immobilier',
    label: 'Immobilier & Terrains',
    promptContext: 'expert en immobilier africain',
    fields: [
      { name: 'nom', label: 'Nom du bien', placeholder: 'Ex: Villa F4 à Cocody', required: true, type: 'text' },
      { name: 'prix', label: 'Prix', placeholder: 'Ex: 45 000 000 FCFA', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Vue dégagée, sécurisé, proche école...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Ville / Quartier', placeholder: 'Ex: Abidjan, Cocody', required: false, type: 'text' },
      { name: 'superficie', label: 'Superficie', placeholder: 'Ex: 200 m² habitable, 500 m² terrain', required: false, type: 'text' },
      { name: 'type_bien', label: 'Type de bien', placeholder: '', required: false, type: 'select', options: ['Villa', 'Appartement', 'Terrain nu', 'Local commercial', 'Immeuble', 'Maison'] },
    ],
  },
  {
    id: 'ecommerce',
    label: 'E-commerce & High-Tech',
    promptContext: 'expert en vente de produits high-tech et e-commerce',
    fields: [
      { name: 'nom', label: 'Nom du produit', placeholder: 'Ex: iPhone 15 Pro Max 256Go', required: true, type: 'text' },
      { name: 'prix', label: 'Prix', placeholder: 'Ex: 850 000 FCFA', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Neuf, garantie 1 an, livraison rapide...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Ville / Zone de livraison', placeholder: 'Ex: Dakar, livraison nationale', required: false, type: 'text' },
      { name: 'etat', label: 'État du produit', placeholder: '', required: false, type: 'select', options: ['Neuf', 'Reconditionné', 'Occasion'] },
      { name: 'marque', label: 'Marque / Référence', placeholder: 'Ex: Apple, Samsung, HP...', required: false, type: 'text' },
    ],
  },
  {
    id: 'automobile',
    label: 'Automobile & Motos',
    promptContext: 'expert en vente de véhicules et motos en Afrique',
    fields: [
      { name: 'nom', label: 'Nom du véhicule', placeholder: 'Ex: Toyota Land Cruiser 2019', required: true, type: 'text' },
      { name: 'prix', label: 'Prix', placeholder: 'Ex: 18 500 000 FCFA', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Faible kilométrage, bien entretenu, climatisé...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Ville', placeholder: 'Ex: Lomé', required: false, type: 'text' },
      { name: 'kilometrage', label: 'Kilométrage', placeholder: 'Ex: 85 000 km', required: false, type: 'text' },
      { name: 'annee', label: 'Année / Transmission', placeholder: 'Ex: 2019, Automatique', required: false, type: 'text' },
    ],
  },
  {
    id: 'services',
    label: 'Services & Prestations',
    promptContext: 'expert en marketing de services professionnels',
    fields: [
      { name: 'nom', label: 'Nom du service', placeholder: 'Ex: Nettoyage industriel, Garde d\'enfants...', required: true, type: 'text' },
      { name: 'prix', label: 'Tarif', placeholder: 'Ex: À partir de 25 000 FCFA / intervention', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Équipe certifiée, disponible 7j/7, résultats garantis...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Zone d\'intervention', placeholder: 'Ex: Abidjan et environs', required: false, type: 'text' },
      { name: 'delai', label: 'Délai / Disponibilité', placeholder: 'Ex: Intervention sous 24h', required: false, type: 'text' },
    ],
  },
  {
    id: 'digital',
    label: 'Formations En Ligne & SaaS',
    promptContext: 'expert en marketing de formations digitales et logiciels SaaS',
    fields: [
      { name: 'nom', label: 'Nom de la formation / du logiciel', placeholder: 'Ex: Formation SEO Avancé, CRM ProGest...', required: true, type: 'text' },
      { name: 'prix', label: 'Prix / Abonnement', placeholder: 'Ex: 49 000 FCFA ou 15 000 FCFA/mois', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Accès à vie, certificat inclus, support WhatsApp...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Accessible depuis', placeholder: 'Ex: Partout dans le monde', required: false, type: 'text' },
      { name: 'niveau', label: 'Niveau / Cible', placeholder: 'Ex: Débutants, entrepreneurs, PME...', required: false, type: 'text' },
      { name: 'duree', label: 'Durée / Modules', placeholder: 'Ex: 8 semaines, 32 vidéos', required: false, type: 'text' },
    ],
  },
  {
    id: 'restauration_evenements',
    label: 'Restauration, Hôtels & Événements',
    promptContext: 'expert en marketing de la restauration et de l\'hôtellerie africaine',
    fields: [
      { name: 'nom', label: 'Nom du plat / de l\'offre', placeholder: 'Ex: Menu Grillades du weekend, Chambre Deluxe...', required: true, type: 'text' },
      { name: 'prix', label: 'Prix / Tarif', placeholder: 'Ex: 8 500 FCFA par personne', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Produits frais locaux, ambiance, service traiteur...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Adresse / Ville', placeholder: 'Ex: Plateau, Abidjan', required: false, type: 'text' },
      { name: 'capacite', label: 'Capacité / Spécialité', placeholder: 'Ex: Salle de 200 personnes, cuisine ivoirienne...', required: false, type: 'text' },
    ],
  },
  {
    id: 'beaute_bienetre',
    label: 'Beauté, Cosmétique & Spas',
    promptContext: 'expert en marketing beauté et bien-être pour la clientèle africaine',
    fields: [
      { name: 'nom', label: 'Nom du produit / soin', placeholder: 'Ex: Crème éclaircissante, Soin kératine...', required: true, type: 'text' },
      { name: 'prix', label: 'Prix / Tarif', placeholder: 'Ex: 12 000 FCFA', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: 100% naturel, résultats visibles en 2 semaines...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Ville / Salon', placeholder: 'Ex: Dakar, Almadies', required: false, type: 'text' },
      { name: 'type_peau', label: 'Type de peau / Usage', placeholder: 'Ex: Peaux noires, mixtes, cheveux crépus...', required: false, type: 'text' },
    ],
  },
  {
    id: 'materiel_pro',
    label: 'Matériel Pro, BTP & Équipements',
    promptContext: 'expert en vente de matériel professionnel et équipements BTP en Afrique',
    fields: [
      { name: 'nom', label: 'Nom de l\'équipement', placeholder: 'Ex: Groupe électrogène 10 KVA, Bétonnière...', required: true, type: 'text' },
      { name: 'prix', label: 'Prix', placeholder: 'Ex: 1 200 000 FCFA', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Robuste, garantie pièces, SAV disponible...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Ville / Dépôt', placeholder: 'Ex: Bamako, Zone Industrielle', required: false, type: 'text' },
      { name: 'marque_ref', label: 'Marque / Référence', placeholder: 'Ex: Honda, Caterpillar, réf. BT2000', required: false, type: 'text' },
      { name: 'etat', label: 'État', placeholder: '', required: false, type: 'select', options: ['Neuf', 'Occasion révisé', 'Reconditionné'] },
    ],
  },
  {
    id: 'education_ecoles',
    label: 'Écoles & Formations Présentielles',
    promptContext: 'expert en marketing éducatif pour les établissements africains',
    fields: [
      { name: 'nom', label: 'Nom de la formation / filière', placeholder: 'Ex: BTS Informatique, Licence Marketing...', required: true, type: 'text' },
      { name: 'prix', label: 'Frais de scolarité', placeholder: 'Ex: 650 000 FCFA / an', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Corps enseignant qualifié, stage garanti, diplôme reconnu...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Ville / Campus', placeholder: 'Ex: Abidjan, Yopougon', required: false, type: 'text' },
      { name: 'duree', label: 'Durée / Niveau requis', placeholder: 'Ex: 2 ans, Bac requis', required: false, type: 'text' },
    ],
  },
  {
    id: 'mode_artisanat',
    label: 'Mode, Sur-Mesure & Artisanat',
    promptContext: 'expert en marketing de la mode africaine et de l\'artisanat',
    fields: [
      { name: 'nom', label: 'Nom de l\'article / collection', placeholder: 'Ex: Robe Kente sur-mesure, Sac en raphia...', required: true, type: 'text' },
      { name: 'prix', label: 'Prix', placeholder: 'Ex: 35 000 FCFA', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Fait main, tissus authentiques, livraison incluse...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Ville / Atelier', placeholder: 'Ex: Accra, Kumasi', required: false, type: 'text' },
      { name: 'matiere', label: 'Matière / Style', placeholder: 'Ex: Coton kente, wax 100% africain, bogolan...', required: false, type: 'text' },
    ],
  },
  {
    id: 'sante_parapharmacie',
    label: 'Santé, Parapharmacie & Bio',
    promptContext: 'expert en marketing santé et parapharmacie pour le marché africain',
    fields: [
      { name: 'nom', label: 'Nom du produit / service', placeholder: 'Ex: Complément fer & vitamines, Consultation diététique...', required: true, type: 'text' },
      { name: 'prix', label: 'Prix / Tarif', placeholder: 'Ex: 7 500 FCFA', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Certifié, sans effets secondaires, recommandé par médecins...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Disponible à', placeholder: 'Ex: Toutes pharmacies de Douala', required: false, type: 'text' },
      { name: 'indication', label: 'Indication / Cible', placeholder: 'Ex: Femmes enceintes, diabétiques, sportifs...', required: false, type: 'text' },
    ],
  },
  {
    id: 'agriculture_agro',
    label: 'Agriculture, Élevage & Agroalimentaire',
    promptContext: 'expert en marketing agricole et agroalimentaire en Afrique',
    fields: [
      { name: 'nom', label: 'Nom du produit / de l\'offre', placeholder: 'Ex: Sac de riz local 50kg, Poulets de chair...', required: true, type: 'text' },
      { name: 'prix', label: 'Prix', placeholder: 'Ex: 22 000 FCFA le sac', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Production locale, sans OGM, stock permanent...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Zone de production / livraison', placeholder: 'Ex: Bouaké, livraison Abidjan possible', required: false, type: 'text' },
      { name: 'quantite', label: 'Quantité disponible / Conditionnement', placeholder: 'Ex: 200 sacs disponibles, vente en gros', required: false, type: 'text' },
    ],
  },
  {
    id: 'voyage_logistique',
    label: 'Voyage, Transport & Transit',
    promptContext: 'expert en marketing du voyage et de la logistique en Afrique',
    fields: [
      { name: 'nom', label: 'Nom de l\'offre', placeholder: 'Ex: Package Zanzibar 5 jours, Transport Abidjan-Dakar...', required: true, type: 'text' },
      { name: 'prix', label: 'Prix / Tarif', placeholder: 'Ex: 450 000 FCFA / personne', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Vol + hôtel inclus, guide francophone, visa facilité...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Départ / Destination', placeholder: 'Ex: Départ Abidjan, destination Dubaï', required: false, type: 'text' },
      { name: 'duree', label: 'Durée / Fréquence', placeholder: 'Ex: 7 jours / 6 nuits, départ chaque vendredi', required: false, type: 'text' },
    ],
  },
  {
    id: 'finance_juridique',
    label: 'Finance, Assurance & Juridique',
    promptContext: 'expert en marketing de services financiers et juridiques en Afrique',
    fields: [
      { name: 'nom', label: 'Nom du produit / service', placeholder: 'Ex: Assurance auto tous risques, Consultation juridique...', required: true, type: 'text' },
      { name: 'prix', label: 'Tarif / Prime', placeholder: 'Ex: À partir de 85 000 FCFA / an', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Remboursement rapide, experts certifiés, disponible 24h/24...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Ville / Zone de couverture', placeholder: 'Ex: Couverture nationale', required: false, type: 'text' },
      { name: 'cible', label: 'Cible / Éligibilité', placeholder: 'Ex: PME, particuliers, fonctionnaires...', required: false, type: 'text' },
    ],
  },
  {
    id: 'sport_fitness',
    label: 'Sport, Fitness & Coaching',
    promptContext: 'expert en marketing du sport et du coaching fitness en Afrique',
    fields: [
      { name: 'nom', label: 'Nom de l\'offre / programme', placeholder: 'Ex: Abonnement salle Gold, Programme Perte de poids 90j...', required: true, type: 'text' },
      { name: 'prix', label: 'Tarif / Abonnement', placeholder: 'Ex: 25 000 FCFA / mois', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Coach certifié, matériel moderne, résultats garantis...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Ville / Salle', placeholder: 'Ex: Cotonou, Quartier Cadjehoun', required: false, type: 'text' },
      { name: 'niveau', label: 'Niveau / Type d\'entraînement', placeholder: 'Ex: Débutants à confirmés, Musculation, Cardio, MMA...', required: false, type: 'text' },
    ],
  },
  {
    id: 'energie_solaire',
    label: 'Énergie Solaire & Électricité',
    promptContext: 'expert en marketing de solutions solaires et électriques en Afrique',
    fields: [
      { name: 'nom', label: 'Nom du kit / système', placeholder: 'Ex: Kit solaire 3KW complet, Panneau 400W Monocristallin...', required: true, type: 'text' },
      { name: 'prix', label: 'Prix', placeholder: 'Ex: 1 800 000 FCFA installation comprise', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Économies sur facture, installation en 48h, garantie 10 ans...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Zone d\'intervention', placeholder: 'Ex: Grand Abidjan et intérieur du pays', required: false, type: 'text' },
      { name: 'puissance', label: 'Puissance / Capacité', placeholder: 'Ex: 3 KWc, batterie 200Ah, autonomie 2 jours...', required: false, type: 'text' },
    ],
  },
  {
    id: 'art_divertissement',
    label: 'Art, Musique & Entertainment',
    promptContext: 'expert en marketing de l\'art, de la musique et du divertissement africain',
    fields: [
      { name: 'nom', label: 'Nom de l\'oeuvre / événement', placeholder: 'Ex: Concert Afrobeats Night, Tableau "Masques", Beat exclusif...', required: true, type: 'text' },
      { name: 'prix', label: 'Prix / Cachet / Entrée', placeholder: 'Ex: 5 000 FCFA l\'entrée, 150 000 FCFA l\'oeuvre', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Ex: Artiste reconnu, expérience unique, tirage limité...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Lieu / Ville', placeholder: 'Ex: Abidjan, Palais de la Culture', required: false, type: 'text' },
      { name: 'genre', label: 'Genre / Style artistique', placeholder: 'Ex: Afrobeat, Art contemporain africain, Théâtre...', required: false, type: 'text' },
    ],
  },
  {
    id: 'autre_custom',
    label: 'Autre Activité (Personnalisé)',
    promptContext: 'expert en marketing digital adapté à votre activité',
    fields: [
      { name: 'nom', label: 'Nom du produit / service', placeholder: 'Ex: Mon offre unique...', required: true, type: 'text' },
      { name: 'prix', label: 'Prix / Tarif', placeholder: 'Ex: 50 000 FCFA', required: true, type: 'text' },
      { name: 'points_forts', label: 'Avantages clés', placeholder: 'Décrivez les points forts de votre offre...', required: true, type: 'textarea' },
      { name: 'localisation', label: 'Ville / Zone', placeholder: 'Ex: Abidjan, national...', required: false, type: 'text' },
      { name: 'description', label: 'Description complémentaire', placeholder: 'Tout détail supplémentaire utile pour le prompt...', required: false, type: 'textarea' },
    ],
  },
]

export function getDomain(id: DomainId): Domain {
  const domain = DOMAINS.find((d) => d.id === id)
  if (!domain) {
    throw new Error(`Domain "${id}" not found`)
  }
  return domain
}
