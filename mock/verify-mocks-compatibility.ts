import * as RawMocks from ".";
import * as JestMocks from "./jest-mocks";

type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T
  ? 1
  : 2) extends <G>() => G extends U ? 1 : 2
  ? Y
  : N;

/** Trigger a compiler error when a value is _not_ an exact type. */
declare const exactType: <T, U>(
  draft: T & IfEquals<T, U>,
  expected: U & IfEquals<T, U>,
) => IfEquals<T, U>;

exactType(typeof JestMocks, typeof RawMocks);
