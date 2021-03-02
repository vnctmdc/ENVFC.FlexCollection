import React from "react";
import { View, TouchableOpacity } from "react-native";
import Toolbar from "../../../components/Toolbar";
import GlobalStore from "../../../Stores/GlobalStore";
import { inject, observer } from "mobx-react";
import SMX from "../../../constants/SMX";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
}
interface iState {}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class UploadImageActionFieldSrc extends React.Component<iProps, iState> {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Upload ảnh tác nghiệp" navigation={this.props.navigation}>
                    <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity activeOpacity={0.5}>
                            <FontAwesome5 name="save" size={25} color="#B3BDC6" />
                        </TouchableOpacity>
                    </View>
                </Toolbar>
            </View>
        );
    }
}
