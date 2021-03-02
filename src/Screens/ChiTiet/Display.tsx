import React from "react";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import { View } from "react-native";
import CollectionDisplayTab from "./CollectionDisplayTab";
import HopDongDisplayUC from "../ChiTiet/HopDong";
import CollectionDocumentDto from "../../DtoParams/CollectionDocumentDto";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import ActionLogSrc from "./Action/ActionLog";
import HoSoECM from "./HoSo/HoSoECM";
import SoThuSrc from "./SoThu";
import LichTraNoSrc from "./LichTraNo";
import PromiseToPayDisplayUC from "./PromiseToPayDisplay";

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
    route: any;
}
interface iState {
    selectedScreen: string;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class CollectionDocumentDetailSrc extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            selectedScreen: "HopDong",
        };
    }

    // componentDidMount() {
    //     this.props.GlobalStore.UpdateCollection = () => {
    //         this.setState({ selectedScreen: "CollectionAttachment" });
    //     };
    // }

    renderContent(screen) {
        switch (screen) {
            case "HopDong":
                return (
                    <HopDongDisplayUC
                        navigation={this.props.navigation}
                        GlobalStore={this.props.GlobalStore}
                        route={this.props.route}
                    />
                );
            case "TacNghiep":
                return (
                    <ActionLogSrc
                        navigation={this.props.navigation}
                        GlobalStore={this.props.GlobalStore}
                        route={this.props.route}
                    />
                );
            case "HoSo":
                return (
                    <HoSoECM
                        navigation={this.props.navigation}
                        GlobalStore={this.props.GlobalStore}
                        route={this.props.route}
                    />
                );
            case "SoThu":
                return (
                    <SoThuSrc
                        navigation={this.props.navigation}
                        GlobalStore={this.props.GlobalStore}
                        route={this.props.route}
                    />
                );
            case "LichTraNo":
                return (
                    <LichTraNoSrc
                        navigation={this.props.navigation}
                        GlobalStore={this.props.GlobalStore}
                        route={this.props.route}
                    />
                );
            case "HuaTra":
                return (
                    <PromiseToPayDisplayUC
                        navigation={this.props.navigation}
                        GlobalStore={this.props.GlobalStore}
                        route={this.props.route}
                    />
                );
        }
    }

    onChangeScreen(screen) {
        this.setState({
            selectedScreen: screen,
        });
        this.props.navigation.setParams({ CurrentView: screen });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                {this.renderContent(this.state.selectedScreen)}
                <CollectionDisplayTab
                    onChangeScreen={(screen) => {
                        this.onChangeScreen(screen);
                    }}
                />
            </View>
        );
    }
}
