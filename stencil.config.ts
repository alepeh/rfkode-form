import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'rfkode-form',
  globalStyle: 'src/globals/app.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};
