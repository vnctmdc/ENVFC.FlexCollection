import React from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image } from "react-native";
import Toolbar from "../../components/Toolbar";
import GlobalStore from "../../Stores/GlobalStore";
import AttachmentDto from "../../DtoParams/AttachmentDto";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import SMX from "../../constants/SMX";
import adm_Attachment from "../../Entities/adm_Attachment";
import PopupModal from "../../components/PopupModal";
import GlobalCache from "../../Caches/GlobalCache";
import Theme from "../../Themes/Default";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import PromiseToPay from "../../Entities/PromiseToPay";
import PromiseToPayDto from "../../DtoParams/PromiseToPayDto";
import Utility from "../../Utils/Utility";

const { width } = Dimensions.get("window");

interface iProps {
    navigation: any;
    route: any;
    GlobalStore: GlobalStore;
}
interface iState {
    LstPromiseToPay: PromiseToPay[];
    PageIndex: number;
}
export default class PromiseToPayDisplayUC extends React.Component<iProps, iState> {
    private onEndReachedCalledDuringMomentumAttPromiseToPay = false;

    constructor(props: iProps) {
        super(props);
        this.state = {
            LstPromiseToPay: [],
            PageIndex: 0,
        };
    }

    async componentDidMount() {
        await this.LoadData(false);
    }

    async LoadData(isLoadMore: boolean) {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new PromiseToPayDto();
            let promise = new PromiseToPay();
            promise.CustomerID = this.props.route.params.CustomerID;
            promise.DocumentActionID = this.props.route.params.DocumentActionID;
            promise.DocumentID = this.props.route.params.DocumentID;
            req.PromiseToPay = promise;

            let res = await HttpUtils.post<PromiseToPayDto>(
                ApiUrl.PromiseToPay_Execute,
                SMX.ApiActionCode.SearchData,
                JSON.stringify(req)
            );

            if (!isLoadMore) this.setState({ LstPromiseToPay: res!.LstPromiseToPay! });
            else this.setState({ LstPromiseToPay: this.state.LstPromiseToPay.concat(res!.LstPromiseToPay!) });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    renderItem(item: PromiseToPay) {
        return (
            <View style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                    <Text>Ngày hứa trả</Text>
                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDateString(item.PromiseDTG)}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                    <Text>Số tiền hứa trả</Text>
                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(item.PromiseAmount)}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                    <Text>Số tiền thanh toán</Text>
                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(item.PaidAmount)}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                    <Text>Kết luận</Text>
                    <Text
                        style={{
                            fontWeight: "bold",
                            color: Utility.GetDictionaryValue(SMX.PromisePaid.dicColor, item.PaidStatus),
                        }}
                    >
                        {Utility.GetDictionaryValue(SMX.PromisePaid.dicName, item.PaidStatus)}
                    </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                    <Text>Ngày liên lạc</Text>
                    <Text style={{ fontWeight: "bold" }}>{Utility.GetDateString(item.FieldDTG)}</Text>
                </View>

                <View
                    style={{
                        height: 1,
                        backgroundColor: "gainsboro",
                        marginTop: 5,
                    }}
                ></View>
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Hứa trả" navigation={this.props.navigation}></Toolbar>
                <FlatList
                    data={this.state.LstPromiseToPay}
                    renderItem={({ item, index }) => this.renderItem(item)}
                    keyExtractor={(item, i) => i.toString()}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentumAttPromiseToPay = false;
                    }}
                    onEndReached={() => {
                        if (!this.onEndReachedCalledDuringMomentumAttPromiseToPay) {
                            if (this.state.LstPromiseToPay.length >= 20) {
                                this.setState({ PageIndex: this.state.PageIndex + 1 }, () => {
                                    this.LoadData(true);
                                });
                                this.onEndReachedCalledDuringMomentumAttPromiseToPay = true;
                            }
                        }
                    }}
                    onEndReachedThreshold={0.5}
                />
            </View>
        );
    }
}
