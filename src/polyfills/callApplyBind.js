/**
 * Notes on why Symbol is required in call and apply?
 * The purpose of these lines is twofold:
    * To execute the function in the correct context:
        * In JavaScript, the value of this inside a function depends on how the function is called.
        * To make call and apply work, we need to ensure the function is called as a method of the provided context object.
        * By adding the function as a property of the context object, we can then call it as a method of that object, ensuring this inside the function refers to the context object.
        
    * To avoid interfering with existing properties on the context object:
        * We can't simply use a regular string as the property name (like context['tempFunction'] = this) because it might overwrite an existing property.
        * Using a Symbol creates a guaranteed unique property name, ensuring we don't accidentally modify or overwrite any existing properties on the context object.
 */

// Bind polyfill
Function.prototype.myBind = function (context, ...origArgs) {
  const originalFunction = this;

  // edge case
  if (typeof originalFunction !== 'function') {
    throw new TypeError('myBind must be called on a function');
  }

  const boundFunction = function (...args) {
    return originalFunction.apply(context, [...origArgs, ...args]);
  };

  // Advanced, but adding the below code resembles the bind closely.
  Object.defineProperty(boundFunction, 'name', {
    value: `bound ${originalFunction.name}`,
    configurable: true,
  });

  return boundFunction;
};

// Call polyfill
Function.prototype.myCall = function (context, ...args) {
  // edge case
  if (typeof this !== 'function') {
    throw new TypeError('myCall must be called on a function');
  }

  // If context is null or undefined, use the global object
  context = context || globalThis;

  // Create a unique property(Symbol)
  const tempUniqueProperty = Symbol('Temporary Property');

  // Assign this function to the unique property of the context
  context[tempUniqueProperty] = this;

  // Call the function as a method of the context
  const result = context[tempUniqueProperty](...args);

  // Cleanup: Remove the temporary property
  delete context[tempUniqueProperty];

  return result;
};

// Apply polyfill
Function.prototype.myApply = function (context, args) {
  // edge case
  if (typeof this !== 'function') {
    throw new TypeError('myApply can be called only on functions');
  }

  context = context ?? globalThis;

  const tempFunctionProperty = Symbol('Temp Property');

  context[tempFunctionProperty] = this;

  let result;
  if (args === null) {
    result = context[tempFunctionProperty]();
  } else if (!Array.isArray(args)) {
    throw new TypeError(`${typeof args} ${args} must be an array`);
  } else {
    result = context[tempFunctionProperty](...args);
  }

  // Cleanup
  delete context[tempFunctionProperty];

  return result;
};
