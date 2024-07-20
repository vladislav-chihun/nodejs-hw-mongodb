import mongoose from "mongoose";



async function initMongoConnection() {
    try {
        const DB_URI = process.env.DB_URI;
        await mongoose.connect(DB_URI);
        console.log("Mongo connection successfully established!");
    } catch (error) {
        console.log(error);
    }
}


export { initMongoConnection };
