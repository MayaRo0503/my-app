module.exports = {
  // presets: ["module:metro-react-native-babel-preset"],
  presets: ["babel-preset-expo"],
  plugins: ["expo-router/babel"],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
        allowUndefined: false,
      },
    ],
    ["@babel/plugin-transform-class-properties", { loose: true }],
    ["@babel/plugin-transform-private-methods", { loose: true }],
    ["@babel/plugin-transform-private-property-in-object", { loose: true }],
  ],
};
