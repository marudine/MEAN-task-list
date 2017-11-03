const mongoose = require('mongoose')
const async = require('async')
var schema = require('./public/schemas/schema');
var testSchema = new mongoose.Schema(schema);
const testData = require('./test/testData')

var append;

//DATABASE STATE
let state = (active = false) => {
  if (typeof state === 'undefined') {
    var state = {
      db: active
    }
  }
  return state.db;
}

//SELECT ENVIRONMENT
let environmentSelector = () => {
  if (process.env.NODE_ENV == 'Test') {
    append = '-test'
    schema = testSchema
  }
  else {
    append = ''
  }
}

//CONNECT DATABASE
exports.connect = async() => {
  await mongoose.connection.close()
  environmentSelector();
  let uri = 'mongodb://localhost/task-list'+append

  if(state() === false ) {
    var connection = mongoose.connect(uri, (err) => {
      if (err) {
        console.log("Custom Database Connection error message(/db.js): "+ err)
      }
      else {
      console.log('Connecting to '+uri)
      state(true);
      }
    })
  }
  else {
    state(true)
  }

};

//CHECK MODEL STATE
let model = () => {
  if ( typeof Task === 'undefined' ) {
    Task = mongoose.model('Task', schema)
  }
}

//REMOVE COLLECTION(S)
exports.wipe = () => {
  Task.remove({}, (err) => {
  if (err){ console.log("Custom Task.remove error message: "+err)}
  console.log('Collection removed. Clean slate.')
  });
};

//SUPPLY COLLECTION DATA FROM JSON TO DB
exports.testData = async() => {
  model()
  let testTasks = testData.testTasks;

  testTasks.forEach( async(task) => {
    let tsk = new Task({ _id: task._id, task: task.task });
    await tsk.save( (err, res) => {
      if (err){ console.log("Custom testData/tsk.save message: "+err.errmsg) }
    });
  });
  console.log("Database populated by 'beforeEach' block.")
};
