/* Set de iconițe line-art, 24x24, stroke = currentColor */
window.ICONS = (function () {
  const p = {
    it: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M9 8l-2 2 2 2M15 8l2 2-2 2"/>',
    finance: '<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
    public: '<path d="M4 21h16M6 21V11M18 21V11M10 21v-6h4v6M3 11l9-7 9 7"/>',
    health: '<path d="M12 21s-7-4.5-9-9.5C1.7 8 3.7 4.5 7.2 4.5c2 0 3.4 1.2 4.8 3 1.4-1.8 2.8-3 4.8-3 3.5 0 5.5 3.5 4.2 7-2 5-9 9.5-9 9.5z"/><path d="M8 12h2.5l1.5-3 2 5 1.5-2H16"/>',
    electronics: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    logistics: '<path d="M2 7h11v9H2zM13 10h4l4 3v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    naval: '<path d="M3 15l2 5h14l2-5H3zM6 15V9h12v6M12 9V4M9 6h6"/><path d="M2 21c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',
    metal: '<path d="M4 20h16M6 20V9l4 3V9l4 3V6l4 3v11"/><path d="M8 16h2M14 16h2"/>',
    tourism: '<circle cx="12" cy="9" r="3"/><path d="M12 2v2M12 14v2M5 9H3M21 9h-2M7 4l1.4 1.4M17 4l-1.4 1.4"/><path d="M2 21l6-6 4 4 3-3 7 5"/>',
    auto: '<path d="M3 16v-3l2-5h14l2 5v3H3z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5.5 13h13"/>',
    oil: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
    energy: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    aero: '<path d="M2 14l20-7-6 13-3-6-6 3 1-4z"/>',
    food: '<path d="M7 3v8a2 2 0 0 0 4 0V3M9 11v10M16 3c-2 1.5-2 6 0 8v10M16 3c2 1.5 2 6 0 8"/>',
    chem: '<path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M7 15h10"/>',
    wood: '<path d="M12 2l5 7h-3l4 6h-4l3 5H7l3-5H6l4-6H7z"/><path d="M12 20v2"/>',
    textile: '<path d="M8 3l-5 3 2 5 3-1v11h8V10l3 1 2-5-5-3c-.5 2-2 3-4 3S8.5 5 8 3z"/>',
    agri: '<path d="M12 22V10M12 10c0-4 3-7 7-7 0 4-3 7-7 7zM12 14c0-3-2.5-5.5-6-5.5 0 3 2.5 5.5 6 5.5z"/><path d="M5 22h14"/>',
    retail: '<path d="M4 7h16l-1.5 12a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2L4 7z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
    construction: '<path d="M2 20h20M4 20V10l8-6 8 6v10"/><path d="M9 20v-5h6v5M3 8h4"/>',
    mining: '<path d="M14 4l6 6M4 20l9-9M11 6c3-2 7-2 9 0-1.5 0-4 1-6 3"/>',
    wine: '<path d="M8 3h8l-1 6a3 3 0 0 1-6 0zM12 12v8M8 21h8"/>',
    height: '<path d="M12 2v20M8 6l4-4 4 4M8 18l4 4 4-4"/><path d="M4 7h3M4 12h3M4 17h3"/>',
    looks: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    photo: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.5"/><path d="M8 5l1.5-2h5L16 5"/>',
    gender: '<circle cx="9" cy="14" r="5"/><path d="M9 19v3M7 21h4"/><circle cx="16" cy="8" r="4"/><path d="M19 5l3-3M19 2h3v3"/>',
    persona: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/><path d="M17 3.5l1.2 1.2M19.5 7H21M7 3.5L5.8 4.7"/>',
    arrow: '<path d="M7 7h10v10M7 17L17 7"/>',
    mask: '<path d="M3 6c3 0 6-1 9-3 3 2 6 3 9 3 0 8-4 13-9 15C7 19 3 14 3 6z"/><path d="M7 10l3 1M17 10l-3 1M9 15c2-1 4-1 6 0"/>',
    name: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16c.5-1.5 1.7-2 3-2s2.5.5 3 2M14 10h4M14 13h3"/>',
    weight: '<path d="M5 8h14l2 12H3z"/><circle cx="12" cy="5" r="2"/><path d="M12 12v3l2 1"/>',
    network: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><circle cx="12" cy="13" r="2"/><path d="M12 7v4M10.5 14.5l-4 2.5M13.5 14.5l4 2.5M6.5 16.5L11 6.5M17.5 16.5L13 6.5"/>',
    age: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
  };
  return function (k, cls) {
    return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (p[k] || p.it) + '</svg>';
  };
})();
