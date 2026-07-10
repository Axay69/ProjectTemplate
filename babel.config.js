module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        cwd: 'packagejson',
        root: ['./src'],
        alias: {
          '@app': './src/app',
          '@core': './src/core',
          '@features': './src/features',
          '@modules': './src/modules',
          '@shared': './src/shared',
          '@assets': './src/shared/assets',
          '@theme': './src/shared/theme',
          '@hooks': './src/shared/hooks',
          '@utils': './src/shared/utils',
          '@types': './src/shared/types',
          '@constants': './src/shared/constants',
          '@store': './src/store',
        },
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
      },
    ],
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
