import Collection_DocumentAction from "../Entities/Collection_DocumentAction";
import SystemParameter from "../Entities/SystemParameter";

export default class CollectionDocumentActionDto {
    public CollDocActID?: number;
    public DocumentID?: number;
    public CollDocAction?: Collection_DocumentAction;
    public LstObjectType?: SystemParameter[];
    public LstAddressType?: SystemParameter[];
    public LstReturnCode?: SystemParameter[];   
}
