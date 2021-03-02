export default class PaymentSchedule{
    public DebtContractPaymentScheduleID?: number;
    public CustomerID?: number;
    public DocumentID?: number;
    public DebtContractID?: number;
    public DebtContractCode
    public Invoiced?: string;
    public DueDate?: Date;
    public NB?: number;
    public InstallmentStartDTG?: Date;
    public InstallmentEndDTG?: Date;
    public PrincipalAmount?: number;
    public InterestAmount?: number;
    public TotalAmount?: number;
    public ContractRemainPrincipalAmount?: number;
    public InstallmentRemainPrincipalAmount?: number;
    public InstallmentRemainInterestAmount?: number;
    public InstallmentRemainFeeAmount?: number;
    public Status?: number;
}