import UserModel from "../models/UserModel";

const UserRead = async (userId: string) => {

    return await UserModel.findOne({userId})

}

const UserCreate = async (userId: string) => {

    return await UserModel.create({userId})

}

const UserUpdate = async (userId: string, data: any) => {

    return await UserModel.updateOne({ userId }, data)
    
}

export default {
    UserRead,
    UserCreate,
    UserUpdate
}