import Collection_DocumentActionField from "./Collection_DocumentActionField";

export default class Collection_DocumentAction {
    public DocumentActionID?: number;
    public DocumentID?: number;
    public CustomerID?: number;
    public ObjectiveType?: number;
    public CustomerName?: string;
    public LastActionDTG?: Date;

    public FieldIssueDTG?: Date;
    public IssueByName?: string;
    public PromiseToPayDTG?: Date;
    public PromiseToPayAmount?: number;
    public ReturnCodeID?: number;
    public Version?: number;
    public ActionField?: Collection_DocumentActionField;
    public ObjectiveName?: string;

    // extend
    public Budget?: string;
    public OverDueDay?: number;
    public NumberOfContract?: number;
    public CustomerMobile?: string;
    public CustomerTempAddress?: string;
    public TotalPastDueAmount?: number;
    public LastActionName?: string;

    //extend 2
    public DocumentActionScheduleID?: number;
    public ScheduleVersion?: number;
    public ScheduleStatus?: number;

    public ListContractCode?: string;
    public IDCard?: string;
    public DistrictName?: string;
    public ProvinceName?: string;
    public EmployeeName?: string;
    public Notes?: string;
}
