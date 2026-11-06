# Datele din spatele site-ului

Toate cifrele de pe [HartaMuncii](https://sardariu-luiza-elena.github.io/hartamuncii/) sunt în baza SQLite [`hartamuncii.sqlite`](hartamuncii.sqlite) și, tabel cu tabel, în [`csv/`](csv/) (UTF-8, separator virgulă).

Ultima actualizare: **2026-11-06**. Fișierele sunt generate de `python scripts/update.py`; nu le edita de mână. Cifrele fără sursă descărcabilă automat se schimbă în [`manual.json`](manual.json).

## `county_salary`

Câștigul salarial mediu net lunar, media anuală, pe județe. Rândul RO e media pe țară.

Sursa: [INS TEMPO, FOM106E](http://statistici.insse.ro:8077/tempo-online/#/pages/tables/insse-table)

| Coloană | Tip | Descriere |
|---|---|---|
| `county_code` | TEXT | codul județului (RO = toată țara) |
| `county` | TEXT | județul |
| `year` | INTEGER | anul |
| `net_salary_lei` | INTEGER | lei pe lună |

## `eu_indicator`

Indicatori pentru țările UE: ore lucrate pe săptămână (hours), tineri NEET (neet), săraci deși muncesc (iwp), angajarea absolvenților (grad). Clasamentul are toate țările UE în ultimul an; seriile în timp sunt pentru România, media UE și, la ore, Olanda.

Sursa: [Eurostat: lfsa_ewhan2, edat_lfse_20, ilc_iw01, edat_lfse_24](https://ec.europa.eu/eurostat/databrowser/)

| Coloană | Tip | Descriere |
|---|---|---|
| `indicator` | TEXT | hours, neet, iwp sau grad |
| `country` | TEXT | cod de țară Eurostat (EU27_2020 = media UE) |
| `year` | INTEGER | anul |
| `value` | REAL | ore pe săptămână sau procent |

## `graduate_employment_by_level`

Rata de ocupare a tinerilor de 20–34 de ani la 1–3 ani după absolvire, pe nivel de educație (ISCED).

Sursa: [Eurostat, edat_lfse_24](https://ec.europa.eu/eurostat/databrowser/view/edat_lfse_24/default/table)

| Coloană | Tip | Descriere |
|---|---|---|
| `country` | TEXT | RO sau EU |
| `isced_level` | TEXT | nivelul de educație, cod ISCED 2011 |
| `value` | REAL | procent |

## `diaspora_series`

Cetățeni români rezidenți în fiecare țară, pe ani.

Sursa: [Eurostat, migr_pop1ctz](https://ec.europa.eu/eurostat/databrowser/view/migr_pop1ctz/default/table)

| Coloană | Tip | Descriere |
|---|---|---|
| `country` | TEXT | cod de țară |
| `year` | INTEGER | anul |
| `romanian_citizens` | INTEGER | persoane |

## `diaspora_latest`

Comunitățile de români, cel mai recent an disponibil pentru fiecare țară, și ponderea în populația țării.

Sursa: [Eurostat migr_pop1ctz, tps00001, cens_21ctz_r3; ONS (Regatul Unit)](https://ec.europa.eu/eurostat/databrowser/view/migr_pop1ctz/default/table)

| Coloană | Tip | Descriere |
|---|---|---|
| `country` | TEXT | cod de țară |
| `romanian_citizens` | INTEGER | persoane |
| `year` | INTEGER | anul datelor |
| `share_of_population_pct` | REAL | % din populația țării |
| `note` | TEXT | precizări despre sursă |

## `sector_employment_change`

Variația numărului de lucrători pe domenii. Perioadele sunt separate din cauza schimbării de metodologie din 2021.

Sursa: [Eurostat, lfsa_egan2](https://ec.europa.eu/eurostat/databrowser/view/lfsa_egan2/default/table)

| Coloană | Tip | Descriere |
|---|---|---|
| `period_from` | TEXT | anul de început |
| `period_to` | TEXT | anul de sfârșit |
| `sector` | TEXT | domeniul |
| `change_pct` | REAL | variația, % |
| `employed_start_thousands` | INTEGER | mii de lucrători la început |
| `employed_end_thousands` | INTEGER | mii de lucrători la sfârșit |

## `sector_work`

Munca pe domenii (secțiuni CAEN): salariu, ore, câștig pe oră, accidente mortale, lucrători. TOTAL = toată economia; C16_31 = lemn și mobilă (diviziile 16 și 31).

Sursa: [INS, câștigul salarial lunar (anexa din decembrie); Eurostat lfsa_ewhan2, hsw_n2_02, lfsa_egan2](https://insse.ro/cms/ro/content/castiguri-salariale)

| Coloană | Tip | Descriere |
|---|---|---|
| `sector_code` | TEXT | secțiunea CAEN |
| `sector` | TEXT | domeniul |
| `net_salary_lei` | INTEGER | salariul mediu net lunar |
| `hours_ro` | REAL | ore pe săptămână, salariați, România |
| `hours_eu` | REAL | ore pe săptămână, salariați, media UE |
| `net_lei_per_hour` | REAL | câștig net pe oră |
| `fatal_accidents_ro` | REAL | accidente mortale la 100.000 de lucrători, România |
| `fatal_accidents_eu` | REAL | accidente mortale la 100.000 de lucrători, media UE |
| `employed_thousands` | REAL | mii de lucrători |

## `sector_share`

Ponderea marilor sectoare în populația ocupată.

Sursa: [Eurostat, lfsa_egan2](https://ec.europa.eu/eurostat/databrowser/view/lfsa_egan2/default/table)

| Coloană | Tip | Descriere |
|---|---|---|
| `sector_group` | TEXT | marele sector |
| `year` | INTEGER | anul |
| `share_pct` | REAL | % din populația ocupată |

## `remittances`

Banii trimiși acasă de românii din străinătate și investițiile străine directe. Remitențele în dolari sunt doar din 2013, din cauza unei schimbări de înregistrare.

Sursa: [Banca Mondială: BX.TRF.PWKR.CD.DT, BX.KLT.DINV.CD.WD, BX.TRF.PWKR.DT.GD.ZS](https://data.worldbank.org/indicator/BX.TRF.PWKR.CD.DT?locations=RO)

| Coloană | Tip | Descriere |
|---|---|---|
| `year` | INTEGER | anul |
| `remittances_bn_usd` | REAL | remitențe, mld. $ |
| `fdi_bn_usd` | REAL | investiții străine directe, mld. $ |
| `remittances_pct_gdp` | REAL | remitențe, % din PIB |

## `migration_flows`

Cetățeni români care s-au întors în țară și care au plecat, pe ani.

Sursa: [Eurostat: migr_imm1ctz, migr_emi1ctz](https://ec.europa.eu/eurostat/databrowser/view/migr_emi1ctz/default/table)

| Coloană | Tip | Descriere |
|---|---|---|
| `year` | INTEGER | anul |
| `returned` | INTEGER | întorși |
| `emigrated` | INTEGER | plecați |

## `hourly_earnings_by_occupation`

Câștigul brut pe oră, pe grupe de ocupații, firme cu 10+ angajați.

Sursa: [Eurostat, earn_ses22_47 (ancheta salariilor 2022)](https://ec.europa.eu/eurostat/databrowser/view/earn_ses22_47/default/table)

| Coloană | Tip | Descriere |
|---|---|---|
| `occupation` | TEXT | grupa ISCO-08 (TOTAL = toate) |
| `country` | TEXT | cod de țară |
| `unit` | TEXT | EUR sau PPS (standard de putere de cumpărare) |
| `value` | REAL | câștig pe oră |

## `children_parents_abroad`

Copii cu părinți plecați la muncă în străinătate (introdus de mână din data/manual.json).

Sursa: [ANPDCA, prin Economedia](https://economedia.ro/?p=330015)

| Coloană | Tip | Descriere |
|---|---|---|
| `date` | TEXT | data situației |
| `any_parent` | INTEGER | cu cel puțin un părinte plecat |
| `both_parents` | INTEGER | cu ambii părinți plecați |
| `one_parent` | INTEGER | cu un părinte plecat |
| `sole_parent` | INTEGER | cu singurul părinte plecat |
| `any_parent_prev_year` | INTEGER | cu cel puțin un părinte plecat, anul anterior |
| `both_parents_prev_year` | INTEGER | cu ambii părinți plecați, anul anterior |

## `pay_distribution`

Salariații din sectorul privat pe tranșe de venit (introdus de mână din data/manual.json). Netul e aproximativ.

Sursa: [INS, prin Ziarul Financiar](https://www.zf.ro/eveniment/varful-salariilor-subtire-1-5-dintre-angajati-depasesc-venituri-30-22964480)

| Coloană | Tip | Descriere |
|---|---|---|
| `band` | INTEGER | ordinea tranșei |
| `gross_band` | TEXT | venit brut, lei |
| `net_band` | TEXT | echivalent net aproximativ, lei |
| `employees_millions` | REAL | milioane de salariați |
