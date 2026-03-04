import { PICTOS, type PictoId } from '@/lib/pictos'

/** Pictos section Services = même source que lib/pictos (référentiel OVHcloud DS : zeroheight iconography) */

const LABELS: Record<PictoId, string> = {
  trophy: 'Trophée', speed: 'Rapidité', star: 'Qualité', camera: 'Photo', book: 'Documentation',
  brush: 'Design', settings: 'Configuration', contacts: 'Contact', cursors: 'Interface', house: 'Accueil',
  cart: 'Boutique', mobile: 'Mobile', 'page-query': 'Texte', 'page-script': 'Titre', 'page-info': 'Sous-titre',
  play: 'Vidéo', microphone: 'Audio', check: 'OK',
}

/** Set de 10 pictos pour la section "Nos services" - même source que le reste du site */
const SERVICE_PICTO_IDS: PictoId[] = [
  'trophy', 'speed', 'star', 'camera', 'book', 'brush',
  'settings', 'contacts', 'cursors', 'house',
]

export const SERVICE_PICTOS = SERVICE_PICTO_IDS.map((id) => ({
  id,
  iconSrc: PICTOS[id],
  label: LABELS[id] ?? id,
}))
