import { BaseParam } from "./BaseParam";
import Customer from "../Entities/Customer";
import Collection_DebtContract from "../Entities/Collection_DebtContract";
import Collection_DocumentAction from "../Entities/Collection_DocumentAction";

export default class CollectionDebtContractDto extends BaseParam {
    public CustomerID?: number;

    public DocumentID?: number;

    public DocumentActionID?: number;

    public Customer?: Customer;

    public DocumentAction?: Collection_DocumentAction;

    public LstCollDebtContract?: Collection_DebtContract[];
}
