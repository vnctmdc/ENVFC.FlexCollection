import React, { RefObject } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Toolbar from "../../../components/Toolbar";
import GlobalStore from "../../../Stores/GlobalStore";
import { inject, observer } from "mobx-react";
import SMX from "../../../constants/SMX";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import PickAndTakeImage from "../../../components/PickAndTakeImage";
import ImageObject from "../../../SharedEntity/ImageObject";
import Theme from "../../../Themes/Default";
import AttachmentDto from "../../../DtoParams/AttachmentDto";
import adm_Attachment from "../../../Entities/adm_Attachment";
import HttpUtils from "../../../Utils/HttpUtils";
import ApiUrl from "../../../constants/ApiUrl";

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
    route: any;
}
interface iState {
    image: ImageObject;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class UploadHoSoECMSrc extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            image: new ImageObject(),
        };
    }

    PassDataImg = (img: ImageObject) => {
        this.setState({ image: img });
    };

    async SaveImage() {
        try {
            this.props.GlobalStore.ShowLoading();

            let req = new AttachmentDto();
            let att = new adm_Attachment();
            att.ImageBase64String = this.state.image.Base64;
            att.ContentType = "image/" + this.state.image.FileExtension;
            att.FileName = this.state.image.FileName;
            att.DisplayName = this.state.image.FileName;
            att.CustomerID = this.props.route.params.CustomerID;
            att.RefID = this.props.route.params.CustomerID;
            req.Attachment = att;

            await HttpUtils.post<AttachmentDto>(
                ApiUrl.Attachment_Execute,
                SMX.ApiActionCode.UploadDocumentCustomer,
                JSON.stringify(req)
            );

            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.UpdateImageTrigger();
            this.props.navigation.goBack();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Upload hồ sơ khách hàng" navigation={this.props.navigation}>
                    <View style={{ marginLeft: 10 }}>
                        {/* <TouchableOpacity activeOpacity={0.5}>
                            <FontAwesome5 name="save" size={25} color="#B3BDC6" />
                        </TouchableOpacity> */}
                    </View>
                </Toolbar>
                <PickAndTakeImage navigation={this.props.navigation} SendData={this.PassDataImg}>
                    <TouchableOpacity
                        style={[Theme.BtnSmPrimary, { alignSelf: "center" }]}
                        onPress={() => this.SaveImage()}
                    >
                        <Text style={{ fontWeight: "bold", color: "white" }}>Lưu</Text>
                    </TouchableOpacity>
                </PickAndTakeImage>
            </View>
        );
    }
}
