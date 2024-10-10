class MyLocalStorage {
  getItem(key) {
    const result = JSON.parse(window.localStorage.getItem(key));
    if (result) {
      if (result.expireAt <= Date.now()) {
        this.removeItem(key);
        return null;
      }
      return result.value;
    }
    return null;
  }
  setItem(key, value, maxAge = 30 * 24 * 60 * 60 * 1000) {
    const result = JSON.stringify({ value, expireAt: Date.now() + maxAge });
    window.localStorage.setItem(key, result);
  }
  removeItem(key) {
    window.localStorage.removeItem(key);
  }
  clear() {
    window.localStorage.clear();
  }
}

window.myLocalStorage = new MyLocalStorage();

// Usage examples
window.myLocalStorage.setItem('testKey', 'testValue', 5000); // Expires in 5 seconds
console.log(window.myLocalStorage.getItem('testKey')); // Outputs: 'testValue'
setTimeout(() => {
  console.log(window.myLocalStorage.getItem('testKey')); // Outputs: null (expired)
}, 6000);
