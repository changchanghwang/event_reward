export abstract class Repository {
  protected strip(obj: Record<string, any>) {
    return Object.keys(obj).reduce((stripped, key) => {
      if (typeof obj[key] !== 'undefined') {
        stripped[key] = obj[key];
      }
      return stripped;
    }, {} as Record<string, any>);
  }
}
