import React from "react";
import { View, TouchableOpacity, Text, Dimensions, ScrollView } from "react-native";
import Toolbar from "../../components/Toolbar";
import { Ionicons } from "@expo/vector-icons";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import Utility from "../../Utils/Utility";
import Collection_DebtContractEntry from "../../Entities/Collection_DebtContractEntry";
import DebtContractEntryDto from "../../DtoParams/DebtContractEntryDto";
const { width } = Dimensions.get("window");

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
    route: any;
}
interface iState {
    LstDebtContractEntry?: Collection_DebtContractEntry[];
    LstDCEntry?: Collection_DebtContractEntry[];
    ThisMonth?: string;
    TotalAmount?: number;
    ValuedDTG?: Date;
    selectedIndex: number;
    LstContractName?: string[];
    SelectedDebtCode: string;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class SoThuSrc extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            LstDebtContractEntry: [],
            LstDCEntry: [],
            SelectedDebtCode: "",
            TotalAmount: 0,
            selectedIndex: 0,
            LstContractName: [],
        };
    }

    async componentDidMount() {
        await this.LoadData();
        this.setState({ ValuedDTG: this.state.LstDebtContractEntry[this.state.selectedIndex].ValuedDTG });
    }

    setDateTT(selectedIndex: number) {
        this.setState({
            ValuedDTG: this.state.LstDebtContractEntry[selectedIndex].ValuedDTG,
        });
    }

    async LoadData() {
        this.props.GlobalStore.ShowLoading();
        let req = new DebtContractEntryDto();
        req.CustomerID = this.props.route.params.CustomerID;
        req.DocumentID = this.props.route.params.DocumentID;

        let res = await HttpUtils.post<DebtContractEntryDto>(
            ApiUrl.DebtContractEntry_Execute,
            SMX.ApiActionCode.SearchData,
            JSON.stringify(req)
        );

        var debtContractName = [];
        const cats = res!.LstDebtContractEntry.map((q) => q.DebtContractCode);
        debtContractName = cats.filter((q, idx) => cats.indexOf(q) === idx);
        let data = res.LstDebtContractEntry;
        let totalAmount = 0;
        data.forEach((element) => {
            totalAmount += element.TotalAmount ? element.TotalAmount : 0;
        });

        this.setState(
            {
                LstContractName: debtContractName,
                LstDebtContractEntry: res!.LstDebtContractEntry!,
                TotalAmount: totalAmount,
            },
            () => {
                if (this.state.LstDebtContractEntry.length > 0) {
                    var lstDCEntry = this.state.LstDebtContractEntry.filter(
                        (en) => en.DebtContractCode == debtContractName[0]
                    );
                    lstDCEntry = lstDCEntry.sort((a, b) => (new Date(b.ValuedDTG) < new Date(a.ValuedDTG) ? -1 : 1));

                    this.setState({
                        LstDCEntry: lstDCEntry,
                        SelectedDebtCode: this.state.LstDebtContractEntry[0].DebtContractCode,
                    });
                }
            }
        );
        this.props.GlobalStore.HideLoading();
    }

    renderDebtContractEntry() {
        let lstDCEntry = this.state.LstDebtContractEntry;
        return lstDCEntry.map((en, index) => {
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
                            {/* <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Ngày thanh toán</Text>
                                <Text style={{ fontWeight: "bold" }}>{Utility.GetDateString(en.ValuedDTG)}</Text>
                            </View> */}

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Số HĐ</Text>
                                <Text style={{ fontWeight: "bold" }}>{en.DebtContractCode}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Mã giao dịch</Text>
                                <Text style={{ fontWeight: "bold" }}>{en.TransferCode}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Số tiền TT</Text>
                                <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(en.TotalAmount)}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Gạch nợ gốc</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {Utility.GetDecimalString(en.PrincipalAmount)}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Gạch nợ lãi</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {Utility.GetDecimalString(en.InterestAmount)}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Gạch nợ LPI</Text>
                                <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(en.PenaltyAmount)}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Kênh thu hộ</Text>
                                <Text style={{ fontWeight: "bold" }}>{en.Channel}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Người TT</Text>
                                <Text style={{ fontWeight: "bold" }}>{en.Payer}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Số ĐT người TT</Text>
                                <Text style={{ fontWeight: "bold" }}>{en.PayerPhone}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Agency</Text>
                                <Text style={{ fontWeight: "bold" }}>{en.AgencyName}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Code bán nợ</Text>
                                <Text style={{ fontWeight: "bold" }}>{en.DebtSaleFlag}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{ padding: 8, paddingTop: 50 }}
                            onPress={() => {
                                if (this.state.selectedIndex < lstDCEntry.length - 1) {
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

    setListDebtContractEntry(code: string) {
        var lstDCEntry = this.state.LstDebtContractEntry.filter((en) => en.DebtContractCode == code);
        lstDCEntry = lstDCEntry.sort((a, b) => (new Date(b.ValuedDTG) < new Date(a.ValuedDTG) ? -1 : 1));
        this.setState({ LstDCEntry: lstDCEntry });
    }

    render() {
        let lstContractName = this.state.LstContractName;
        let lstDCEntry = this.state.LstDCEntry;
        return (
            <View style={{ flex: 1 }}>
                <Toolbar Title="Lịch sử Thanh toán" navigation={this.props.navigation}>
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
                                        this.setListDebtContractEntry(ContractName);
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
                </View>
                <ScrollView>
                    <View>
                        <View
                            style={{
                                paddingTop: 10,
                                width: "100%",
                                flexDirection: "row",
                                alignItems: "center",
                                marginVertical: 10,
                                backgroundColor: "#FFF",
                                marginHorizontal: 10,
                            }}
                        >
                            <Text style={{ fontWeight: "bold", width: "5%" }}>#</Text>
                            <Text style={{ fontWeight: "bold", width: "30%" }}>Ngày đóng tiền</Text>
                            <Text style={{ fontWeight: "bold", width: "35%" }}>Số tiền KH đóng</Text>
                            <Text style={{ fontWeight: "bold", width: "30%" }}>Kênh TT</Text>
                        </View>
                        {lstDCEntry.length > 0
                            ? lstDCEntry.map((en, index) => (
                                  <View
                                      style={{
                                          width: "100%",
                                          flexDirection: "row",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          marginHorizontal: 10,
                                          marginVertical: 10,
                                          backgroundColor: "#FFF",
                                          borderBottomColor: "gainsboro",
                                          borderBottomWidth: 1,
                                      }}
                                  >
                                      <Text style={{ width: "5%" }}>{index + 1}</Text>
                                      <Text style={{ width: "30%" }}>{Utility.GetDateString(en.ValuedDTG)}</Text>
                                      <View
                                          style={{ width: "35%", justifyContent: "flex-end", alignItems: "flex-end" }}
                                      >
                                          <Text style={{ marginRight: 35 }}>
                                              {Utility.GetDecimalString(en.TotalAmount)}
                                          </Text>
                                      </View>
                                      <Text style={{ width: "30%" }}>{en.Channel}</Text>
                                  </View>
                              ))
                            : undefined}
                    </View>
                </ScrollView>
                {/* <View style={{ paddingTop: 5, paddingHorizontal: 35 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                        <Text>Tháng</Text>
                        <Text style={{ fontWeight: "bold" }}>
                            {Utility.GetMonthString(this.state.ValuedDTG)}
                        </Text>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                        <Text>Tổng số tiền TT</Text>
                        <Text style={{ fontWeight: "bold" }}>
                            {Utility.GetDecimalString(this.state.TotalAmount)}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                        <Text>Ngày thanh toán</Text>
                        <Text style={{ fontWeight: "bold" }}>{Utility.GetDateString(this.state.ValuedDTG)}</Text>
                    </View>
                    <View
                        style={{
                            marginTop: 8,
                            height: 1,
                            width: width - 70,
                            backgroundColor: "gainsboro"
                        }}
                    />
                </View>
                {this.renderDebtContractEntry()} */}
                {/* <ScrollView
                    horizontal={true}
                    pagingEnabled={true}>
                    {lstDCEntry.map((en, i) =>
                        <View style={{ width: width , paddingVertical: 5, paddingHorizontal: 10 }}>
                            
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Ngày thanh toán</Text>
                                <Text style={{ fontWeight: "bold" }}>{Utility.GetDateString(en.ValuedDTG)}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Số HĐ</Text>
                                <Text style={{ fontWeight: "bold" }}>{en.DebtContractCode}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Mã giao dịch</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {en.TransferCode}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Số tiền TT</Text>
                                <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(en.TotalAmount)}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Gạch nợ gốc</Text>
                                <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(en.PrincipalAmount)}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Gạch nợ lãi</Text>
                                <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(en.InterestAmount)}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Gạch nợ LPI</Text>
                                <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(en.PenaltyAmount)}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Kênh thu hộ</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {en.Channel}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Người TT</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {en.Payer}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Số ĐT người TT</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {en.PayerPhone}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Agency</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {en.AgencyName}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text>Code bán nợ</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {en.DebtSaleFlag}
                                </Text>
                            </View>

                        </View>
                    )}
                </ScrollView>
             */}
            </View>
        );
    }
}
