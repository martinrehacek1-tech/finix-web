# FINIX web - nová verzia (návod pre správcu)

Tento priečinok obsahuje základ nového webu. Skladá sa z dvoch častí:

1. **Verejný web** (to, čo vidia návštevníci) - postavený v Next.js
2. **Admin/editor** (to, kde ty pridávaš články a upravuješ poradcov) - postavený v Sanity Studio, beží na adrese `/studio`

Nižšie je návod od úplného začiatku. Rob kroky presne v poradí.

## Čo budeš potrebovať (jednorazovo)

- Účet na [sanity.io](https://www.sanity.io) - zadarmo
- Účet na [vercel.com](https://vercel.com) - zadarmo, prihlásiš sa cez GitHub
- Účet na [github.com](https://github.com) - zadarmo, sem sa nahrá kód
- Nainštalovaný [Node.js](https://nodejs.org) (stiahni verziu "LTS") - toto je jediná vec, čo treba nainštalovať na počítač

## Krok 1 - vyskúšať web na vlastnom počítači

1. Otvor terminál (na Windows "Príkazový riadok" alebo lepšie "PowerShell", na Mac "Terminal")
2. Prejdi do priečinka s projektom a spusti:
   ```
   npm install
   ```
   (stiahne všetko potrebné, chvíľu to trvá)
3. Skopíruj súbor `.env.local.example` a premenuj kópiu na `.env.local`
4. Zatiaľ ho nechaj tak - hodnoty doplníme v kroku 2

## Krok 2 - vytvoriť CMS (administráciu) v Sanity

1. Choď na [sanity.io](https://www.sanity.io) a zaregistruj sa (zadarmo)
2. V teréminale, v priečinku projektu, spusti:
   ```
   npx sanity init
   ```
3. Vyber "Create new project", daj mu meno napr. "finix"
4. Keď sa opýta na dataset, vyber "production"
5. Po dokončení ti vypíše "Project ID" - skopíruj si ho
6. Otvor súbor `.env.local` a vlož tam:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=tvoje_skopirovane_id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

## Krok 3 - spustiť web lokálne a vyskúšať admin

1. V termináli spusti:
   ```
   npm run dev
   ```
2. Otvor v prehliadači `http://localhost:3000` - uvidíš web (zatiaľ prázdny, lebo v CMS ešte nie je žiadny obsah)
3. Otvor `http://localhost:3000/studio` - toto je tvoja administrácia. Prihlás sa rovnakým účtom ako v kroku 2
4. V administrácii:
   - Klikni na "Nastavenia webu" a vyplň nadpis, čísla klientov atď.
   - Klikni na "Poradcovia / tím" → "Create" a pridaj prvého poradcu (nahraj fotku, meno, bio)
   - Rovnako pridaj "Kategórie blogu" (Hypotéky, Poistenie...) a potom "Články"
5. Obnov `http://localhost:3000` - obsah sa objaví automaticky

**Toto je presne tá časť, ktorú budeš používať bežne** - pridávanie článkov a úprava tímu, bez potreby dotknúť sa kódu.

## Krok 4 - nahratie na internet (nasadenie)

1. Vytvor si repozitár na GitHub a nahraj tam obsah tohto priečinka (najjednoduchšie cez GitHub Desktop appku, alebo mi napíš, môžem ťa previesť príkazmi)
2. Choď na [vercel.com](https://vercel.com), prihlás sa cez GitHub, zvoľ "Import Project" a vyber tento repozitár
3. Vercel sa opýta na "Environment Variables" - vlož tam tie isté dve hodnoty čo máš v `.env.local`
4. Klikni "Deploy" - o pár minút dostaneš funkčnú verziu na adrese ako `finix-web.vercel.app`
5. V nastaveniach Vercel projektu (Domains) pridaj `finix.sk` a nastavíme presmerovanie DNS (spravíme spolu, keď budeš pripravený prepnúť)

## Bežná prevádzka (po spustení)

- Chceš pridať článok? → choď na `finix.sk/studio`, "Články" → "Create"
- Chceš zmeniť fotku/bio poradcu? → `finix.sk/studio`, "Poradcovia / tím", klikni na meno, uprav, "Publish"
- Nič iné nemusíš robiť - web sa aktualizuje automaticky do minúty od uloženia

## Čo NEROBIŤ

- Needituj priamo súbory v `sanity/schemaTypes/` bez konzultácie - to je "tvar formulárov" v administrácii, nie obsah
- Ak niečo v kóde nefunguje, nič nemeň naslepo - napíš mi presne čo vidíš na obrazovke

---

Ďalšie kroky, ktoré ešte spravíme spolu: migrácia existujúcich článkov a poradcov z WordPress, testovanie, a prepnutie domény finix.sk na nový web.
