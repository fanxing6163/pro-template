/**
 * 简单包装一 sessionStorage 和 localStorage 的使用
 */
class Storage {
  static serialize(data: any) {
    return JSON.stringify(data);
  }
  static deserialize(data: any) {
    return JSON.parse(data);
  }

  static set(storage: any, key: string, data: any) {
    storage.setItem(key, this.serialize(data));
  }

  static get(storage: any, key: string) {
    const serializedData = storage.getItem(key);
    return serializedData ? this.deserialize(serializedData) : undefined;
  }

  static remove(storage: any, key: string) {
    storage.removeItem(key);
  }

  static clear(storage: any) {
    storage.clear();
  }
}
/**
 * eg: SessionStorage.set('name','Hello World')
 */
export class SessionStorage {
  static clear() {
    Storage.clear(window.sessionStorage);
  }
  static remove(key: string) {
    Storage.remove(window.sessionStorage, key);
  }
  static set(key: string, value: any) {
    Storage.set(window.sessionStorage, key, value);
  }
  static get(key: string) {
    return Storage.get(window.sessionStorage, key);
  }
}
/**
 * eg: LocalStorage.set('name','Hello World')
 */
export class LocalStorage {
  static clear() {
    Storage.clear(window.localStorage);
  }
  static remove(key: string) {
    Storage.remove(window.localStorage, key);
  }
  static set(key: string, value: any) {
    Storage.set(window.localStorage, key, value);
  }
  static get(key: string) {
    return Storage.get(window.localStorage, key);
  }
}
