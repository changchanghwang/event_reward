import { EventPattern } from '@nestjs/microservices';

interface KafkaDddEvent {
  type: string;
  occurredAt: DateTime;
  txId?: string;
  data: string;
}

export function EventHandler<T extends { new (...args: any[]): any }>(
  eventClass: T,
  options: { topic: string },
): MethodDecorator {
  const eventType = eventClass.name;

  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (payload: KafkaDddEvent) {
      if (payload && payload.type === eventType) {
        try {
          const eventData = JSON.parse(payload.data);
          const deserializedEvent = Object.assign(new eventClass(), eventData);

          return await originalMethod.apply(this, [deserializedEvent]);
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    };
    EventPattern(options.topic)(target, propertyKey, descriptor);
    return descriptor;
  };
}
