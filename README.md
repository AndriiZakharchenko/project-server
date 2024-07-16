# Node.js Global Mentoring Program - Module 3 EventEmitter / Buffer / Streams

Link to [ebook](https://ebook.learn.epam.com/node-gmp/docs/event-emitter-vs-buffers-vs-streams/Homework).

## Getting started

1. Install the dependencies

Run the following command in your project directory to install the necessary dependencies:

```
npm install
```

2. Implement the tasks

Start implementing the tasks one by one based on the provided descriptions. Feel free to install any extra dependencies that you think will help you to complete them more efficiently.

## Practical task

### Task 1: Implement an EventEmitter Class

In this task, you will be creating an `EventEmitter` class, which is similar to the built-in [EventEmitter](https://nodejs.org/api/events.html) in Node.js. This class will be used to manage events and their listeners.

Your `EventEmitter` class should have the following methods:
- `addListener(eventName: string, fn: Function)`: This method should add a new listener function to a specified event.
- `on(eventName: string, fn: Function)`: This method is an alias for the `addListener` method.
- `once(eventName: string, fn: Function)`: This method should add a one-time listener function for a specified event. The listener should be invoked only the first time the event is fired, after which it is removed.
- `removeListener(eventName: string, fn: Function)`: This method should remove the specified listener from the listener array for a specified event.
- `off(eventName: string, fn: Function)`: This method is an alias for the `removeListener` method.
- `emit(eventName: string, ...args: any[])`: This method should call each of the listeners registered for a specified event, passing the supplied arguments to each.
- `listenerCount(eventName: string)`: This method should return the number of listeners listening to a specified event.
- `rawListeners(eventName: string)`: This method should return a copy of the array of listeners for a specified event.

The exact implementation details are up to you, but the final `EventEmitter` class should meet the specifications described above. Consider edge cases and ensure your code is robust and handles errors gracefully.

Use the examples below to test your implementation:
```javascript
const emitter = new EventEmitter();

// Test addListener and emit
emitter.addListener('testEvent', (data) => console.log(data));
emitter.emit('testEvent', 'Hello, World!'); // Should log 'Hello, World!'

// Test listenerCount
console.log(emitter.listenerCount('testEvent')); // Should log 1

// Test rawListeners
console.log(emitter.rawListeners('testEvent')); // Should log [ [Function] ]

// Test removeListener
emitter.removeListener('testEvent', console.log);
console.log(emitter.listenerCount('testEvent')); // Should log 0
```

### Task 2: Implement WithTime Class

In this task, you will be creating `WithTime` class that extends the `EventEmitter` class you created in the previous task. This class will be used to call the asynchronous function and measure the time it takes to complete it.

Your `WithTime` class should include the following method:
- `execute(asyncFunc: AsyncFunction, ...args: any[])`: This method should execute a provided asynchronous function and measure the execution time using the `console.time()` and `console.timeEnd()` functions.
   - The `asyncFunc` should be a function that performs an asynchronous operation and accepts a callback as its last argument. This callback should follow the Node.js convention of accepting an Error object or null as the first argument, and the result of the operation as the second argument.
   - The `asyncFunc` should fetch data from https://jsonplaceholder.typicode.com/posts/1 and transform it to JSON format.

The `execute` method should emit the following events:
  - `begin` event at the start of execution.
  - `data` event if the asynchronous function provides data, passing the data as an argument to any `data` event listeners.
  - `end` event at the end of execution.
  - `error` event if an error occurs during the execution of the asynchronous function, passing the Error object as an argument to any `error` event listeners.

Remember to account for edge cases and ensure that your code is robust and handles errors gracefully.

Use the example below to test your implementation:

```javascript
import axios from 'axios';

const fetchFromUrl = (url: string, cb: (error: Error | null, data?: any) => void) => {
  axios.get(url)
    .then((response) => {
      cb(null, response.data);
    })
    .catch((error) => {
      cb(error);
    });
};

const withTime = new WithTime();

withTime.on('begin', () => console.log('About to execute'));
withTime.on('data', (data) => console.log('Data:', data));
withTime.on('end', () => console.log('Done with execute'));
withTime.on('error', (error) => console.log('Error:', error));

withTime.execute(fetchFromUrl, 'https://jsonplaceholder.typicode.com/posts/1');
```

### Task 3: Convert CSV Data to JSON and Write to a TXT File

In this task, you will be creating a function named `exportCsvToTxt()` which will read a CSV file, convert the data to JSON format using the [csvtojson](https://www.npmjs.com/package/csvtojson) package and write the data to a TXT file.

The function should return a Promise that resolves true when the export is done or reject an error if something went wrong during reading or writing to the file.

Keep in mind that all the content of the CSV file should not be loaded into RAM. Instead, it should read and write the file content line by line using streams.

The CSV file is located at `./src/assets/books.csv` and has the following format:
```
Book;Author;Amount;Price
The Compound Effect;Darren Hardy;5;9,48
The 7 Habits of Highly Effective People;Stephen R. Covey;4;23,48
The Miracle Morning;Hal Elrod;10;21,34
Influence: The Psychology of Persuasion;Robert B. Cialdini;4;12,99
The ONE Thing;Gary Keller;1;11,18
```

The resulting TXT file should be written to `./src/assets/books.txt` and have the following format:
```
{"book":"The Compound Effect","author":"Darren Hardy","price":9.48}
{"book":"The 7 Habits of Highly Effective People","author":"Stephen R. Covey","price":23.48}
{"book":"The Miracle Morning","author":"Hal Elrod","price":21.34}
{"book":"Influence: The Psychology of Persuasion","author":"Robert B. Cialdini","price":12.99}
{"book":"The ONE Thing","author":"Gary Keller","price":11.18}
```

## Evaluation criteria

- [x] Task 1 is implemented based on requirements specified.
- [x] Task 2 is implemented based on requirements specified.
- [x] Task 3 is implemented based on requirements specified.