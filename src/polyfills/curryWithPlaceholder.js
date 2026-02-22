/**
 * ## Currying with Placeholders — Advanced Partial Application
 *
 * In standard currying, arguments must be provided in a strict left-to-right order.
 * For a function `f(a, b, c)`, there's no easy way to fix `a` and `c` while leaving
 * `b` open for later. **Placeholders** solve this by letting you "skip" specific
 * arguments and fill them in at a later point.
 *
 * ---
 *
 * ### Real-world Use Cases
 *
 * #### Customizing Library Functions
 *
 * Consider a generic logging function with the signature `(level, component, message)`.
 * Placeholders allow you to pre-fill `component` ("Auth") while deferring the `level`
 * argument — even though `level` comes first in the argument list.
 *
 * @example
 * ```ts
 * const log = (level: string, component: string, message: string) =>
 *   console.log(`[${level}] [${component}]: ${message}`);
 *
 * const curriedLog = curryWithPlaceholderSupport(log);
 * const _ = curryWithPlaceholderSupport.placeholder;
 *
 * // Fix "Auth" as the component, but defer the level for later.
 * const authLogger = curriedLog(_, "Auth");
 *
 * authLogger("INFO", "User logged in");   // [INFO] [Auth]: User logged in
 * authLogger("ERROR", "Password failed"); // [ERROR] [Auth]: Password failed
 * ```
 *
 * Without placeholders, you'd be forced to supply `level` first since it's
 * the leading argument — making selective partial application impossible.
 */

function curryWithPlaceholder(func) {
  const arity = func.length;
  const { placeholder } = curryWithPlaceholder;
  return function curried(...args) {
    const context = this;
    // base case
    if (arity <= args.length && !args.slice(0, arity).includes(placeholder)) {
      return func.call(context, ...args);
    }
    return function (...remaining) {
      let remainingArrayIdx = 0;
      args = args.map((arg) =>
        arg === placeholder && remainingArrayIdx < remaining.length
          ? remaining[remainingArrayIdx++]
          : arg,
      );
      return curried(...args, ...remaining.slice(remainingArrayIdx));
    };
  };
}

curryWithPlaceholder.placeholder = Symbol();
