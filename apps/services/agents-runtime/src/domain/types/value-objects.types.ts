export abstract class ValueObjects<Payload, Return> {
  abstract getValue: () => Return;
  abstract equals: (payload: Payload) => boolean;
}
