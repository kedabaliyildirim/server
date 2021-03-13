const mongoose = require('mongoose')

mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    createIndexes: true
}).then((data) => {
    console.log('MONGOD HAS ARRISEN');
}).catch((err) => {
    console.log(err);
})