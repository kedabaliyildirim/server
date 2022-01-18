const mongoose = require('mongoose')
mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
}).then(() => {
    console.log('MONGOD HAS ARRISEN');
}).catch((err) => {
    console.log(`this is database error ${err}`);
})