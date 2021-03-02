import Collection_DebtContract from "../Entities/Collection_DebtContract";

export default class DebtContractAnnexDto {
    public CustomerID?: number;
    public DebtContractID?: number;
    public LstDebtContract?: Collection_DebtContract[];
    public DebtContract?: Collection_DebtContract;
    public NextDueDTG?: Date;
}
