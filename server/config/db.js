const mongoose = require('mongoose');

const connectDB = async () => {
   
  try {
    await mongoose.connect("mongodb://SWMS:EmMdN6j6VFL3Vpsp@ac-ukznkdf-shard-00-00.hgiqt0x.mongodb.net:27017,ac-ukznkdf-shard-00-01.hgiqt0x.mongodb.net:27017,ac-ukznkdf-shard-00-02.hgiqt0x.mongodb.net:27017/?ssl=true&replicaSet=atlas-ahp4yk-shard-0&authSource=admin&appName=Cluster0");
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); 
  }
};




module.exports = connectDB;
