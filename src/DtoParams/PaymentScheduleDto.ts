import { BaseParam } from "./BaseParam";
import PaymentSchedule from "../Entities/PaymentSchedule";

export default class PaymentScheduleDto extends BaseParam {
    public CustomerID?: number;

    public DocumentID?: number;

    public LstDebtContractPaymentSchedule?: PaymentSchedule[];
}
