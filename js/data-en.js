/* Varianta în engleză a datelor descriptive. Se aplică doar când limba e EN. */
(function () {
  if (window.LANG !== 'en') return;

  const C = window.RO_DATA.counties;
  C.B.n = 'Bucharest';
  for (const k in C) C[k].ind = C[k].ind.map(([icon, t]) => [icon, tr(t)]);

  window.RO_SECTORS_SPLIT.forEach(s => { s.k = tr(s.k); });

  const RISK = { 'scăzut': 'low', mediu: 'medium', ridicat: 'high' };
  const DOM_EN = [
    ['Agriculture', 'More than one worker in ten is still in farming, by far the highest share in the EU. Much of it is subsistence or family work, where undeclared work is common.'],
    ['Manufacturing', 'The biggest employer in the economy: cars, car parts, metals, furniture, food. Concentrated in the west and centre of the country.'],
    ['Construction', 'The sector most exposed to cash-in-hand pay: in a 2021 study, 17% of workers under-reported their real income.'],
    ['Retail & trade', 'The second-largest employer. Lots of part-time contracts, and hours worked beyond the contract legally count as undeclared work.'],
    ['Transport & logistics', 'Growing around Bucharest, Constanța and Timiș. Includes ride-sharing and delivery, where inspectors often find people without contracts.'],
    ['Hotels, restaurants & tourism', 'Restaurants, hotels, the seaside. Seasonal work and cash payments make it a regular target for inspections.'],
    ['IT & communications', 'The highest salaries in the economy, concentrated in Bucharest, Cluj, Iași and Timiș. Many people work as contractors through their own company.'],
    ['Finance & insurance', 'Few employees, high salaries, almost entirely in big cities.'],
    ['Energy & utilities', 'Hydro, nuclear (Cernavodă), and coal in decline in Gorj. Above-average pay and large employers, many of them state-owned.'],
    ['Health & social care', 'Mostly women. The main problem is staff emigrating, not missing contracts.'],
    ['Public administration & education', 'The public sector employs about 16.6% of everyone in work.'],
    ['Wood & furniture', 'Strong in Maramureș, Suceava, Bihor and Harghita. In 2025, inspectors found 295 workers doing undeclared work at a single furniture factory in Bihor.']
  ];
  window.RO_DOMAINS.forEach((d, i) => { d.t = DOM_EN[i][0]; d.d = DOM_EN[i][1]; d.riskLabel = RISK[d.risk]; });

  const HIRE_EN = {
    height: ['Height', 'salary per inch (2.54 cm)', 'Each extra inch of height as a teenager was linked to about 1.8% higher pay as an adult. The effect seems to work through confidence and social activities in adolescence, not adult height itself.'],
    looks: ['Looks', 'penalty vs. premium', 'People rated as “below average” in looks earn 7–9% less, and those rated “above average” about 5% more, with the same qualifications.'],
    photo: ['CV photo', 'more interview invitations', 'In an experiment with fictitious CVs, applicants with attractive photos got 36% more call-backs than those with less attractive ones.'],
    gender: ['Gender', 'out of 100 men / women have a job', 'In Romania the gender pay gap is small (about 4%, Eurostat), but the employment gap is large: 71.4% of men work, compared with 54.4% of women (2025).'],
    persona: ['Personality', 'more pay for less “agreeable” men', 'Men low in agreeableness (blunt, tough negotiators) earned about 18% more than very agreeable men. The best predictor of job performance, though, is conscientiousness: organised, reliable people do consistently better in every field.'],
    name: ['Your name', 'more call-backs for the same CV', 'Identical CVs with names perceived as “white” got 50% more call-backs than those with African-American names. Similar European studies find penalties for ethnic-minority names; in Romania, for example, for Roma applicants.'],
    weight: ['Weight', 'salary (women)', 'Being about 30 kg heavier was linked to roughly 9% lower wages for white women in the US. For men the effect was much weaker or absent.'],
    network: ['Connections', 'of jobs found through contacts', 'Personal networks explain a huge share of hiring. What matters most are “weak ties”, distant acquaintances rather than close friends.'],
    age: ['Age', 'employment rate at ages 15–24 (RO)', 'Young Romanians have one of the lowest employment rates in the EU, and after 50, applicants get fewer replies in CV experiments.']
  };
  window.RO_HIRE.forEach(h => {
    const e = HIRE_EN[h.icon]; if (!e) return;
    h.t = e[0]; h.unit = e[1]; h.d = e[2];
    if (h.icon === 'gender') h.big = '71 vs 54';
  });

  window.EU_GEO.c.forEach(c => { if (COUNTRY_EN[c.id]) c.n = COUNTRY_EN[c.id]; });

  const X = window.RO_EXTRA;
  Object.values(X.sect).forEach(p => p.rows.forEach(r => { r[0] = tr(r[0]); }));
  X.diaspora.forEach(d => {
    if (!d.note) return;
    d.note = d.id === 'UK' ? 'born in Romania, 2021 census (England and Wales), ONS' : 'Romanian citizens, 2021 census';
  });
})();
