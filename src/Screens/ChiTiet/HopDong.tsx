import React from "react";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import {
    View,
    TouchableOpacity,
    Text,
    ScrollView,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    StyleSheet,
    Platform,
} from "react-native";
import CollectionDisplayTab from "./CollectionDisplayTab";
import Toolbar from "../../components/Toolbar";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import HttpUtils from "../../Utils/HttpUtils";
import CollectionDebtContractDto from "../../DtoParams/CollectionDebtContractDto";
import ApiUrl from "../../constants/ApiUrl";
import Theme from "../../Themes/Default";
import Customer from "../../Entities/Customer";
import Utility from "../../Utils/Utility";
import Collection_DebtContract from "../../Entities/Collection_DebtContract";
import PopupModal from "../../components/PopupModal";
import CustomerExtPhone from "../../Entities/CustomerExtPhone";
import DropDownBox from "../../components/DropDownBox";
import SystemParameter from "../../Entities/SystemParameter";
import CustomerAddress from "../../Entities/CustomerAddress";
import CustomerDto from "../../DtoParams/CustomerDto";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PopupModalView from "../../components/PopupModelView";
import * as Enums from "../../constants/Enums";
import * as Linking from "expo-linking";
import { ClientMessage } from "../../SharedEntity/SMXException";
import Collection_DocumentAction from "../../Entities/Collection_DocumentAction";

const CustomerMode = 1;
const ContractMode = 2;

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
    route: any;
}
interface iState {
    SelectedMode: number;
    Customer: Customer;
    LstCollDebtContract: Collection_DebtContract[];
    SelectedDebtCode: string;
    ShowAddPhone: boolean;
    ShowAddAddress: boolean;

    CustomerExtPhone: CustomerExtPhone;
    LstCustomerObjective: SystemParameter[];

    CustomerAddress: CustomerAddress;

    LstAddressType: SystemParameter[];
    LstProvince: SystemParameter[];

    LstDistrictAll: SystemParameter[];
    LstDistrictByProvince: SystemParameter[];
    DocumentAction: Collection_DocumentAction;
}

export default class HopDongDisplayUC extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            SelectedMode: CustomerMode,
            Customer: new Customer(),
            LstCollDebtContract: [],
            SelectedDebtCode: "",
            ShowAddAddress: false,
            ShowAddPhone: false,
            CustomerExtPhone: new CustomerExtPhone(),
            LstCustomerObjective: [],
            CustomerAddress: new CustomerAddress(),
            LstAddressType: [],
            LstProvince: [],
            LstDistrictByProvince: [],
            LstDistrictAll: [],
            DocumentAction: new Collection_DocumentAction()
        };
    }

    async componentDidMount() {
        try {
            this.props.GlobalStore.ShowLoading();
            await this.SetupViewForm();
            await this.LoadData();
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    async SetupViewForm() {
        let res = await HttpUtils.post<CustomerDto>(
            ApiUrl.Customer_Execute,
            SMX.ApiActionCode.SetupViewForm,
            JSON.stringify(new CustomerDto())
        );
        this.setState({
            LstAddressType: res!.LstAddressType!,
            LstCustomerObjective: res!.LstObjectiveType!,
            LstProvince: res!.LstProvince!,
            LstDistrictAll: res!.LstDistrict!,
        });
    }

    BindDistrictByProvince() {
        let lstDistrict = this.state.LstDistrictAll.filter((x) => x.Ext1i == this.state.CustomerAddress.Province);
        this.setState({ LstDistrictByProvince: lstDistrict });
    }

    async LoadData() {
        try {
            let req = new CollectionDebtContractDto();
            req.CustomerID = this.props.route.params.CustomerID;
            req.DocumentID = this.props.route.params.DocumentID;
            req.DocumentActionID = this.props.route.params.DocumentActionID;
            
            let res = await HttpUtils.post<CollectionDebtContractDto>(
                ApiUrl.CollectionDebtContract_Execute,
                SMX.ApiActionCode.SetupDisplay,
                JSON.stringify(req)
            );

            this.setState({ DocumentAction: res!.DocumentAction!, Customer: res!.Customer!, LstCollDebtContract: res!.LstCollDebtContract! }, () => {
                if (this.state.LstCollDebtContract.length > 0) {
                    this.setState({ SelectedDebtCode: this.state.LstCollDebtContract[0].DebtContractCode });
                }
            });
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    async SaveCustomerExtPhone() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new CustomerDto();
            let cus = new CustomerExtPhone();
            cus = this.state.CustomerExtPhone;
            if (!cus.ObjectiveType || !cus.ObjectiveName || !cus.Phone) {
                this.props.GlobalStore.HideLoading();
                this.props.GlobalStore.Exception = ClientMessage("Vui lòng nhập đầy đủ thông tin!");
                return;
            }
            cus.CustomerID = this.props.route.params.CustomerID;
            req.CustomerExtPhone = cus;
            await HttpUtils.post<CustomerDto>(
                ApiUrl.Customer_Execute,
                SMX.ApiActionCode.SaveCustomerExtPhone,
                JSON.stringify(req)
            );
            await this.LoadData();
            this.setState({CustomerExtPhone: new CustomerExtPhone()})
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    async SaveCustomerAddress() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new CustomerDto();
            let cus = new CustomerAddress();
            cus = this.state.CustomerAddress;
            if (!cus.Type || !cus.Province || !cus.District || !cus.Ward || !cus.Address) {
                this.props.GlobalStore.HideLoading();
                this.props.GlobalStore.Exception = ClientMessage("Vui lòng nhập đầy đủ thông tin!");
                return;
            }
            cus.CustomerID = this.props.route.params.CustomerID;
            req.CustomerAddress = cus;
            await HttpUtils.post<CustomerDto>(
                ApiUrl.Customer_Execute,
                SMX.ApiActionCode.SaveCustomerAddress,
                JSON.stringify(req)
            );
            await this.LoadData();
            this.setState({CustomerAddress: new CustomerAddress()})
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    renderType() {
        if (this.state.SelectedMode === CustomerMode) {
            return this.renderCustomer();
        } else if (this.state.SelectedMode === ContractMode) {
            return this.renderContract();
        }
    }

    renderContract() {
        let lstDebt = this.state.LstCollDebtContract;
        let action = this.state.DocumentAction;

        return (
            <View style={{ flex: 1 }}>
                <ScrollView horizontal={true}>
                    {lstDebt.map((en: Collection_DebtContract, i) => (
                        <TouchableOpacity
                            style={{
                                //width: width - 30,
                                paddingHorizontal: 15,
                                justifyContent: "center",
                                height: 35,
                                margin: 10,
                                borderWidth: 1,
                                borderColor:
                                    this.state.SelectedDebtCode === en.DebtContractCode ? "#2EA8EE" : "gainsboro",
                            }}
                            onPress={() => this.setState({ SelectedDebtCode: en.DebtContractCode })}
                        >
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    color: this.state.SelectedDebtCode === en.DebtContractCode ? "#2EA8EE" : undefined,
                                }}
                            >
                                {en.DebtContractCode}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <ScrollView>
                    {lstDebt.map((en, i) =>
                        this.state.SelectedDebtCode === en.DebtContractCode ? (
                            <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
                                <View
                                    style={{
                                        height: 1,
                                        width: width - 20,
                                        backgroundColor: "gainsboro",
                                        marginBottom: 5,
                                    }}
                                ></View>

                                <View style={styles.Item}>
                                    <Text>Số tiền được phê duyệt</Text>
                                    <Text style={{ fontWeight: "bold" }}>
                                        {Utility.GetDecimalString(en.FinancedApprovalAmount)}
                                    </Text>
                                </View>

                                <View style={styles.Item}>
                                    <Text>Dư nợ gốc</Text>
                                    <Text style={{ fontWeight: "bold" }}>
                                        {Utility.GetDecimalString(en.PrincipalAmount)}
                                    </Text>
                                </View>

                                <View style={styles.Item}>
                                    <Text>Ngày bắt đầu</Text>
                                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDateString(en.StartDTG)}</Text>
                                </View>

                                <View style={styles.Item}>
                                    <Text>Ngày kết thúc</Text>
                                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDateString(en.EndDTG)}</Text>
                                </View>

                                <View style={styles.Item}>
                                    <Text>Ngày hiệu lực</Text>
                                    <Text style={{ fontWeight: "bold" }}>
                                        {Utility.GetDateString(en.ActivationDTG)}
                                    </Text>
                                </View>

                                <View style={styles.Item}>
                                    <Text>Trạng thái HĐ</Text>
                                    <Text style={{ fontWeight: "bold" }}>{en.Status}</Text>
                                </View>

                                <View style={styles.Item}>
                                    <Text>Lãi suất (%)</Text>
                                    <Text style={{ fontWeight: "bold" }}>{en.Rate}</Text>
                                </View>

                                <View style={styles.Item}>
                                    <Text>Kỳ hạn vay</Text>
                                    <Text style={{ fontWeight: "bold" }}>{en.Tenor}</Text>
                                </View>

                                <View style={styles.Item}>
                                    <Text>Tổng số kỳ đã qua</Text>
                                    <Text style={{ fontWeight: "bold" }}>{en.TotalInstallmentDue}</Text>
                                </View>

                                <View style={styles.Item}>
                                    <Text>Ngày bắt đầu kỳ</Text>
                                    <Text style={{ fontWeight: "bold" }}>
                                        {Utility.GetDateString(en.InstallmentDTG)}
                                    </Text>
                                </View>

                                <View style={[styles.Item, { backgroundColor: "#F5F6F8" }]}>
                                    <Text style={{ fontWeight: "bold" }}>Thông tin nợ</Text>
                                </View>
                                <View style={styles.Item}>
                                    <Text>Tổng số tiền cần thanh toán</Text>
                                    <Text style={{ fontWeight: "bold" }}>
                                        {Utility.GetDecimalString(en.NeedCollectAmount)}
                                    </Text>
                                </View>
                                <View style={styles.Item}>
                                    <Text>Gốc quá hạn</Text>
                                    <Text style={{ fontWeight: "bold" }}>
                                        {Utility.GetDecimalString(en.PrincipalPastDueAmount)}
                                    </Text>
                                </View>
                                <View style={styles.Item}>
                                    <Text>Lãi quá hạn</Text>
                                    <Text style={{ fontWeight: "bold" }}>
                                        {Utility.GetDecimalString(en.InterestPastDueAmount)}
                                    </Text>
                                </View>

                                <View style={styles.Item}>
                                    <Text>LPI</Text>
                                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(en.LPIAmount)}</Text>
                                </View>

                                <View style={styles.Item}>
                                    <Text>Phí thu hộ</Text>
                                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(en.CollectedFeeAmount)}</Text>
                                </View>

                                <View style={styles.Item}>
                                    <Text>Số ngày quá hạn theo EVN</Text>
                                    <Text style={{ fontWeight: "bold" }}>{en.OverDueDay}</Text>
                                </View>

                                <View style={styles.Item}>
                                    <Text>Số ngày quá hạn theo CIC</Text>
                                    <Text style={{ fontWeight: "bold" }}>{en.OverDueDayCIC}</Text>
                                </View>

                                <View style={[styles.Item, { backgroundColor: "#F5F6F8" }]}>
                                    <Text style={{ fontWeight: "bold" }}>Thông tin thanh toán</Text>
                                </View>
                                <View style={styles.Item}>
                                    <Text>Số tiền gốc kỳ tiếp theo</Text>
                                    <Text style={{ fontWeight: "bold" }}>
                                        {Utility.GetDecimalString(en.NextInstallmentCapitalAmount)}
                                    </Text>
                                </View>
                                <View style={styles.Item}>
                                    <Text>Số tiền lãi kỳ tiếp theo</Text>
                                    <Text style={{ fontWeight: "bold" }}>
                                        {Utility.GetDecimalString(en.NextInstallmentInterestAmount)}
                                    </Text>
                                </View>
                                <View style={styles.Item}>
                                    <Text>Số tiền phải trả kỳ tiếp theo</Text>
                                    <Text style={{ fontWeight: "bold" }}>
                                        {Utility.GetDecimalString(en.NextInstallmentAmount)}
                                    </Text>
                                </View>
                                <View style={styles.Item}>
                                    <Text>Ngày thanh toán tiếp theo</Text>
                                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDateString(en.NextDueDTG)}</Text>
                                </View>
                                <View style={styles.Item}>
                                    <Text>Tổng số tiền đã thanh toán</Text>
                                    <Text style={{ fontWeight: "bold" }}>
                                        {Utility.GetDecimalString(en.PaidAmount)}
                                    </Text>
                                </View>
                                <View style={styles.Item}>
                                    <Text>Ngày thanh toán gần nhất</Text>
                                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDateString(en.LastPaidDTG)}</Text>
                                </View>

                                <View style={[styles.Item, { backgroundColor: "#F5F6F8" }]}>
                                    <Text style={{ fontWeight: "bold" }}>Thông tin khác</Text>
                                </View>
                                <View style={styles.Item}>
                                    <Text>Kết quả gọi lần đầu</Text>
                                    <Text style={{ fontWeight: "bold" }}>{en.WelcomcallResult}</Text>
                                </View>
                                <View style={styles.Item}>
                                    <Text>Kênh bán hàng</Text>
                                    <Text style={{ fontWeight: "bold" }}>{en.SalesChannel}</Text>
                                </View>
                                <View style={styles.Item}>
                                    <Text>Số TK thanh toán</Text>
                                    <Text style={{ fontWeight: "bold" }}>{en.DebitAccountNumber}</Text>
                                </View>
                                <View style={styles.Item}>
                                    <Text>Công ty bảo hiểm</Text>
                                    <Text style={{ fontWeight: "bold" }}>{en.ServicesInsurance}</Text>
                                </View>
                            </View>
                        ) : undefined
                    )}
                </ScrollView>
            </View>
        );
    }

    renderCustomer() {
        let cus = this.state.Customer;
        let action = this.state.DocumentAction;
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={{}}>
                    <View
                        style={{
                            borderRightWidth: 1,
                            borderRightColor: "#000",
                            borderLeftWidth: 1,
                            borderLeftColor: "#000",
                            borderBottomWidth: 1,
                            borderBottomColor: "#000",
                        }}
                    >
                        <View style={styles.Item123}>
                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                <Text style={{ width: width / 2 - 7 }}>Tên khách hàng</Text>
                            </View>
                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                <Text style={{ width: width / 2 - 7, fontWeight: "bold" }}>{cus.CustomerName}</Text>
                            </View>
                        </View>
                        <View style={styles.Item123}>
                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                <Text style={{ width: width / 2 - 7 }}>CMND</Text>
                            </View>
                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                <Text style={{ width: width / 2 - 7, fontWeight: "bold" }}>{cus.IDCard}</Text>
                            </View>
                        </View>
                        <View style={styles.Item123}>
                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                <Text style={{ width: width / 2 - 7 }}>Ngày sinh</Text>
                            </View>
                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                <Text style={{ width: width / 2 - 7, fontWeight: "bold" }}>{Utility.GetDateString(cus.DOB)}</Text>
                            </View>
                        </View>
                        <View style={styles.Item123}>
                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                <Text style={{ width: width / 2 - 7 }}>Giới tính</Text>
                            </View>
                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                <Text style={{ width: width / 2 - 7, fontWeight: "bold" }}>{cus.Gender}</Text>
                            </View>
                        </View>
                        <View style={styles.Item123}>
                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                <Text style={{ width: width / 2 - 7 }}>Nghề nghiệp</Text>
                            </View>
                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                <Text style={{ width: width / 2 - 7, fontWeight: "bold" }}>{cus.Job}</Text>
                            </View>
                        </View>
                        <View style={styles.Item123}>
                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                <Text style={{ width: width / 2 - 7 }}>Chuyên viên phụ trách</Text>
                            </View>
                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                <Text style={{ width: width / 2 - 7, fontWeight: "bold" }}>{action.EmployeeName}</Text>
                            </View>
                        </View>
                    </View>

                    <View>
                        <View
                            style={{
                                marginTop: 15,
                                flexDirection: "row",
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: width / 2,
                                    borderLeftWidth: 1,
                                    borderLeftColor: "#000",
                                    borderTopWidth: 1,
                                    borderTopColor: "#000",
                                    borderRightWidth: 1,
                                    borderRightColor: "#000",
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#000",
                                    paddingVertical: 8
                                }}
                                onPress={() => {
                                    this.setState({ SelectedMode: CustomerMode });
                                }}
                            >
                                <Text
                                    style={{
                                        paddingLeft: 5,
                                        fontWeight: "bold",
                                        //color: this.state.SelectedMode === CustomerMode ? "white" : undefined,
                                    }}
                                >
                                    SỐ ĐIỆN THOẠI
                        </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: width / 2,
                                    borderTopWidth: 1,
                                    borderTopColor: "#000",
                                    borderRightWidth: 1,
                                    borderRightColor: "#000",
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#000",
                                    paddingVertical: 8
                                }}
                                onPress={() => this.setState({ ShowAddPhone: true })}
                            >
                                <Text
                                    style={{
                                        paddingLeft: 5,
                                        fontWeight: "bold",
                                        color: '#2EA8EE'
                                        //color: this.state.SelectedMode === ContractMode ? "white" : undefined,
                                    }}
                                >ADD</Text>
                            </TouchableOpacity>

                        </View>
                        <View>
                            {cus.LstPhone.length > 0
                                ? cus.LstPhone.map((en, index) => (
                                    <View
                                        style={{
                                            borderLeftWidth: 1,
                                            borderLeftColor: "#000",
                                            borderBottomWidth: 1,
                                            borderBottomColor: "#000",
                                            borderRightWidth: 1,
                                            borderRightColor: "#000",
                                        }}
                                    >
                                        <View style={styles.Item123}>
                                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                                <Text style={{ width: width / 2 - 7 }}>{en.ObjectiveName}</Text>
                                            </View>
                                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                                <Text style={{ width: width / 2 - 7, fontWeight: "bold" }}>{en.ObjectiveTypeName}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.Item, { justifyContent: 'center' }]}>
                                            <TouchableOpacity
                                                onPress={() => Linking.openURL("tel://" + en.Phone)}
                                                style={{ justifyContent: 'center' }}
                                            >
                                                <Text style={{ color: "#2EA8EE" }}>{en.Phone}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                                : undefined}
                        </View>
                    </View>


                    <View>
                        <View
                            style={{
                                marginTop: 15,
                                flexDirection: "row",
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: width / 2,
                                    borderLeftWidth: 1,
                                    borderLeftColor: "#000",
                                    borderTopWidth: 1,
                                    borderTopColor: "#000",
                                    borderRightWidth: 1,
                                    borderRightColor: "#000",
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#000",
                                    paddingVertical: 8
                                }}
                                onPress={() => {
                                    this.setState({ SelectedMode: CustomerMode });
                                }}
                            >
                                <Text
                                    style={{
                                        paddingLeft: 5,
                                        fontWeight: "bold",
                                        //color: this.state.SelectedMode === CustomerMode ? "white" : undefined,
                                    }}
                                >
                                    ĐỊA CHỈ
                        </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: width / 2,
                                    borderTopWidth: 1,
                                    borderTopColor: "#000",
                                    borderRightWidth: 1,
                                    borderRightColor: "#000",
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#000",
                                    paddingVertical: 8
                                }}
                                onPress={() => this.setState({ ShowAddAddress: true })}
                            >
                                <Text
                                    style={{
                                        paddingLeft: 5,
                                        fontWeight: "bold",
                                        color: '#2EA8EE'
                                        //color: this.state.SelectedMode === ContractMode ? "white" : undefined,
                                    }}
                                >ADD</Text>
                            </TouchableOpacity>

                        </View>
                        <View>
                            {cus.LstCustomerAddress.length > 0
                                ? cus.LstCustomerAddress.map((en, index) => (
                                    <View
                                        style={{
                                            borderLeftWidth: 1,
                                            borderLeftColor: "#000",
                                            borderBottomWidth: 1,
                                            borderBottomColor: "#000",
                                            borderRightWidth: 1,
                                            borderRightColor: "#000",
                                        }}
                                    >
                                        <View style={styles.Item123}>
                                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                                <Text style={{ width: width / 2 - 7 }}>{en.AddressTypeName}</Text>
                                            </View>
                                            <View style={{ paddingLeft: 5, borderRightWidth: 1, borderRightColor: 'gainsboro', paddingVertical: 10 }}>
                                                <Text style={{ width: width / 2 - 7, fontWeight: "bold" }}>{en.SourceType == Enums.SourceType.Core ? "Old" : "New"}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.Item, { justifyContent: 'center' }]}>
                                            <TouchableOpacity
                                                //style={{ width: "100%" }}
                                                onPress={() => {
                                                    if (Platform.OS === "ios") {
                                                        Linking.openURL("http://maps.apple.com/maps?daddr=" + en.Address + (en.Ward? ', ' + en.Ward : undefined) + (en.DistrictName? ', ' + en.DistrictName : undefined) + (en.ProvinceName? ', ' + en.ProvinceName: undefined));
                                                    } else {
                                                        Linking.openURL("http://maps.google.com/maps?daddr=" + en.Address + (en.Ward? ', ' + en.Ward : undefined) + (en.DistrictName? ', ' + en.DistrictName : undefined) + (en.ProvinceName? ', ' + en.ProvinceName: undefined));
                                                    }
                                                }}
                                            >
                                                <Text style={{ color: "#2EA8EE" }}>{en.Address + (en.Ward? ', ' + en.Ward : undefined) + (en.DistrictName? ', ' + en.DistrictName : undefined) + (en.ProvinceName? ', ' + en.ProvinceName: undefined)}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                                : undefined}
                        </View>
                    </View>


                    {/* <View
                        style={{
                            marginTop: 10,
                            paddingVertical: 5,
                            backgroundColor: "FFF",
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                paddingHorizontal: 5,
                                backgroundColor: "#F5F6F8",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View>
                                <Text style={{ fontWeight: "bold" }}>DS số điện thoại</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ ShowAddPhone: true })}>
                                <FontAwesome5 name="plus" size={30} color={"#2EA8EE"} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <View
                                style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginVertical: 5,
                                    backgroundColor: "#FFF",
                                }}
                            >
                                <Text style={{ fontWeight: "bold", width: "6%" }}>#</Text>
                                <Text style={{ fontWeight: "bold", width: "35%" }}>Mối quan hệ</Text>
                                <Text style={{ fontWeight: "bold", width: "28%" }}>Số điện thoại</Text>
                                <Text style={{ fontWeight: "bold", width: "33%" }}>Tên</Text>
                            </View>
                            {cus.LstPhone.length > 0
                                ? cus.LstPhone.map((en, index) => (
                                    <View
                                        style={{
                                            width: "100%",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            backgroundColor: "#FFF",
                                            borderBottomColor: "gainsboro",
                                            borderBottomWidth: 1,
                                        }}
                                    >
                                        <Text style={{ width: "6%" }}>{index + 1}</Text>
                                        <Text style={{ width: "35%" }}>{en.ObjectiveName}</Text>
                                        <TouchableOpacity
                                            onPress={() => Linking.openURL("tel://" + en.Phone)}
                                            style={{ width: "28%" }}
                                        >
                                            <Text style={{ color: "#2EA8EE" }}>{en.Phone}</Text>
                                        </TouchableOpacity>

                                        <Text style={{ width: "33%" }}>{en.ObjectiveTypeName}</Text>
                                    </View>
                                ))
                                : undefined}
                        </View>
                    </View> */}

                    {/* {cus.LstPhone.map((en) => (
                        <View style={{ paddingVertical: 10, borderBottomColor: "gainsboro", borderBottomWidth: 1 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                                <Text>Người tham chiếu</Text>
                                <Text style={{ fontWeight: "bold" }}>{en.ObjectiveName}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                                <Text>
                                    Mối quan hệ:
                                    <Text style={{ fontWeight: "bold" }}> {en.ObjectiveTypeName}</Text>
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                                <Text>Số điện thoại</Text>
                                <TouchableOpacity onPress={() => Linking.openURL("tel://" + en.Phone)}>
                                    <Text style={{ fontWeight: "bold", color: "#2EA8EE" }}>{en.Phone}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))} */}

                    {/* <View
                        style={{
                            marginTop: 10,
                            paddingVertical: 5,
                            backgroundColor: "#FFF",
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                paddingHorizontal: 5,
                                backgroundColor: "#F5F6F8",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View>
                                <Text style={{ fontWeight: "bold" }}>DS địa chỉ</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ ShowAddAddress: true })}>
                                <FontAwesome5 name="plus" size={30} color={"#2EA8EE"} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <View
                                style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginVertical: 5,
                                    backgroundColor: "#FFF",
                                }}
                            >
                                <Text style={{ fontWeight: "bold", width: "6%" }}>#</Text>
                                <Text style={{ fontWeight: "bold", width: "34%" }}>Loại địa chỉ</Text>
                                <Text style={{ fontWeight: "bold", width: "48%" }}>Địa chỉ</Text>
                                <Text style={{ fontWeight: "bold", width: "12%" }}>Nguồn</Text>
                            </View>
                            {cus.LstCustomerAddress.length > 0
                                ? cus.LstCustomerAddress.map((en, index) => (
                                    <View
                                        style={{
                                            width: "100%",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            backgroundColor: "#FFF",
                                            borderBottomColor: "gainsboro",
                                            borderBottomWidth: 1,
                                        }}
                                    >
                                        <Text style={{ width: "6%" }}>{index + 1}</Text>
                                        <Text style={{ width: "34%" }}>{en.AddressTypeName}</Text>
                                        <TouchableOpacity
                                            style={{ width: "48%" }}
                                            onPress={() => {
                                                if (Platform.OS === "ios") {
                                                    Linking.openURL("http://maps.apple.com/maps?daddr=" + en.Address);
                                                } else {
                                                    Linking.openURL(
                                                        "http://maps.google.com/maps?daddr=" + en.Address
                                                    );
                                                }
                                            }}
                                        >
                                            <Text style={{ color: "#2EA8EE" }}>{en.Address}</Text>
                                        </TouchableOpacity>

                                        <Text style={{ width: "12%" }}>
                                            {en.SourceType == Enums.SourceType.Core ? "Old" : "New"}
                                        </Text>
                                    </View>
                                ))
                                : undefined}
                        </View>
                    </View> */}

                    {/* {cus.LstCustomerAddress.map((en) => (
                        <View style={{ paddingVertical: 10, borderBottomColor: "gainsboro", borderBottomWidth: 1 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                                <Text>
                                    Loại địa chỉ: <Text style={{ fontWeight: "bold" }}> {en.AddressTypeName}</Text>
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (Platform.OS === "ios") {
                                            Linking.openURL("http://maps.apple.com/maps?daddr=" + en.Address);
                                        } else {
                                            Linking.openURL("http://maps.google.com/maps?daddr=" + en.Address);
                                        }
                                    }}
                                >
                                    <Text>
                                        Địa chỉ: <Text style={{ fontWeight: "bold" }}> {en.Address}</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                                <Text>
                                    Nguồn: <Text style={{ fontWeight: "bold" }}> {
                                        en.SourceType == Enums.SourceType.Core ? 'Old' : 'New'
                                    }</Text>
                                </Text>
                            </View>
                        </View>
                    ))} */}
                </View>
                <PopupModal modalVisible={this.state.ShowAddPhone} title="Thêm số điện thoại">
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Mối quan hệ</Text>
                        <DropDownBox
                            TextField="Name"
                            ValueField="SystemParameterID"
                            DataSource={this.state.LstCustomerObjective}
                            SelectedValue={this.state.CustomerExtPhone.ObjectiveType}
                            OnSelectedItemChanged={(item) => {
                                let cus = this.state.CustomerExtPhone;
                                cus.ObjectiveType = item.SystemParameterID;
                                this.setState({ CustomerExtPhone: cus });
                            }}
                        ></DropDownBox>
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Tên người liên hệ</Text>
                        <TextInput
                            style={Theme.TextInput}
                            value={this.state.CustomerExtPhone.ObjectiveName}
                            onChangeText={(val) => {
                                let cus = this.state.CustomerExtPhone;
                                cus.ObjectiveName = val;
                                this.setState({ CustomerExtPhone: cus });
                            }}
                        />
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Số điện thoại</Text>
                        <TextInput
                            style={Theme.TextInput}
                            value={this.state.CustomerExtPhone.Phone}
                            onChangeText={(val) => {
                                let cus = this.state.CustomerExtPhone;
                                cus.Phone = val;
                                this.setState({ CustomerExtPhone: cus });
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity
                            style={[Theme.BtnSmPrimary, { alignSelf: "center", flex: 1, marginRight: 5 }]}
                            onPress={() => {
                                this.SaveCustomerExtPhone();
                                this.setState({ ShowAddPhone: false });
                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>Lưu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[Theme.BtnSmWarning, { alignSelf: "center", flex: 1, marginLeft: 5 }]}
                            onPress={() => this.setState({ CustomerExtPhone: new CustomerExtPhone(), ShowAddPhone: false })}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </PopupModal>
                <PopupModal modalVisible={this.state.ShowAddAddress} title="Thêm địa chỉ">
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Loại địa chỉ</Text>
                        <DropDownBox
                            TextField="Name"
                            ValueField="SystemParameterID"
                            DataSource={this.state.LstAddressType}
                            SelectedValue={this.state.CustomerAddress.Type}
                            OnSelectedItemChanged={(item) => {
                                let cus = this.state.CustomerAddress;
                                cus.Type = item.SystemParameterID;
                                this.setState({ CustomerAddress: cus });
                            }}
                        ></DropDownBox>
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Tỉnh/Thành phố</Text>
                        <DropDownBox
                            TextField="Name"
                            ValueField="SystemParameterID"
                            DataSource={this.state.LstProvince}
                            SelectedValue={this.state.CustomerAddress.Province}
                            OnSelectedItemChanged={(item) => {
                                let cus = this.state.CustomerAddress;
                                cus.ProvinceName = item.Name;
                                cus.Province = item.SystemParameterID;
                                this.setState({ CustomerAddress: cus }, () => {
                                    this.BindDistrictByProvince();
                                });
                            }}
                        ></DropDownBox>
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Quận/Huyện</Text>
                        <DropDownBox
                            TextField="Name"
                            ValueField="SystemParameterID"
                            DataSource={this.state.LstDistrictByProvince}
                            SelectedValue={this.state.CustomerAddress.District}
                            OnSelectedItemChanged={(item) => {
                                let cus = this.state.CustomerAddress;
                                cus.DistrictName = item.Name;
                                cus.District = item.SystemParameterID;
                                this.setState({ CustomerAddress: cus });
                            }}
                        ></DropDownBox>
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Phường</Text>
                        <TextInput
                            style={Theme.TextInput}
                            value={this.state.CustomerAddress.Ward}
                            onChangeText={(val) => {
                                let cus = this.state.CustomerAddress;
                                cus.Ward = val;
                                this.setState({ CustomerAddress: cus });
                            }}
                        />
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Địa chỉ</Text>
                        <TextInput
                            style={Theme.TextInput}
                            value={this.state.CustomerAddress.Address}
                            onChangeText={(val) => {
                                let cus = this.state.CustomerAddress;
                                cus.Address = val;
                                this.setState({ CustomerAddress: cus });
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity
                            style={[Theme.BtnSmPrimary, { alignSelf: "center", flex: 1, marginRight: 5 }]}
                            onPress={() => {
                                this.SaveCustomerAddress();
                                this.setState({ ShowAddAddress: false });
                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>Lưu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[Theme.BtnSmWarning, { alignSelf: "center", flex: 1, marginLeft: 5 }]}
                            onPress={() => this.setState({ CustomerAddress: new CustomerAddress(), ShowAddAddress: false })}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </PopupModal>
            </ScrollView>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Hợp đồng" navigation={this.props.navigation}>
                    <View style={{ marginLeft: 10 }}></View>
                </Toolbar>

                <View
                    style={{
                        flexDirection: "row",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: width / 2,
                            borderLeftWidth: 1,
                            borderLeftColor: "#000",
                            borderTopWidth: 1,
                            borderTopColor: "#000",
                            borderRightWidth: 1,
                            borderRightColor: "#000",
                            borderBottomWidth: 1,
                            borderBottomColor: "#000",
                            paddingVertical: 8
                        }}
                        onPress={() => {
                            this.setState({ SelectedMode: CustomerMode });
                        }}
                    >
                        <Text
                            style={{
                                paddingLeft: 5,
                                fontWeight: "bold",
                                color: '#2EA8EE'
                                //color: this.state.SelectedMode === CustomerMode ? "white" : undefined,
                            }}
                        >
                            THÔNG TIN KHÁCH HÀNG
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: width / 2,
                            borderTopWidth: 1,
                            borderTopColor: "#000",
                            borderRightWidth: 1,
                            borderRightColor: "#000",
                            borderBottomWidth: 1,
                            borderBottomColor: "#000",
                            paddingVertical: 8
                        }}
                        onPress={() => {
                            this.setState({ SelectedMode: ContractMode });
                        }}
                    >
                        <Text
                            style={{
                                paddingLeft: 5,
                                fontWeight: "bold",
                                color: '#2EA8EE'
                                //color: this.state.SelectedMode === ContractMode ? "white" : undefined,
                            }}
                        >
                            THÔNG TIN HỢP ĐỒNG
                        </Text>
                    </TouchableOpacity>

                </View>

                {/* <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        paddingVertical: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: "gainsboro",
                    }}
                >
                    <TouchableOpacity
                        style={[
                            Theme.BtnSmNone,
                            {
                                marginRight: 5,
                                marginLeft: 10,
                                flex: 1,
                                backgroundColor: this.state.SelectedMode === CustomerMode ? "#2EA8EE" : undefined,
                            },
                        ]}
                        onPress={() => {
                            this.setState({ SelectedMode: CustomerMode });
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                                color: this.state.SelectedMode === CustomerMode ? "white" : undefined,
                            }}
                        >
                            THÔNG TIN KHÁCH HÀNG
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            Theme.BtnSmNone,
                            {
                                marginLeft: 5,
                                marginRight: 10,
                                flex: 1,
                                backgroundColor: this.state.SelectedMode === ContractMode ? "#2EA8EE" : undefined,
                            },
                        ]}
                        onPress={() => {
                            this.setState({ SelectedMode: ContractMode });
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                                color: this.state.SelectedMode === ContractMode ? "white" : undefined,
                            }}
                        >
                            THÔNG TIN HỢP ĐỒNG
                        </Text>
                    </TouchableOpacity>
                
                </View> */}
                {this.renderType()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    Item: {
        flexDirection: "row",
        paddingVertical: 10,
        justifyContent: "space-between",
        borderBottomColor: "gainsboro",
        borderBottomWidth: 1,
    },
    Item123: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "gainsboro",
        borderBottomWidth: 1,

    },
});
