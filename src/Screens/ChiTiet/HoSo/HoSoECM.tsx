import React from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image, Modal } from "react-native";
import Toolbar from "../../../components/Toolbar";
import GlobalStore from "../../../Stores/GlobalStore";
import AttachmentDto from "../../../DtoParams/AttachmentDto";
import HttpUtils from "../../../Utils/HttpUtils";
import ApiUrl from "../../../constants/ApiUrl";
import SMX from "../../../constants/SMX";
import adm_Attachment from "../../../Entities/adm_Attachment";
import PopupModal from "../../../components/PopupModal";
import GlobalCache from "../../../Caches/GlobalCache";
import Theme from "../../../Themes/Default";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import DropDownBox from "../../../components/DropDownBox";
import * as Enums from "../../../constants/Enums";
import Gallery from "../../../components/Gallery";
import SystemParameter from "../../../Entities/SystemParameter";
import { ImageViewer } from "react-native-image-zoom-viewer";

const { width } = Dimensions.get("window");

interface iProps {
    navigation: any;
    route: any;
    GlobalStore: GlobalStore;
}
interface iState {
    LstAtt: adm_Attachment[];
    PageIndex: number;
    ImgSelected: adm_Attachment;
    ImgShow: boolean;
    //SelectedAttRefType: number;
    SelectedAttRefCode?: string;
    LstAttType: SystemParameter[];
}
export default class HoSoECM extends React.Component<iProps, iState> {
    private onEndReachedCalledDuringMomentumAttCustomer = false;

    constructor(props: iProps) {
        super(props);
        this.state = {
            LstAtt: [],
            PageIndex: 0,
            ImgSelected: new adm_Attachment(),
            ImgShow: false,
            //SelectedAttRefCode: "",
            //SelectedAttRefType: Enums.AttachmentRefType.ActionField,
            LstAttType: [],
        };
    }

    async componentDidMount() {
        await this.SetupViewForm();
        this.props.GlobalStore.UpdateImageTrigger = () => {
            //this.setState({ SelectedAttRefType: Enums.AttachmentRefType.CustomerInfo }, () => {
            this.LoadData(false);
            //});
        };

        await this.LoadData(false);
    }

    async SetupViewForm() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new AttachmentDto();

            let res = await HttpUtils.post<AttachmentDto>(
                ApiUrl.Attachment_Execute,
                SMX.ApiActionCode.SetupViewForm,
                JSON.stringify(req)
            );

            if (res.LstAttType) {
                let attType = res.LstAttType;
                let item = new SystemParameter();
                item.Name = "Xem toàn bộ";
                item.Code = "";
                attType.unshift(item);
                this.setState({ LstAttType: attType });
            }

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    async LoadData(isLoadMore: boolean) {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new AttachmentDto();
            req.CustomerID = this.props.route.params.CustomerID;
            //req.RefType = this.state.SelectedAttRefType;
            req.RefCode = this.state.SelectedAttRefCode;

            let res = await HttpUtils.post<AttachmentDto>(
                ApiUrl.Attachment_Execute,
                SMX.ApiActionCode.SearchDataByCustomer,
                JSON.stringify(req)
            );

            if (!isLoadMore) this.setState({ LstAtt: res!.LstHoSoECM! });
            else this.setState({ LstAtt: this.state.LstAtt.concat(res!.LstHoSoECM!) });
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    renderItem(item: adm_Attachment) {
        return (
            <View style={{ width: width, padding: 15 }}>
                {item.ContentType === "image/jpeg" || item.ContentType == "jpg" ? (
                    <TouchableOpacity onPress={() => this.setState({ ImgSelected: item, ImgShow: true })}>
                        <Text style={{ fontWeight: "bold", color: "#2EA8EE", fontSize: 16 }}>{item.FileName}</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.FileName}</Text>
                )}
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Danh sách tài liệu" navigation={this.props.navigation}>
                    <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                this.props.navigation.navigate("UploadHoSoECM", {
                                    CustomerID: this.props.route.params.CustomerID,
                                });
                            }}
                        >
                            <FontAwesome5 name="plus" size={25} color="#1C4694" />
                        </TouchableOpacity>
                    </View>
                </Toolbar>
                <View style={{ padding: 10, flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flex: 3 }}>
                        <Text style={Theme.Label}>Nhóm hồ sơ</Text>
                        <DropDownBox
                            TextField="Name"
                            ValueField="Code"
                            DataSource={this.state.LstAttType}
                            SelectedValue={this.state.SelectedAttRefCode}
                            OnSelectedItemChanged={(item) => {
                                this.setState({ SelectedAttRefCode: item.Code });
                            }}
                        ></DropDownBox>
                    </View>

                    <TouchableOpacity
                        style={[Theme.BtnSmPrimary, { flex: 1, marginLeft: 5 }]}
                        onPress={() => this.LoadData(false)}
                    >
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 17 }}>Lọc</Text>
                    </TouchableOpacity>
                </View>
                {/* <FlatList
                    data={this.state.LstAtt}
                    renderItem={({ item, index }) => this.renderItem(item)}
                    keyExtractor={(item, i) => i.toString()}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentumAttCustomer = false;
                    }}
                    onEndReached={() => {
                        if (!this.onEndReachedCalledDuringMomentumAttCustomer) {
                            if (this.state.LstAtt.length >= 20) {
                                this.setState({ PageIndex: this.state.PageIndex + 1 }, () => {
                                    this.LoadData(true);
                                });
                                this.onEndReachedCalledDuringMomentumAttCustomer = true;
                            }
                        }
                    }}
                    onEndReachedThreshold={0.5}
                /> */}
                <Gallery Images={this.state.LstAtt} numberColumn={1} navigation={this.props.navigation} />
                <PopupModal modalVisible={this.state.ImgShow} title={"Ảnh tài liệu"}>
                    <Image
                        source={{
                            uri: `${ApiUrl.Attachment_ImagePreview}?id=${this.state.ImgSelected.AttachmentID}&size=1&token=${GlobalCache.UserToken}`,
                        }}
                        style={{ width: "90%", height: 200, resizeMode: "contain", alignSelf: "center" }}
                    />
                    <TouchableOpacity
                        style={[Theme.BtnSmPrimary, { alignSelf: "center", marginTop: 10 }]}
                        onPress={() => this.setState({ ImgShow: false })}
                    >
                        <Text style={{ fontWeight: "bold", color: "white" }}>Đóng</Text>
                    </TouchableOpacity>
                </PopupModal>
            </View>
        );
    }
}
