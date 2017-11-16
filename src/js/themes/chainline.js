
const baseSpacing = 24;
const background = '#444';

export default {
  global: {
    colors: {
      background,
      darkBackgroundTextColor: 'rgba(255, 255, 255, 0.95)',
      darkBackground: {
        text: 'rgba(255, 255, 255, 0.95)',
      },
      accent: ['#2AD2C9', '#614767', '#ff8d6d', '#61c9cf'],
      brand: '#69B8D6',
      neutral: ['#425563', '#5F7A76', '#80746E', '#767676', '#f8f8f8'],
      status: {
        critical: '#F04953',
        error: '#F04953',
        warning: '#FFD144',
        ok: '#01a982',
        unknown: '#CCCCCC',
        disabled: '#CCCCCC',
      },
    },
    control: {
      font: {
        weight: 500,
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
    edgeSize: {
      xsmall: `${baseSpacing / 4}px`,
      small: `${baseSpacing / 2}px`,
      medium: `${baseSpacing}px`,
      medlarge: `${baseSpacing * 1.4}px`,
      medlarge2: '40px',
      large: `${baseSpacing * 2}px`,
      xlarge: `${baseSpacing * 4}px`,
    },
    font: {
      family: 'Rubik, -apple-system, BlinkMacSystemFont, San Francisco, Roboto, Segoe UI, Helvetica Neue, Lucida Grande, sans-serif',
      face: `
        @font-face {
          font-family: 'Nunito';
          font-style: normal;
          font-weight: 700;
          src: local('Nunito Bold'), local('Nunito-Bold'), url(https://fonts.gstatic.com/s/nunito/v9/TttUCfJ272GBgSKaOaD7KpBw1xU1rKptJj_0jans920.woff2) format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
        }
        @font-face {
          font-family: 'Nunito';
          font-style: normal;
          font-weight: 600;
          src: local('Nunito SemiBold'), local('Nunito-SemiBold'), url(https://fonts.gstatic.com/s/nunito/v9/NcqjkPJTQZlJIFxZdZcTe5Bw1xU1rKptJj_0jans920.woff2) format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
        }
        @font-face {
          font-family: 'Rubik';
          font-style: normal;
          font-weight: 500;
          src: local('Rubik Medium'), local('Rubik-Medium'), url(https://fonts.gstatic.com/s/rubik/v7/IUSlgBbgyuDQpy87mBOAc3YhjbSpvc47ee6xR_80Hnw.woff2) format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
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
      page: '1000px',
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
    extend: 'letter-spacing: 0.03em;',
  },
  checkBox: {
    check: {
      color: '#69B8D6',
    },
  },
  radioButton: {
    check: {
      color: '#69B8D6',
    },
  },
  heading: {
    // maxWidth chosen to be ~50 characters wide
    // see: https://ux.stackexchange.com/a/34125
    level: {
      1: {
        medium: { size: '56px', height: 1.125, maxWidth: 'auto' },
        small: { size: '24px', height: 1.333, maxWidth: 'auto' },
        large: { size: '96px', height: 1.125, maxWidth: 'auto' },
      },
      2: {
        medium: { size: '34px', height: 1.23, maxWidth: 'auto' },
        small: { size: '18px', height: 1.333, maxWidth: 'auto' },
        large: { size: '52px', height: 1.125, maxWidth: 'auto' },
      },
      3: {
        medium: { size: '26px', height: 1.333, maxWidth: 'auto' },
        small: { size: '18px', height: 1.333, maxWidth: 'auto' },
        large: { size: '36px', height: 1.23, maxWidth: 'auto' },
      },
      4: {
        medium: { size: '18px', height: 1.333 },
        small: { size: '16px', height: 1.375 },
        large: { size: '24px', height: 1.333 },
      },
    },
    weight: 400,
  },
  paragraph: {
    // maxWidth chosen to be ~50 characters wide
    // see: https://ux.stackexchange.com/a/34125
    medium: { size: '16px', height: 1.375, maxWidth: `${baseSpacing * 16}px` },
    small: { size: '14px', height: 1.43, maxWidth: `${baseSpacing * 14}px` },
    large: { size: '24px', height: 1.333, maxWidth: `${baseSpacing * 24}px` },
    xlarge: { size: '32px', height: 1.1875, maxWidth: `${baseSpacing * 32}px` },
    full: { size: '16px', height: 1.375, maxWidth: '100%' },
  },
};
