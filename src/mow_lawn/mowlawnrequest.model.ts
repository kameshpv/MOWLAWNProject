import * as  mongoose from 'mongoose';

export const MOWLawnRequestSchema =  new mongoose.Schema({
    registrationId: {type: String, required: true},
    areaLength: { type: Number, required: true},
    requestCount: {type: Number, required: true},
    requestDate: {type: Date, default: Date.now},
    amount: {type: Number, required: true},
    paymentType: {type: String, required: true},
})

export interface MOWLawnRequest extends mongoose.Document {
    id: string;
    registrationId: string;
    requestCount: number;
    requestDate: Date;
    areaLength: number
    amount: number;
    paymentType: string;
}