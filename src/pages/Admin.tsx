// Administration du site : connexion Google, ajout et modification des publications et de leurs photos.
// Les droits sont vérifiés par Firebase (firestore.rules et storage.rules), pas par cette page.
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { User } from 'firebase/auth'
import { services, type Services } from '../lib/firebase'
import { useToutesPublications } from '../data/publications'
import { THEMES, type Publication, type Visuel } from '../data/types'
import { formatJourMois, lireDate } from '../lib/format'

const champ =
  'mt-1.5 w-full rounded-xl border border-rule bg-surface px-4 py-3 text-base font-normal outline-none transition-[border-color,box-shadow] focus:border-rouge focus:ring-4 focus:ring-rouge/15'
const bouton = 'inline-flex h-12 items-center justify-center rounded-full px-6 font-semibold transition-colors disabled:opacity-50'
const boutonRouge = `${bouton} bg-rouge text-white hover:bg-rouge-fonce`
const boutonLigne = `${bouton} border border-rule hover:bg-[var(--rule)]/60`

/** Message d'erreur lisible à partir d'une erreur Firebase. */
function messageErreur(e: unknown): string {
  const code = (e as { code?: string })?.code ?? ''
  if (code.includes('permission-denied') || code.includes('unauthorized'))
    return 'Ce compte n’a pas le droit de modifier le site. Connectez-vous avec le compte administrateur.'
  if (code.includes('popup-closed') || code.includes('cancelled-popup')) return 'Connexion annulée.'
  if (code.includes('popup-blocked')) return 'Le navigateur a bloqué la fenêtre de connexion. Autorisez les fenêtres pop-up et réessayez.'
  if (code.includes('unauthorized-domain'))
    return 'Cette adresse n’est pas autorisée pour la connexion. Utilisez https://cgtaveyron.web.app/admin.'
  if (code.includes('storage/')) return 'L’envoi de la photo a échoué. Vérifiez que Storage est activé dans Firebase.'
  return (e as Error)?.message ?? 'Erreur inconnue.'
}

/** Réduit la photo (1600 px maximum) et la réenregistre en JPEG, sans ses métadonnées (position GPS…). */
async function compresser(fichier: File): Promise<Blob> {
  const image = await createImageBitmap(fichier, { imageOrientation: 'from-image' })
  const echelle = Math.min(1, 1600 / Math.max(image.width, image.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(image.width * echelle)
  canvas.height = Math.round(image.height * echelle)
  canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height)
  image.close()
  return new Promise((ok, ko) =>
    canvas.toBlob((b) => (b ? ok(b) : ko(new Error('Photo illisible.'))), 'image/jpeg', 0.82),
  )
}

/** Valeur pour un champ « date et heure » (AAAA-MM-JJTHH:MM). */
const versChampDate = (iso?: string) => (!iso ? '' : iso.length === 10 ? `${iso}T12:00` : iso.slice(0, 16))

function maintenant() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

function nouvelle(): Publication {
  return {
    id: `site-${Date.now().toString(36)}`,
    titre: '',
    date: maintenant(),
    texte: '',
    theme: 'Mobilisation',
    visuels: [],
    source: 'site',
  }
}

export function Admin() {
  const [s, setS] = useState<Services | null | undefined>(undefined)
  const [utilisateur, setUtilisateur] = useState<User | null | undefined>(undefined)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    document.title = 'Administration — CGT Aveyron'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    let arret: (() => void) | undefined
    void services().then(async (sv) => {
      setS(sv)
      if (!sv) return
      const { onAuthStateChanged } = await import('firebase/auth')
      arret = onAuthStateChanged(sv.auth, setUtilisateur)
    })
    return () => {
      meta.remove()
      arret?.()
    }
  }, [])

  const connexion = async () => {
    if (!s) return
    setErreur('')
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
      await signInWithPopup(s.auth, new GoogleAuthProvider())
    } catch (e) {
      setErreur(messageErreur(e))
    }
  }

  const deconnexion = async () => {
    if (!s) return
    const { signOut } = await import('firebase/auth')
    await signOut(s.auth)
  }

  return (
    <main id="contenu" className="mx-auto max-w-3xl px-4 pt-8 pb-16 sm:px-6 sm:pt-12">
      <h1 className="font-condensed text-[clamp(2.8rem,9vw,4.5rem)] leading-[0.9] font-[900]">Administration</h1>

      {s === undefined || (s && utilisateur === undefined) ? (
        <p className="mt-8 text-muted">Chargement…</p>
      ) : s === null ? (
        <NonConfigure />
      ) : !utilisateur ? (
        <div className="mt-8 rounded-2xl bg-surface p-6 sm:p-8">
          <p className="text-lg">Connectez-vous avec le compte Google administrateur pour ajouter ou modifier des publications.</p>
          <button type="button" onClick={connexion} className={`${boutonRouge} mt-5`}>
            Se connecter avec Google
          </button>
          {erreur && <p className="mt-4 font-semibold text-rouge" role="alert">{erreur}</p>}
        </div>
      ) : (
        <>
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted">
            Connecté : {utilisateur.email}
            <button type="button" onClick={deconnexion} className="font-semibold text-rouge hover:underline">
              Se déconnecter
            </button>
          </p>
          <Gestion s={s} />
        </>
      )}
    </main>
  )
}

function NonConfigure() {
  return (
    <div className="mt-8 rounded-2xl bg-surface p-6 sm:p-8">
      <p className="text-xl font-semibold">Firebase n’est pas encore prêt pour l’administration.</p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted">
        <li>Console Firebase → Paramètres du projet → Vos applications → ajouter une application Web.</li>
        <li>Activer Authentication (fournisseur Google), Firestore Database et Storage.</li>
        <li>Coller les règles de sécurité (fichiers firestore.rules et storage.rules du dépôt).</li>
      </ol>
      <p className="mt-4 text-muted">Cette page ne fonctionne que sur le site en ligne : https://cgtaveyron.web.app/admin.</p>
    </div>
  )
}

function Gestion({ s }: { s: Services }) {
  const publications = useToutesPublications()
  const [enCours, setEnCours] = useState<Publication | null>(null)
  const [info, setInfo] = useState('')
  const [erreur, setErreur] = useState('')

  const enregistrer = async (p: Publication) => {
    const { doc, setDoc } = await import('firebase/firestore')
    await setDoc(doc(s.db, 'publications', p.id), p)
  }

  const basculer = async (p: Publication) => {
    setErreur('')
    try {
      await enregistrer({ ...p, masque: !p.masque })
      setInfo(p.masque ? `« ${p.titre} » est de nouveau sur le site.` : `« ${p.titre} » est retirée du site.`)
    } catch (e) {
      setErreur(messageErreur(e))
    }
  }

  if (enCours) {
    return (
      <Editeur
        s={s}
        initiale={enCours}
        autres={publications.filter((p) => p.id !== enCours.id)}
        enregistrer={enregistrer}
        fini={(message) => {
          setEnCours(null)
          setInfo(message ?? '')
          window.scrollTo(0, 0)
        }}
      />
    )
  }

  return (
    <section className="mt-8">
      <button type="button" onClick={() => setEnCours(nouvelle())} className={boutonRouge}>
        Nouvelle publication
      </button>
      {info && <p className="mt-4 font-semibold" role="status">{info}</p>}
      {erreur && <p className="mt-4 font-semibold text-rouge" role="alert">{erreur}</p>}

      <h2 className="mt-10 font-condensed text-3xl font-[850]">Publications ({publications.length})</h2>
      <ul className="mt-3 divide-y divide-[var(--rule)] border-y border-rule">
        {publications.map((p) => {
          const photo = p.visuels?.find((v) => v.src)?.src
          return (
            <li key={p.id} className={`flex gap-4 py-4 ${p.masque ? 'opacity-55' : ''}`}>
              <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-[var(--rule)]">
                {photo && <img src={photo} alt="" className="size-full object-cover" loading="lazy" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug">{p.titre}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {formatJourMois(p.date)} {lireDate(p.date).getFullYear()}
                  {p.epingle && ' · À la une'}
                  {p.masque && ' · Retirée du site'}
                  {' · '}
                  {p.visuels?.filter((v) => v.src).length ?? 0} photo(s)
                </p>
                <div className="mt-2 flex gap-4 text-sm font-semibold">
                  <button type="button" onClick={() => setEnCours(p)} className="text-rouge hover:underline">
                    Modifier
                  </button>
                  <button type="button" onClick={() => basculer(p)} className="text-muted hover:underline">
                    {p.masque ? 'Remettre sur le site' : 'Retirer du site'}
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Editeur({
  s,
  initiale,
  autres,
  enregistrer,
  fini,
}: {
  s: Services
  initiale: Publication
  autres: Publication[]
  enregistrer: (p: Publication) => Promise<void>
  fini: (message?: string) => void
}) {
  const [p, setP] = useState<Publication>({ ...initiale, date: versChampDate(initiale.date), visuels: initiale.visuels ?? [] })
  const [envoi, setEnvoi] = useState('')
  const [occupe, setOccupe] = useState(false)
  const [erreur, setErreur] = useState('')
  const fichiers = useRef<HTMLInputElement>(null)
  const visuels = p.visuels ?? []
  const maj = (champs: Partial<Publication>) => setP((x) => ({ ...x, ...champs }))
  const majVisuels = (v: Visuel[]) => maj({ visuels: v })

  const ajouterPhotos = async (e: ChangeEvent<HTMLInputElement>) => {
    const liste = [...(e.target.files ?? [])]
    e.target.value = ''
    if (!liste.length) return
    setErreur('')
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
    const ajoutees: Visuel[] = []
    try {
      for (const [i, f] of liste.entries()) {
        setEnvoi(`Envoi de la photo ${i + 1} sur ${liste.length}…`)
        const blob = await compresser(f)
        const r = ref(s.storage, `publications/${p.id}/${Date.now()}-${i}.jpg`)
        await uploadBytes(r, blob, { contentType: 'image/jpeg', cacheControl: 'public, max-age=31536000' })
        ajoutees.push({ src: await getDownloadURL(r), legende: p.titre || 'Photo', teinte: 'encre' })
      }
    } catch (err) {
      setErreur(messageErreur(err))
    } finally {
      setEnvoi('')
      setP((x) => ({ ...x, visuels: [...(x.visuels ?? []), ...ajoutees] }))
    }
  }

  const deplacer = (i: number, sens: -1 | 1) => {
    const v = [...visuels]
    const j = i + sens
    if (j < 0 || j >= v.length) return
    ;[v[i], v[j]] = [v[j], v[i]]
    majVisuels(v)
  }

  const valider = async (e: FormEvent) => {
    e.preventDefault()
    setErreur('')
    setOccupe(true)
    try {
      const finale: Publication = {
        ...p,
        titre: p.titre.trim(),
        texte: p.texte.trim(),
        visuels: visuels.filter((v) => v.src),
        dateEvenement: p.epingle ? p.dateEvenement : undefined,
        lieu: p.epingle ? p.lieu : undefined,
      }
      await enregistrer(finale)
      // Une seule publication à la une à la fois.
      if (finale.epingle) for (const a of autres.filter((a) => a.epingle)) await enregistrer({ ...a, epingle: false })
      fini(`« ${finale.titre} » est enregistrée et visible sur le site.`)
    } catch (err) {
      setErreur(messageErreur(err))
    } finally {
      setOccupe(false)
    }
  }

  return (
    <form onSubmit={valider} className="mt-8 flex flex-col gap-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-condensed text-3xl font-[850]">
          {initiale.titre ? 'Modifier la publication' : 'Nouvelle publication'}
        </h2>
        <button type="button" onClick={() => fini()} className="font-semibold text-muted hover:underline">
          Annuler
        </button>
      </div>

      <label className="font-semibold">
        Titre
        <input required value={p.titre} onChange={(e) => maj({ titre: e.target.value })} className={champ} />
      </label>

      <label className="font-semibold">
        Texte
        <textarea value={p.texte} onChange={(e) => maj({ texte: e.target.value })} rows={7} className={champ} />
      </label>

      <fieldset>
        <legend className="font-semibold">Photos</legend>
        {visuels.length > 0 && (
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visuels.map((v, i) => (
              <li key={v.src ?? i} className="overflow-hidden rounded-xl border border-rule bg-surface">
                <div className="aspect-[4/3] bg-[var(--rule)]">
                  {v.src && <img src={v.src} alt={v.legende} className="size-full object-cover" />}
                </div>
                <div className="p-2">
                  <input
                    aria-label={`Description de la photo ${i + 1}`}
                    placeholder="Description (pour les personnes aveugles)"
                    value={v.legende}
                    onChange={(e) => majVisuels(visuels.map((x, k) => (k === i ? { ...x, legende: e.target.value } : x)))}
                    className="w-full rounded-lg border border-rule bg-transparent px-2 py-1.5 text-sm"
                  />
                  <div className="mt-2 flex items-center justify-between text-sm font-semibold">
                    <span className="flex gap-1">
                      <button type="button" onClick={() => deplacer(i, -1)} disabled={i === 0} aria-label="Avancer la photo" className="rounded-md px-2 py-1 hover:bg-[var(--rule)] disabled:opacity-30">←</button>
                      <button type="button" onClick={() => deplacer(i, 1)} disabled={i === visuels.length - 1} aria-label="Reculer la photo" className="rounded-md px-2 py-1 hover:bg-[var(--rule)] disabled:opacity-30">→</button>
                    </span>
                    <button type="button" onClick={() => majVisuels(visuels.filter((_, k) => k !== i))} className="text-rouge hover:underline">
                      Enlever
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <input ref={fichiers} type="file" accept="image/*" multiple onChange={ajouterPhotos} className="sr-only" tabIndex={-1} />
        <button type="button" onClick={() => fichiers.current?.click()} disabled={!!envoi} className={`${boutonLigne} mt-3`}>
          {envoi || 'Ajouter des photos'}
        </button>
        <p className="mt-2 text-sm text-muted">La première photo s’affiche en premier dans le fil. Les photos sont réduites et leurs données de position retirées avant l’envoi.</p>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="font-semibold">
          Date de publication
          <input type="datetime-local" required value={p.date} onChange={(e) => maj({ date: e.target.value })} className={champ} />
        </label>
        <label className="font-semibold">
          Thème
          <select value={p.theme} onChange={(e) => maj({ theme: e.target.value as Publication['theme'] })} className={champ}>
            {THEMES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="font-semibold">
        Union locale <span className="font-normal text-muted">(facultatif)</span>
        <input value={p.unionLocale ?? ''} onChange={(e) => maj({ unionLocale: e.target.value || undefined })} className={champ} />
      </label>

      <label className="font-semibold">
        Lien Facebook <span className="font-normal text-muted">(facultatif : le clic dans le fil mènera à Facebook)</span>
        <input type="url" value={p.lienFacebook ?? ''} onChange={(e) => maj({ lienFacebook: e.target.value || undefined })} className={champ} />
      </label>

      <fieldset className="rounded-2xl border border-rule p-5">
        <label className="flex items-center gap-3 font-semibold">
          <input type="checkbox" checked={!!p.epingle} onChange={(e) => maj({ epingle: e.target.checked })} className="size-5 accent-[var(--color-rouge)]" />
          Mettre à la une (grande banderole rouge en haut du site)
        </label>
        {p.epingle && (
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <label className="font-semibold">
              Date de l’événement <span className="font-normal text-muted">(compte à rebours)</span>
              <input
                type="datetime-local"
                value={versChampDate(p.dateEvenement)}
                onChange={(e) => maj({ dateEvenement: e.target.value || undefined })}
                className={champ}
              />
            </label>
            <label className="font-semibold">
              Lieu
              <input value={p.lieu ?? ''} onChange={(e) => maj({ lieu: e.target.value || undefined })} className={champ} />
            </label>
          </div>
        )}
      </fieldset>

      {erreur && <p className="font-semibold text-rouge" role="alert">{erreur}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={occupe || !!envoi} className={boutonRouge}>
          {occupe ? 'Enregistrement…' : 'Enregistrer et publier'}
        </button>
        {initiale.titre && (
          <Link to={`/publication/${p.id}`} className="font-semibold text-muted hover:underline">
            Voir sur le site
          </Link>
        )}
      </div>
    </form>
  )
}
