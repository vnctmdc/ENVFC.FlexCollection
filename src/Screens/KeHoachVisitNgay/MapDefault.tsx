import React from "react";
import { View, Text, Dimensions } from "react-native";
import Toolbar from "../../components/Toolbar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import Collection_DocumentAction from "../../Entities/Collection_DocumentAction";
import Utility from "../../Utils/Utility";
import CollectionDocumentAllDto from "../../DtoParams/CollectionDocumentAllDto";
import MapView, { Marker } from "react-native-maps";
const { width, height } = Dimensions.get("window");

interface iProps {
    GlobalStore: GlobalStore;
    navigation: any;
}

interface iState {
    IsMapScreen: boolean;
    Coordinates: any;
    LstAction: Collection_DocumentAction[];
    TongKhachHang: number;
    TongDuNo: number;
}
@inject(SMX.StoreName.GlobalStore)
@observer
export default class KeHoachVisitNgayMapSrc extends React.Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            IsMapScreen: false,
            Coordinates: [],
            LstAction: [],
            TongKhachHang: 0,
            TongDuNo: 0,
        };
    }

    async componentDidMount() {
        await this.LoadData();
        await this.LoadAllAddress();

    }

    async LoadData() {
        this.props.GlobalStore.ShowLoading();
        let res = await HttpUtils.post<CollectionDocumentAllDto>(
            ApiUrl.CollectionDocumentAll_Execute,
            SMX.ApiActionCode.DSKHKeHoachVisitMap,
            JSON.stringify(new CollectionDocumentAllDto())
        );

        this.setState({ LstAction: res!.LstAction! });
        this.setState({ TongKhachHang: res!.TongKhachHang!, TongDuNo: res!.TongDuNo! });
        this.props.GlobalStore.HideLoading();
    }

    async LoadAllAddress() {
        try {
            this.props.GlobalStore.ShowLoading();
            if (this.state.LstAction.length > 0) {
                await this.state.LstAction.map(async (item) => {
                    var url = `${ApiUrl.GoogleGeocodeApi}?address=${item.CustomerTempAddress}&key=${ApiUrl.GOOGLE_MAPS_APIKEY}`;
                    let coordinates = this.state.Coordinates;
                    await fetch(url)
                        .then(async (response) => await response.json())
                        .then(async (responseJson) => {
                            //console.log('origin',responseJson);
                            if (responseJson.results.length > 0) {
                                if (responseJson.results[0].geometry) {
                                    const marker = {
                                        customer: item.CustomerName,
                                        name: item.CustomerTempAddress,
                                        latitude: responseJson.results[0].geometry.location.lat,
                                        longitude: responseJson.results[0].geometry.location.lng,
                                        budget: item.Budget
                                    };
                                    coordinates.push(marker);
                                }
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                        
                    this.setState({ Coordinates: coordinates });
                });
            }
            
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
        }
    }

    GetColorCode(value: string) {
        if (value !== null && value !== undefined) {
            if (value == 'B4') {
                return "#02c39a";
            } else if (value == 'B3') {
                return "#fb5607";
            } else if (value == 'B2') {
                return "#028090";
            } else if (value == 'B1') {
                return "#3a86ff";
            } else if (value == 'B0') {
                return "#8338ec";
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    async GuiKeHoach() {
        this.props.GlobalStore.ShowLoading();
        let request = new CollectionDocumentAllDto();
        let res = await HttpUtils.post<CollectionDocumentAllDto>(
            ApiUrl.CollectionDocumentAll_Execute,
            SMX.ApiActionCode.GuiKeHoach,
            JSON.stringify(request)
        );
        this.props.GlobalStore.HideLoading();
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Toolbar Title="Kế hoạch visit theo bản đồ" navigation={this.props.navigation}>
                    <View style={{ marginLeft: 10 }}>
                    </View>
                </Toolbar>
                <View style={{ backgroundColor: "#FFF", flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "gainsboro" }}>
                    <View
                        style={{
                            paddingRight: 16,
                            paddingLeft: 4,
                            paddingVertical: width / 25,
                            flexDirection: "row",
                        }}
                    >
                        <View>
                            <Text>Tổng số HĐ: </Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold" }}>
                                {this.state.TongKhachHang}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            paddingRight: 4,
                            paddingVertical: width / 25,
                            flexDirection: "row",
                        }}
                    >
                        <Text>Tổng dự nợ: </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            {Utility.GetDecimalString(this.state.TongDuNo)}
                        </Text>
                    </View>
                </View>
                <MapView
                    ref={(map) => {
                        //@ts-ignore
                        this.map = map;
                    }}
                    onMapReady={() => {
                        //@ts-ignore
                        this.map.fitToElements(true);
                    }}
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: 10.823099,
                        longitude: 106.629664,
                        latitudeDelta: 0.4554,
                        longitudeDelta: 0.0429,
                    }}
                >
                    {this.state.Coordinates.map((marker) => (

                        <Marker
                            key={marker.id}
                            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                            title={marker.customer}
                            description={marker.name}

                            pinColor="#ff0000"
                        >
                            {/* <FontAwesome name="map-marker" size={30} color="#008024" /> */}
                            <FontAwesome name="map-marker" size={30} color={this.GetColorCode(marker.budget)} />
                        </Marker>
                    ))}
                </MapView>
            </View>
        );
    }
}