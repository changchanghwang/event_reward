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

  protected range(start?: Date | CalendarDate, end?: Date | CalendarDate) {
    if (start && end) {
      return {
        $gte: start,
        $lt: end,
      };
    }

    if (start) {
      return {
        $gte: start,
      };
    }

    if (end) {
      return {
        $lt: end,
      };
    }

    return undefined;
  }

  protected inValues(values?: string[]) {
    if (!values) {
      return undefined;
    }

    return {
      $in: values,
    };
  }
}
