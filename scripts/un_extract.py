"""Extrage din tabelul ONU (International Migrant Stock 2024) persoanele născute în România (cod 642), pe țări de reședință.
Folosire: python scripts/un_extract.py <work>/un/ims.xlsx <work>/un/ro_origin.json"""
import json, sys
import openpyxl

src, out = sys.argv[1], sys.argv[2]
ws = openpyxl.load_workbook(src, read_only=True, data_only=True)['Table 1']
YEARS = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024]
rows = []
for row in ws.iter_rows(min_row=12, values_only=True):
    if row[6] in (642, '642'):
        rows.append({'dest': row[1], 'code': int(row[4]), 'y': {str(y): row[7 + i] for i, y in enumerate(YEARS)}})
json.dump(rows, open(out, 'w', encoding='utf-8'), ensure_ascii=False)
print(len(rows), 'rânduri')
