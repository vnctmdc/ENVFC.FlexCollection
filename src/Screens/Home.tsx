import React, { Component } from "react";
import {
    Text,
    View,
    Alert,
    TouchableOpacity,
    ScrollView,
    Button,
    BackHandler,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Image,
    Dimensions,
    ImageBackground,
    Keyboard,
    StatusBar,
} from "react-native";
import Theme from "../Themes/Default";
import ApiUrl from "../constants/ApiUrl";
import { WebView } from "react-native-webview";
import Toolbar from "../components/Toolbar";
import HttpUtils from "../Utils/HttpUtils";
import SMX from "../constants/SMX";
import { inject, observer } from "mobx-react";
import GlobalStore from "../Stores/GlobalStore";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import GlobalCache from "../Caches/GlobalCache";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
}

interface iState {}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class Home extends Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);

        Keyboard.addListener("keyboardWillShow", this.onKeyboardShow);
        StatusBar.setBarStyle("dark-content");
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);

        Keyboard.removeListener("keyboardWillShow", this.onKeyboardShow);
        StatusBar.setBarStyle("dark-content");
    }

    onKeyboardShow = () => {
        StatusBar.setBarStyle("dark-content");
    };

    handleBackPress = () => {
        return true;
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Trang chủ" navigation={this.props.navigation} HasDrawer={true}>
                    <View style={{ marginLeft: 15 }}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => {
                            this.props.navigation.navigate("ProfilesSrc");
                        }}> 
                            <FontAwesome5 name="user" size={23} color="#1C4694" />
                        </TouchableOpacity>
                    </View>
                </Toolbar>
                <View style={{ marginTop: 80 }}>
                    <WebView                        
                        onLoadStart={this.props.GlobalStore.ShowLoading}
                        onLoadEnd={this.props.GlobalStore.HideLoading}
                        source={{ uri: `${ApiUrl.Home_Chart}?token=${GlobalCache.UserToken}` }}
                    />
                </View>
            </View>
        );
    }
}
