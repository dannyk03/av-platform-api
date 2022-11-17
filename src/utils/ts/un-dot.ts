export type UnDot<T extends string> = T extends `${infer A}.${infer B}`
  ? [A, ...UnDot<B>]
  : [T];
