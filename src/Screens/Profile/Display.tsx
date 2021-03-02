import React from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import Toolbar from '../../components/Toolbar';
import Employee from '../../Entities/Employee';
import GlobalStore from '../../Stores/GlobalStore';
import Utility from '../../Utils/Utility';
import HttpUtils from '../../Utils/HttpUtils';
import { ProfileDto } from '../../DtoParams/ProfileDto';
import ApiUrl from '../../constants/ApiUrl';
import SMX from '../../constants/SMX';
import { observer, inject } from 'mobx-react';

const { height, width } = Dimensions.get('window');

interface iProps {
    navigation: any;
    route: any;
    GlobalStore: GlobalStore;
}
interface iState {
    Employee: Employee;

}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class ProfilesSrc extends React.Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            Employee: new Employee()
        }
    }

    async componentDidMount() {
        await this.LoadData();
    }

    async LoadData() {
        this.props.GlobalStore.ShowLoading();
        let res = await HttpUtils.post<ProfileDto>(
            ApiUrl.Profile_Execute,
            SMX.ApiActionCode.GetProfile,
            JSON.stringify(new ProfileDto())
        );

        if (res) {
            this.setState({ Employee: res!.Employee! });
        }

        this.props.GlobalStore.HideLoading();

    }

    render() {
        const { Employee } = this.state;
        return (
            <View style={{ height: height, backgroundColor: "#FFF" }}>
                <Toolbar Title="Thông tin người đăng nhập" navigation={this.props.navigation} />

                <View style={{ paddingLeft: 10, marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            <View>
                                {/* <Image
                                    style={{ borderRadius: 40, width: 80, height: 80, resizeMode: "contain" }}
                                    source={require("../../../assets/avatar.png")}
                                /> */}
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                <Text style={{ width: width - 80, paddingLeft: 8, fontWeight: 'bold', fontSize: 30 }}>{Employee.Name}</Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ paddingTop: 30 }}>
                        <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                            <View style={{ width: width / 3 }}>
                                <Text style={{ fontWeight: 'bold' }}>Chức danh</Text>
                            </View>
                            <View style={{ width: 2 * width / 3 }}>
                                <Text>{Employee.Description}</Text>
                            </View>
                        </View>
                        <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                            <View style={{ width: width / 3 }}>
                                <Text style={{ fontWeight: 'bold' }}>Ngày sinh</Text>
                            </View>
                            <View style={{ width: 2 * width / 3 }}>
                                <Text>{Utility.GetDateString(Employee.DOB)}</Text>
                            </View>
                        </View>
                        <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                            <View style={{ width: width / 3 }}>
                                <Text style={{ fontWeight: 'bold' }}>Phone</Text>
                            </View>
                            <View style={{ width: 2 * width / 3 }}>
                                <Text>{Employee.Phone}</Text>
                            </View>
                        </View>
                        <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                            <View style={{ width: width / 3 }}>
                                <Text style={{ fontWeight: 'bold' }}>Email</Text>
                            </View>
                            <View style={{ width: 2 * width / 3 }}>
                                <Text>{Employee.Email}</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </View>
        )
    }
}