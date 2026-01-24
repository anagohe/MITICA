// sanity/client.ts
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'cdstv0qp', // 👈 mismo que en sanity.config.ts
  dataset: 'production', // 👈 mismo dataset
  // ✅ apiVersion más reciente (mejor compatibilidad)
  apiVersion: '2024-01-01',
  // ✅ En producción: TRUE para ahorrar bandwidth/carga (tu caso)
  useCdn: true,
  // ✅ Evita drafts en producción (menos payload/variantes)
  perspective: 'published',
});
