export type Result<A, E> = Success<A> | Error<E>;

/**
 * @deprecated Use {@link Result} instead.
 */
export type ActionResult<E, A> = Result<A, E>;

export interface Success<A> {
  kind: "success";
  value: A;
}

/**
 * @deprecated Use {@link Success} instead.
 */
export type ActionSuccess<A> = Success<A>;

export interface Error<E> {
  kind: "error";
  error: E;
}

/**
 * @deprecated Use {@link Error} instead.
 */
export type ActionError<E> = Error<E>;

export const success = <E = never, A = never>(a: A): Result<A, E> => ({
  kind: "success",
  value: a,
});

export const error = <E = never, A = never>(err: E): Result<A, E> => ({
  kind: "error",
  error: err,
});

/**
 * @deprecated Use {@link error} instead.
 */
export const err = error;
