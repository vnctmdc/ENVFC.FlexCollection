import { BaseParam } from "./BaseParam";
import Collection_DebtContractEntry from "../Entities/Collection_DebtContractEntry";

export default class DebtContractEntryDto extends BaseParam {

    public CustomerID?: number;

    public DocumentID?: number;

    public LstDebtContractEntry?: Collection_DebtContractEntry[];

}
