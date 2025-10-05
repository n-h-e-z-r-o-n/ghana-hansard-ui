// Ghana Flag Color Palette - National Core Colors
export const ghanaColors = {
  // Primary Colors (Ghana Flag)
  red: {
    50: 'bg-red-50',
    100: 'bg-red-100',
    200: 'bg-red-200',
    300: 'bg-red-300',
    400: 'bg-red-400',
    500: 'bg-red-500',
    600: 'bg-red-600',
    700: 'bg-red-700',
    800: 'bg-red-800',
    900: 'bg-red-900',
  },
  yellow: {
    50: 'bg-yellow-50',
    100: 'bg-yellow-100',
    200: 'bg-yellow-200',
    300: 'bg-yellow-300',
    400: 'bg-yellow-400',
    500: 'bg-yellow-500',
    600: 'bg-yellow-600',
    700: 'bg-yellow-700',
    800: 'bg-yellow-800',
    900: 'bg-yellow-900',
  },
  green: {
    50: 'bg-green-50',
    100: 'bg-green-100',
    200: 'bg-green-200',
    300: 'bg-green-300',
    400: 'bg-green-400',
    500: 'bg-green-500',
    600: 'bg-green-600',
    700: 'bg-green-700',
    800: 'bg-green-800',
    900: 'bg-green-900',
  },
  // Text Colors
  text: {
    red: {
      50: 'text-red-50',
      100: 'text-red-100',
      200: 'text-red-200',
      300: 'text-red-300',
      400: 'text-red-400',
      500: 'text-red-500',
      600: 'text-red-600',
      700: 'text-red-700',
      800: 'text-red-800',
      900: 'text-red-900',
    },
    yellow: {
      50: 'text-yellow-50',
      100: 'text-yellow-100',
      200: 'text-yellow-200',
      300: 'text-yellow-300',
      400: 'text-yellow-400',
      500: 'text-yellow-500',
      600: 'text-yellow-600',
      700: 'text-yellow-700',
      800: 'text-yellow-800',
      900: 'text-yellow-900',
    },
    green: {
      50: 'text-green-50',
      100: 'text-green-100',
      200: 'text-green-200',
      300: 'text-green-300',
      400: 'text-green-400',
      500: 'text-green-500',
      600: 'text-green-600',
      700: 'text-green-700',
      800: 'text-green-800',
      900: 'text-green-900',
    },
  },
  // Border Colors
  border: {
    red: {
      50: 'border-red-50',
      100: 'border-red-100',
      200: 'border-red-200',
      300: 'border-red-300',
      400: 'border-red-400',
      500: 'border-red-500',
      600: 'border-red-600',
      700: 'border-red-700',
      800: 'border-red-800',
      900: 'border-red-900',
    },
    yellow: {
      50: 'border-yellow-50',
      100: 'border-yellow-100',
      200: 'border-yellow-200',
      300: 'border-yellow-300',
      400: 'border-yellow-400',
      500: 'border-yellow-500',
      600: 'border-yellow-600',
      700: 'border-yellow-700',
      800: 'border-yellow-800',
      900: 'border-yellow-900',
    },
    green: {
      50: 'border-green-50',
      100: 'border-green-100',
      200: 'border-green-200',
      300: 'border-green-300',
      400: 'border-green-400',
      500: 'border-green-500',
      600: 'border-green-600',
      700: 'border-green-700',
      800: 'border-green-800',
      900: 'border-green-900',
    },
  },
  // Gradients
  gradients: {
    primary: 'bg-gradient-to-r from-red-600 via-yellow-500 to-green-600',
    primaryHover: 'hover:from-red-700 hover:via-yellow-600 hover:to-green-700',
    primaryText: 'bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 bg-clip-text text-transparent',
    redToGreen: 'bg-gradient-to-r from-red-600 to-green-600',
    redToGreenHover: 'hover:from-red-700 hover:to-green-700',
    background: 'bg-gradient-to-br from-red-50 via-yellow-50 to-green-50',
    backgroundAlt: 'bg-gradient-to-r from-red-50 via-yellow-50 to-green-50',
  },
  // Focus and Ring Colors
  focus: {
    red: 'focus:ring-red-500 focus:border-red-500',
    yellow: 'focus:ring-yellow-500 focus:border-yellow-500',
    green: 'focus:ring-green-500 focus:border-green-500',
  },
  // Status Colors
  status: {
    success: 'bg-green-100 text-green-600 border-green-200',
    warning: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    error: 'bg-red-100 text-red-600 border-red-200',
    info: 'bg-blue-100 text-blue-600 border-blue-200',
  },
};

// Common color combinations
export const colorCombinations = {
  // Primary button
  primaryButton: `${ghanaColors.gradients.primary} ${ghanaColors.gradients.primaryHover} text-white`,
  
  // Secondary button (red)
  secondaryButton: `${ghanaColors.red[600]} hover:${ghanaColors.red[700]} text-white`,
  
  // Success button (green)
  successButton: `${ghanaColors.green[600]} hover:${ghanaColors.green[700]} text-white`,
  
  // Warning button (yellow)
  warningButton: `${ghanaColors.yellow[600]} hover:${ghanaColors.yellow[700]} text-white`,
  
  // Input focus
  inputFocus: `${ghanaColors.focus.yellow}`,
  
  // Card backgrounds
  cardBackground: `${ghanaColors.gradients.background}`,
  
  // Text gradients
  headingGradient: `${ghanaColors.gradients.primaryText}`,
  
  // Status indicators
  connected: `${ghanaColors.green[500]} ${ghanaColors.text.green[600]}`,
  disconnected: `${ghanaColors.yellow[500]} ${ghanaColors.text.yellow[600]}`,
  error: `${ghanaColors.red[500]} ${ghanaColors.text.red[600]}`,
};

export default ghanaColors;
