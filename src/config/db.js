const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
    try {
        // await mongoose.connect('mongodb://127.0.0.1:27017/kahrobaDB', {
        await mongoose.connect(config.db.uri, {});
        console.log('✅ MongoDB Connected Successfully....');
    } catch (error) {
        console.error('❌ MongoDB Error in Connect:', error.message);
        process.exit(1); // در صورت خطا، برنامه متوقف شود
    }
};

module.exports = connectDB;
