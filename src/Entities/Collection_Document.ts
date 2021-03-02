export default class Collection_Document {
    public DocumentID?: number;

    public CustomerID?: number;

    public CustomerCode?: string;

    public CustomerName?: string;

    public NumberOfContract?: number;

    public CustomerMobile?: string;

    public CustomerTempAddress?: string;

    public TotalPastDueAmount?: number;

    public LastActionName?: string;

    public OverDueDay?: number;

    public PromiseToPayAmount?: number;

    public DocumentActionID?: number;

    public Version?: number;

    public Budget?: string;

    public DocumentActionScheduleID?: number;

    public ScheduleVersion?: number;

    public ListContractCode?: string;

    public TotalCollectedAmount?: number;

    public LastPaidAmount?: number;

    public LastPaidDTG?: Date;

    public ScheduleStatus?: number;

    public DebtContractCode?: string;

    public CardID?: string;

    public IDCard?: string;

    public NeedCollectAmount?: number;

    public DistrictName?: string;

    public ProvinceName?: string;

    public EndDTG?: Date;

    public AssignEmployeeDTG?: Date;

    public hasSchedule?: boolean;

}
