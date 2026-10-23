#!/usr/bin/env bash
# Descarcă toate datele brute folosite pe site într-un folder de lucru (implicit: ./work).
# Folosire: bash scripts/download.sh [folder]
set -euo pipefail
W="${1:-work}"
mkdir -p "$W/euro" "$W/wb" "$W/un" "$W/ins" "$W/geo"
E="https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data"
UA="Mozilla/5.0 (compatible; hartamuncii-data/1.0)"
get() { echo "→ $1"; curl -sfL -A "$UA" -o "$1" "$2"; }

# ---------- Eurostat ----------
get "$W/euro/pop_ro.json"      "$E/migr_pop1ctz?citizen=RO&age=TOTAL&sex=T&unit=NR&sinceTimePeriod=2010"
get "$W/euro/pop_tot.json"     "$E/tps00001?sinceTimePeriod=2024"
get "$W/euro/neet.json"        "$E/edat_lfse_20?age=Y15-29&sex=T&training=NO_FE_NO_NFE&wstatus=NEMP&sinceTimePeriod=2015"
get "$W/euro/iwp.json"         "$E/ilc_iw01?age=Y18-64&sex=T&wstatus=EMP&unit=PC&sinceTimePeriod=2015"
get "$W/euro/hours.json"       "$E/lfsa_ewhan2?age=Y20-64&sex=T&worktime=TOTAL&wstatus=EMP&nace_r2=TOTAL&sinceTimePeriod=2024"
get "$W/euro/hours_ts.json"    "$E/lfsa_ewhan2?age=Y20-64&sex=T&worktime=TOTAL&wstatus=EMP&nace_r2=TOTAL&geo=RO&geo=EU27_2020&geo=NL&sinceTimePeriod=2010"
get "$W/euro/hours_nace.json"  "$E/lfsa_ewhan2?geo=RO&geo=EU27_2020&sex=T&age=Y20-64&worktime=TOTAL&wstatus=SAL&sinceTimePeriod=2025"
get "$W/euro/grad.json"        "$E/edat_lfse_24?sex=T&age=Y20-34&duration=Y1-3&isced11=ED5-8&sinceTimePeriod=2012"
get "$W/euro/grad_lvl.json"    "$E/edat_lfse_24?geo=RO&geo=EU27_2020&sex=T&age=Y20-34&duration=Y1-3&sinceTimePeriod=2025"
get "$W/euro/emp_nace_ts.json" "$E/lfsa_egan2?geo=RO&sex=T&age=Y15-74&sinceTimePeriod=2008"
get "$W/euro/acc_fatal.json"   "$E/hsw_n2_02?geo=RO&geo=EU27_2020&sinceTimePeriod=2020"
get "$W/euro/imm_ro.json"      "$E/migr_imm1ctz?geo=RO&citizen=RO&age=TOTAL&agedef=COMPLET&sex=T&unit=NR&sinceTimePeriod=2010"
get "$W/euro/emi_ro.json"      "$E/migr_emi1ctz?geo=RO&citizen=RO&age=TOTAL&agedef=COMPLET&sex=T&unit=NR&sinceTimePeriod=2010"
get "$W/euro/ses47.json"       "$E/earn_ses22_47?geo=RO&geo=IT&geo=DE&geo=ES&geo=AT&geo=FR&sex=T&nace_r2=B-S_X_O"
get "$W/euro/cens_el.json"     "$E/cens_21ctz_r3?geo=EL&geo=CY&geo=MT&citizen=RO&citizen=TOTAL&age=TOTAL"

# ---------- Banca Mondială ----------
for ind in BX.TRF.PWKR.CD.DT BX.TRF.PWKR.DT.GD.ZS BX.KLT.DINV.CD.WD; do
  get "$W/wb/$ind.json" "https://api.worldbank.org/v2/country/ROU/indicator/$ind?format=json&per_page=80&date=2000:2025"
done

# ---------- ONU ----------
get "$W/un/ims.xlsx" "https://www.un.org/development/desa/pd/sites/www.un.org.development.desa.pd/files/undesa_pd_2024_ims_stock_by_sex_destination_and_origin.xlsx"

# ---------- INS ----------
get "$W/ins/cs12r25.xls" "https://insse.ro/cms/files/statistici/comunicate/castiguri/a25/cs12r25.xls"
python scripts/tempo_county_salary.py 2023 2024 > "$W/ins/fom106e.csv"

# ---------- contururi ----------
get "$W/geo/ro.geojson"        "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/ROU/ADM1/geoBoundaries-ROU-ADM1_simplified.geojson"
get "$W/geo/world50.geojson"   "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_admin_0_countries.geojson"
get "$W/geo/world110.geojson"  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_110m_admin_0_countries.geojson"
echo "Gata. Datele brute sunt în $W/"
