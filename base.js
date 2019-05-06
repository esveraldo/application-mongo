const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/app", {
    //useMongoClient: true
    useNewUrlParser: true
})
.then(() => {
    console.log("Conexão realizada com sucesso.");
})
.catch((err) => {
    console.log("Houve um erro ao se conectar " + err);
})

//TODO Definindo o model
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    }, 
    country: {
        type: String,
        require: false
    }
});

//TODO Collection
const newUser = mongoose.model('users', UserSchema);

//TODO inserindo dados
new newUser({
    nome: 'Esveraldo',
    email: 'esveraldo@hotmail.com',
    age: 50,
    country: 'Brasil'
})
.save()
.then(() => {
    console.log("Usuário criado com sucesso.");
})
.catch((err) => {
    console.log("Não foi possivel criar usuário " + err);
})