import Dexie, { type EntityTable } from "dexie";

export const db = new Dexie("WalkingData") as Dexie & {
  data: EntityTable<DataPoint>;
};

db.version(1).stores({
  data: "++id, timestamp, distance",
});


