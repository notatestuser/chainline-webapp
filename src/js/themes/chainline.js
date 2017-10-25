
const baseSpacing = 24;
const background = '#444';

export default {
  global: {
    colors: {
      background,
      darkBackgroundTextColor: 'rgba(255, 255, 255, 0.95)',
      accent: ['#2AD2C9', '#614767', '#ff8d6d'],
      brand: '#69B8D6',
      neutral: ['#425563', '#5F7A76', '#80746E', '#767676', '#81d7e4'],
      status: {
        critical: '#F04953',
        error: '#F04953',
        warning: '#FFD144',
        ok: '#01a982',
        unknown: '#CCCCCC',
        disabled: '#CCCCCC',
      },
    },
    drop: {
      backgroundColor: '#f8f8f8',
      border: {
        width: '0px',
        radius: '0px',
      },
      shadow: '0px 3px 8px rgba(100, 100, 100, 0.30)',
    },
    font: {
      family: 'Rubik, -apple-system, BlinkMacSystemFont, San Francisco, Roboto, Segoe UI, Helvetica Neue, Lucida Grande, sans-serif',
      face: `
        @font-face {
          font-family: 'Rubik';
          font-style: normal;
          font-weight: 400;
          src: local('Rubik'), local('Rubik-Regular'), url(https://fonts.gstatic.com/s/rubik/v7/Vi2gYeiEKThJHNpaE3cq54DGDUGfDkXyfkzVDelzfFk.woff2) format('woff2');
          unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
        }
        @font-face {
          font-family: 'Rubik';
          font-style: normal;
          font-weight: 400;
          src: local('Rubik'), local('Rubik-Regular'), url(https://fonts.gstatic.com/s/rubik/v7/p_PvaTv0YzIEJlEVv30xK6CWcynf_cDxXwCLxiixG1c.woff2) format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
        }`,
    },
    size: {
      xxsmall: `${baseSpacing * 2}px`, // 48
      xsmall: `${baseSpacing * 4}px`, // 96
      small: `${baseSpacing * 8}px`, // 192
      medium: `${baseSpacing * 16}px`, // 384
      large: `${baseSpacing * 32}px`, // 768
      xlarge: `${baseSpacing * 48}px`, // 1152
      page: '1050px',
      full: '100%',
    },
  },
  anchor: {
    color: '#379fc8',
  },
  breakpoints: {
    narrow: 699,
  },
  button: {
    border: {
      radius: '0px',
    },
    colors: {
      accent: '#ff8d6d',
      secondary: 'rgba(51,51,51,0.6)',
    },
    extend: 'letter-spacing: 0.02em;',
  },
  heading: {
    // maxWidth chosen to be ~50 characters wide
    // see: https://ux.stackexchange.com/a/34125
    level: {
      1: {
        medium: { size: '48px', height: 1.125, maxWidth: 'auto' },
        small: { size: '24px', height: 1.333, maxWidth: 'auto' },
        large: { size: '96px', height: 1.125, maxWidth: 'auto' },
      },
      2: {
        medium: { size: '32px', height: 1.23, maxWidth: 'auto' },
        small: { size: '18px', height: 1.333, maxWidth: 'auto' },
        large: { size: '44px', height: 1.125, maxWidth: 'auto' },
      },
      3: {
        medium: { size: '24px', height: 1.333, maxWidth: 'auto' },
        small: { size: '18px', height: 1.333, maxWidth: 'auto' },
        large: { size: '36px', height: 1.23, maxWidth: 'auto' },
      },
      4: {
        medium: { size: '18px', height: 1.333 },
        small: { size: '16px', height: 1.375 },
        large: { size: '24px', height: 1.333 },
      },
    },
    weight: 300,
  },
};
