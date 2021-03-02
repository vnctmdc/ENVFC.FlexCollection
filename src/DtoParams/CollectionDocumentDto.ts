import Collection_Document from "../Entities/Collection_Document";
import { BaseParam } from "./BaseParam";
import Customer from "../Entities/Customer";
import Collection_DebtContract from "../Entities/Collection_DebtContract";

export default class CollectionDocumentDto extends BaseParam {
    public LstCollDoc?: Collection_Document[];

    public CustomerID?: number;

    public FilterName?: string;

    public DocumentID?: number;

    public Customer?: Customer;

    public Collection_DebtContract?: Collection_DebtContract[];

    public TongKhachHang?: number;

    public TongDuNo?: number;

    public CustomerName?: string;

    public IDCard?: string;

    public ContractNumber?: string;

    public ContractCode?: string;

    public DocumentActionScheduleID?: number;

    public ScheduleVersion?: number;

    public ScheduleStatus?: number;

    public EndDTG?: Date;

    public AssignEmployeeDTG?: Date;
    
}
