
export class client {

  id: Number;
  clientName: String;
  address: String;
  city: String;
  state: String;
  country: String;
  email: String;
  mobile: String;
  gstNo: String;
  active: boolean;
  createdOn: String;
  name: any;


  constructor() {
    this.id = 0;
    this.clientName = "";
    this.address = "";
    this.city = "";
    this.state = "";
    this.country = "";
    this.email = "";
    this.mobile = "";
    this.gstNo = "";
    this.active = true;
    this.createdOn = "";
  }
}
