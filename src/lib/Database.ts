import mongoose from "mongoose"

export const connectDB = async (mongo_uri: string) => {

    var connection = await mongoose.connect(mongo_uri).then(() => {
        return true
    }).catch(err => {
        console.log(err)
        return false
    })

    return connection

}