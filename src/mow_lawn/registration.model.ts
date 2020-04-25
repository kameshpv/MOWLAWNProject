import * as  mongoose from 'mongoose';

export const RegistrationSchema = new mongoose.Schema({
    custName: {type: String, required: true},
    custAddr: {type: String, required: true},
    custCity: {type: String, required: true},
    custState: {type: String, required: true},
    custPhone: {type: String, required: true},
    custEmailId: {type: String, required: true},
    custPassword: {type: String, required: true},
    registeredDate: {type: Date, default: Date.now}
})

export interface Registration extends mongoose.Document {
    id: string;
    custName: string;
    custAddr: string;
    custCity: string;
    custState: string;
    custPhone: string;
    custEmailId: string;
    custPassword: string;
    registeredDate: Date;
}

