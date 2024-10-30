import mongoose from 'mongoose';

const uri: string = 'mongodb://root:nodegmp@localhost:27017/mydatabase?authSource=admin';

mongoose.connect(uri)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error: Error) => {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  });
