
import { challanItems } from "./challanItems";
import { contractor } from "./contractor";

export class contractorChallan {

    id: Number;
    challanNumber: string;
    challanDate: string;
    contractor: contractor;
    challanType: string;
    challanItems: challanItems[];
    party: number;
    design: number;
    color: number;
    quantity: number;
    createdOn: string;

    constructor() {
        this.id = 0;
        this.challanNumber = "";
        this.contractor = new contractor();
        this.challanItems = [];
        this.challanDate = "";
        this.party = 0;
        this.design = 0;
        this.createdOn = "";
        this.challanType = "I";
        this.color = 0;
        this.quantity = 0;
    }

}
