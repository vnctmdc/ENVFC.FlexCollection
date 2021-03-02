import Customer from "../Entities/Customer";
import CustomerExtPhone from "../Entities/CustomerExtPhone";
import CustomerAddress from "../Entities/CustomerAddress";
import SystemParameter from "../Entities/SystemParameter";

export default class CustomerDto {
    public CustomerID?: number;
    public Customer?: Customer;
    public CustomerExtPhone?: CustomerExtPhone;
    public CustomerAddress?: CustomerAddress;
    public LstObjectiveType?: SystemParameter[];
    public LstAddressType?: SystemParameter[];
    public LstProvince?: SystemParameter[];
    public LstDistrict?: SystemParameter[];
}
