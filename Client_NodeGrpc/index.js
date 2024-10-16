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

const client = new todoService('localhost:50051' , grpc.credentials.createInsecure())
// console.log(client)

client.ListTodos({},(err,todos)=>{
    if(!err){
        console.log(todos);
        client.CreateTodo({id:'3' , title:'Todo3' , content: 'Content of todo 3'},(err,todos)=>{
            if(!err){
                console.log("created a new todo");
                client.ListTodos({}, ( err , todos)=>{
                    if(!err){
                        console.log("afte insertion",todos);
                    }
                })
            }
        })
    }else{
        console.log(err);
    }
})