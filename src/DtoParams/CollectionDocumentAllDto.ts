import Collection_Document from "../Entities/Collection_Document";
import { BaseParam } from "./BaseParam";
import Customer from "../Entities/Customer";
import Collection_DebtContract from "../Entities/Collection_DebtContract";
import Collection_DocumentActionSchedule from "../Entities/Collection_DocumentActionSchedule";
import Collection_DocumentAction from "../Entities/Collection_DocumentAction";

export default class CollectionDocumentAllDto extends BaseParam {
    
    public LstAction?: Collection_DocumentAction[];

    public Action?: Collection_DocumentAction;

    public LstCollDoc?: Collection_Document[];

    public CustomerID?: number;

    public DocumentID?: number;

    public Customer?: Customer;

    public FilterName?: string;

    public Collection_DebtContract?: Collection_DebtContract[];

    public TongKhachHang?: number;

    public TongDuNo?: number;

    public ActionSchedule?: Collection_DocumentActionSchedule;

    public LstActionSchedule?: Collection_DocumentActionSchedule[];

    public DocumentActionID?: number;

    public CustomerName?: string;

    public IDCard?: string;

    public ContractNumber?: string;

    public ContractCode?: string;
    
}
