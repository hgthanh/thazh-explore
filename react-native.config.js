module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: {
          project: 'ios/ThazhExplore.xcodeproj',
          projectName: 'ThazhExplore',
          libraryFolder: 'Libraries',
        },
        android: {
          sourceDir: '../node_modules/react-native-vector-icons/android/',
          packageImportPath: 'import io.github.react_native_vector_icons.VectorIconsPackage;',
        },
      },
    },
  },
  assets: ['./src/assets/fonts/'],
};