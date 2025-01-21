/* eslint-disable @typescript-eslint/default-param-last */
export const MutationHelpers = {
  append: <T, K>(old: T[] | undefined = [], formData: K) => [...old, formData],
  remove: <T>(old: T[] | undefined = [], formData: T) => [
    ...old.filter(
      (oldItem) => JSON.stringify(formData) !== JSON.stringify(oldItem)
    ),
  ],
  deleteByKey: <T extends Record<string, unknown>>(key: keyof T) => {
    return (old: T[] | undefined = [], currentDataId: string) => [
      ...old.filter((oldData) => currentDataId !== oldData[key]),
    ];
  },
  mergeArray: <T, K>(old: T[] | undefined = [], formData: K[] = []) => [
    ...old,
    ...formData,
  ],
  mergeObject: <T, K extends Partial<T>>(old: T | undefined, formData: K): T =>
    ({ ...old, ...formData } as unknown as T),
  replace: <T>(_: T, formData: T) => formData,
  update: <T extends { id: string }, K extends { id: string }>(
    old: T[] | undefined = [],
    formData: K
  ) => {
    const clone = [...old];
    const index = clone.findIndex(({ id }) => id === formData.id);
    if (index > -1) {
      clone[index] = { ...clone[index], ...formData };
    }
    return clone;
  },
  delete: <T extends { id: string }>(
    old: T[] | undefined = [],
    currentDataId: string
  ) => [...old.filter(({ id }) => currentDataId !== id)],
  sortOrder: <T extends { id: string }>(
    old: T[] | undefined = [],
    order: string[]
  ) => {
    const oldMap = Object.fromEntries(
      old.map((oldItem) => [oldItem.id, oldItem])
    );
    return order.map((orderId) => oldMap[orderId]);
  },
  removeMany: <T>(old: T[] | undefined = [], formData: T[]) => [
    ...old.filter((oldItem) => !formData.includes(oldItem)),
  ],
};
