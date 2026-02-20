export const DisplayMode = Object.freeze({
  BIG_SCREEN: 'big-screen',
  SHARED_TABLET: 'shared-tablet',
  INDIVIDUAL_FIELD: 'individual-field'
});

export const PublicViews = {
  [DisplayMode.BIG_SCREEN]: {
    description: 'Shows all battlefields at once in split/top-down layout.',
    publicDetail: 'full-public-state'
  },
  [DisplayMode.SHARED_TABLET]: {
    description: 'Single shared battlefield controlled by player phones.',
    publicDetail: 'full-public-state'
  },
  [DisplayMode.INDIVIDUAL_FIELD]: {
    description: 'Per-player battlefield with opponent summaries.',
    publicDetail: 'summary-opponents'
  }
};
