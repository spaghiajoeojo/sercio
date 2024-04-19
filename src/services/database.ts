import * as Orama from '@orama/orama';
import Item from '../models/Item';

const LIMIT = 50;

const createDB = () => {
  return Orama.create({
    schema: {
      path: 'string',
      name: 'string',
    },
    components: {
      tokenizer: {
        language: 'english',
        normalizationCache: new Map(),
        tokenize(raw) {
          return raw.split(/\s|_|-|\./);
        }
      }
    }
  });
};

let database: Orama.Orama<{ path: string; name: string; }>;
createDB().then(db => database = db);

const reset = async () => {
  database = await createDB();
};

/**
 * Insert in database an array of items
 * @param {Array<Item>} items 
 */
const insert = async (items: Item[]) => {
  // @ts-expect-error - https://github.com/askorama/orama/issues/542
  await Orama.insertMultiple(database, items);
}

const searchByName = (name: string, page: number) => Orama.search(database, {
  term: name,
  properties: ['name'],
  exact: false,
  tolerance: 1,
  limit: LIMIT,
  offset: page * LIMIT,
}).then(res => res.hits.map(hit => new Item(hit.document)))

export {
  reset,
  insert,
  searchByName,
}
