// Réglages de mouvement communs, d'après le skill emil-design-eng (Emil Kowalski).
// Mêmes courbes que les jetons --ease-* de src/index.css.
//
// Règles du site :
// - ce qui apparaît ou disparaît : EASE_SORTIE ; ce qui se déplace à l'écran : EASE_DEPLACEMENT ;
// - interface sous 300 ms ; la sortie plus rapide que l'entrée ;
// - jamais d'animation sur une action au clavier (Échap, flèches) : changement immédiat ;
// - seul grand mouvement automatique : la banderole, et une seule fois par visite.

export const EASE_SORTIE = [0.23, 1, 0.32, 1] as const
export const EASE_DEPLACEMENT = [0.77, 0, 0.175, 1] as const
export const EASE_TIROIR = [0.32, 0.72, 0, 1] as const

/** Transition nulle : pour les actions au clavier. */
export const INSTANTANE = { duration: 0 } as const
