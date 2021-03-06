var bodyParser = require('body-parser')
var mongoose = require('mongoose')

//Connect to the database
mongoose.connect('mongodb+srv://test:test@todo.yhbea.mongodb.net/<dbname>?retryWrites=true&w=majority')

//Create a schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
    item : String
})

var Todo = mongoose.model('Todo', todoSchema);
var itemOne = Todo({item:'buy flowers'}).save(function(err){
  if(err) throw err;
  console.log('item saved');
})
var data = [{item:'get milk'},{item:'walk dog'},{item:'kick some coding ass'}]

var urlencodedParser = bodyParser.urlencoded({extended:false})

module.exports = function(app){
   
    app.get('/todo',function(res,req,next){
      console.log('suprabhat');
      next();
    }, function(req,res){
     //getting data from mongodb and pass it to view
      Todo.find({},function(err,data){
        if(err) throw err;
        res.render('todo',{data});
      })
    }); 

    app.post('/todo', urlencodedParser,function(req,res){
      //get data from the view and add it to mongodb
      var newTodo = Todo.find(req.body).save(function(err,data){
        if(err) throw err;
        res.json({data});
      })
    });
 
    app.delete('/todo/:item', function(req,res){
     data = data.filter(function(todo){
        return todo.item.replace(/ /g,'-') !== req.params.item;  //if false then removes
     })
     res.json({data});
    });
};