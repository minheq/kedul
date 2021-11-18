import { Colors, HeadingSizes, TextSizes, Theme } from 'paramount-ui';

export const palette = {
  green: {
    100: '#014D40',
    200: '#0C6B58',
    300: '#14866E',
    400: '#199473',
    500: '#27AB83',
    600: '#3EBD93',
    700: '#65D6AD',
    800: '#8EEDC7',
    900: '#C6F7E2',
    1000: '#EFFCF6',
  },

  neutral: {
    100: '#102A43',
    200: '#243B53',
    300: '#334E68',
    400: '#486581',
    500: '#5D7999',
    600: '#829AB1',
    700: '#9FB3C8',
    800: '#BCCCDC',
    900: '#D9E2EC',
    1000: '#F0F4F8',
  },

  blue: {
    100: '#003E6B',
    200: '#0A558C',
    300: '#0F609B',
    400: '#186FAF',
    500: '#2680C2',
    600: '#4098D7',
    700: '#62B0E8',
    800: '#84C5F4',
    900: '#B6E0FE',
    1000: '#DCEEFB',
  },

  purple: {
    100: '#240754',
    200: '#34126F',
    300: '#421987',
    400: '#51279B',
    500: '#653CAD',
    600: '#724BB7',
    700: '#8662C7',
    800: '#A081D9',
    900: '#CFBCF2',
    1000: '#EAE2F8',
  },

  red: {
    100: '#610404',
    200: '#780A0A',
    300: '#911111',
    400: '#A61B1B',
    500: '#BA2525',
    600: '#D64545',
    700: '#E66A6A',
    800: '#F29B9B',
    900: '#FACDCD',
    1000: '#FFEEEE',
  },

  yellow: {
    100: '#513C06',
    200: '#7C5E10',
    300: '#A27C1A',
    400: '#C99A2E',
    500: '#E9B949',
    600: '#F7D070',
    700: '#F9DA8B',
    800: '#F8E3A3',
    900: '#FCEFC7',
    1000: '#FFFAEB',
  },
};

export const colors: Colors = {
  background: {
    base: 'white',
    content: 'white',

    greyDark: palette.neutral[800],
    greyDefault: palette.neutral[900],
    greyLight: palette.neutral[1000],

    primaryDark: palette.green[800],
    primaryDefault: palette.green[700],
    primaryLight: palette.green[1000],

    secondaryDark: palette.blue[800],
    secondaryDefault: palette.blue[900],
    secondaryLight: palette.blue[1000],

    dangerDark: palette.red[100],
    dangerDefault: palette.red[200],
    dangerLight: palette.red[400],

    infoDark: palette.blue[200],
    infoDefault: palette.blue[300],
    infoLight: palette.blue[500],

    successDark: palette.green[300],
    successDefault: palette.green[400],
    successLight: palette.green[600],

    warningDark: palette.yellow[200],
    warningDefault: palette.yellow[300],
    warningLight: palette.yellow[500],
  },

  button: {
    danger: palette.red[300],
    dangerText: 'white',
    default: palette.neutral[1000],
    defaultText: palette.neutral[200],
    disabled: palette.red[300],
    disabledText: 'white',
    primary: palette.green[800],
    primaryText: palette.neutral[100],
    secondary: palette.green[900],
    secondaryText: palette.neutral[100],
  },

  border: {
    danger: palette.red[100],
    default: palette.neutral[900],
    info: palette.blue[100],
    primary: palette.green[100],
    secondary: palette.blue[100],
    success: palette.green[200],
    warning: palette.yellow[100],
  },

  text: {
    danger: palette.red[200],
    default: palette.neutral[200],
    info: palette.blue[200],
    link: palette.green[300],
    muted: palette.neutral[500],
    primary: palette.green[200],
    secondary: palette.blue[200],
    selected: 'white',
    success: palette.green[200],
    warning: palette.yellow[200],
    white: 'white',
  },
};

export const headingSizes: HeadingSizes = {
  xxxlarge: {
    fontSize: 96,
    fontWeight: '500',
    lineHeight: 112,
  },

  xxlarge: {
    fontSize: 60,
    fontWeight: '500',
    lineHeight: 64,
  },

  xlarge: {
    fontSize: 48,
    fontWeight: '500',
    lineHeight: 56,
  },

  large: {
    fontSize: 34,
    fontWeight: '500',
    lineHeight: 40,
  },

  medium: {
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 32,
  },

  small: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 24,
  },
};

export const textSizes: TextSizes = {
  large: {
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 24,
  },

  medium: {
    fontSize: 19,
    fontWeight: '400',
    lineHeight: 24,
  },

  small: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 16,
  },

  xsmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
};

export const theme: Partial<Theme> = {
  textSizes,
  headingSizes,
  colors,

  overrides: {
    FormField: {
      Root: {
        style: {
          paddingBottom: 24,
        },
      },
      Label: {
        props: {
          overrides: {
            LabelText: {
              props: { size: 'small' },
            },
          },
        },
      },
      Description: {
        props: {
          size: 'small',
        },
      },
    },
    ListItem: {
      Root: {
        style: {
          backgroundColor: colors.background.base,
          alignItems: 'center',
        },
      },
    },
  },
};
