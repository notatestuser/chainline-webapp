
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
      family: '-apple-system, BlinkMacSystemFont, San Francisco, Roboto, Segoe UI, Helvetica Neue, Lucida Grande, sans-serif',
      face: '\n        @font-face {\n          font-family: "Metric";\n          src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Regular.woff") format(\'woff\');\n        }\n\n        @font-face {\n          font-family: "Metric";\n          src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Bold.woff") format(\'woff\');\n          font-weight: 700;\n        }\n\n        @font-face {\n          font-family: "Metric";\n          src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Semibold.woff") format(\'woff\');\n          font-weight: 600;\n        }\n\n        @font-face {\n          font-family: "Metric";\n          src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Light.woff") format(\'woff\');\n          font-weight: 100;\n        }\n      '
    },
    size: {
      xxsmall: `${baseSpacing * 2}px`, // 48
      xsmall: `${baseSpacing * 4}px`, // 96
      small: `${baseSpacing * 8}px`, // 192
      medium: `${baseSpacing * 16}px`, // 384
      large: `${baseSpacing * 32}px`, // 768
      xlarge: `${baseSpacing * 48}px`, // 1152
      full: '100%',
    },
  },
  anchor: {
    color: '#69b8d6',
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
    extend: 'letter-spacing: 0.04167em;',
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
        medium: { size: '36px', height: 1.23, maxWidth: 'auto' },
        small: { size: '18px', height: 1.333, maxWidth: 'auto' },
        large: { size: '48px', height: 1.125, maxWidth: 'auto' },
      },
      3: {
        medium: { size: '24px', height: 1.333 },
        small: { size: '18px', height: 1.333 },
        large: { size: '36px', height: 1.23 },
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
