import React from "react";
import { View, TouchableOpacity, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import Theme from "../../Themes/Default";
import Toolbar from "../../components/Toolbar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import Utility from "../../Utils/Utility";
import PaymentSchedule from "../../Entities/PaymentSchedule";
import PaymentScheduleDto from "../../DtoParams/PaymentScheduleDto";
const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
    route: any;
}
interface iState {
    LstPaymentSchedule?: PaymentSchedule[];
    LstKySchedule?: PaymentSchedule[];
    LstContractName?: string[];
    SelectedDebtCode: string;
    NB?: number;
    selectedIndex: number;
    scheduleCount: number;
    KyHienTai?: number;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class LichTraNoSrc extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            LstPaymentSchedule: [],
            LstKySchedule: [],
            SelectedDebtCode: "",
            LstContractName: [],
            selectedIndex: 0,
            scheduleCount: 0,
        };
    }

    async componentDidMount() {
        await this.LoadData();
    }

    async LoadData() {
        this.props.GlobalStore.ShowLoading();
        let req = new PaymentScheduleDto();
        req.CustomerID = this.props.route.params.CustomerID;
        req.DocumentID = this.props.route.params.DocumentID;

        let res = await HttpUtils.post<PaymentScheduleDto>(
            ApiUrl.PaymentSchedule_Execute,
            SMX.ApiActionCode.SearchData,
            JSON.stringify(req)
        );

        var debtContractName = [];
        const cats = res!.LstDebtContractPaymentSchedule.map((q) => q.DebtContractCode);
        debtContractName = cats.filter((q, idx) => cats.indexOf(q) === idx);

        this.setState(
            { LstContractName: debtContractName, LstPaymentSchedule: res!.LstDebtContractPaymentSchedule! },
            () => {
                if (this.state.LstPaymentSchedule.length > 0) {
                    var lstKySchedule = this.state.LstPaymentSchedule.filter(
                        (en) => en.DebtContractCode == debtContractName[0]
                    );
                    lstKySchedule = lstKySchedule.sort((a, b) => (new Date(b.DueDate) < new Date(a.DueDate) ? -1 : 1));

                    var kyScheduleHT = lstKySchedule.filter(
                        (en) =>
                            new Date(en.InstallmentStartDTG).getTime() < new Date().getTime() &&
                            new Date().getTime() < new Date(en.InstallmentEndDTG).getTime()
                    );
                    this.setState({
                        LstKySchedule: lstKySchedule,
                        SelectedDebtCode: this.state.LstPaymentSchedule[0].DebtContractCode,
                        NB: lstKySchedule.length > 0 ? lstKySchedule[0].NB : 0,
                        scheduleCount: lstKySchedule.length,
                        KyHienTai: kyScheduleHT.length > 0 ? kyScheduleHT[0].NB : 0,
                    });
                }
            }
        );
        this.props.GlobalStore.HideLoading();
    }

    setDateTT(selectedIndex: number) {
        this.setState({ NB: this.state.LstKySchedule[selectedIndex].NB });
    }

    setListKyScheduleByCode(code: string) {
        var lstKySchedule = this.state.LstPaymentSchedule.filter((en) => en.DebtContractCode == code);
        lstKySchedule = lstKySchedule.sort((a, b) => (new Date(b.DueDate) < new Date(a.DueDate) ? -1 : 1));
        var kyScheduleHT = lstKySchedule.filter(
            (en) =>
                new Date(en.InstallmentStartDTG).getTime() < new Date().getTime() &&
                new Date().getTime() < new Date(en.InstallmentEndDTG).getTime()
        );
        this.setState({
            selectedIndex: 0,
            LstKySchedule: lstKySchedule,
            NB: lstKySchedule.length > 0 ? lstKySchedule[0].NB : 0,
            scheduleCount: lstKySchedule.length,
            KyHienTai: kyScheduleHT.length > 0 ? kyScheduleHT[0].NB : 0,
        });
    }

    setListKyScheduleByKy() {
        //var lstKySchedule = this.state.LstKySchedule.filter((en) => en.NB == this.state.KyHienTai);

        var index = this.state.LstKySchedule.findIndex((en) => en.NB == this.state.KyHienTai);
        // lstKySchedule = this.state.LstKySchedule.filter(
        //     (x) => x.DebtContractPaymentScheduleID !== this.state.LstKySchedule[index].DebtContractPaymentScheduleID
        // );

        //lstKySchedule.unshift(this.state.LstKySchedule[index]);

        this.setState({ NB: this.state.KyHienTai, selectedIndex: index });
    }

    renderKySchedule() {
        let lstKySchedule = this.state.LstKySchedule;
        return lstKySchedule.map((en, index) => {
            if (index == this.state.selectedIndex)
                return (
                    <View
                        style={{
                            justifyContent: "space-between",
                            backgroundColor: "#FFF",
                            flexDirection: "row",
                        }}
                    >
                        <TouchableOpacity
                            style={{ padding: 8, paddingTop: 50 }}
                            onPress={() => {
                                if (this.state.selectedIndex > 0) {
                                    this.setState({ selectedIndex: this.state.selectedIndex - 1 }, () =>
                                        this.setDateTT(this.state.selectedIndex)
                                    );
                                }
                            }}
                        >
                            <Ionicons name="ios-arrow-back" size={50} />
                        </TouchableOpacity>
                        <View style={{ width: width - 70, paddingVertical: 5 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Kỳ thanh toán</Text>
                                {en.Invoiced == "Yes" ? (
                                    <View>
                                        <FontAwesome name="check-square-o" color="blue" size={20} />
                                    </View>
                                ) : (
                                    <View>
                                        <FontAwesome name="square-o" color="blue" size={20} />
                                    </View>
                                )}
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Ngày đến hạn</Text>
                                <Text style={{ fontWeight: "bold" }}>{Utility.GetDateString(en.DueDate)}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Ngày bắt đầu</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {Utility.GetDateString(en.InstallmentStartDTG)}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Ngày kết thúc</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {Utility.GetDateString(en.InstallmentEndDTG)}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Gốc phải trả</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {Utility.GetDecimalString(en.PrincipalAmount)}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Lãi phải trả</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {Utility.GetDecimalString(en.InterestAmount)}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Tổng số tiền cần TT</Text>
                                <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(en.TotalAmount)}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Dư nợ gốc còn lại</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {Utility.GetDecimalString(en.ContractRemainPrincipalAmount)}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Gốc thực tế còn lại</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {Utility.GetDecimalString(en.InstallmentRemainPrincipalAmount)}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Lãi thực tế còn lại</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {Utility.GetDecimalString(en.InstallmentRemainInterestAmount)}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Phí thực tế còn lại</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {Utility.GetDecimalString(en.InstallmentRemainFeeAmount)}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{ padding: 8, paddingTop: 50 }}
                            onPress={() => {
                                if (this.state.selectedIndex < lstKySchedule.length - 1) {
                                    this.setState({ selectedIndex: this.state.selectedIndex + 1 }, () =>
                                        this.setDateTT(this.state.selectedIndex)
                                    );
                                }
                            }}
                        >
                            <Ionicons name="ios-arrow-forward" size={50} />
                        </TouchableOpacity>
                    </View>
                );
        });
    }

    render() {
        let lstContractName = this.state.LstContractName;
        let lstSchedule = this.state.LstPaymentSchedule;
        return (
            <View style={{ flex: 1 }}>
                <Toolbar Title="Lịch trả nợ" navigation={this.props.navigation}>
                    <View style={{ marginLeft: 10 }}></View>
                </Toolbar>
                <View>
                    <ScrollView style={{ marginTop: 5 }} horizontal={true}>
                        {lstContractName.map((ContractName: string, i) => (
                            <TouchableOpacity
                                style={{
                                    //width: width - 30,
                                    paddingHorizontal: 15,
                                    justifyContent: "center",
                                    height: 35,
                                    margin: 10,
                                    borderWidth: 1,
                                    borderColor: this.state.SelectedDebtCode === ContractName ? "#2EA8EE" : "gainsboro",
                                }}
                                onPress={() =>
                                    this.setState({ SelectedDebtCode: ContractName }, () => {
                                        this.setListKyScheduleByCode(ContractName);
                                    })
                                }
                            >
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        color: this.state.SelectedDebtCode === ContractName ? "#2EA8EE" : undefined,
                                    }}
                                >
                                    {ContractName}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View>
                        {this.state.NB ? (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: 'space-between'
                                }}
                            >
                                <View style={{ paddingBottom: 10, paddingHorizontal: 10, flexDirection: "row", marginTop: 10 }}>
                                    <Text style={{ fontWeight: "bold" }}>KỲ TRẢ NỢ: </Text>
                                    <Text style={{ fontWeight: "bold" }}>{Utility.GetKyTraNo(this.state.NB)}</Text>
                                </View>
                                <View style={{ paddingBottom: 10, paddingHorizontal: 10, flexDirection: "row", marginTop: 10 }}>
                                    <Text style={{ fontWeight: "bold" }}>Tổng số kỳ: </Text>
                                    <Text style={{ fontWeight: "bold" }}>{this.state.scheduleCount}</Text>
                                </View>
                                <View style={{ paddingBottom: 10, paddingHorizontal: 10, flexDirection: "row", marginTop: 10 }}>
                                    <Text style={{ fontWeight: "bold" }}>Kỳ hiện tại: </Text>
                                    <TouchableOpacity onPress={() => this.setListKyScheduleByKy()}>
                                        <Text style={{ color: "#2EA8EE", fontWeight: "bold" }}>
                                            {Utility.GetKyTraNo(this.state.KyHienTai)}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : undefined}
                    </View>
                    {lstSchedule.length > 0 ? (
                        <View
                            style={{
                                marginLeft: 10,
                                height: 1,
                                width: width - 20,
                                backgroundColor: "gainsboro",
                            }}
                        ></View>
                    ) : undefined}
                </View>
                <ScrollView>
                    <View>{this.renderKySchedule()}</View>
                </ScrollView>

                {/* <ScrollView>
                    {lstSchedule.map((en, i) =>
                        this.state.SelectedDebtCode === en.DebtContractCode ? (
                            <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                    <Text>Hóa đơn</Text>
                                    <Text style={{ fontWeight: "bold" }}>
                                        {en.Invoiced}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                    <Text>Ngày đến hạn</Text>
                                    <Text style={{ fontWeight: "bold" }}>
                                        {Utility.GetDateString(en.DueDate)}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                    <Text>Ngày bắt đầu</Text>
                                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDateString(en.InstallmentStartDTG)}</Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                    <Text>Ngày kết thúc</Text>
                                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDateString(en.InstallmentEndDTG)}</Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                    <Text>Gốc phải trả</Text>
                                    <Text style={{ fontWeight: "bold" }}>
                                        {Utility.GetDecimalString(en.PrincipalAmount)}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                    <Text>Lãi phải trả</Text>
                                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(en.InterestAmount)}</Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                    <Text>Tổng số tiền cần TT</Text>
                                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(en.TotalAmount)}</Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                    <Text>Dư nợ gốc còn lại</Text>
                                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(en.ContractRemainPrincipalAmount)}</Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                    <Text>Gốc thực tế còn lại</Text>
                                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(en.InstallmentRemainPrincipalAmount)}</Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                    <Text>Lãi thực tế còn lại</Text>
                                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(en.InstallmentRemainInterestAmount)}</Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                    <Text>Phí thực tế còn lại</Text>
                                    <Text style={{ fontWeight: "bold" }}>
                                        {Utility.GetDecimalString(en.InstallmentRemainFeeAmount)}
                                    </Text>
                                </View>

                            </View>
                        ) : undefined
                    )}
                </ScrollView> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    Item: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "gainsboro",
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
});
