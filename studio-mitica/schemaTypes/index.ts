// studio-mitica/schemaTypes/index.ts

import * as objects from './objects'
import * as home from './home'
import * as about from './about'
import * as products from './products'
import * as community from './community'
import * as general from './general'
import * as locationsPage from './locationsPage'
import * as terrazaMitica from './terrazaMitica'

// Tomamos todos los exports de cada archivo y los metemos en un solo array.
// Cualquier cosa que exportes en esos archivos (pages, objetos, etc.) se
// registrará como schema en el Studio.
export const schemaTypes = [
  ...Object.values(objects),
  ...Object.values(home),
  ...Object.values(about),
  ...Object.values(products),
  ...Object.values(community),
  ...Object.values(general),
  ...Object.values(locationsPage),
  ...Object.values(terrazaMitica),
]