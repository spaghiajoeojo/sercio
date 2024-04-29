import * as Orama from '@orama/orama';
import Item from '../models/Item';
import { embeddings } from './feature-extraction';

type Entry = { path: string; name: string; embedding: string; }

const LIMIT = 50;

const createDB = () => {
  return Orama.create({
    schema: {
      path: 'string',
      name: 'string',
      embedding: 'vector[384]'
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

let database: Orama.Orama<Entry>;
createDB().then(db => database = db);

const reset = async () => {
  database = await createDB();
};

/**
 * Insert in database an array of items
 * @param {Array<Item>} items 
 */
const insert = async (items: Item[]) => {
  const entries = await Promise.all(
    items.map(
      async (item) => {
        const embedding = await embeddings(item.name);
        return ({ ...item, embedding })}
    )
    )
  // @ts-expect-error - https://github.com/askorama/orama/issues/542
  await Orama.insertMultiple(database, entries);
}

const searchByName = (name: string, page: number) => Orama.search(database, {
  term: name,
  properties: ['name'],
  exact: false,
  tolerance: 1,
  limit: LIMIT,
  offset: page * LIMIT,
}).then(res => res.hits.map(hit => new Item(hit.document)))

const searchByVector = async (query: string, page: number) => {
  const vectorValue = await embeddings(query);
  return Orama.search(database, {
  mode: 'vector',
  vector: {
    value: vectorValue,
    property: 'embedding',
  },
  similarity: 0.1,
  includeVectors: true,
  limit: LIMIT,
  offset: page * LIMIT,
})
.then(res => res.hits.map(hit => new Item(hit.document)))}

export {
  reset,
  insert,
  searchByName,
  searchByVector,
}
