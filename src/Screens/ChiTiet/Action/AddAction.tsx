import React from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    Alert,
    TextInput,
} from "react-native";
import Toolbar from "../../../components/Toolbar";
import DropDownBox from "../../../components/DropDownBox";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Theme from "../../../Themes/Default";
import Collection_DocumentActionField from "../../../Entities/Collection_DocumentActionField";
import DateTimePicker from "../../../components/DateTimePicker";
import { inject, observer } from "mobx-react";
import SMX from "../../../constants/SMX";
import GlobalStore from "../../../Stores/GlobalStore";
import CollectionDocumentActionFieldDto from "../../../DtoParams/CollectionDocumentActionFieldDto";
import HttpUtils from "../../../Utils/HttpUtils";
import ApiUrl from "../../../constants/ApiUrl";
import Customer from "../../../Entities/Customer";
import SystemParameter from "../../../Entities/SystemParameter";
import CustomerExtPhone from "../../../Entities/CustomerExtPhone";
import CustomerAddress from "../../../Entities/CustomerAddress";
import Collection_DocumentAction from "../../../Entities/Collection_DocumentAction";
import PromiseToPay from "../../../Entities/PromiseToPay";
import { GlobalDto } from "../../../DtoParams/GlobalDto";
import * as ImagePicker from "expo-image-picker";
import AttachmentDto from "../../../DtoParams/AttachmentDto";
import adm_Attachment from "../../../Entities/adm_Attachment";
import { TextInputMask } from "react-native-masked-text";
import * as Enums from "../../../constants/Enums";
import PopupModal from "../../../components/PopupModal";
import CustomerDto from "../../../DtoParams/CustomerDto";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import MarkerObject from "../../../SharedEntity/MarkerObject";
import { ClientMessage, SMXException } from "../../../SharedEntity/SMXException";
import LogManager from "../../../Utils/LogManager";
import * as ImageManipulator from "expo-image-manipulator";
import SyncAttachmentDto from "../../../DtoParams/SyncAttachmentDto";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    route: any;
    GlobalStore: GlobalStore;
}
interface iState {
    ActField: Collection_DocumentActionField;
    LstReturnCode: SystemParameter[];
    Customer: Customer;
    LstAttachment?: adm_Attachment[];

    ObjecttiveSelected?: number;
    ObjectiveName: string;
    Description?: string;
    AddressSelected?: CustomerAddress;
    KyHuaTraSelected?: number;
    PromiseAmount: string;
    PromiseDTG?: Date;
    LstImg: any;
    CustomerAddress: CustomerAddress;
    LstObjectType?: SystemParameter[];
    LstAddressType?: SystemParameter[];
    ObjectiveTypeSelected?: number;
    AddressTypeSelected?: number;
    ReturnCodeSelected?: number;
    location?: MarkerObject;
    disabled: boolean;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class AddActionSrc extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            ActField: new Collection_DocumentActionField(),
            Customer: new Customer(),
            ObjectiveName: "",
            LstReturnCode: [],
            PromiseAmount: "",
            LstImg: [],
            CustomerAddress: new CustomerAddress(),
            disabled:false,
        };
    }

    async componentDidMount() {
        this.getLocationAsync();
        await this.SetupAddForm();
    }

    async SetupAddForm() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new CollectionDocumentActionFieldDto();
            req.CustomerID = this.props.route.params.CustomerID;
            req.DocActID = this.props.route.params.DocumentActionID;
            req.DocumentID = this.props.route.params.DocumentID;

            let res = await HttpUtils.post<CollectionDocumentActionFieldDto>(
                ApiUrl.CollectionDocActionField_Execute,
                SMX.ApiActionCode.SetupEditForm,
                JSON.stringify(req)
            );

            res!.LstObjectType!.forEach((x) => {
                if (x.Code && x.Name) x.CodeAndName = x.Code + " - " + x.Name;
            });

            //res!.LstReturnCode!.forEach((x) => {
            //    if (x.Code && x.Name) x.CodeAndName = x.Code + " - " + x.Name;
            //});

            this.setState({
                Customer: res!.Customer!,
                LstObjectType: res!.LstObjectType!,
                LstAddressType: res!.LstAddressType!,
                //LstReturnCode: res!.LstReturnCode!,
            });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
            LogManager.Log("Setup form error: " + ex.toString());
        }
    }

    async GetReturnCodeByObjectiveType() {
        try {
            let req = new CollectionDocumentActionFieldDto();
            req.ObjectType = this.state.ObjectiveTypeSelected;
            let res = await HttpUtils.post<CollectionDocumentActionFieldDto>(
                ApiUrl.CollectionDocActionField_Execute,
                SMX.ApiActionCode.GetReturnCodeByCusExtPhone,
                JSON.stringify(req)
            );

            res!.LstReturnCode!.forEach((x) => {
                if (x.Code && x.Name) x.CodeAndName = x.Code + " - " + x.Name;
            });

            this.setState({
                LstReturnCode: res!.LstReturnCode!,
            });
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
        }
    }

    async CaculatePromiseAmount() {
        try {
            let req = new CollectionDocumentActionFieldDto();
            req.CustomerID = this.props.route.params.CustomerID;
            req.DocumentID = this.props.route.params.DocumentID;
            req.PeriodPromise = this.state.KyHuaTraSelected;

            let res = await HttpUtils.post<CollectionDocumentActionFieldDto>(
                ApiUrl.CollectionDocActionField_Execute,
                SMX.ApiActionCode.CaculatePromiseAmount,
                JSON.stringify(req)
            );

            let promiseResult = res!.Document!.PromiseToPayAmount + "";
            let promiseOrg = res!.Document!.PromiseToPayAmount;
            if (promiseOrg && promiseOrg.toString().split(".").length > 0) {
                promiseResult = promiseOrg.toString().split(".")[0];
            }

            this.setState({
                PromiseAmount: promiseResult,
            });
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
        }
    }

    async SaveCustomerAddress() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new CustomerDto();
            let cus = new CustomerAddress();
            cus = this.state.CustomerAddress;
            cus.CustomerID = this.props.route.params.CustomerID;
            req.CustomerAddress = cus;
            await HttpUtils.post<CustomerDto>(
                ApiUrl.Customer_Execute,
                SMX.ApiActionCode.SaveCustomerAddress,
                JSON.stringify(req)
            );
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    async saveActionFieldCall() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new CollectionDocumentActionFieldDto();
            var promiseAmount = this.state.PromiseAmount;

            let colDocAct = new Collection_DocumentAction();
            colDocAct.DocumentActionID = this.props.route.params.DocumentActionID;
            colDocAct.DocumentID = this.props.route.params.DocumentID;
            colDocAct.CustomerID = this.props.route.params.CustomerID;
            colDocAct.PromiseToPayAmount =
                promiseAmount.length != 0 ? parseInt(promiseAmount.split(",").join("")) : undefined;
            colDocAct.PromiseToPayDTG = this.state.PromiseDTG;
            colDocAct.ReturnCodeID = this.state.ReturnCodeSelected;
            colDocAct.Notes = this.state.Description;

            let promise = new PromiseToPay();
            promise.DocumentActionID = this.props.route.params.DocumentActionID;
            promise.DocumentID = this.props.route.params.DocumentID;
            promise.CustomerID = this.props.route.params.CustomerID;
            promise.PromiseAmount = promiseAmount.length != 0 ? parseInt(promiseAmount.split(",").join("")) : undefined;
            promise.PromiseDTG = this.state.PromiseDTG;

            let colDocField = new Collection_DocumentActionField();
            colDocField = this.state.ActField;
            colDocField.ReturnCodeID = this.state.ReturnCodeSelected;
            colDocField.ObjectiveType = this.state.ObjectiveTypeSelected;
            colDocField.AddressType = this.state.AddressTypeSelected;

            if (this.state.location == undefined || this.state.location == null) {
                this.props.GlobalStore.HideLoading();
                this.props.GlobalStore.Exception = ClientMessage("Chưa bật định vị!");
                await this.getLocationAsync();
            }

            if (this.state.location) {
                if (
                    this.state.location.Latitude == null ||
                    this.state.location.Longitude == null ||
                    this.state.location.Latitude == undefined ||
                    this.state.location.Longitude == undefined
                ) {
                    this.props.GlobalStore.HideLoading();
                    this.props.GlobalStore.Exception = ClientMessage("Chưa bật định vị!");
                    await this.getLocationAsync();
                }

                colDocField.LocationLat = this.state.location.Latitude
                    ? this.state.location.Latitude.toString()
                    : undefined;
                colDocField.LocationLon = this.state.location.Longitude
                    ? this.state.location.Longitude.toString()
                    : undefined;
            }

            if (this.state.Description && this.state.Description.length < 1) {
                this.props.GlobalStore.HideLoading();
                this.props.GlobalStore.Exception = ClientMessage("Vui lòng nhập ghi chú trước khi lưu");
                return;
            }

            colDocField.Content = this.state.Description;
            colDocField.Version = 1;
            colDocField.Deleted = 0;

            colDocAct.ActionField = colDocField;
            req.DocAction = colDocAct;
            req.PromiseToPay = promise;

            if (this.state.LstImg && this.state.LstImg.length < 1) {
                this.props.GlobalStore.HideLoading();
                this.props.GlobalStore.Exception = ClientMessage("Vui lòng chụp ảnh trước khi lưu");
                return;
            }
            if (this.state.LstImg && this.state.LstImg.length > 0) {
                await this.SaveImageField(-1);

                LogManager.Log("Client start lưu tác nghiệp: " + new Date().toString());
                LogManager.Log("Location: " + JSON.stringify(this.state.location));
                LogManager.Log("Location Lat: " + colDocField.LocationLat);
                LogManager.Log("Location Long: " + colDocField.LocationLon);
                let res = await HttpUtils.post<CollectionDocumentActionFieldDto>(
                    ApiUrl.CollectionDocActionField_Execute,
                    SMX.ApiActionCode.SaveItem,
                    JSON.stringify(req)
                );

                await this.UpdateListAttachment(res.DocumentActionFieldID);

                this.props.GlobalStore.HideLoading();
                this.props.GlobalStore.UpdateActField();
                this.props.navigation.goBack();
            } else {
                this.props.GlobalStore.HideLoading();
                this.props.GlobalStore.Exception = ClientMessage("Chưa có ảnh tác nghiệp");
                return;
            }
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
            LogManager.Log("Add action error: " + ex.toString());
        }
    }

    pressButton() {
        this.setState({
          disabled: true,
        });
        
        // enable after 5 second
        setTimeout(()=>{
           this.setState({
            disabled: false,
          });
        }, 2000)
      }

    validateBeforeSaveActionCall() {
        Alert.alert(
            "Xác nhận lưu tác nghiệp",
            "Bạn có muốn lưu tác nghiệp không?",
            [
                { text: "Lưu", onPress: () => this.uploadAttachmentAndAction() },
                {
                    text: "Hủy",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );
    }

    async uploadAttachmentAndAction() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new SyncAttachmentDto();
            var promiseAmount = this.state.PromiseAmount;

            let colDocAct = new Collection_DocumentAction();
            colDocAct.DocumentActionID = this.props.route.params.DocumentActionID;
            colDocAct.DocumentID = this.props.route.params.DocumentID;
            colDocAct.CustomerID = this.props.route.params.CustomerID;
            colDocAct.PromiseToPayAmount =
                promiseAmount.length != 0 ? parseInt(promiseAmount.split(",").join("")) : undefined;
            colDocAct.PromiseToPayDTG = this.state.PromiseDTG;
            colDocAct.ReturnCodeID = this.state.ReturnCodeSelected;
            colDocAct.Notes = this.state.Description;

            let promise = new PromiseToPay();
            promise.DocumentActionID = this.props.route.params.DocumentActionID;
            promise.DocumentID = this.props.route.params.DocumentID;
            promise.CustomerID = this.props.route.params.CustomerID;
            promise.PromiseAmount = promiseAmount.length != 0 ? parseInt(promiseAmount.split(",").join("")) : undefined;
            promise.PromiseDTG = this.state.PromiseDTG;

            let colDocField = new Collection_DocumentActionField();
            colDocField = this.state.ActField;
            colDocField.ReturnCodeID = this.state.ReturnCodeSelected;
            colDocField.ObjectiveType = this.state.ObjectiveTypeSelected;
            colDocField.AddressType = this.state.AddressTypeSelected;

            if (this.state.location == undefined || this.state.location == null) {
                this.props.GlobalStore.HideLoading();
                this.props.GlobalStore.Exception = ClientMessage("Chưa bật định vị!");
                await this.getLocationAsync();
            }

            if (this.state.location) {
                if (
                    this.state.location.Latitude == null ||
                    this.state.location.Longitude == null ||
                    this.state.location.Latitude == undefined ||
                    this.state.location.Longitude == undefined
                ) {
                    this.props.GlobalStore.HideLoading();
                    this.props.GlobalStore.Exception = ClientMessage("Chưa bật định vị!");
                    await this.getLocationAsync();
                }

                colDocField.LocationLat = this.state.location.Latitude
                    ? this.state.location.Latitude.toString()
                    : undefined;
                colDocField.LocationLon = this.state.location.Longitude
                    ? this.state.location.Longitude.toString()
                    : undefined;
            }

            if (this.state.Description && this.state.Description.length < 1) {
                this.props.GlobalStore.HideLoading();
                this.props.GlobalStore.Exception = ClientMessage("Vui lòng nhập ghi chú trước khi lưu");
                return;
            }

            colDocField.Content = this.state.Description;
            colDocField.Version = 1;
            colDocField.Deleted = 0;

            colDocAct.ActionField = colDocField;
            req.DocAction = colDocAct;
            req.PromiseToPay = promise;

            if (this.state.LstImg && this.state.LstImg.length < 1) {
                this.props.GlobalStore.HideLoading();
                this.props.GlobalStore.Exception = ClientMessage("Vui lòng chụp ảnh trước khi lưu");
                return;
            }
            if (this.state.LstImg && this.state.LstImg.length > 0) {
                req.LstAttachment = this.ValidateImageField();
                let res = await HttpUtils.post<SyncAttachmentDto>(
                    ApiUrl.SyncAttachment_Execute,
                    SMX.ApiActionCode.SaveItem,
                    JSON.stringify(req)
                );

                if (res.DocumentActionFieldID != undefined || res.DocumentActionFieldID != null) {
                    this.props.GlobalStore.HideLoading();
                    this.props.GlobalStore.Exception = ClientMessage("Lưu tác nghiệp thành công!");
                }
                this.props.GlobalStore.HideLoading();
                this.props.GlobalStore.UpdateActField();
                this.props.navigation.goBack();
            } else {
                this.props.GlobalStore.HideLoading();
                this.props.GlobalStore.Exception = ClientMessage("Chưa có ảnh tác nghiệp");
                return;
            }
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
            LogManager.Log("Add action error: " + ex.toString());
        }
    }

    ValidateImageField() {
        let lstAtt: adm_Attachment[] = [];

        this.state.LstImg.forEach((element) => {
            let att = new adm_Attachment();

            att.ImageBase64String = element.base64;

            if (element.uri.toString() != "") {
                let uriArray = element.uri.toString().split("/");
                if (uriArray.length > 0) {
                    let filename = uriArray[uriArray.length - 1];
                    att.FileName = filename;
                    att.DisplayName = filename;

                    let fileExternal = filename.split(".")[1];
                    att.ContentType = "image/" + fileExternal;
                }
            }

            att.CustomerID = this.props.route.params.CustomerID;

            lstAtt.push(att);
        });

        return lstAtt;
    }

    async SaveImageField(docActFieldID?: number) {
        try {
            let req = new AttachmentDto();
            let lstAtt: adm_Attachment[] = [];

            this.state.LstImg.forEach((element) => {
                let att = new adm_Attachment();

                att.ImageBase64String = element.base64;

                if (element.uri.toString() != "") {
                    let uriArray = element.uri.toString().split("/");
                    if (uriArray.length > 0) {
                        let filename = uriArray[uriArray.length - 1];
                        att.FileName = filename;
                        att.DisplayName = filename;

                        let fileExternal = filename.split(".")[1];
                        att.ContentType = "image/" + fileExternal;
                    }
                }

                att.CustomerID = this.props.route.params.CustomerID;
                att.RefID = docActFieldID;

                lstAtt.push(att);
            });

            req.LstAttachment = lstAtt;

            // let logMsg = JSON.stringify(req).length;
            // LogManager.Log("Client Lưu ảnh tác nghiệp, JSON length: " + logMsg.toString());
            // LogManager.Log("Client lưu ảnh tác nghiệp, JSON: " + JSON.stringify(req));

            LogManager.Log("Client start lưu ảnh tác nghiệp: " + new Date().toString());
            let res = await HttpUtils.post<AttachmentDto>(
                ApiUrl.Attachment_Execute,
                SMX.ApiActionCode.UploadLstAttachmentField,
                JSON.stringify(req)
            );

            this.setState({ LstAttachment: res!.LstAttachment! });
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
            LogManager.Log("Save image action error: " + ex.toString());
        }
    }

    async UpdateListAttachment(docActFieldID?: number) {
        let req = new AttachmentDto();
        var lstAtt = this.state.LstAttachment;
        if (docActFieldID != null || lstAtt.length > 0) {
            lstAtt.forEach((item) => {
                item.RefID = docActFieldID;
            });
        }

        req.LstAttachment = lstAtt;

        LogManager.Log("Client start lưu ảnh tác nghiệp: " + new Date().toString());
        await HttpUtils.post<AttachmentDto>(
            ApiUrl.Attachment_Execute,
            SMX.ApiActionCode.UpdateLstAttachmentField,
            JSON.stringify(req)
        );

        LogManager.Log("Client end lưu ảnh tác nghiệp: " + new Date().toString());
    }

    _pickImage = async () => {
        try {
            //@ts-ignore
            //status === "granted";
            let { status } = await Permissions.getAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
            if (status !== "granted") {
                //@ts-ignore
                let status1 = await (await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)).status;

                if (status1 !== "granted") {
                    // log status
                    //var requestGlobal = new GlobalDto();
                    //requestGlobal.ExceptionInfo = `CAMERA Permission: ${JSON.stringify(status1)}`;
                    //LogManager.Log(requestGlobal);
                    ///////////////

                    return;
                }
            }
            let result: any = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                base64: true,
            });

            if (!result.cancelled) {
                let lstImg = this.state.LstImg;

                const manipResult = await ImageManipulator.manipulateAsync(result.uri, [], {
                    compress: 0.7,
                    base64: true,
                });

                lstImg.push(manipResult);
                this.setState({ LstImg: lstImg });
            }
        } catch (ex) {
            LogManager.Log("Take image error: " + ex.toString());
        }
    };

    async getLocationAsync() {
        try {
            let statusAfter: any = null;
            let { status } = await Permissions.getAsync(Permissions.LOCATION);
            if (status !== "granted") {
                LogManager.Log("Not permission");
                statusAfter = (await Permissions.askAsync(Permissions.LOCATION)).status;
                if (statusAfter !== "granted") {
                    LogManager.Log("Not permission");
                    return;
                }
            }

            let location = await Location.getCurrentPositionAsync({});
            LogManager.Log("Location origin: " + JSON.stringify(location));
            this.setState({
                location: new MarkerObject(1, location.coords.latitude, location.coords.longitude, "Vị trí hiện tại"),
            });
        } catch (ex) {
            LogManager.Log("Get Location Error: " + ex.toString());
        }
    }

    render() {
        let actField = this.state.ActField;
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Thêm tác nghiệp" navigation={this.props.navigation}>
                    <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            disabled={this.state.disabled}
                            onPress={() => {
                                this.pressButton();
                                this.validateBeforeSaveActionCall();
                            }}
                        >
                            <FontAwesome5 name="save" size={25} color="#1F31A4" />
                        </TouchableOpacity>
                    </View>
                </Toolbar>
                <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={{ padding: 10 }}>
                            <View style={Theme.FormGroup}>
                                <Text style={Theme.Label}>Tên khách hàng</Text>
                                <Text style={Theme.TextView}>{this.state.Customer.CustomerName}</Text>
                            </View>
                            <View style={Theme.FormGroup}>
                                <Text style={Theme.Label}>Đối tượng liên hệ</Text>
                                <DropDownBox
                                    TextField="CodeAndName"
                                    ValueField="SystemParameterID"
                                    DataSource={this.state.LstObjectType}
                                    SelectedValue={this.state.ObjectiveTypeSelected}
                                    OnSelectedItemChanged={(item) => {
                                        this.setState({ ObjectiveTypeSelected: item.SystemParameterID }, async () => {
                                            await this.GetReturnCodeByObjectiveType();
                                        });
                                    }}
                                ></DropDownBox>
                            </View>
                            <View style={Theme.FormGroup}>
                                <Text style={Theme.Label}>Địa chỉ liên hệ</Text>
                                <DropDownBox
                                    TextField="Name"
                                    ValueField="SystemParameterID"
                                    DataSource={this.state.LstAddressType}
                                    SelectedValue={this.state.AddressTypeSelected}
                                    OnSelectedItemChanged={(item) => {
                                        this.setState({ AddressTypeSelected: item.SystemParameterID });
                                    }}
                                ></DropDownBox>
                            </View>

                            <View style={Theme.FormGroup}>
                                <Text style={Theme.Label}>Kết quả liên hệ</Text>
                                <DropDownBox
                                    TextField="CodeAndName"
                                    ValueField="SystemParameterID"
                                    DataSource={this.state.LstReturnCode}
                                    SelectedValue={this.state.ReturnCodeSelected}
                                    OnSelectedItemChanged={(item) => {
                                        this.setState({
                                            PromiseDTG: null,
                                            KyHuaTraSelected: null,
                                            PromiseAmount: "",
                                            ReturnCodeSelected: item.SystemParameterID,
                                        });
                                    }}
                                ></DropDownBox>
                            </View>
                            {this.state.ReturnCodeSelected == Enums.KetQuaLienHe.HuaThanhToan ? (
                                <View>
                                    <View style={Theme.FormGroup}>
                                        <Text style={Theme.Label}>Ngày hứa trả</Text>
                                        <DateTimePicker
                                            SelectedDate={this.state.PromiseDTG}
                                            OnselectedDateChanged={(val) => {
                                                this.setState({ PromiseDTG: val });
                                            }}
                                        />
                                    </View>
                                    <View style={Theme.FormGroup}>
                                        <Text style={Theme.Label}>Số tiền</Text>
                                        <DropDownBox
                                            TextField="Value"
                                            ValueField="Key"
                                            DataSource={SMX.KyHuaTra.dicName}
                                            SelectedValue={this.state.KyHuaTraSelected}
                                            OnSelectedItemChanged={(item) => {
                                                this.setState({ KyHuaTraSelected: item.Key }, async () => {
                                                    await this.CaculatePromiseAmount();
                                                });
                                            }}
                                        ></DropDownBox>
                                    </View>
                                    <View style={Theme.FormGroup}>
                                        <Text style={Theme.Label}>Số tiền hứa trả</Text>
                                        <TextInputMask
                                            type={"money"}
                                            options={{
                                                precision: 0,
                                                separator: ".",
                                                delimiter: ",",
                                                unit: "",
                                                suffixUnit: "",
                                            }}
                                            value={this.state.PromiseAmount}
                                            style={Theme.TextInput}
                                            onChangeText={(val) => {
                                                this.setState({ PromiseAmount: val });
                                            }}
                                        />
                                    </View>
                                </View>
                            ) : undefined}
                            <View style={Theme.FormGroup}>
                                <Text style={Theme.Label}>Ghi chú</Text>
                                <TextInput
                                    multiline={true}
                                    numberOfLines={4}
                                    style={[Theme.TextInput, { height: 100 }]}
                                    value={this.state.Description}
                                    onChangeText={(val) => {
                                        this.setState({ Description: val });
                                    }}
                                />
                            </View>
                        </View>
                        <View
                            style={[
                                Theme.FormGroup,
                                {
                                    marginVertical: 5,
                                    marginHorizontal: 10,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                },
                            ]}
                        >
                            <TouchableOpacity
                                style={Theme.BtnBlockPrimary}
                                onPress={() =>
                                    this.props.navigation.navigate("DebtContractAnnexSrc", {
                                        CustomerID: this.props.route.params.CustomerID,
                                    })
                                }
                            >
                                <Text style={{ color: "white", fontWeight: "bold" }}>Tra cứu tất toán</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <ScrollView horizontal={true}>
                                <View style={{ flexDirection: "row" }}>
                                    {this.state.LstImg.map((en) => (
                                        <Image
                                            source={{ uri: en.uri }}
                                            style={{
                                                alignSelf: "center",
                                                marginHorizontal: 10,
                                                width: Dimensions.get("window").width / 2 - 20,
                                                height: width / 2 - 20,
                                                resizeMode: "contain",
                                                borderRadius: 10,
                                            }}
                                        />
                                    ))}
                                </View>
                            </ScrollView>
                            <TouchableOpacity
                                style={{
                                    marginHorizontal: 10,
                                    alignSelf: "flex-start",
                                    width: width / 2 - 20,
                                    height: 50,
                                    backgroundColor: "gainsboro",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 5,
                                    marginVertical: 10,
                                }}
                                onPress={() => this._pickImage()}
                            >
                                <Image
                                    source={require("../../../../assets/photo.png")}
                                    style={{
                                        width: "50%",
                                        height: 30,
                                        resizeMode: "contain",
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }
}
