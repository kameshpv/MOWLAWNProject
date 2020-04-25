import { Module } from "@nestjs/common";
import { MowLawnController } from "./mowlawn.controller";
import { MowLawnService } from "./mowlawn.service";
import { MongooseModule} from "@nestjs/mongoose";
import { RegistrationSchema } from "./Registration.model";
import { MOWLawnRequestSchema } from "./mowlawnrequest.model";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Registration', schema: RegistrationSchema}]),
              MongooseModule.forFeature([{name: 'MOWLawnRequest', schema: MOWLawnRequestSchema}])],
    controllers: [MowLawnController],
    providers: [MowLawnService]
})

export class MowLawnModule {}