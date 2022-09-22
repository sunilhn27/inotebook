const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook?mongodb://localhost:27017/?tls=false&directConnection=true&readPreference=primary";



const connectToMango = async () => {
    mongoose.connect(mongoURI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        },
        () => {
            console.log("mongdb is connected");
        }
    );
}

module.exports = connectToMango;