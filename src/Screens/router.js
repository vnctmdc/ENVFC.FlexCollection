import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createSwitchNavigator } from "@react-navigation/compat";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Octicons from "react-native-vector-icons/Octicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { setTopLevelNavigator } from "./NavigationService";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { DrawerItem, DrawerContentScrollView, createDrawerNavigator } from "@react-navigation/drawer";

import GoBack from "../components/GoBack";
// Shared
import Welcome from "./shared/Welcome";
import SrcLogin from "./shared/Login";
import SrcLogout from "./shared/Logout";
import Home from "./Home";

import AuthenticationService from "../Utils/AuthenticationService";
import Error from "./shared/Error";

import DSKhachHangSrc from "../Screens/DSKhachHang/Default";
import CollectionDocumentDetailSrc from "../Screens/ChiTiet/Display";

//
import DSKhachHangChuaVisitSrc from "../Screens/DSKhachHangChuaVisit/Default";
import DSKhachHangChuaVisitMapSrc from "../Screens/DSKhachHangChuaVisit/MapDefault";
import DSKhachHangDaThanhToanSrc from "../Screens/DSKhachHangDaThanhToan/Default";
import DSKhachHangVisitedInDaySrc from "../Screens/DSKhachHangVisitedInDay/Default";
import DSKhachHangVisitedInMonthSrc from "../Screens/DSKhachHangVisitedInMonth/Default";
import KeHoachVisitNgaySrc from "../Screens/KeHoachVisitNgay/Default";
import KeHoachVisitNgayMapSrc from "../Screens/KeHoachVisitNgay/MapDefault";
import AddActionSrc from "../Screens/ChiTiet/Action/AddAction";
import ActionDisplaySrc from "../Screens/ChiTiet/Action/Display";
import UploadImageActionFieldSrc from "../Screens/ChiTiet/Action/UploadImageActionField";
import UploadHoSoECMSrc from "../Screens/ChiTiet/HoSo/UploadHoSoECM";
import DebtContractAnnexSrc from "../Screens/ChiTiet/Action/DebtContractAnnex";
import PDFView from "../Screens/ChiTiet/HoSo/PDFView";
//
import ProfilesSrc from "../Screens/Profile/Display";

// ? Default title style
const defaultTitleStyle = {
    headerStyle: {
        backgroundColor: "#2EA8EE",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
        fontWeight: "bold",
    },
    headerBackTitle: "",
};

const HomeStack = createStackNavigator();
function HomeContainer() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen
                name="Home"
                component={Home}
                options={({ navigation, route }) => ({
                    title: "Trang chủ",
                    ...defaultTitleStyle,
                    headerShown: false,
                    headerLeft: (props) => (
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => navigation.openDrawer()}>
                                <FontAwesome5 name="bars" size={size} />
                            </TouchableOpacity>
                        </View>
                    ),
                })}
            />
            {/* <HomeStack.Screen
                name="ProfilesSrc"
                component={ProfilesSrc}
                options={({ navigation, route }) => ({
                    title: "Thông tin người đăng nhập",
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            /> */}
        </HomeStack.Navigator>
    );
}

const DSKhachHangStack = createStackNavigator();
function DSKhachHangContainer() {
    return (
        <DSKhachHangStack.Navigator>
            <DSKhachHangStack.Screen
                name="DSKhachHang"
                component={DSKhachHangSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangStack.Screen
                name="CollectionDocumentDisplay"
                component={CollectionDocumentDetailSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangStack.Screen
                name="DocActionDisplay"
                component={ActionDisplaySrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangStack.Screen
                name="AddAction"
                component={AddActionSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangStack.Screen
                name="UploadImgActionField"
                component={UploadImageActionFieldSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangStack.Screen
                name="UploadHoSoECM"
                component={UploadHoSoECMSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangStack.Screen
                name="PDFView"
                component={PDFView}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangStack.Screen
                name="DebtContractAnnexSrc"
                component={DebtContractAnnexSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
        </DSKhachHangStack.Navigator>
    );
}

const DSKhachHangChuaVisitStack = createStackNavigator();
function DSKhachHangChuaVisitContainer() {
    return (
        <DSKhachHangChuaVisitStack.Navigator>
            <DSKhachHangChuaVisitStack.Screen
                name="DSKhachHangChuaVisit"
                component={DSKhachHangChuaVisitSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangChuaVisitStack.Screen
                name="CollectionDocumentDisplay"
                component={CollectionDocumentDetailSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangChuaVisitStack.Screen
                name="DSKhachHangChuaVisitMap"
                component={DSKhachHangChuaVisitMapSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangChuaVisitStack.Screen
                name="DocActionDisplay"
                component={ActionDisplaySrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangChuaVisitStack.Screen
                name="AddAction"
                component={AddActionSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangChuaVisitStack.Screen
                name="UploadImgActionField"
                component={UploadImageActionFieldSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangChuaVisitStack.Screen
                name="UploadHoSoECM"
                component={UploadHoSoECMSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangChuaVisitStack.Screen
                name="PDFView"
                component={PDFView}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangChuaVisitStack.Screen
                name="DebtContractAnnexSrc"
                component={DebtContractAnnexSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
        </DSKhachHangChuaVisitStack.Navigator>
    );
}

const DSKhachHangDaThanhToanStack = createStackNavigator();
function DSKhachHangDaThanhToanContainer() {
    return (
        <DSKhachHangDaThanhToanStack.Navigator>
            <DSKhachHangDaThanhToanStack.Screen
                name="DSKhachHangDaThanhToan"
                component={DSKhachHangDaThanhToanSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangDaThanhToanStack.Screen
                name="CollectionDocumentDisplay"
                component={CollectionDocumentDetailSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangDaThanhToanStack.Screen
                name="DocActionDisplay"
                component={ActionDisplaySrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangDaThanhToanStack.Screen
                name="AddAction"
                component={AddActionSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangDaThanhToanStack.Screen
                name="UploadImgActionField"
                component={UploadImageActionFieldSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangDaThanhToanStack.Screen
                name="UploadHoSoECM"
                component={UploadHoSoECMSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangDaThanhToanStack.Screen
                name="PDFView"
                component={PDFView}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangDaThanhToanStack.Screen
                name="DebtContractAnnexSrc"
                component={DebtContractAnnexSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
        </DSKhachHangDaThanhToanStack.Navigator>
    );
}

const DSKhachHangVisitedInDayStack = createStackNavigator();
function DSKhachHangVisitedInDayContainer() {
    return (
        <DSKhachHangVisitedInDayStack.Navigator>
            <DSKhachHangVisitedInDayStack.Screen
                name="DSKhachHangVisitedInDay"
                component={DSKhachHangVisitedInDaySrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangVisitedInDayStack.Screen
                name="CollectionDocumentDisplay"
                component={CollectionDocumentDetailSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangVisitedInDayStack.Screen
                name="DocActionDisplay"
                component={ActionDisplaySrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangVisitedInDayStack.Screen
                name="AddAction"
                component={AddActionSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangVisitedInDayStack.Screen
                name="UploadImgActionField"
                component={UploadImageActionFieldSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangVisitedInDayStack.Screen
                name="UploadHoSoECM"
                component={UploadHoSoECMSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangVisitedInDayStack.Screen
                name="PDFView"
                component={PDFView}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangVisitedInDayStack.Screen
                name="DebtContractAnnexSrc"
                component={DebtContractAnnexSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
        </DSKhachHangVisitedInDayStack.Navigator>
    );
}

const DSKhachHangVisitedInMonthStack = createStackNavigator();
function DSKhachHangVisitedInMonthContainer() {
    return (
        <DSKhachHangVisitedInMonthStack.Navigator>
            <DSKhachHangVisitedInMonthStack.Screen
                name="DSKhachHangVisitedInMonth"
                component={DSKhachHangVisitedInMonthSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangVisitedInMonthStack.Screen
                name="CollectionDocumentDisplay"
                component={CollectionDocumentDetailSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangVisitedInMonthStack.Screen
                name="DocActionDisplay"
                component={ActionDisplaySrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangVisitedInMonthStack.Screen
                name="AddAction"
                component={AddActionSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangVisitedInMonthStack.Screen
                name="UploadImgActionField"
                component={UploadImageActionFieldSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangVisitedInMonthStack.Screen
                name="UploadHoSoECM"
                component={UploadHoSoECMSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangVisitedInMonthStack.Screen
                name="PDFView"
                component={PDFView}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <DSKhachHangVisitedInMonthStack.Screen
                name="DebtContractAnnexSrc"
                component={DebtContractAnnexSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
        </DSKhachHangVisitedInMonthStack.Navigator>
    );
}

const KeHoachVisitNgayStack = createStackNavigator();
function KeHoachVisitNgayContainer() {
    return (
        <KeHoachVisitNgayStack.Navigator>
            <KeHoachVisitNgayStack.Screen
                name="KeHoachVisitNgay"
                component={KeHoachVisitNgaySrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <KeHoachVisitNgayStack.Screen
                name="CollectionDocumentDisplay"
                component={CollectionDocumentDetailSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <KeHoachVisitNgayStack.Screen
                name="KeHoachVisitNgayMap"
                component={KeHoachVisitNgayMapSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <KeHoachVisitNgayStack.Screen
                name="DocActionDisplay"
                component={ActionDisplaySrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <KeHoachVisitNgayStack.Screen
                name="AddAction"
                component={AddActionSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <KeHoachVisitNgayStack.Screen
                name="UploadImgActionField"
                component={UploadImageActionFieldSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <KeHoachVisitNgayStack.Screen
                name="UploadHoSoECM"
                component={UploadHoSoECMSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <KeHoachVisitNgayStack.Screen
                name="PDFView"
                component={PDFView}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
            <KeHoachVisitNgayStack.Screen
                name="DebtContractAnnexSrc"
                component={DebtContractAnnexSrc}
                options={({ navigation, route }) => ({
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            />
        </KeHoachVisitNgayStack.Navigator>
    );
}

const Drawer = createDrawerNavigator();
function DrawerContainer() {
    const [type, setType] = useState(1);

    return (
        <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={({ navigation }) => (
                <View style={{ paddingTop: 27 }}>
                    <DrawerItem
                        icon={({ color, size }) => (
                            <View style={{ width: 27 }}>
                                <FontAwesome5 name="home" size={size - 3} color={type === 1 ? "#2EA8EE" : color} />
                            </View>
                        )}
                        label="Trang chủ"
                        labelStyle={{ color: type === 1 ? "#2EA8EE" : "#000000", fontSize: 15 }}
                        onPress={() => {
                            setType(1);
                            navigation.closeDrawer();
                            navigation.navigate("Home");
                        }}
                    />

                    <DrawerItem
                        icon={({ color, size }) => (
                            <View style={{ width: 27 }}>
                                <FontAwesome5 name="users" size={size - 3} color={type === 2 ? "#2EA8EE" : color} />
                            </View>
                        )}
                        label="Kế hoạch visit ngày"
                        labelStyle={{ color: type === 2 ? "#2EA8EE" : "#000000", fontSize: 15 }}
                        onPress={() => {
                            setType(2);
                            navigation.closeDrawer();
                            navigation.navigate("KeHoachVisitNgay");
                        }}
                    />

                    <DrawerItem
                        icon={({ color, size }) => (
                            <View style={{ width: 27 }}>
                                <FontAwesome5 name="users" size={size - 3} color={type === 3 ? "#2EA8EE" : color} />
                            </View>
                        )}
                        label="KH chưa visit"
                        labelStyle={{ color: type === 3 ? "#2EA8EE" : "#000000", fontSize: 15 }}
                        onPress={() => {
                            setType(3);
                            navigation.closeDrawer();
                            navigation.navigate("DSKhachHangChuaVisit");
                        }}
                    />

                    <DrawerItem
                        icon={({ color, size }) => (
                            <View style={{ width: 27 }}>
                                <FontAwesome5 name="users" size={size - 3} color={type === 4 ? "#2EA8EE" : color} />
                            </View>
                        )}
                        label="KH visited ngày"
                        labelStyle={{ color: type === 4 ? "#2EA8EE" : "#000000", fontSize: 15 }}
                        onPress={() => {
                            setType(4);
                            navigation.closeDrawer();
                            navigation.navigate("DSKhachHangVisitedInDay");
                        }}
                    />

                    <DrawerItem
                        icon={({ color, size }) => (
                            <View style={{ width: 27 }}>
                                <FontAwesome5 name="users" size={size - 3} color={type === 5 ? "#2EA8EE" : color} />
                            </View>
                        )}
                        label="KH visited tháng"
                        labelStyle={{ color: type === 5 ? "#2EA8EE" : "#000000", fontSize: 15 }}
                        onPress={() => {
                            setType(5);
                            navigation.closeDrawer();
                            navigation.navigate("DSKhachHangVisitedInMonth");
                        }}
                    />

                    <DrawerItem
                        icon={({ color, size }) => (
                            <View style={{ width: 27 }}>
                                <FontAwesome5 name="users" size={size - 3} color={type === 6 ? "#2EA8EE" : color} />
                            </View>
                        )}
                        label="KH đã thanh toán"
                        labelStyle={{ color: type === 6 ? "#2EA8EE" : "#000000", fontSize: 15 }}
                        onPress={() => {
                            setType(6);
                            navigation.closeDrawer();
                            navigation.navigate("DSKhachHangDaThanhToan");
                        }}
                    />

                    <DrawerItem
                        icon={({ color, size }) => (
                            <View style={{ width: 27 }}>
                                <FontAwesome5 name="users" size={size - 3} color={type === 7 ? "#2EA8EE" : color} />
                            </View>
                        )}
                        label="KH tổng"
                        labelStyle={{ color: type === 7 ? "#2EA8EE" : "#000000", fontSize: 15 }}
                        onPress={() => {
                            setType(7);
                            navigation.closeDrawer();
                            navigation.navigate("DSKhachHang");
                        }}
                    />

                    <DrawerItem
                        icon={({ color, size }) => (
                            <View style={{ width: 27 }}>
                                <FontAwesome5
                                    name="sign-out-alt"
                                    size={size - 3}
                                    color={type === 8 ? "#2EA8EE" : color}
                                />
                            </View>
                        )}
                        labelStyle={{ color: type === 8 ? "#2EA8EE" : "#000000", fontSize: 15 }}
                        label="Đăng xuất"
                        onPress={() => {
                            setType(8);
                            AuthenticationService.SignOut();
                            navigation.closeDrawer();
                            navigation.navigate("SrcLogin");
                        }}
                    />
                </View>
            )}
        >
            <Drawer.Screen
                name="Home"
                component={HomeContainer}
                options={{
                    drawerLabel: "Trang chủ",
                    headerShown: false,
                }}
            />

            <Drawer.Screen
                name="DSKhachHang"
                component={DSKhachHangContainer}
                options={{
                    drawerLabel: "DS Khách hàng",
                    headerShown: false,
                }}
            />
            <Drawer.Screen
                name="DSKhachHangChuaVisit"
                component={DSKhachHangChuaVisitContainer}
                options={{
                    drawerLabel: "DS Khách hàng chưa visit",
                    headerShown: false,
                }}
            />
            <Drawer.Screen
                name="DSKhachHangDaThanhToan"
                component={DSKhachHangDaThanhToanContainer}
                options={{
                    drawerLabel: "DS Khách hàng đã thanh toán",
                    headerShown: false,
                }}
            />
            <Drawer.Screen
                name="DSKhachHangVisitedInDay"
                component={DSKhachHangVisitedInDayContainer}
                options={{
                    drawerLabel: "DS Khách hàng visited trong ngày",
                    headerShown: false,
                }}
            />
            <Drawer.Screen
                name="DSKhachHangVisitedInMonth"
                component={DSKhachHangVisitedInMonthContainer}
                options={{
                    drawerLabel: "DS Khách hàng visited trong tháng",
                    headerShown: false,
                }}
            />
            <Drawer.Screen
                name="KeHoachVisitNgay"
                component={KeHoachVisitNgayContainer}
                options={{
                    drawerLabel: "Kế hoạch visit ngày",
                    headerShown: false,
                }}
            />
        </Drawer.Navigator>
    );
}

const Stack = createStackNavigator();
function AppContainer() {
    return (
        <NavigationContainer ref={(navigationRef) => setTopLevelNavigator(navigationRef)}>
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen name="SwitchStack" component={SwitchStack} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const SwitchStack = createSwitchNavigator(
    {
        Welcome: Welcome,
        SrcLogin: SrcLogin,
        ProfilesSrc: ProfilesSrc,
        Drawers: DrawerContainer,
        SrcError: Error,
    },
    {
        initialRouteName: "Welcome",
    }
);

export default AppContainer;
