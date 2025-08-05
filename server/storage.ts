// This application doesn't require persistent storage
// All calculations are stateless
export interface IStorage {}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
