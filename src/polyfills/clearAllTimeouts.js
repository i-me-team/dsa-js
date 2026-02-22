// Two ways to implement the same
// 1st way involves clearing all the ids in the timer pool. This can help but it will clear all the intervals as well.
export function clearAllTimeouts1() {
  // Create a new timer and track it's id
  let newAndLargestTimerId = setTimeout(null, 0);
  while (newAndLargestTimerId > 0) {
    clearTimeout(newAndLargestTimerId--);
  }
}

// 2nd way More proper and useful way
export function customTimeoutWrapper() {
  const timerIds = new Set();

  function myTimeout(func, wait, ...args) {
    let timerId;
    // Memory safe implementation.
    const onComplete = () => {
      timerIds.delete(timerId);
      func.call(this, ...args);
    };
    timerId = window.setTimeout(onComplete, wait);
    timerIds.add(timerId);
    return timerId;
  }

  function myClearTimeout(id) {
    window.clearTimeout(id);
    timerIds.delete(id);
  }

  function clearAllTimeouts() {
    timerIds.forEach((timerId) => window.clearTimeout(timerId));
    timerIds.clear();
  }

  return { myTimeout, clearAllTimeouts, myClearTimeout };
}
