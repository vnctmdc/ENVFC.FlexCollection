import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import GlobalStore from "../../../Stores/GlobalStore";
import { inject, observer } from "mobx-react";
import SMX from "../../../constants/SMX";
import DebtContractAnnexDto from "../../../DtoParams/DebtContractAnnexDto";
import HttpUtils from "../../../Utils/HttpUtils";
import ApiUrl from "../../../constants/ApiUrl";
import Collection_DebtContract from "../../../Entities/Collection_DebtContract";
import Toolbar from "../../../components/Toolbar";
import Theme from "../../../Themes/Default";
import DropDownBox from "../../../components/DropDownBox";
import Utility from "../../../Utils/Utility";

interface iProps {
    navigation: any;
    route: any;
    GlobalStore: GlobalStore;
}
interface iState {
    LstDebtContract: Collection_DebtContract[];
    SelectedDebtContractID?: number;
    DebtContract: Collection_DebtContract;
    NextDueDTG?: Date;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class DebtContractAnnexSrc extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            DebtContract: new Collection_DebtContract(),
            LstDebtContract: [],
        };
    }

    async componentDidMount() {
        await this.SetupViewForm();
    }

    async SetupViewForm() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new DebtContractAnnexDto();
            req.CustomerID = this.props.route.params.CustomerID;

            let res = await HttpUtils.post<DebtContractAnnexDto>(
                ApiUrl.DebtContractAnnex_Execute,
                SMX.ApiActionCode.SetupDisplay,
                JSON.stringify(req)
            );

            this.setState({ LstDebtContract: res!.LstDebtContract! });
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    async CaculateDebtContractAnnex() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new DebtContractAnnexDto();
            req.DebtContractID = this.state.SelectedDebtContractID;

            let res = await HttpUtils.post<DebtContractAnnexDto>(
                ApiUrl.DebtContractAnnex_Execute,
                SMX.ApiActionCode.CaculateAnnex,
                JSON.stringify(req)
            );

            this.setState({ DebtContract: res!.DebtContract!, NextDueDTG: res!.NextDueDTG! });
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    renderContent(item: Collection_DebtContract) {
        if (item && item.OverDueDay < 1) {
            return (
                <View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Số tiền thanh toán cho kỳ gần nhất tiếp theo</Text>
                        <Text style={Theme.TextView}>{Utility.GetDecimalString(item.TotalAmountTex)}</Text>
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Dư nợ gốc còn lại của hợp đồng</Text>
                        <Text style={Theme.TextView}>{Utility.GetDecimalString(item.RemainPrincipalAmount)}</Text>
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Phí trả nợ trước hạn</Text>
                        <Text style={Theme.TextView}>{Utility.GetDecimalString(item.Fees)}</Text>
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Số tiền khách hàng đang trả dư còn lại</Text>
                        <Text style={Theme.TextView}>{Utility.GetDecimalString(item.ToCollectAmount)}</Text>
                    </View>
                </View>
            );
        }
        if (item && item.OverDueDay >= 1 && item.OverDueDay <= 180) {
            return (
                <View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Lãi trên gốc chậm trả (LPI)</Text>
                        <Text style={Theme.TextView}>{Utility.GetDecimalString(item.LPIAmount)}</Text>
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Số tiền quá hạn</Text>
                        <Text style={Theme.TextView}>{Utility.GetDecimalString(item.ToCollectAmount)}</Text>
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Số tiền thanh toán cho kỳ gần nhất tiếp theo</Text>
                        <Text style={Theme.TextView}>{Utility.GetDecimalString(item.TotalAmountTex)}</Text>
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Dư nợ gốc còn lại của hợp đồng</Text>
                        <Text style={Theme.TextView}>{Utility.GetDecimalString(item.RemainPrincipalAmount)}</Text>
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Phí trả nợ trước hạn</Text>
                        <Text style={Theme.TextView}>{Utility.GetDecimalString(item.Fees)}</Text>
                    </View>
                </View>
            );
        }
        if (item && item.OverDueDay > 180) {
            return (
                <View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Số tiền quá hạn</Text>
                        <Text style={Theme.TextView}>{Utility.GetDecimalString(item.ToCollectAmount)}</Text>
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Lãi trên gốc chậm trả (LPI)</Text>
                        <Text style={Theme.TextView}>{Utility.GetDecimalString(item.LPIAmount)}</Text>
                    </View>
                </View>
            );
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Tính tất toán" navigation={this.props.navigation}></Toolbar>
                <View style={{ padding: 10, flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flex: 3 }}>
                        <Text style={Theme.Label}>Mã hợp đồng</Text>
                        <DropDownBox
                            TextField="DebtContractCode"
                            ValueField="DebtContractID"
                            DataSource={this.state.LstDebtContract}
                            SelectedValue={this.state.SelectedDebtContractID}
                            OnSelectedItemChanged={(item) => {
                                this.setState({ SelectedDebtContractID: item.DebtContractID });
                            }}
                        ></DropDownBox>
                    </View>

                    <TouchableOpacity
                        style={[Theme.BtnSmPrimary, { flex: 1, marginLeft: 5 }]}
                        onPress={() => {
                            this.CaculateDebtContractAnnex();
                        }}
                    >
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 17 }}>Tính</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 10 }}>
                    {this.state.NextDueDTG ? (
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                            <Text>
                                <Text style={{ color: "red" }}>
                                    (Chỉ tính tất toán từ ngày hiện tại đến hạn thanh toán gần nhất){" "}
                                </Text>
                                {Utility.GetDateString(this.state.NextDueDTG)}
                            </Text>
                        </View>
                    ) : undefined}
                    {this.renderContent(this.state.DebtContract)}
                    {this.state.DebtContract.TotalAnnexAmount ? (
                        <View style={Theme.FormGroup}>
                            <Text style={Theme.Label}>Số tiền tất toán</Text>
                            <Text style={Theme.TextView}>
                                {Utility.GetDecimalString(
                                    this.state.DebtContract ? this.state.DebtContract.TotalAnnexAmount : 0
                                )}
                            </Text>
                        </View>
                    ) : undefined}
                </View>
            </View>
        );
    }
}
