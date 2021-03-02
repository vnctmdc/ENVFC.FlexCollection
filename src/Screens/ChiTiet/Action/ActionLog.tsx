import React from "react";
import { View, Text, FlatList, TouchableOpacity, Dimensions } from "react-native";
import GlobalStore from "../../../Stores/GlobalStore";
import Toolbar from "../../../components/Toolbar";
import HttpUtils from "../../../Utils/HttpUtils";
import CollectionDocumentActionHistoryDto from "../../../DtoParams/CollectionDocumentActionHistoryDto";
import ApiUrl from "../../../constants/ApiUrl";
import SMX from "../../../constants/SMX";
import CollectionDocumentAllDto from "../../../DtoParams/CollectionDocumentAllDto";
import Collection_DocumentActionHistory from "../../../Entities/Collection_DocumentActionHistory";
import Utility from "../../../Utils/Utility";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as Enums from "../../../constants/Enums";
const { width, height } = Dimensions.get("window");

interface iProps {
    GlobalStore: GlobalStore;
    navigation: any;
    route: any;
}
interface iState {
    LstCollDocActHis: Collection_DocumentActionHistory[];
    PageIndex: number;
    IsAvailableAddAction?: boolean;
}
export default class ActionLogSrc extends React.Component<iProps, iState> {
    private onEndReachedCalledDuringMomentumActHis = false;

    constructor(props: iProps) {
        super(props);
        this.state = {
            LstCollDocActHis: [],
            PageIndex: 0,
        };
    }

    async componentDidMount() {
        this.props.GlobalStore.UpdateActField = async () => {
            await this.LoadData(false);
        };

        await this.LoadData(false);
    }

    async LoadData(isLoadMore: boolean) {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new CollectionDocumentActionHistoryDto();
            req.PageIndex = this.state.PageIndex;
            req.CustomerID = this.props.route.params.CustomerID;
            req.DocumentID = this.props.route.params.DocumentID;
            req.DocumentActionID = this.props.route.params.DocumentActionID;

            let res = await HttpUtils.post<CollectionDocumentActionHistoryDto>(
                ApiUrl.CollectionDocActHis_Execute,
                SMX.ApiActionCode.SearchData,
                JSON.stringify(req)
            );

            if (!isLoadMore) this.setState({ LstCollDocActHis: res!.LstCollDocActHis! });
            else this.setState({ LstCollDocActHis: this.state.LstCollDocActHis.concat(res!.LstCollDocActHis!) });

            this.setState({
                IsAvailableAddAction: res.IsAvailableAddAction !== undefined ? res.IsAvailableAddAction : true,
            });
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    renderItem(item: Collection_DocumentActionHistory) {
        return (
            <TouchableOpacity
                style={{ paddingVertical: 5, paddingHorizontal: 10 }}
                onPress={() =>
                    this.props.navigation.navigate("DocActionDisplay", {
                        CustomerID: this.props.route.params.CustomerID,
                        DocActHisID: item.DocumentActionHistoryID,
                    })
                }
            >
                <View style={{ flexDirection: "row", flex: 3, marginTop: 3 }}>
                    <Text style={{ flex: 1 }}>Ngày - giờ liên lạc</Text>
                    <Text style={{ fontWeight: "bold", flex: 2 }}>{item.EndDTGText}</Text>
                </View>
                <View style={{ flexDirection: "row", flex: 3, marginTop: 3 }}>
                    <Text style={{ flex: 1 }}>Địa chỉ liên lạc </Text>
                    <Text style={{ fontWeight: "bold", flex: 2 }}>{item.AddressName}</Text>
                </View>
                <View style={{ flexDirection: "row", flex: 3, marginTop: 3 }}>
                    <Text style={{ flex: 1 }}>Nhân viên tác nghiệp </Text>
                    <Text style={{ fontWeight: "bold", flex: 2 }}>{item.EmployeeName}</Text>
                </View>
                <View style={{ flexDirection: "row", flex: 3, marginTop: 3 }}>
                    <Text style={{ flex: 1 }}>Người liên hệ </Text>
                    <Text style={{ fontWeight: "bold", flex: 2 }}>{item.ObjectiveName}</Text>
                </View>
                <View style={{ flexDirection: "row", flex: 3, marginTop: 3 }}>
                    <Text style={{ flex: 1 }}>Code </Text>
                    <Text style={{ fontWeight: "bold", flex: 2 }}>{item.ReturnCode + "- " + item.ReturnName}</Text>
                </View>
                {/* {item.ReturnCodeName ? (
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                        <Text style={{ fontWeight: "bold" }}>{item.ReturnCodeName}</Text>
                    </View>
                ) : undefined} */}
                {item.ReturnCodeID == Enums.KetQuaLienHe.HuaThanhToan ? (
                    <View>
                        <View style={{ flexDirection: "row", flex: 3, marginTop: 3 }}>
                            <Text style={{ flex: 1 }}>Ngày hứa trả</Text>
                            <Text style={{ fontWeight: "bold", flex: 2 }}>
                                {Utility.GetDateString(item.PromiseToPayDTG)}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", flex: 3, marginTop: 3 }}>
                            <Text style={{ flex: 1 }}>Số tiền hứa trả</Text>
                            <Text style={{ fontWeight: "bold", flex: 2 }}>
                                {Utility.GetDecimalString(item.PromiseToPayAmount)}
                            </Text>
                        </View>
                    </View>
                ) : undefined}
                <View style={{ flexDirection: "row", flex: 3, marginTop: 3 }}>
                    <Text style={{ flex: 1 }}>Ghi chú </Text>
                    <Text style={{ fontWeight: "bold", flex: 2 }}>{item.Notes}</Text>
                </View>

                <View
                    style={{
                        height: 1,
                        backgroundColor: "gainsboro",
                        marginTop: 5,
                    }}
                ></View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Lịch sử tác nghiệp" navigation={this.props.navigation}>
                    <View style={{ marginLeft: 10 }}>
                        {this.state.IsAvailableAddAction ? (
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => {
                                    this.props.navigation.navigate("AddAction", {
                                        CustomerID: this.props.route.params.CustomerID,
                                        DocumentID: this.props.route.params.DocumentID,
                                        DocumentActionID: this.props.route.params.DocumentActionID,
                                    });
                                }}
                            >
                                <FontAwesome5 name="plus" size={25} color="#1F31A4" />
                            </TouchableOpacity>
                        ) : undefined}
                    </View>
                </Toolbar>
                <FlatList
                    data={this.state.LstCollDocActHis}
                    renderItem={({ item, index }) => this.renderItem(item)}
                    keyExtractor={(item, i) => i.toString()}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentumActHis = false;
                    }}
                    onEndReached={() => {
                        if (!this.onEndReachedCalledDuringMomentumActHis) {
                            if (this.state.LstCollDocActHis.length >= 20) {
                                this.setState({ PageIndex: this.state.PageIndex + 1 }, () => {
                                    this.LoadData(true);
                                });
                                this.onEndReachedCalledDuringMomentumActHis = true;
                            }
                        }
                    }}
                    onEndReachedThreshold={0.5}
                />
            </View>
        );
    }
}
