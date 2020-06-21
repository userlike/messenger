/**
 * Messenger state that customers have read access to.
 */
export type ActionResult<E, A> = ActionSuccess<A> | ActionError<E>;

export interface ActionSuccess<A> {
  kind: "success";
  value: A;
}
export interface ActionError<E> {
  kind: "error";
  error: E;
}

export const success = <A>(a: A): ActionSuccess<A> => ({
  kind: "success",
  value: a,
});
export const err = <E>(err: E): ActionError<E> => ({
  kind: "error",
  error: err,
});
