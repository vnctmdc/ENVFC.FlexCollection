export default class Collection_DebtContract {
    public PrincipalPastDueAmount?: number;
    public InterestPastDueAmount?: number;
    public NeedCollectAmount?: number;
    public DebtContractCode?: string;
    public FinancedApprovalAmount?: number;
    public PrincipalAmount?: number;
    public StartDTG?: Date;
    public EndDTG?: Date;
    public ActivationDTG?: Date;
    public Status?: string;
    public Rate?: number;
    public Tenor?: number;
    public TotalInstallmentDue?: number;
    public InstallmentDTG?: Date;
    public TotalPastDueAmount?: number;
    public LPIAmount?: number;
    public OverDueDay?: number;
    public OverDueDayCIC?: number;
    public NextInstallmentCapitalAmount?: number;
    public NextInstallmentInterestAmount?: number;
    public NextInstallmentAmount?: number;
    public NextDueDTG?: Date;
    public TotalCollectedAmount?: number;
    public LastPaidDTG?: Date;
    public Version?: number;

    public InstallmentAmount?: number;

    public TotalAmountTex?: number;
    public ToCollectAmount?: number;
    public RemainPrincipalAmount?: number;
    public TotalAnnexAmount?: number;
    public Fees?: number;
    public PaidAmount?: number;
    //thông tin khác
    public WelcomcallResult?: string;
    public SalesChannel?: string;
    public DebitAccountNumber?: string;
    public ServicesInsurance?: string;
    public CollectedFeeAmount?: number;
}
