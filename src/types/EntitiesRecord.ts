type EntitiesRecord = Record<string, {
    constructor: new () => BaseModel<Key>,
    equalityKeys: ReadonlyArray<keyof EntityByAlias<Key>>
  }>