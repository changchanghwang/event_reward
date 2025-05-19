export abstract class Repository {
  protected strip(obj: Record<string, any>) {
    return Object.keys(obj).reduce(
      (stripped, key) => {
        if (typeof obj[key] !== 'undefined') {
          stripped[key] = obj[key];
        }
        return stripped;
      },
      {} as Record<string, any>,
    );
  }

  protected range(start?: Date, end?: Date) {
    if (start && end) {
      return {
        $gte: start,
        $lte: end,
      };
    }

    if (start) {
      return {
        $gte: start,
      };
    }

    if (end) {
      return {
        $lte: end,
      };
    }

    return undefined;
  }
}
