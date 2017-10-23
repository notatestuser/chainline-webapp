export default {
  global: {
    colors: {
      accent: ['#2AD2C9', '#614767', '#ff8d6d'],
      brand: '#01a982',
      neutral: ['#425563', '#5F7A76', '#80746E', '#767676'],
      status: {
        critical: '#F04953',
        error: '#F04953',
        warning: '#FFD144',
        ok: '#01a982',
        unknown: '#CCCCCC',
        disabled: '#CCCCCC',
      },
    },
    font: {
      family: 'apple-system, BlinkMacSystemFont, San Francisco, Roboto, Segoe UI, Helvetica Neue, Lucida Grande, sans-serif',
      face: '\n        @font-face {\n          font-family: "Metric";\n          src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Regular.woff") format(\'woff\');\n        }\n\n        @font-face {\n          font-family: "Metric";\n          src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Bold.woff") format(\'woff\');\n          font-weight: 700;\n        }\n\n        @font-face {\n          font-family: "Metric";\n          src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Semibold.woff") format(\'woff\');\n          font-weight: 600;\n        }\n\n        @font-face {\n          font-family: "Metric";\n          src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Light.woff") format(\'woff\');\n          font-weight: 100;\n        }\n      '
    },
  },
  anchor: {
    color: 'inherit',
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
};
