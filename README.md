<div align="center">
  <h1>
    <img src="https://github.com/Musly/musly-ui/blob/main/public/assets/logo-dark.svg?raw=true" width="200" alt="Musly" />
  </h1>
</div>

# Musly Utils

**The musly app helps musicians and managers of musical groups to create and organize their music.**

This repository contains configurations and helpers that are shared between the Musly applications.

## Installation

```sh
yarn add @musly/utils
```

## Table Of Contents

* **eslint config**
  * Add the following to the `.eslintrc.js`:
  
    ```js
    module.exports = require('@musly/utils/eslint-config')
    ````

* **react-i18next**
  * exports a `initI18n()` function that can be used to set up i18n for `react-i18next`
* **webpack-config**
  * Add the following to the `webpack.config.js`:

    ```js
    require('dotenv').config(); // Needed to initialize Node ENV variables.
    module.exports = require('@musly/utils/webpack-config');
    ```
