import { defineConfig } from 'orval';

export default defineConfig({
  'crm-api': {
    output: {
      mode: 'split',
      target: './src/api-client/endpoints.ts',
      schemas: './src/api-client/models',
      client: 'axios',
      mock: true,
      override: {
        mutator: {
          path: './src/api-client/axios-instance.ts',
          name: 'customAxiosInstance',
        },
      },
    },
    input: {
      target: './src/swagger-output.json',
    },
  },
});
