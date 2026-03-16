module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for React Native Reanimated - must be last
      'react-native-reanimated/plugin',
      // Module resolver for crypto shims required by Sequence WaaS
      [
        'module-resolver',
        {
          alias: {
            crypto: 'react-native-quick-crypto',
            stream: 'readable-stream',
            buffer: '@craftzdog/react-native-buffer',
          },
        },
      ],
    ],
  };
};
