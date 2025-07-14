module.exports = function (api) {
  api.cache(true); // Keep only one call to api.cache
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel" // Removed duplicate
    ],
    plugins: [
      ["module-resolver", {
        root: ["./"],
        alias: {
          "@": "./",
          "tailwind.config": "./tailwind.config.js"
        }
      }]
    ]
  };
};