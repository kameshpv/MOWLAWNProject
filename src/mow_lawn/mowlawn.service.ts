import { Injectable, NotFoundException } from "@nestjs/common";
import { Registration } from './Registration.model';
import { MOWLawnRequest } from './mowlawnrequest.model';
//import { v4 as uuid } from 'uuid'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MowLawnService {
    constructor(@InjectModel('Registration') private readonly registrationModel: Model<Registration>,
                @InjectModel('MOWLawnRequest') private readonly mowLawnRequestModel: Model<MOWLawnRequest>) {}
    
    /*<Summary>
        This function is used to register the new user.
    <Summary>*/
    async registerUser(custName: string, custAddr: string, custCity: string, custState: string, 
                 custPhone: string, custEmailId: string, custPassword: string)
    {
        try {
                //const custId = uuid().toString();
                const userRegistration = new this.registrationModel({custName: custName,custAddr: custAddr,custCity: custCity,custState: custState,
                                                        custPhone: custPhone,custEmailId: custEmailId,custPassword: custPassword});
                await userRegistration.save();
            } catch(error) {
                throw new NotFoundException('An error encountered while inserting the record.');
            }        
            return "Record inserted successfully";                 
    }

    /*<Summary> 
        This function is used to get all the user registrations.
    <Summary>*/
    async getRegistrations() {
        const registrations = await this.registrationModel.find().exec();
        return registrations.map((userRegistration) => ({id: userRegistration.id, custName: userRegistration.custName, custAddr: userRegistration.custAddr, 
            custCity: userRegistration.custCity, custState: userRegistration.custState, custPhone: userRegistration.custPhone, custEmailId: userRegistration.custEmailId,
            custPassword: userRegistration.custPassword}));
    }

    /*<Summary> 
        This function is used to get details of single registered user.
    <Summary>*/
    async getRegisteredUser(emailId: string) {
        const registeredUser = await this.findRegisteredUser(emailId);
        return {id: registeredUser.id, custName: registeredUser.custName, custAddr: registeredUser.custAddr,
                custCity: registeredUser.custCity, custState: registeredUser.custState, custPhone: registeredUser.custPhone,
                custEmailId: registeredUser.custEmailId};
    }

    /*<Summary> 
        This function is used to find a particular registered user.
    <Summary>*/
    private async findRegisteredUser(emailId: string): Promise<Registration> {
        let registeredUser;
        try {
            registeredUser = await this.registrationModel.findOne({custEmailId: emailId}).exec();
        } catch(error) {
            throw new NotFoundException('Could not find the Registered User.');
        }
        
        if(!registeredUser) {
            throw new NotFoundException('Could not find the Registered User.');
        }
        return registeredUser;
    }

    /*<Summary> 
        This function is used to modify the details of particular registered user.
    <Summary>*/
    async updateMowLawnUser(custName: string, custAddr: string, custCity: string, custState: string, custPhone: string, custEmailId: string) {
        try {
                const updatedUser = await this.findRegisteredUser(custEmailId);
                if(custName) { updatedUser.custName = custName; }
                if(custAddr) { updatedUser.custAddr = custAddr; }
                if(custCity) { updatedUser.custCity = custCity; }
                if(custState) { updatedUser.custState = custState; }
                if(custPhone) { updatedUser.custPhone = custPhone; }
                updatedUser.save();
            } catch(error) {
                throw new NotFoundException('An error encountered while updating the record.');
            }        
    
    }

    /*<Summary> 
        This function is used to delete the details of particular user.
    <Summary>*/
    async deleteUser(emailId: string) {
        const registeredUser = await this.findRegisteredUser(emailId);  
        if (!(await this.mowLawnRequestModel.find({registrationId: registeredUser.id}).countDocuments() > 0)) {
            const result = await this.registrationModel.deleteOne({custEmailId: emailId}).exec();
            if (result.n === 0) 
                throw new NotFoundException("Could not find the Registered User.")
        }
        else {
            return "Record cannot be deleted as registered user is associated with Mow Lawn request.";
        }
        return "Record Delete Successfully"
    }

    /*<Summary> 
        This function is used to process the new Mow Lawn request.
    <Summary>*/
    async mowLawnRequest(emailId: string, areaLength: number, paymentType: string)
    {
        try {
            let amount: number, requestCount: number, calculatedAmount: number;
            const registeredUser = await this.findRegisteredUser(emailId);  
            requestCount = 0;
            calculatedAmount = this.mowLawnCalcualtion(areaLength);
            amount = calculatedAmount;

            if (await this.mowLawnRequestModel.find({registrationId: registeredUser.id}).countDocuments() > 0)
            {
                const mowLawnRecord = await this.mowLawnRequestModel.find({registrationId: registeredUser.id}).sort({_id:-1}).limit(1);
                requestCount = mowLawnRecord[0].requestCount + 1;
            } 

            if (requestCount == 0) {
                calculatedAmount = calculatedAmount * 0.05
                amount = amount - calculatedAmount;
                requestCount = requestCount + 1;
            }
    
            const mowLawnProcessed = new this.mowLawnRequestModel({registrationId: registeredUser.id, requestCount: requestCount,areaLength: areaLength,
                    amount: amount, paymentType: paymentType});
            await mowLawnProcessed.save();
        } catch(error) {
            throw new NotFoundException('An error encountered while inserting the record.');
        }
        return "New Mow Lawn request received";
    }

    /*<Summary> 
        This function is used to modify the exiting Mow Lawn request.
    <Summary>*/
    async modifyMowLawnRequest(emailId: string, areaLength: number, paymentType: string)
    {
        try {
            let amount: number, calculatedAmount: number;
            const registeredUser = await this.findRegisteredUser(emailId);  
            
            calculatedAmount = this.mowLawnCalcualtion(areaLength);
            amount = calculatedAmount;

            if (await this.mowLawnRequestModel.find({registrationId: registeredUser.id}).countDocuments() > 0)
            {
            const mowLawnRecord = await this.mowLawnRequestModel.find({registrationId: registeredUser.id}).sort({_id:-1}).limit(1);

            if (mowLawnRecord[0].requestCount == 1) {
                calculatedAmount = calculatedAmount * 0.05
                amount = amount - calculatedAmount;
            }
            else
                amount = mowLawnRecord[0].amount;

            if(areaLength) { mowLawnRecord[0].areaLength = areaLength; }
            if(amount) { mowLawnRecord[0].amount = amount; }
            if(paymentType) { mowLawnRecord[0].paymentType = paymentType; }
            mowLawnRecord[0].save();
            } 
        }catch(error) {
            throw new NotFoundException('An error encountered while updating the record.');
        }
    }

    /*<Summary> 
        This function is used to calcualte the cost to Mow the Lawn area.
    <Summary>*/
    private mowLawnCalcualtion(areaLength: number) {
        let amount: number, calculatedAmount: number;

        if(areaLength > 15) {
            amount = areaLength * 1 * 0.1;
            calculatedAmount = areaLength-amount;
        }
        else if(areaLength > 25) {
            amount = areaLength * 1 * .25;
            calculatedAmount = areaLength-amount;
        }
        else {
            calculatedAmount = areaLength * 1;
        }
        
        return calculatedAmount;
    }

    /*<Summary> 
        This function is used to get all the user Mow Lawn requests.
    <Summary>*/
    async getMowLawnRequests(emailId: string, registrationId: string) {
        const mowLawnRequests = await this.mowLawnRequestModel.find({registrationId: registrationId}).exec();
        return mowLawnRequests.map((mowlawn) => ({RegistrationId: mowlawn.registrationId, RequestDate: mowlawn.requestDate, RequestCount: mowlawn.requestCount, 
            AreaLength: mowlawn.areaLength, PaymentType: mowlawn.paymentType}));
    }
}