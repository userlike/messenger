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

export const success = <E = never, A = never>(a: A): ActionResult<E, A> => ({
  kind: "success",
  value: a,
});
export const err = <E = never, A = never>(err: E): ActionResult<E, A> => ({
  kind: "error",
  error: err,
});
