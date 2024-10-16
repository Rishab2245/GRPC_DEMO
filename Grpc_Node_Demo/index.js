const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

let packageDefinition = protoLoader.loadSync(
    "./todo.proto",
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
let protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

let todoService = protoDescriptor.TodoService;
const server = new grpc.Server();


const todos = [
    {
        id:'1' , title:'Todo1' , content: 'Content of todo 1'
    },
    {
        id:'2' , title:'Todo2' , content: 'Content of todo 2'
    },
];

// console.log("todoservice" , todoService);

server.addService(todoService.service , {
    listTodos: (call , callback) => {
        callback(null , {
            todos:todos
        })
    },
    createTodo: (call , callback) => {
        let incomingNewTodo = call.request;
        todos.push(incomingNewTodo);
        callback(null, incomingNewTodo);
    },
    getTodo:(call,callback) => {
        let incomingId = call.request.id;
        let todo = todos.filter((e)=>e.id == incomingId);
        if(todo.length > 0){
            callback(null , todo);
        }else{
            callback({
                message: 'Todo not found'
            }, null);
        }
    }
});


server.bindAsync('127.0.0.1:50051' , grpc.ServerCredentials.createInsecure(), () => {
    console.log("server started");
    // server.start();
  });
