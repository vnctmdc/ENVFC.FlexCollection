import React from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView } from "react-native";
import Toolbar from "../../../components/Toolbar";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import DropDownBox from "../../../components/DropDownBox";
import Theme from "../../../Themes/Default";
import GlobalStore from "../../../Stores/GlobalStore";
import SystemParameter from "../../../Entities/SystemParameter";
import Collection_DocumentAction from "../../../Entities/Collection_DocumentAction";
import CollectionDocumentActionDto from "../../../DtoParams/CollectionDocumentActionDto";
import HttpUtils from "../../../Utils/HttpUtils";
import ApiUrl from "../../../constants/ApiUrl";
import SMX from "../../../constants/SMX";
import { inject, observer } from "mobx-react";
import Utility from "../../../Utils/Utility";
import DateTimePicker from "../../../components/DateTimePicker";
import CollectionDocumentActionFieldDto from "../../../DtoParams/CollectionDocumentActionFieldDto";
import CustomerExtPhone from "../../../Entities/CustomerExtPhone";
import CustomerAddress from "../../../Entities/CustomerAddress";
import Customer from "../../../Entities/Customer";
import Collection_DocumentActionField from "../../../Entities/Collection_DocumentActionField";
import CollectionDocumentActionHistoryDto from "../../../DtoParams/CollectionDocumentActionHistoryDto";
import Collection_DocumentActionHistory from "../../../Entities/Collection_DocumentActionHistory";
import * as Enums from '../../../constants/Enums';

interface iProps {
    navigation: any;
    route: any;
    GlobalStore: GlobalStore;
}
interface iState {
    ActHistory: Collection_DocumentActionHistory;
    Customer: Customer;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class ActionDisplaySrc extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            Customer: new Customer(),
            ActHistory: new Collection_DocumentActionHistory(),
        };
    }

    async componentDidMount() {
        await this.LoadData();
    }

    async LoadData() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new CollectionDocumentActionHistoryDto();
            req.DocActHistoryID = this.props.route.params.DocActHisID;
            req.CustomerID = this.props.route.params.CustomerID;

            let res = await HttpUtils.post<CollectionDocumentActionHistoryDto>(
                ApiUrl.CollectionDocActHis_Execute,
                SMX.ApiActionCode.SetupDisplay,
                JSON.stringify(req)
            );

            this.setState({ ActHistory: res!.DocumentActionHistory!, Customer: res!.Customer! });
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    render() {
        let actHis = this.state.ActHistory;
        let cus = this.state.Customer;
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Chi tiết tác nghiệp" navigation={this.props.navigation}></Toolbar>
                <ScrollView>
                    <View style={{ padding: 10 }}>
                        <View style={Theme.FormGroup}>
                            <Text style={Theme.Label}>Tên khách hàng</Text>
                            <Text style={Theme.TextView}>{cus.CustomerName}</Text>
                        </View>
                        <View style={Theme.FormGroup}>
                            <Text style={Theme.Label}>Ngày - giờ liên hệ</Text>
                            <Text style={Theme.TextView}>{actHis.EndDTGText}</Text>
                        </View>
                        <View style={Theme.FormGroup}>
                            <Text style={Theme.Label}>Đối tượng liên hệ</Text>
                            <Text style={Theme.TextView}>{actHis.ObjectiveCode + '- ' + actHis.ObjectiveName}</Text>
                        </View>
                        <View style={Theme.FormGroup}>
                            <Text style={Theme.Label}>Người liên hệ</Text>
                            <Text style={Theme.TextView}>{actHis.ObjectiveName}</Text>
                        </View>
                        <View style={Theme.FormGroup}>
                            <Text style={Theme.Label}>Địa chỉ liên hệ</Text>
                            <Text style={Theme.TextView}>{actHis.AddressName}</Text>
                        </View>
                        <View style={Theme.FormGroup}>
                            <Text style={Theme.Label}>Kết quả liên hệ</Text>
                            <Text style={Theme.TextView}>{actHis.ReturnCode + '- ' + actHis.ReturnName}</Text>
                        </View>
                        {
                            actHis.ReturnCodeID == Enums.KetQuaLienHe.HuaThanhToan ? (
                                <View>
                                    <View style={Theme.FormGroup}>
                                        <Text style={Theme.Label}>Ngày hứa trả</Text>
                                        <Text style={Theme.TextView}>{Utility.GetDateString(actHis.PromiseToPayDTG)}</Text>
                                    </View>
                                    <View style={Theme.FormGroup}>
                                        <Text style={Theme.Label}>Số tiền hứa trả</Text>
                                        <Text style={Theme.TextView}>{Utility.GetDecimalString(actHis.PromiseToPayAmount)}</Text>
                                    </View>
                                </View>
                            ) : undefined
                        }
                        <View style={Theme.FormGroup}>
                            <Text style={Theme.Label}>Ghi chú</Text>
                            <Text style={[Theme.TextView, {height: 100}]}>{actHis.Notes}</Text>
                        </View>

                    </View>
                </ScrollView>
            </View>
        );
    }
}
