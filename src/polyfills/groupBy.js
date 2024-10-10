/**
const items = [{id: 1,kind: 'a'}, { id: 2, kind: 'b'}, { id: 3, kind: 'a'}];
const groups = Object.groupBy(items, ({kind}) => kind)
O/P:  {  a: [{id: 1, kind: 'a'}, {id: 3, kind: 'a' }], b: [{id: 2, kind: 'b'}]}
***Important theory:***
Object.create(null): It creates an object with no prototype. This means the object does not inherit any properties or methods from Object.prototype, such as toString(), hasOwnProperty(), isPrototypeOf(), etc.
{} literal: Inherits from Object.prototype: This creates an object that inherits from Object.prototype. As a result, it has access to all the standard object methods like toString(), hasOwnProperty(), etc.
*/
export function objectGroupBy(items, callback) {
  return items.reduce((acc, currVal) => {
    const target = callback(currVal);
    if (!(target in acc)) {
      acc[target] = [];
    }
    acc[target].push(currVal);
    return acc;
  }, Object.create(null));
}
