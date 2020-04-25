import { Controller, Post, Get, Put, Body, Param, Patch, Delete } from "@nestjs/common";
import { MowLawnService } from "./mowlawn.service";

@Controller('mowlawn')
export class MowLawnController {
    constructor(private mowLawnService: MowLawnService) {}

    @Post()
    async CustomerRegistration(@Body('name') custName: string, 
                         @Body('address') custAddr: string,
                         @Body('city') custCity: string,
                         @Body('state') custState: string, 
                         @Body('phone')  custPhone: string,
                         @Body('emailid') custEmailId: string,
                         @Body('password') custPassword: string) {
        const result = await this.mowLawnService.registerUser(custName,custAddr, custCity,
            custState, custPhone, custEmailId, custPassword);
        return result;
    }

    @Post(':emailId')
    async MowLawnRequest(@Body('emailId') emailId: string,
                         @Body('areaLength') areaLength: number,
                         @Body('paymentType') paymentType: string ) {
        const result = await this.mowLawnService.mowLawnRequest(emailId, areaLength, paymentType);
        return result;
    }
    @Get()
    async getAllUserRegistrations() {
        const registrations =await this.mowLawnService.getRegistrations();
        return registrations;
    }

    @Get(':custEmailId')
    getRegisteredUser(@Param('custEmailId') emailId: string) {
    return this.mowLawnService.getRegisteredUser(emailId);
    }

    @Get('/:emailId/:registrationId')
    getUserMowLawnRequests(@Param('emailId') emailId: string, @Param('registrationId') registrationId) {
    return this.mowLawnService.getMowLawnRequests(emailId, registrationId);
    }

    @Patch(':emailId')
    async updateRegisteredUser(
        @Param('emailId') emailId: string,
        @Body('name') custName: string, 
        @Body('address') custAddr: string,
        @Body('city') custCity: string,
        @Body('state') custState: string, 
        @Body('phone')  custPhone: string
    ) {
        await this.mowLawnService.updateMowLawnUser(custName, custAddr, custCity, custState, custPhone, emailId);
        return "Record updated successfully";
    }

    @Put(':emailId')
    async updateMowLawnRequest(
        @Param('emailId') emailId: string,       
        @Body('areaLength') areaLength: number, 
        @Body('paymentType') paymentType: string
    ) {
        await this.mowLawnService.modifyMowLawnRequest(emailId, areaLength, paymentType);
        return "Record updated successfully";
    }

    @Delete(':custEmailId')
    async removeUser(@Param('custEmailId') emailId: string) {
        const result = await this.mowLawnService.deleteUser(emailId);
        return result;
    }
}