import { model, Schema } from "mongoose";

const userSchema = new Schema({
    userId : {
        type: String,
        required: true,
        unique: true
    },
    riddleEntires : {
        type: Array,
        default: []
    },
    currentRiddle : {
        type: Number,
        default : -1
    }
}, { timestamps : true})

const UserModel = model('User', userSchema)

export default UserModel