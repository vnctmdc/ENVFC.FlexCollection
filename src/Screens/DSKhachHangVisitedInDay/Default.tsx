import React from "react";
import { View, TouchableOpacity, FlatList, Text, Dimensions, TextInput } from "react-native";
import Toolbar from "../../components/Toolbar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import Collection_Document from "../../Entities/Collection_Document";
import Utility from "../../Utils/Utility";
import CollectionDocumentAllDto from "../../DtoParams/CollectionDocumentAllDto";
import Theme from "../../Themes/Default";
import PopupModal from "../../components/PopupModal";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const { width, height } = Dimensions.get("window");

interface iProps {
    GlobalStore: GlobalStore;
    navigation: any;
}

interface iState {
    LstCollDoc: Collection_Document[];
    IsMapScreen: boolean;
    coordinates: any;
    TongKhachHang: number;
    TongDuNo: number;
    PageIndex: number;
    //search kh
    searchBox: boolean;
    CustomerName: string;
    IDCard: string;
    ContractNumber: string;
    ContractCode: string;

    OrderDownPaidAmount?: boolean;
    OrderDownPaidSHD?: boolean;
    OrderDownName?: boolean;
    OrderOverDueDay?: boolean;

    FilterName: string;
}
@inject(SMX.StoreName.GlobalStore)
@observer
export default class DSKhachHangVisitedInDaySrc extends React.Component<iProps, iState> {
    private onEndReachedCalledDuringMomentumAll = false;

    constructor(props: iProps) {
        super(props);
        this.state = {
            LstCollDoc: [],
            TongKhachHang: 0,
            TongDuNo: 0,
            IsMapScreen: false,
            coordinates: [],
            PageIndex: 0,
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
        //await this.LoadAllAddress();
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
            SMX.ApiActionCode.DSKHDaVisitInDay,
            JSON.stringify(req)
        );

        // res!.LstCollDoc!.forEach(x => {
        //     x.CustomerName = x.CustomerName ? x.CustomerName : '';
        //     x.ListContractCode = x.ListContractCode ? x.ListContractCode : '';
        //     x.IDCard = x.IDCard ? x.IDCard : '';
        //     x.DistrictName = x.DistrictName ? x.DistrictName : '';
        //     x.ProvinceName = x.ProvinceName ? x.ProvinceName : '';
        // });

        if (!isLoadMore) this.setState({ LstCollDoc: res!.LstCollDoc! });
        else this.setState({ LstCollDoc: this.state.LstCollDoc.concat(res!.LstCollDoc!) });
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

    async LoadAllAddress() {
        try {
            if (this.state.LstCollDoc.length > 0) {
                await this.state.LstCollDoc.map((item) => {
                    var url = `${ApiUrl.GoogleGeocodeApi}?address=${item.CustomerTempAddress}&key=${ApiUrl.GOOGLE_MAPS_APIKEY}`;
                    fetch(url)
                        .then(async (response) => await response.json())
                        .then(async (responseJson) => {
                            //console.log('origin',responseJson);
                            if (responseJson.results.length > 0) {
                                if (responseJson.results[0].geometry) {
                                    let coordinates = this.state.coordinates;
                                    //console.log('init',responseJson);
                                    const marker = {
                                        customer: item.CustomerName,
                                        name: item.CustomerTempAddress,
                                        latitude: responseJson.results[0].geometry.location.lat,
                                        longitude: responseJson.results[0].geometry.location.lng,
                                    };
                                    coordinates.push(marker);
                                    this.setState({ coordinates: coordinates });
                                }
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                });
            }
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
        }
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
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: "gainsboro",
                    padding: 15,
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
                    <Text style={{ fontWeight: "bold", fontSize: 17, color: "white" }}>{item.OverDueDay}</Text>
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
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        {item.CustomerTempAddress ? (
                            <Text style={{ fontWeight: "bold", width: width - 100 }}>{item.CustomerTempAddress}</Text>
                        ) : undefined}
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text>Tổng nợ quá hạn:</Text>
                        <Text style={{ fontWeight: "bold" }}>{Utility.GetDecimalString(item.TotalPastDueAmount)}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text>Tác nghiệp gần nhất:</Text>
                        <Text style={{ fontWeight: "bold" }}>{item.LastActionName}</Text>
                    </View>
                </View> */}
            </TouchableOpacity>
        );
    }

    sortSHD() {
        let lstColl = this.state.LstCollDoc;
        if (this.state.OrderDownPaidSHD === undefined || this.state.OrderDownPaidSHD === true) {
            lstColl = lstColl.sort((a, b) =>
                a.NumberOfContract > b.NumberOfContract ? 1 : b.NumberOfContract > a.NumberOfContract ? -1 : 0
            );
        } else {
            lstColl = lstColl.sort((a, b) =>
                a.NumberOfContract < b.NumberOfContract ? 1 : b.NumberOfContract < a.NumberOfContract ? -1 : 0
            );
        }

        this.setState({
            LstCollDoc: lstColl,
            OrderDownPaidSHD: this.state.OrderDownPaidSHD !== undefined ? !this.state.OrderDownPaidSHD : false,
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

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="KH visited trong ngày" navigation={this.props.navigation} HasDrawer={true}>
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
                            <Text style={{ fontWeight: "bold" }}>{this.state.TongKhachHang}</Text>
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
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentumAll = false;
                    }}
                    ListHeaderComponent={() => (
                        <View style={{ flexDirection: "row", alignItems: "center", flex: 7, padding: 15 }}>
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
                                this.SearchCustomer();
                                this.setState({ searchBox: false });
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
