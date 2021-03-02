import Collection_DocumentAction from "../Entities/Collection_DocumentAction";
import Collection_DocumentActionField from "../Entities/Collection_DocumentActionField";
import SystemParameter from "../Entities/SystemParameter";
import Customer from "../Entities/Customer";
import CustomerAddress from "../Entities/CustomerAddress";
import CustomerExtPhone from "../Entities/CustomerExtPhone";
import Collection_Document from "../Entities/Collection_Document";
import PromiseToPay from "../Entities/PromiseToPay";

export default class CollectionDocumentActionFieldDto {
    public Customer?: Customer;
    public CustomerID?: number;
    public ObjectiveType?: number;
    public DocActID?: number;
    public ActID?: number;
    public DocumentID?: number;
    public PeriodPromise?: number;
    public PromiseToPay?: PromiseToPay;
    public DocAction?: Collection_DocumentAction;
    public DocActField?: Collection_DocumentActionField;
    public Document?: Collection_Document;
    //public LstCusExtPhone?: CustomerExtPhone[];
    //public LstAddress?: CustomerAddress[];
    public ObjectType?: number;

    public LstReturnCode?: SystemParameter[];
    public LstObjectType?: SystemParameter[];
    public LstAddressType?: SystemParameter[];
    public DocumentActionFieldID?: number;
}
