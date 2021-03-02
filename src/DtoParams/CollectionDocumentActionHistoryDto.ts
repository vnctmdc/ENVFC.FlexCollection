import Collection_DocumentActionHistory from "../Entities/Collection_DocumentActionHistory";
import { BaseParam } from "./BaseParam";
import Customer from "../Entities/Customer";

export default class CollectionDocumentActionHistoryDto extends BaseParam {
    public LstCollDocActHis?: Collection_DocumentActionHistory[];
    public IsAvailableAddAction?: boolean;
    public CustomerID?: number;
    public DocumentID?: number;
    public DocumentActionID?: number;
    public DocActHistoryID?: number;
    public DocumentActionHistory?: Collection_DocumentActionHistory;
    public Customer?: Customer;
}
