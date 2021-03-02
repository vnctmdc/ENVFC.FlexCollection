import React from "react";
import { View, TouchableOpacity, FlatList, Text, Dimensions, TextInput } from "react-native";
import Toolbar from "../../components/Toolbar";
import AntDesign from "react-native-vector-icons/AntDesign";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import HttpUtils from "../../Utils/HttpUtils";
import CollectionDocumentDto from "../../DtoParams/CollectionDocumentDto";
import ApiUrl from "../../constants/ApiUrl";
import Collection_Document from "../../Entities/Collection_Document";
import Utility from "../../Utils/Utility";
import Theme from "../../Themes/Default";
import PopupModal from "../../components/PopupModal";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CollectionDocumentAllDto from "../../DtoParams/CollectionDocumentAllDto";
import Collection_DocumentActionSchedule from "../../Entities/Collection_DocumentActionSchedule";
import { ClientMessage } from "../../SharedEntity/SMXException";

const { width, height } = Dimensions.get("window");

interface iProps {
    GlobalStore: GlobalStore;
    navigation: any;
}

interface iState {
    LstCollDoc: Collection_Document[];
    TongKhachHang: number;
    TongDuNo: number;
    PageIndex: number;
    IsMapScreen: boolean;
    coordinates: any;
    //search kh
    searchBox: boolean;
    CustomerName: string;
    IDCard: string;
    ContractNumber: string;
    ContractCode: string;
    IsShowPopupCalendar: boolean;
    PlanDTG: Date;

    OrderDownPaidAmount?: boolean;
    OrderOverDueDay?: boolean;
    OrderDownName?: boolean;

    FilterName: string;
    selectedDocument?: Collection_Document;
}
@inject(SMX.StoreName.GlobalStore)
@observer
export default class DSKhachHangSrc extends React.Component<iProps, iState> {
    private onEndReachedCalledDuringMomentumAll = false;

    constructor(props: iProps) {
        super(props);
        this.state = {
            PlanDTG: new Date(),
            IsShowPopupCalendar: false,
            LstCollDoc: [],
            PageIndex: 0,
            TongKhachHang: 0,
            TongDuNo: 0,
            IsMapScreen: false,
            coordinates: [],
            //search
            searchBox: false,
            CustomerName: "",
            IDCard: "",
            ContractNumber: "",
            ContractCode: "",

            FilterName: "",
        };
    }

    async componentDidMount() {
        await this.LoadData(false);
    }

    async LoadData(isLoadMore: boolean) {
        this.props.GlobalStore.ShowLoading();
        let req = new CollectionDocumentDto();
        req.FilterName = this.state.FilterName;
        //req.CustomerName = this.state.CustomerName;
        //req.IDCard = this.state.IDCard;
        //req.ContractNumber = this.state.ContractNumber;
        //req.ContractCode = this.state.ContractCode;
        req.PageIndex = this.state.PageIndex;
        let res = await HttpUtils.post<CollectionDocumentDto>(
            ApiUrl.CollectionDocument_Execute,
            SMX.ApiActionCode.SearchData,
            JSON.stringify(req)
        );

        //res!.LstCollDoc!.forEach(x => {
        //    x.CustomerName = x.CustomerName ? x.CustomerName : '';
        //    x.ListContractCode = x.ListContractCode ? x.ListContractCode : '';
        //    x.IDCard = x.IDCard ? x.IDCard : '';
        //    x.DistrictName = x.DistrictName ? x.DistrictName : '';
        //    x.ProvinceName = x.ProvinceName ? x.ProvinceName : '';
        //});

        if (!isLoadMore) this.setState({ LstCollDoc: res!.LstCollDoc! });
        else this.setState({ LstCollDoc: res!.LstCollDoc && res!.LstCollDoc!.length > 0 ? this.state.LstCollDoc.concat(res!.LstCollDoc!) : this.state.LstCollDoc });
        this.SearchCustomer();
        this.setState({ TongKhachHang: res!.TongKhachHang!, TongDuNo: res!.TongDuNo! });
        this.props.GlobalStore.HideLoading();
    }

    SearchCustomer() {
        this.setState({
            CustomerName: "",
            IDCard: "",
            ContractNumber: "",
            ContractCode: "",
        });
    }

    GetColorCode(value: string) {
        if (value !== null && value !== undefined) {
            if (value == "B8") {
                return "#8A0808";
            } else if (value == "B7") {
                return "#FF0040";
            } else if (value == "B6") {
                return "#FF8000";
            } else if (value == "B5") {
                return "#B18904";
            } else if (value == "B4") {
                return "#0040FF";
            } else if (value == "B3") {
                return "#00BFFF";
            } else if (value == "B2") {
                return "#298A08";
            } else if (value == "B1") {
                return "#80FF00";
            } else if (value == "B0") {
                return "#D8F781";
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    renderItem(item: Collection_Document, index: number) {
        return (
            <View style={{ flex: 10, flexDirection: "row" }}>
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        borderBottomColor: "gainsboro",
                        padding: 15,
                        alignItems: "center",
                        //justifyContent: "space-between",
                        flex: 8,
                    }}
                    onPress={() => {
                        this.props.navigation.navigate("CollectionDocumentDisplay", {
                            DocumentID: item.DocumentID,
                            CustomerID: item.CustomerID,
                            DocumentActionID: item.DocumentActionID,
                        });
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <Text>{index + 1}</Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{item.ListContractCode}</Text>
                        <Text>{item.OverDueDay}</Text>
                    </View>
                    <View style={{ flex: 4 }}>
                        <Text>{item.CustomerName}</Text>
                        <Text>{Utility.GetDecimalString(item.NeedCollectAmount)}</Text>
                        {/* <Text>{Utility.GetDateString(item.LastPaidDTG)}</Text> */}
                    </View>
                    {/* <View
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
                <View style={{ padding: 10 }}>
                    <Text style={{ width: width - 100 }}>{item.CustomerName}</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text>Số lượng HĐ:</Text>
                        <Text style={{ fontWeight: "bold" }}>{item.NumberOfContract ? item.NumberOfContract : 0}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text>Số ĐT:</Text>
                        <Text style={{ fontWeight: "bold" }}>{item.CustomerMobile}</Text>
                    </View>
                    <View>
                        {item.CustomerTempAddress ? (
                            <Text style={{ fontWeight: "bold", width: width - 100 }}>{item.CustomerTempAddress}</Text>
                        ) : undefined}
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text>Tổng nợ quá hạn:</Text>
                        <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(item.TotalPastDueAmount)}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text>Kết quả tác nghiệp gần nhất:</Text>
                        <Text style={{ fontWeight: "bold" }}>{item.LastActionName}</Text>
                    </View>
                </View> */}
                </TouchableOpacity>
                {
                    item.hasSchedule ? (
                        <TouchableOpacity
                            style={{
                                width: 25,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => {
                                this.setState({ IsShowPopupCalendar: true, selectedDocument: item })
                            }}
                        >
                            <FontAwesome name="calendar-plus-o" size={25} color="#169BD5" />

                        </TouchableOpacity>
                    ) : undefined
                }
            </View>
        );
    }

    sortODD() {
        let lstColl = this.state.LstCollDoc;
        if (this.state.OrderOverDueDay === undefined || this.state.OrderOverDueDay === true) {
            lstColl = lstColl.sort((a, b) =>
                a.OverDueDay > b.OverDueDay ? 1 : b.OverDueDay > a.OverDueDay ? -1 : 0
            );
        } else {
            lstColl = lstColl.sort((a, b) =>
                a.OverDueDay < b.OverDueDay ? 1 : b.OverDueDay < a.OverDueDay ? -1 : 0
            );
        }

        this.setState({
            LstCollDoc: lstColl,
            OrderOverDueDay: this.state.OrderOverDueDay !== undefined ? !this.state.OrderOverDueDay : false,
        });
    }

    sortAmountPaid() {
        let lstColl = this.state.LstCollDoc;
        if (this.state.OrderDownPaidAmount === undefined || this.state.OrderDownPaidAmount === true) {
            lstColl = lstColl.sort((a, b) =>
                a.LastPaidAmount > b.LastPaidAmount ? 1 : b.LastPaidAmount > a.LastPaidAmount ? -1 : 0
            );
        } else {
            lstColl = lstColl.sort((a, b) =>
                a.LastPaidAmount < b.LastPaidAmount ? 1 : b.LastPaidAmount < a.LastPaidAmount ? -1 : 0
            );
        }

        this.setState({
            LstCollDoc: lstColl,
            OrderDownPaidAmount: this.state.OrderDownPaidAmount !== undefined ? !this.state.OrderDownPaidAmount : false,
        });
    }

    sortName() {
        let lstColl = this.state.LstCollDoc;
        if (this.state.OrderDownName === undefined || this.state.OrderDownName === true) {
            lstColl = lstColl.sort((a, b) => a.CustomerName.localeCompare(b.CustomerName));
        } else {
            lstColl = lstColl.sort((a, b) => b.CustomerName.localeCompare(a.CustomerName));
        }

        this.setState({
            LstCollDoc: lstColl,
            OrderDownName: this.state.OrderDownName !== undefined ? !this.state.OrderDownName : false,
        });
    }

    async LapKeHoach() {
        try {
            this.props.GlobalStore.ShowLoading();
            let request = new CollectionDocumentAllDto();
            let document = this.state.selectedDocument;
            let schedule = new Collection_DocumentActionSchedule();
            schedule.DocumentActionScheduleID = document.DocumentActionScheduleID;
            schedule.Version = document.ScheduleVersion;
            schedule.DocumentID = document.DocumentID;
            schedule.CustomerID = document.CustomerID;
            schedule.DocumentActionID = document.DocumentActionID;

            request.ActionSchedule = schedule;
            let res = await HttpUtils.post<CollectionDocumentAllDto>(
                ApiUrl.CollectionDocumentAll_Execute,
                SMX.ApiActionCode.LapKeHoach,
                JSON.stringify(request)
            );
            //this.setState({ LstCollDoc: this.state.LstCollDoc!.filter((x) => x.DocumentID != res.DocumentID) });
            this.setState({ IsShowPopupCalendar: false })
            await this.LoadData(false);
            this.props.GlobalStore.Exception = ClientMessage("Lập kế hoạch thành công!");
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }

    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="DS Khách hàng" navigation={this.props.navigation} HasDrawer={true}>
                    {/* <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                this.setState({ searchBox: true });
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
                </Toolbar>
                <View
                    style={{
                        padding: 15,
                        flexDirection: "row",
                        //alignItems: "center",
                        //justifyContent: "space-between",
                        width: "100%"
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
                            paddingVertical: 10,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <View>
                            <Text>Tổng số HĐ: </Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold" }}>{this.state.TongKhachHang}</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            paddingRight: 4,
                            paddingVertical: 10,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text>Tổng dư nợ: </Text>
                        <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(this.state.TongDuNo)}</Text>
                    </View>
                </View>
                <FlatList
                    data={this.state.LstCollDoc}
                    // data={this.state.LstCollDoc.filter((x) =>
                    //     Utility.FormatVNLanguage(x.CustomerName!.toLowerCase()).includes(Utility.FormatVNLanguage(this.state.FilterName.toLowerCase()))
                    //     || x.ListContractCode.toString().toLowerCase().includes(Utility.FormatVNLanguage(this.state.FilterName.toLowerCase()))
                    //     || x.IDCard!.toLowerCase().includes(Utility.FormatVNLanguage(this.state.FilterName.toLowerCase()))
                    //     || Utility.FormatVNLanguage(x.DistrictName!.toLowerCase()).includes(Utility.FormatVNLanguage(this.state.FilterName.toLowerCase()))
                    //     || Utility.FormatVNLanguage(x.ProvinceName!.toLowerCase()).includes(Utility.FormatVNLanguage(this.state.FilterName.toLowerCase()))
                    // )}
                    renderItem={({ item, index }) => this.renderItem(item, index)}
                    keyExtractor={(item, i) => i.toString()}
                    ListHeaderComponent={() => (
                        <View style={{ flexDirection: "row", alignItems: "center", flex: 8, padding: 15 }}>
                            <Text style={{ flex: 1 }}>STT</Text>
                            {/* <TouchableOpacity
                                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
                                onPress={() => this.sortSHD()}
                            >
                                {this.state.OrderDownPaidSHD === undefined || this.state.OrderDownPaidSHD === true ? (
                                    <FontAwesome5 name="sort-numeric-down" size={15} />
                                ) : (
                                    <FontAwesome5 name="sort-numeric-up" size={15} />
                                )}
                                <Text style={{ paddingLeft: 5 }}>SHĐ</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity
                                style={{ flex: 3, flexDirection: "row", alignItems: "center" }}
                                onPress={() => this.sortODD()}
                            >
                                {this.state.OrderOverDueDay === undefined ||
                                    this.state.OrderOverDueDay === true ? (
                                        <FontAwesome5 name="sort-amount-down" size={15} />
                                    ) : (
                                        <FontAwesome5 name="sort-amount-up" size={15} />
                                    )}
                                <Text style={{ paddingLeft: 5 }}>Số hợp đồng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 4, flexDirection: "row", alignItems: "center" }}
                                onPress={() => this.sortAmountPaid()}
                            >
                                {this.state.OrderDownPaidAmount === undefined ||
                                    this.state.OrderDownPaidAmount === true ? (
                                        <FontAwesome5 name="sort-alpha-down" size={15} />
                                    ) : (
                                        <FontAwesome5 name="sort-alpha-up" size={15} />
                                    )}
                                <Text style={{ paddingLeft: 5 }}>Tên Khách hàng</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentumAll = false;
                    }}
                    onEndReached={() => {
                        if (!this.onEndReachedCalledDuringMomentumAll) {
                            if (this.state.LstCollDoc.length >= 20) {
                                this.setState({ PageIndex: this.state.PageIndex + 1 }, async () => {
                                    await this.LoadData(true);
                                    //await this.LoadAllAddress();
                                });
                                this.onEndReachedCalledDuringMomentumAll = true;
                            }
                        }
                    }}
                    onEndReachedThreshold={0.5}
                />
                <PopupModal modalVisible={this.state.IsShowPopupCalendar} title="Lập kế hoạch">
                    <View style={Theme.FormGroup}>
                        <Text style={Theme.Label}>Ngày visit</Text>
                        <Text style={Theme.TextView}>{Utility.GetDateString(this.state.PlanDTG)}</Text>
                    </View>
                    <View style={{ width: "100%", alignItems: "center", marginTop: 10, flexDirection: "row" }}>
                        <TouchableOpacity
                            style={[Theme.BtnSmPrimary, { flex: 1, marginRight: 5 }]}
                            onPress={() => this.LapKeHoach()}
                        >
                            <Text style={{ color: "white" }}>Lập kế hoạch</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[Theme.BtnBlockPrimary, { flex: 1, marginLeft: 5 }]}
                            onPress={() => this.setState({ IsShowPopupCalendar: false })}
                        >
                            <Text style={{ color: "white" }}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </PopupModal>
            </View>
        );
    }
}
