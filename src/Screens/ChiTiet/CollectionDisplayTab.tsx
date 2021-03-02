import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
const { width, } = Dimensions.get("window");

interface iState {
    CurrentView: string;
}
export default class CollectionDisplayTab extends Component<any, iState> {
    constructor(props: any) {
        super(props);

        this.state = {
            CurrentView: "HopDong",
        };
    }

    handleChangeView(viewName) {
        this.setState({ CurrentView: viewName });
        this.props.onChangeScreen(viewName);
    }

    getStyle(viewName) {
        if (viewName === this.state.CurrentView) {
            return "#2EA8EE";
        } else {
            return "#00000090";
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.5}
                    onPress={() => this.handleChangeView("HopDong")}
                >
                    <FontAwesome5 name="book" size={18} style={{ color: this.getStyle("HopDong") }} />
                    <Text style={[styles.buttonText, { color: this.getStyle("HopDong") }]}>HỢP ĐỒNG</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.5}
                    onPress={() => this.handleChangeView("LichTraNo")}
                >
                    <FontAwesome5 name="calendar" size={18} style={{ color: this.getStyle("LichTraNo") }} />
                    <Text style={[styles.buttonText, { width: width/8, color: this.getStyle("LichTraNo") }]}>LỊCH TRẢ NỢ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.5}
                    onPress={() => this.handleChangeView("SoThu")}
                >
                    <FontAwesome5 name="calculator" size={18} style={{ color: this.getStyle("SoThu") }} />
                    <Text style={[styles.buttonText, {width: width/5, color: this.getStyle("SoThu") }]}>LS THANH TOÁN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.5}
                    onPress={() => this.handleChangeView("TacNghiep")}
                >
                    <FontAwesome5 name="funnel-dollar" size={18} style={{ color: this.getStyle("TacNghiep") }} />
                    <Text style={[styles.buttonText, { color: this.getStyle("TacNghiep") }]}>TÁC NGHIỆP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.5}
                    onPress={() => this.handleChangeView("HoSo")}
                >
                    <FontAwesome5 name="file" size={18} style={{ color: this.getStyle("HoSo") }} />
                    <Text style={[styles.buttonText, { color: this.getStyle("HoSo") }]}>HỒ SƠ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.5}
                    onPress={() => this.handleChangeView("HuaTra")}
                >
                    <FontAwesome5 name="comment-dollar" size={18} style={{ color: this.getStyle("HuaTra") }} />
                    <Text style={[styles.buttonText, { color: this.getStyle("HuaTra") }]}>LS HỨA TRẢ</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.5}
                    onPress={() => this.handleChangeView("PhuLuc")}
                >
                    <FontAwesome5 name="map-marker-alt" size={18} style={{ color: this.getStyle("PhuLuc") }} />
                    <Text style={[styles.buttonText, { color: this.getStyle("PhuLuc") }]}>Phụ lục</Text>
                </TouchableOpacity> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flexDirection: "row",
        paddingVertical: 5,
        borderTopWidth: 3,
        borderTopColor: "#ababab",
    },
    buttonIcon: {
        flex: 2,
        marginTop: 5,
    },
    buttonText: {
        textAlign: "center",
        marginTop: 3,
    },
    button: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
    },
});
