import React from "react";
import { View, TouchableOpacity, FlatList, Text, Dimensions, Alert, TextInput } from "react-native";
import Toolbar from "../../components/Toolbar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import Utility from "../../Utils/Utility";
import CollectionDocumentAllDto from "../../DtoParams/CollectionDocumentAllDto";
import Theme from "../../Themes/Default";
import Collection_DocumentAction from "../../Entities/Collection_DocumentAction";
import Collection_DocumentActionSchedule from "../../Entities/Collection_DocumentActionSchedule";
import { ClientMessage } from "../../SharedEntity/SMXException";
import PopupModal from "../../components/PopupModal";
import * as Enums from '../../constants/Enums';

const { width, height } = Dimensions.get("window");

interface iProps {
    GlobalStore: GlobalStore;
    navigation: any;
}

interface iState {
    IsMapScreen: boolean;
    coordinates: any;
    LstAction: Collection_DocumentAction[];
    LstActionSchedule: Collection_DocumentActionSchedule[];
    TongKhachHang: number;
    TongDuNo: number;
    PageIndex: number;
    //search kh
    searchBox: boolean;
    CustomerName: string;
    IDCard: string;
    ContractNumber: string;
    ContractCode: string;
    hasScheduleVisit: boolean;
    FilterName: string;
}
@inject(SMX.StoreName.GlobalStore)
@observer
export default class KeHoachVisitNgaySrc extends React.Component<iProps, iState> {
    private onEndReachedCalledDuringMomentumAll = false;
    constructor(props: iProps) {
        super(props);
        this.state = {
            hasScheduleVisit: true,
            IsMapScreen: false,
            coordinates: [],
            LstAction: [],
            LstActionSchedule: [],
            TongKhachHang: 0,
            TongDuNo: 0,
            PageIndex: 0,
            //search
            searchBox: false,
            CustomerName: '',
            IDCard: '',
            ContractNumber: '',
            ContractCode: '',
            FilterName: "",
        };
    }

    async componentDidMount() {
        await this.LoadData(false);
    }

    async LoadData(isLoadMore: boolean) {
        this.props.GlobalStore.ShowLoading();
        var req = new CollectionDocumentAllDto();
        req.FilterName = this.state.FilterName;
        // req.CustomerName = this.state.CustomerName;
        // req.IDCard = this.state.IDCard;
        // req.ContractNumber = this.state.ContractNumber;
        // req.ContractCode = this.state.ContractCode;
        req.PageIndex = this.state.PageIndex;
        let res = await HttpUtils.post<CollectionDocumentAllDto>(
            ApiUrl.CollectionDocumentAll_Execute,
            SMX.ApiActionCode.DSKHKeHoachVisit,
            JSON.stringify(req)
        );

        let list = res!.LstAction!.filter(e => e.ScheduleStatus == Enums.Collection_ActionSchedule.Implement);
        if(list.length > 0){
            this.setState({hasScheduleVisit: false});
        }

        // res!.LstAction!.forEach(x => {
        //     x.CustomerName = x.CustomerName ? x.CustomerName : '';
        //     x.ListContractCode = x.ListContractCode ? x.ListContractCode : '';
        //     x.IDCard = x.IDCard ? x.IDCard : '';
        //     x.DistrictName = x.DistrictName ? x.DistrictName : '';
        //     x.ProvinceName = x.ProvinceName ? x.ProvinceName : '';
        // });

        if (!isLoadMore) this.setState({ LstAction: res!.LstAction! });
        else this.setState({ LstAction: this.state.LstAction.concat(res!.LstAction!) });
        //this.SearchCustomer();
        this.setState({ TongKhachHang: res!.TongKhachHang!, TongDuNo: res!.TongDuNo! });
        this.props.GlobalStore.HideLoading();
    }

    // SearchCustomer() {
    //     this.setState({
    //         CustomerName: '',
    //         IDCard: '',
    //         ContractNumber: '',
    //         ContractCode: '',
    //     })
    // }

    GetColorCode(value: string) {
        if (value !== null && value !== undefined) {
            if (value == 'B8') {
                return "#8A0808";
            } else if (value == 'B7') {
                return "#FF0040";
            } else if (value == 'B6') {
                return "#FF8000";
            } else if (value == 'B5') {
                return "#B18904";
            } else if (value == 'B4') {
                return "#0040FF";
            } else if (value == 'B3') {
                return "#00BFFF";
            } else if (value == 'B2') {
                return "#298A08";
            } else if (value == 'B1') {
                return "#80FF00";
            } else if (value == 'B0') {
                return "#D8F781";
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    renderItem(item: Collection_DocumentAction) {
        return (
            <View
                style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: "gainsboro",
                    padding: 10,
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    onPress={() => {
                        this.props.navigation.navigate("CollectionDocumentDisplay", {
                            DocumentID: item.DocumentID,
                            CustomerID: item.CustomerID,
                            DocumentActionID: item.DocumentActionID,
                        });
                    }}
                >
                    <View
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 100,
                            backgroundColor: this.GetColorCode(item.Budget),
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text style={{ fontWeight: "bold", fontSize: 17, color: "white" }}>
                            {item.OverDueDay}
                        </Text>
                    </View>
                    <View style={{ width: width - 95, padding: 10 }}>
                        <Text style={{ width: width - 95 }}>{item.CustomerName}</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Số lượng HĐ:</Text>
                            <Text style={{ fontWeight: "bold" }}>{item.NumberOfContract ? item.NumberOfContract : 0}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Số ĐT:</Text>
                            <Text style={{ fontWeight: "bold" }}>{item.CustomerMobile}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            {item.CustomerTempAddress ?
                                <Text style={{ fontWeight: "bold", width: width - 100 }}>{item.CustomerTempAddress}</Text> : undefined
                            }
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Tổng nợ quá hạn:</Text>
                            <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(item.TotalPastDueAmount)}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Tác nghiệp gần nhất:</Text>
                            <Text style={{ fontWeight: "bold" }}>{item.LastActionName}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {
                    item.ScheduleStatus == Enums.Collection_ActionSchedule.Implement ? undefined :
                        (
                            <TouchableOpacity
                                style={{
                                    width: 25,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onPress={() => this.confirmToDeleteAction(item)}
                            >
                                <FontAwesome name="calendar-times-o" size={25} color="#169BD5" />

                            </TouchableOpacity>
                        )
                }
            </View>
        );
    }

    confirmToDeleteAction(action: Collection_DocumentAction) {
        Alert.alert(
            "Xóa kế hoạch visit",
            "Bạn có chắc chắn muốn xóa kế hoạch visit này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                { text: "Xóa", onPress: () => this.DeleteAction(action) },
            ],
            { cancelable: false }
        );
    }

    async DeleteAction(action: Collection_DocumentAction) {
        try {
            this.props.GlobalStore.ShowLoading();
            let request = new CollectionDocumentAllDto();
            request.Action = action;

            let res = await HttpUtils.post<CollectionDocumentAllDto>(
                ApiUrl.CollectionDocumentAll_Execute,
                SMX.ApiActionCode.DeleteItem,
                JSON.stringify(request),
                true
            );

            //this.setState({ LstAction: this.state.LstAction!.filter((x) => x.DocumentActionID != res.DocumentActionID) });
            await this.LoadData(false);
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    async GuiKeHoach() {
        try {
            this.props.GlobalStore.ShowLoading();
            let request = new CollectionDocumentAllDto();
            let lstAction = this.state.LstAction;
            let lstActionSchedule = this.state.LstActionSchedule;
            lstAction.forEach(element => {
                let item = new Collection_DocumentActionSchedule();
                item.DocumentActionScheduleID = element.DocumentActionScheduleID;
                item.Version = element.ScheduleVersion;
                lstActionSchedule.push(item);
            });

            request.LstActionSchedule = lstActionSchedule;

            let res = await HttpUtils.post<CollectionDocumentAllDto>(
                ApiUrl.CollectionDocumentAll_Execute,
                SMX.ApiActionCode.GuiKeHoach,
                JSON.stringify(request)
            );
            await this.LoadData(false);
            this.props.GlobalStore.Exception = ClientMessage("Chốt kế hoạch ngày thành công!");
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }

    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Kế hoạch visit ngày" navigation={this.props.navigation} HasDrawer={true}>
                    {/* <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                this.setState({ searchBox: true })
                            }}
                        >
                            <AntDesign name="filter" size={22} color="#1C4694" />
                        </TouchableOpacity>
                    </View> */}
                    <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                this.setState({ PageIndex: 0 }, async () => 
                                this.LoadData(false))
                            }}
                        >
                            <AntDesign name="reload1" size={22} color="#1C4694" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                this.props.navigation.navigate('KeHoachVisitNgayMap');
                            }}
                        >
                            <FontAwesome name="map-o" size={22} color="#1C4694" />
                        </TouchableOpacity>
                    </View>
                </Toolbar>
                <View
                    style={{
                        padding: 15,
                        flexDirection: "row",
                        // alignItems: "center",
                        // justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: "#1D39C4",
                            marginRight: 15,
                            borderRadius: 100,
                            paddingVertical: 8,
                            paddingLeft: 10,
                            width: "85%",
                        }}
                        placeholder="Nhập tìm kiếm..."
                        value={this.state.FilterName}
                        onChangeText={(val) => this.setState({ FilterName: val })}
                    />
                    <TouchableOpacity
                        style={{ alignSelf: "center", justifyContent: 'center', flex: 1, paddingTop: 3, width: "15%" }}
                        onPress={() => {
                            this.setState({ PageIndex: 0, searchBox: false }, async () => {
                                await this.LoadData(false);
                            });
                        }}
                    >
                        <AntDesign name="search1" size={30} color="#1C4694" />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "gainsboro" }}>
                    <View
                        style={{
                            paddingRight: 16,
                            paddingLeft: 10,
                            paddingVertical: width / 25,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <View>
                            <Text>Tổng số HĐ: </Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold" }}>
                                {this.state.TongKhachHang}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            paddingRight: 4,
                            paddingVertical: width / 25,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text>Tổng dự nợ: </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            {Utility.GetDecimalString(this.state.TongDuNo)}
                        </Text>
                    </View>
                </View>
                <FlatList
                    data={this.state.LstAction}
                    //data={this.state.LstAction.filter((x) =>
                    //    Utility.FormatVNLanguage(x.CustomerName!.toLowerCase()).includes(Utility.FormatVNLanguage(this.state.FilterName.toLowerCase()))
                    //    || x.ListContractCode.toString().toLowerCase().includes(Utility.FormatVNLanguage(this.state.FilterName.toLowerCase()))
                    //    || x.IDCard!.toLowerCase().includes(Utility.FormatVNLanguage(this.state.FilterName.toLowerCase()))
                    //    || Utility.FormatVNLanguage(x.DistrictName!.toLowerCase()).includes(Utility.FormatVNLanguage(this.state.FilterName.toLowerCase()))
                    //    || Utility.FormatVNLanguage(x.ProvinceName!.toLowerCase()).includes(Utility.FormatVNLanguage(this.state.FilterName.toLowerCase()))
                    //)}
                    renderItem={({ item, index }) => this.renderItem(item)}
                    keyExtractor={(item, i) => i.toString()}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentumAll = false;
                    }}
                    onEndReached={() => {
                        if (!this.onEndReachedCalledDuringMomentumAll) {
                            if (this.state.LstAction.length >= 20) {
                                this.setState({ PageIndex: this.state.PageIndex + 1 }, async () => {
                                    await this.LoadData(true);
                                });
                                this.onEndReachedCalledDuringMomentumAll = true;
                            }
                        }
                    }}
                    onEndReachedThreshold={0.5}
                />
                {this.state.LstAction!.length > 0 && this.state.hasScheduleVisit ? (
                    <View style={{ paddingHorizontal: 100, paddingBottom: 10, backgroundColor: "white" }}>
                        <TouchableOpacity
                            style={[Theme.BtnBlockWarning, { flexDirection: "row" }]}
                            activeOpacity={0.7}
                            onPress={() => {
                                this.GuiKeHoach();
                            }}
                        >
                            <FontAwesome name="send-o" size={20} color="white" />
                            <Text style={{ color: "white", marginLeft: 15 }}>Chốt kế hoạch ngày</Text>
                        </TouchableOpacity>
                    </View>
                ) : undefined}
                <PopupModal modalVisible={this.state.searchBox} title="Tìm kiếm khách hàng">
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Tên khách hàng</Text>
                        <TextInput
                            style={Theme.TextInput}
                            value={this.state.CustomerName}
                            onChangeText={(val) => {
                                this.setState({ CustomerName: val });
                            }}
                        />
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>CMND</Text>
                        <TextInput
                            style={Theme.TextInput}
                            value={this.state.IDCard}
                            onChangeText={(val) => {
                                this.setState({ IDCard: val });
                            }}
                        />
                    </View>
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Số hợp đồng</Text>
                        <TextInput
                            style={Theme.TextInput}
                            value={this.state.ContractCode}
                            onChangeText={(val) => {
                                this.setState({ ContractCode: val });
                            }}
                        />
                    </View>
                    {/* <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Mã hợp đồng</Text>
                        <TextInput
                            style={Theme.TextInput}
                            value={this.state.ContractCode}
                            onChangeText={(val) => {
                                this.setState({ ContractCode: val });
                            }}
                        />
                    </View> */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity
                            style={[Theme.BtnSmPrimary, { alignSelf: "center", flex: 1, marginRight: 5 }]}
                            onPress={() => {
                                this.setState({ searchBox: false }, async () => {
                                    await this.LoadData(false);
                                });
                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>Tìm kiếm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[Theme.BtnSmWarning, { alignSelf: "center", flex: 1, marginLeft: 5 }]}
                            onPress={() => {
                                //this.SearchCustomer();
                                this.setState({ searchBox: false })
                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </PopupModal>
            </View>
        );
    }
}
