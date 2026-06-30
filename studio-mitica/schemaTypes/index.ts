// studio-mitica/schemaTypes/index.ts

import * as objects from './objects'
import * as home from './home'
import * as about from './about'
import * as products from './products'
import * as community from './community'
import * as general from './general'
import * as locationsPage from './locationsPage'
import * as terrazaMitica from './terrazaMitica'

// navbarFooter ya viene incluido desde general.ts con:
// export { default as navbarFooter } from './miticaNavbarFooter'
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