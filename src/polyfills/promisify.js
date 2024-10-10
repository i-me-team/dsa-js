function loadImage(url, callback) {
  const image = new Image(300, 300);
  image.onload = callback(null, image);
  image.onerror = callback(new Error('Unable to load image'));
  // async operation
  image.src = url;
}

// loadImage("https://picsum.photos/300/300.jpg", (err, img) => {
//   if (err) {
//     console.error(err.message);
//     return;
//   }
//   document.body.appendChild(img);
// });

// utility

function promisify(func) {
  return function (...args) {
    const context = this;
    const executorFunction = (resolve, reject) => {
      const callback = (err, data) => (err ? reject(err) : resolve(data));
      func.call(context, ...args, callback);
    };
    return new Promise(executorFunction);
  };
}

const promisifiedLoadImage = promisify(loadImage);

promisifiedLoadImage('https://picsum.photos/300/300.jpg')
  .then((img) => document.body.appendChild(img))
  .catch((err) => console.error(err.message));
