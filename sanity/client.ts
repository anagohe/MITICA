// sanity/client.ts
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'ofzit8al',      // 👈 mismo que en sanity.config.ts
  dataset: 'production',      // 👈 mismo dataset
  apiVersion: '2023-01-01',
  useCdn: true,              // 👈 mejor en false mientras desarrollas
});
