// Bili UI icon set — a curated 24x24 outline set.
// Every icon renders as inline SVG with `fill: none; stroke: currentColor`, so
// color, size and light/dark switching come for free.
//
// Paths are authored for a 24x24 viewBox. Keep new entries in the category that
// matches `iconGroups` below; the test suite checks both stay in sync.
export const icons: Record<string, string[]> = {
  // ---------------------------------------------------------------------
  // Direction & navigation
  // ---------------------------------------------------------------------
  'arrow-left': ['M19 12H5', 'm12 19-7-7 7-7'],
  'arrow-right': ['M5 12h14', 'm12 5 7 7-7 7'],
  'arrow-up': ['M12 19V5', 'm5 12 7-7 7 7'],
  'arrow-down': ['M12 5v14', 'm19 12-7 7-7-7'],
  'arrow-up-right': ['M7 17 17 7', 'M7 7h10v10'],
  'arrow-down-left': ['M17 7 7 17', 'M17 17H7V7'],
  'chevron-down': ['m6 9 6 6 6-6'],
  'chevron-up': ['m18 15-6-6-6 6'],
  'chevron-left': ['m15 18-6-6 6-6'],
  'chevron-right': ['m9 18 6-6-6-6'],
  'chevrons-left': ['m11 17-5-5 5-5', 'm18 17-5-5 5-5'],
  'chevrons-right': ['m6 17 5-5-5-5', 'm13 17 5-5-5-5'],
  'chevrons-up': ['m17 11-5-5-5 5', 'm17 18-5-5-5 5'],
  'chevrons-down': ['m7 6 5 5 5-5', 'm7 13 5 5 5-5'],
  'corner-down-left': ['m9 10-5 5 5 5', 'M20 4v7a4 4 0 0 1-4 4H4'],
  'corner-down-right': ['m15 10 5 5-5 5', 'M4 4v7a4 4 0 0 0 4 4h12'],
  'corner-up-left': ['m9 14-5-5 5-5', 'M20 20v-7a4 4 0 0 0-4-4H4'],
  'corner-up-right': ['m15 14 5-5-5-5', 'M4 20v-7a4 4 0 0 1 4-4h12'],
  move: [
    'M12 2v20',
    'M2 12h20',
    'm8 6 4-4 4 4',
    'm8 18 4 4 4-4',
    'm6 8-4 4 4 4',
    'm18 8 4 4-4 4'
  ],
  // Arrows point outward (expand) vs inward (collapse) — `maximize`/`minimize`
  // keep the heroicons-style frame so they read as window controls too.
  maximize: [
    'M8 3H5a2 2 0 0 0-2 2v3',
    'M21 8V5a2 2 0 0 0-2-2h-3',
    'M3 16v3a2 2 0 0 0 2 2h3',
    'M16 21h3a2 2 0 0 0 2-2v-3'
  ],
  minimize: [
    'M8 3v3a2 2 0 0 1-2 2H3',
    'M21 8h-3a2 2 0 0 1-2-2V3',
    'M3 16h3a2 2 0 0 1 2 2v3',
    'M16 21v-3a2 2 0 0 1 2-2h3'
  ],

  // ---------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------
  check: ['M20 6 9 17l-5-5'],
  close: ['M18 6 6 18', 'm6 6 12 12'],
  plus: ['M12 5v14', 'M5 12h14'],
  minus: ['M5 12h14'],
  edit: [
    'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z',
    'm15 5 4 4'
  ],
  delete: [
    'M3 6h18',
    'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
    'M10 11v6',
    'M14 11v6'
  ],
  copy: [
    'M10 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z',
    'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2'
  ],
  duplicate: [
    'M10 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z',
    'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2',
    'M12 12h6',
    'M15 9v6'
  ],
  refresh: [
    'M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8',
    'M3 3v5h5',
    'M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16',
    'M16 16h5v5'
  ],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z', 'm21 21-4.34-4.34'],
  'zoom-in': ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z', 'm21 21-4.34-4.34', 'M11 8v6', 'M8 11h6'],
  'zoom-out': ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z', 'm21 21-4.34-4.34', 'M8 11h6'],
  download: [
    'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
    'm7 10 5 5 5-5',
    'M12 15V3'
  ],
  upload: [
    'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
    'm17 8-5-5-5 5',
    'M12 3v12'
  ],
  save: [
    'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z',
    'M17 21v-8H7v8',
    'M7 3v5h8'
  ],
  filter: ['M22 3H2l8 9.46V19l4 2v-8.54L22 3'],
  sort: ['M11 5h10', 'M11 9h7', 'M11 13h4', 'm3 17 3 3 3-3', 'M6 18V4'],
  'arrow-up-down': ['m21 16-4 4-4-4', 'M17 20V4', 'm3 8 4-4 4 4', 'M7 4v16'],
  undo: ['M9 14 4 9l5-5', 'M4 9h10.5a5.5 5.5 0 0 1 0 11H11'],
  redo: ['m15 14 5-5-5-5', 'M20 9H9.5a5.5 5.5 0 0 0 0 11H13'],
  share: [
    'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8',
    'm16 6-4-4-4 4',
    'M12 2v13'
  ],
  link: [
    'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
    'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'
  ],
  'external-link': [
    'M15 3h6v6',
    'M10 14 21 3',
    'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'
  ],
  print: [
    'M6 9V2h12v7',
    'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2',
    'M6 14h12v8H6z'
  ],
  settings: [
    'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'
  ],
  power: ['M12 2v10', 'M18.4 6.6a9 9 0 1 1-12.77.04'],

  // ---------------------------------------------------------------------
  // Status & feedback
  // ---------------------------------------------------------------------
  loading: ['M21 12a9 9 0 1 1-6.219-8.56'],
  success: ['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M22 4 12 14.01 9 11.01'],
  warning: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 8v4', 'M12 16h.01'],
  error: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'm15 9-6 6', 'm9 9 6 6'],
  info: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 16v-4', 'M12 8h.01'],
  question: [
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
    'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3',
    'M12 17h.01'
  ],
  'check-circle': ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'm9 12 2 2 4-4'],
  'close-circle': ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'm15 9-6 6', 'm9 9 6 6'],
  'plus-circle': ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 8v8', 'M8 12h8'],
  'minus-circle': ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M8 12h8'],
  ban: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'm4.9 4.9 14.2 14.2'],
  shield: [
    'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'
  ],
  'shield-check': [
    'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
    'm9 12 2 2 4-4'
  ],

  // ---------------------------------------------------------------------
  // Media
  // ---------------------------------------------------------------------
  play: ['M6 3 20 12 6 21V3Z'],
  pause: ['M8 4v16', 'M16 4v16'],
  'skip-back': ['M19 20 9 12l10-8v16Z', 'M5 19V5'],
  'skip-forward': ['m5 4 10 8-10 8V4Z', 'M19 5v14'],
  volume: [
    'M11 5 6 9H2v6h4l5 4V5Z',
    'M15.54 8.46a5 5 0 0 1 0 7.07',
    'M19.07 4.93a10 10 0 0 1 0 14.14'
  ],
  'volume-off': ['M11 5 6 9H2v6h4l5 4V5Z', 'M22 9l-6 6', 'M16 9l6 6'],
  image: [
    'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z',
    'M9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
    'm21 15-5-5L5 21'
  ],
  video: [
    'm22 8-6 4 6 4V8Z',
    'M5 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z'
  ],
  music: [
    'M9 18V5l12-2v13',
    'M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    'M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
  ],
  camera: [
    'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z',
    'M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'
  ],
  mic: [
    'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z',
    'M19 10v2a7 7 0 0 1-14 0v-2',
    'M12 19v3'
  ],

  // ---------------------------------------------------------------------
  // Files & data
  // ---------------------------------------------------------------------
  file: ['M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z', 'M14 2v4a2 2 0 0 0 2 2h4'],
  'file-text': [
    'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
    'M14 2v4a2 2 0 0 0 2 2h4',
    'M10 11H8',
    'M16 15H8',
    'M16 19H8'
  ],
  folder: [
    'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z'
  ],
  'folder-open': [
    'm6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2'
  ],
  clipboard: [
    'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
    'M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z'
  ],
  paperclip: [
    'm21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48'
  ],
  archive: [
    'M3 3h18v5H3z',
    'M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8',
    'M10 12h4'
  ],
  database: [
    'M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3Z',
    'M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5',
    'M3 12c0 1.66 4 3 9 3s9-1.34 9-3'
  ],
  table: [
    'M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z',
    'M3 9h18',
    'M3 15h18',
    'M9 3v18'
  ],
  chart: ['M3 3v16a2 2 0 0 0 2 2h16', 'M7 15l4-5 3 3 5-6'],

  // ---------------------------------------------------------------------
  // Communication
  // ---------------------------------------------------------------------
  mail: [
    'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
    'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'
  ],
  phone: [
    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z'
  ],
  'message-circle': ['M7.9 20A9 9 0 1 0 4 16.1L2 22Z'],
  'message-square': [
    'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'
  ],
  bell: [
    'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9',
    'M10.3 21a1.94 1.94 0 0 0 3.4 0'
  ],
  'bell-off': [
    'm2 2 20 20',
    'M8.7 3A6 6 0 0 1 18 8c0 1.6.3 3 .8 4.2',
    'M6 8c0 7-3 9-3 9h11.3',
    'M10.3 21a1.94 1.94 0 0 0 3.4 0'
  ],
  send: ['M22 2 11 13', 'M22 2 15 22l-4-9-9-4Z'],
  inbox: [
    'M22 12h-6l-2 3h-4l-2-3H2',
    'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z'
  ],
  at: [
    'M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8',
    'M16 11a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'
  ],

  // ---------------------------------------------------------------------
  // People
  // ---------------------------------------------------------------------
  user: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
  users: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
    'M22 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75'
  ],
  'user-plus': [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
    'M19 8v6',
    'M22 11h-6'
  ],
  'user-minus': [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
    'M22 11h-6'
  ],
  smile: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M8 14s1.5 2 4 2 4-2 4-2', 'M9 9h.01', 'M15 9h.01'],

  // ---------------------------------------------------------------------
  // Time
  // ---------------------------------------------------------------------
  calendar: [
    'M8 2v4',
    'M16 2v4',
    'M3 10h18',
    'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z'
  ],
  clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 6v6l4 2'],
  history: ['M3 12a9 9 0 1 0 2.64-6.36L3 8', 'M3 3v5h5', 'M12 7v5l4 2'],
  timer: ['M10 2h4', 'm12 14 3-3', 'M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z'],

  // ---------------------------------------------------------------------
  // Interface
  // ---------------------------------------------------------------------
  home: ['m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 21V12h6v9'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  grid: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z'],
  list: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
  star: ['m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  heart: [
    'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'
  ],
  bookmark: ['m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z'],
  eye: [
    'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0',
    'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'
  ],
  'eye-off': [
    'm2 2 20 20',
    'M6.71 6.71A10.75 10.75 0 0 0 2.062 12.35a1 1 0 0 0 0 .695 10.75 10.75 0 0 0 14.63 5.35',
    'M10.58 10.58a2 2 0 0 0 2.83 2.83',
    'M14.12 9.88a3 3 0 0 1 1.41 1.41',
    'M9.9 4.24A10.75 10.75 0 0 1 12 4c4.1 0 7.7 2.42 9.94 6.35a1 1 0 0 1 0 .696 10.8 10.8 0 0 1-1.67 2.26'
  ],
  lock: [
    'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z',
    'M7 11V7a5 5 0 0 1 10 0v4'
  ],
  unlock: [
    'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z',
    'M7 11V7a5 5 0 0 1 9.9-1'
  ],
  key: [
    'M2.59 13.41A2 2 0 0 1 2 12V5a2 2 0 0 1 2-2h7a2 2 0 0 1 1.41.59l9 9a2 2 0 0 1 0 2.82l-4 4a2 2 0 0 1-2.82 0Z',
    'M6 6h.01',
    'M13 13l-3 3'
  ],
  more: [
    'M5 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0',
    'M11 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0',
    'M17 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0'
  ],
  'more-vertical': [
    'M12 4a1 1 0 1 0 0 2 1 1 0 1 0 0-2',
    'M12 11a1 1 0 1 0 0 2 1 1 0 1 0 0-2',
    'M12 18a1 1 0 1 0 0 2 1 1 0 1 0 0-2'
  ],
  layout: [
    'M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z',
    'M3 9h18',
    'M9 21V9'
  ],
  sidebar: [
    'M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z',
    'M9 3v18'
  ],
  expand: [
    'M3 3h6v6H3z',
    'M15 15h6v6h-6z',
    'M15 3h6v6h-6',
    'M3 15h6v6H3'
  ],
  panel: [
    'M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z',
    'M16 3v18'
  ],
  'dot-grid': [
    'M5 4a1 1 0 1 0 0 2 1 1 0 1 0 0-2',
    'M12 4a1 1 0 1 0 0 2 1 1 0 1 0 0-2',
    'M19 4a1 1 0 1 0 0 2 1 1 0 1 0 0-2',
    'M5 11a1 1 0 1 0 0 2 1 1 0 1 0 0-2',
    'M12 11a1 1 0 1 0 0 2 1 1 0 1 0 0-2',
    'M19 11a1 1 0 1 0 0 2 1 1 0 1 0 0-2',
    'M5 18a1 1 0 1 0 0 2 1 1 0 1 0 0-2',
    'M12 18a1 1 0 1 0 0 2 1 1 0 1 0 0-2',
    'M19 18a1 1 0 1 0 0 2 1 1 0 1 0 0-2'
  ],

  // ---------------------------------------------------------------------
  // Development & system
  // ---------------------------------------------------------------------
  code: ['m16 18 6-6-6-6', 'm8 6-6 6 6 6'],
  terminal: ['m4 17 6-6-6-6', 'M12 19h8'],
  'git-branch': [
    'M6 3v12',
    'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M18 9a9 9 0 0 1-9 9'
  ],
  bug: [
    'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
    'M9 6V4a3 3 0 0 1 6 0v2',
    'M3 13h4',
    'M17 13h4',
    'M6 8l2 2',
    'M16 8l-2 2'
  ],
  cpu: [
    'M5 5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
    'M9 9h6v6H9z',
    'M9 2v3',
    'M15 2v3',
    'M9 19v3',
    'M15 19v3',
    'M2 9h3',
    'M2 15h3',
    'M19 9h3',
    'M19 15h3'
  ],
  server: [
    'M2 2h20v8H2z',
    'M2 14h20v8H2z',
    'M6 6h.01',
    'M6 18h.01'
  ],
  cloud: ['M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z'],
  'cloud-download': [
    'M12 13v8',
    'm8 17 4 4 4-4',
    'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z'
  ],
  wifi: ['M5 13a10 10 0 0 1 14 0', 'M8.5 16.5a5 5 0 0 1 7 0', 'M2 8.82a15 15 0 0 1 20 0', 'M12 20h.01'],
  globe: [
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
    'M2 12h20',
    'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z'
  ],
  'git-merge': [
    'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M6 3v12',
    'M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M18 9a9 9 0 0 1-9 9'
  ],
  box: [
    'M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8Z',
    'm3.3 7 8.7 5 8.7-5',
    'M12 22V12'
  ],
  layers: [
    'm12 2 9 5-9 5-9-5 9-5Z',
    'm3 12 9 5 9-5',
    'm3 17 9 5 9-5'
  ]
}

export type IconName = keyof typeof icons

export const iconNames = Object.keys(icons) as IconName[]

/**
 * Category metadata for docs galleries and icon pickers.
 * Every name here must exist in `icons` — the test suite enforces it.
 */
export const iconGroups: Record<string, string[]> = {
  方向导航: [
    'arrow-left',
    'arrow-right',
    'arrow-up',
    'arrow-down',
    'arrow-up-right',
    'arrow-down-left',
    'chevron-down',
    'chevron-up',
    'chevron-left',
    'chevron-right',
    'chevrons-left',
    'chevrons-right',
    'chevrons-up',
    'chevrons-down',
    'corner-down-left',
    'corner-down-right',
    'corner-up-left',
    'corner-up-right',
    'move',
    'maximize',
    'minimize'
  ],
  操作: [
    'check',
    'close',
    'plus',
    'minus',
    'edit',
    'delete',
    'copy',
    'duplicate',
    'refresh',
    'search',
    'zoom-in',
    'zoom-out',
    'download',
    'upload',
    'save',
    'filter',
    'sort',
    'arrow-up-down',
    'undo',
    'redo',
    'share',
    'link',
    'external-link',
    'print',
    'settings',
    'power'
  ],
  状态: [
    'loading',
    'success',
    'warning',
    'error',
    'info',
    'question',
    'check-circle',
    'close-circle',
    'plus-circle',
    'minus-circle',
    'ban',
    'shield',
    'shield-check'
  ],
  媒体: [
    'play',
    'pause',
    'skip-back',
    'skip-forward',
    'volume',
    'volume-off',
    'image',
    'video',
    'music',
    'camera',
    'mic'
  ],
  文件数据: [
    'file',
    'file-text',
    'folder',
    'folder-open',
    'clipboard',
    'paperclip',
    'archive',
    'database',
    'table',
    'chart'
  ],
  通信: ['mail', 'phone', 'message-circle', 'message-square', 'bell', 'bell-off', 'send', 'inbox', 'at'],
  用户: ['user', 'users', 'user-plus', 'user-minus', 'smile'],
  时间: ['calendar', 'clock', 'history', 'timer'],
  界面: [
    'home',
    'menu',
    'grid',
    'list',
    'star',
    'heart',
    'bookmark',
    'eye',
    'eye-off',
    'lock',
    'unlock',
    'key',
    'more',
    'more-vertical',
    'layout',
    'sidebar',
    'panel',
    'expand',
    'dot-grid'
  ],
  开发: [
    'code',
    'terminal',
    'git-branch',
    'git-merge',
    'bug',
    'cpu',
    'server',
    'cloud',
    'cloud-download',
    'wifi',
    'globe',
    'box',
    'layers'
  ]
}

// ---------------------------------------------------------------------------
// Custom icons
// ---------------------------------------------------------------------------

export type IconMode = 'stroke' | 'fill'

export interface IconDefinition {
  /** Path `d` values. Rendered as `<path>` elements. */
  paths?: string[]
  /** Raw inner SVG markup, for shapes a path cannot express (circle, rect, ...). */
  content?: string
  /** Defaults to `0 0 24 24`. */
  viewBox?: string
  /**
   * `stroke` (default) draws outline icons with `currentColor`; `fill` fills
   * shapes with `currentColor` and is what most brand logos need.
   */
  mode?: IconMode
  /** Stroke width when `mode` is `stroke`. Defaults to `2`. */
  strokeWidth?: number
}

export type IconSource = string[] | IconDefinition

const customIcons: Record<string, IconDefinition> = {}

const normalize = (source: IconSource): IconDefinition =>
  Array.isArray(source) ? { paths: source } : source

/**
 * Register custom icons. Accepts either an array of path `d` values or a full
 * definition object.
 *
 * ```ts
 * addIcons({
 *   brand: ['M12 2 2 22h20z'],
 *   heart: { mode: 'fill', paths: ['M12 21s-8-4.5-8-10a4.5 4.5 0 0 1 8-2 4.5 4.5 0 0 1 8 2c0 5.5-8 10-8 10z'] }
 * })
 * ```
 */
export const addIcons = (source: Record<string, IconSource>): void => {
  Object.entries(source).forEach(([name, definition]) => {
    customIcons[name] = normalize(definition)
  })
}

/** Remove a previously registered custom icon. Built-in icons are unaffected. */
export const removeIcon = (name: string): void => {
  delete customIcons[name]
}

/** Look up an icon by name, preferring custom registrations over built-ins. */
export const getIcon = (name: string): IconDefinition | undefined => {
  if (customIcons[name]) return customIcons[name]
  const builtin = icons[name]
  return builtin ? { paths: builtin } : undefined
}

/** All available icon names, including custom ones. */
export const getIconNames = (): string[] => [
  ...Object.keys(icons),
  ...Object.keys(customIcons).filter(name => !(name in icons))
]

/** Built-in icons grouped by category, for galleries and pickers. */
export const getIconGroups = (): Record<string, string[]> => iconGroups
