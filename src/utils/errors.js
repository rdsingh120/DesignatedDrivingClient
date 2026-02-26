export function getErrorMessage(err, fallback = "Something went wrong") {
  if (!err) return fallback;
  if (typeof err === "string") return err;

  return (
    err.message ||
    err.data?.message ||
    err.data?.error ||
    fallback
  );
}

export const is401 = (err) => err?.status === 401;
export const is403 = (err) => err?.status === 403;
export const is404 = (err) => err?.status === 404;
export const is409 = (err) => err?.status === 409;