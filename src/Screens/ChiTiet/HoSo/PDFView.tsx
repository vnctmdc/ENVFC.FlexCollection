import React from "react";
import { View, Text, Platform } from "react-native";
import Theme from "../../../Themes/Default";
import { WebView } from "react-native-webview";
import ApiUrl from "../../../constants/ApiUrl";
import GlobalCache from "../../../Caches/GlobalCache";
import GlobalStore from "../../../Stores/GlobalStore";
import { inject, observer } from "mobx-react";
import SMX from "../../../constants/SMX";
import Toolbar from "../../../components/Toolbar";
import PDFReader from "rn-pdf-reader-js";

interface iProps {
    GlobalStore: GlobalStore;
    route: any;
    navigation: any;
}

interface iState {}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class PDFView extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {};
    }

    render() {
        // console.log(
        //     `${ApiUrl.Attachment_ImagePreview}?id=${this.props.route.params.AttachmentID}&ecm=${this.props.route.params.ECMItemID}&name=${this.props.route.params.FileName}&size=1&token=${GlobalCache.UserToken}`
        // );
        return (
            <View style={{ flex: 1 }}>
                <Toolbar Title="Hồ sơ" navigation={this.props.navigation}></Toolbar>
                {Platform.OS == "ios" ? (
                    <WebView
                        //scrollEnabled={true}
                        onLoadStart={() => this.props.GlobalStore.ShowLoading()}
                        onLoadEnd={() => this.props.GlobalStore.HideLoading()}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        source={{
                            uri: `${ApiUrl.Attachment_ImagePreview}?id=${this.props.route.params.AttachmentID}&ecm=${this.props.route.params.ECMItemID}&name=${this.props.route.params.FileName}&size=1&token=${GlobalCache.UserToken}`,
                        }}
                    />
                ) : (
                    <PDFReader
                        source={{
                            uri: `${ApiUrl.Attachment_ImagePreview}?id=${this.props.route.params.AttachmentID}&ecm=${this.props.route.params.ECMItemID}&name=${this.props.route.params.FileName}&size=1&token=${GlobalCache.UserToken}`,
                        }}
                    />
                )}
            </View>
        );
    }
}
