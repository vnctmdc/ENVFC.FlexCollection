import * as Enums from "./Enums";
export default class SMX {
    static StoreName = class {
        static GlobalStore = "GlobalStore";
    };

    static PromisePaid = class {
        static dicName: iKeyValuePair<Enums.PromisePaid, string>[] = [
            { Key: Enums.PromisePaid.ThatHua, Value: "BPTP - Không đúng cam kết" },
            { Key: Enums.PromisePaid.TraDu, Value: "KPTP - Đúng cam kết" },
        ];

        static dicColor: iKeyValuePair<Enums.PromisePaid, string>[] = [
            { Key: Enums.PromisePaid.ThatHua, Value: "#EE6400" },
            { Key: Enums.PromisePaid.TraDu, Value: "#597EF7" },
        ];
    };

    static NotificationType = class {
        static dicName: iKeyValuePair<Enums.NotificationType, string>[] = [
            { Key: Enums.NotificationType.SinhNhat, Value: "Sinh nhật" },
            { Key: Enums.NotificationType.KyNiem, Value: "Kỷ niệm" },
            { Key: Enums.NotificationType.ThanhLap, Value: "Thành lập" },
            { Key: Enums.NotificationType.TruyenThong, Value: "Truyền thống" },
        ];
    };

    static Attitudes = class {
        static dicName: iKeyValuePair<Enums.Attitude, string>[] = [
            { Key: Enums.Attitude.TichCuc, Value: "Tích cực" },
            { Key: Enums.Attitude.TieuCuc, Value: "Tiêu cực" },
            { Key: Enums.Attitude.TrungLap, Value: "Trung lập" },
        ];

        static dicColor: iKeyValuePair<Enums.Attitude, string>[] = [
            { Key: Enums.Attitude.TichCuc, Value: "#597EF7" },
            { Key: Enums.Attitude.TieuCuc, Value: "#EE6400" },
            { Key: Enums.Attitude.TrungLap, Value: "#389E0D" },
        ];
    };

    static RelationshipWithMB = class {
        static dicName: iKeyValuePair<Enums.RelationshipWithMB, string>[] = [
            { Key: Enums.RelationshipWithMB.NongAm, Value: "Nồng ấm" },
            { Key: Enums.RelationshipWithMB.ThietLap, Value: "Thiết lập" },
            { Key: Enums.RelationshipWithMB.HieuBiet, Value: "Hiểu biết" },
            { Key: Enums.RelationshipWithMB.ThanThiet, Value: "Thân thiết" },
        ];

        static dicColor: iKeyValuePair<Enums.RelationshipWithMB, string>[] = [
            { Key: Enums.RelationshipWithMB.NongAm, Value: "#597EF7" },
            { Key: Enums.RelationshipWithMB.ThietLap, Value: "#EE6400" },
            { Key: Enums.RelationshipWithMB.HieuBiet, Value: "#389E0D" },
            { Key: Enums.RelationshipWithMB.ThanThiet, Value: "#D9001B" },
        ];
    };

    static PositiveType = class {
        static readonly dicName: iKeyValuePair<Enums.PositiveType, string>[] = [
            { Key: Enums.PositiveType.TruyenHinh, Value: "Truyền hình" },
            { Key: Enums.PositiveType.BaoMang, Value: "Báo mạng" },
            { Key: Enums.PositiveType.BaoGiay, Value: "Báo giấy" },
            { Key: Enums.PositiveType.MangXaHoi, Value: "Mạng xã hội" },
            { Key: Enums.PositiveType.DienDan, Value: "Diễn đàn" },
        ];
    };

    static NegativeNews = class {
        static readonly dicName: iKeyValuePair<Enums.NegativeNews, string>[] = [
            { Key: Enums.NegativeNews.ChuaPhatSinh, Value: "Chưa lên báo" },
            { Key: Enums.NegativeNews.DaPhatSinh, Value: "Đã lên báo" },
        ];
        static readonly dicColor: iKeyValuePair<Enums.NegativeNews, string>[] = [
            { Key: Enums.NegativeNews.ChuaPhatSinh, Value: "#597EF7" },
            { Key: Enums.NegativeNews.DaPhatSinh, Value: "#D9001B" },
        ];
    };

    static NewStatus = class {
        static dicName: iKeyValuePair<Enums.NewStatus, string>[] = [
            { Key: Enums.NewStatus.MoiTao, Value: "Đang xử lý" },
            { Key: Enums.NewStatus.HoanThanh, Value: "Hoàn thành" },
        ];
        static readonly dicColor: iKeyValuePair<Enums.NewStatus, string>[] = [
            { Key: Enums.NewStatus.MoiTao, Value: "#EE6400" },
            { Key: Enums.NewStatus.HoanThanh, Value: "#389E0D" },
        ];
    };

    static Classification = class {
        static readonly dicName: iKeyValuePair<Enums.Classification, string>[] = [
            { Key: Enums.Classification.BinhThuong, Value: "Bình thường" },
            { Key: Enums.Classification.QuanTrong, Value: "Quan trọng" },
            { Key: Enums.Classification.TrungBinh, Value: "Trung bình" },
        ];
        static readonly dicColor: iKeyValuePair<Enums.Classification, string>[] = [
            { Key: Enums.Classification.BinhThuong, Value: "#2F54EB" },
            { Key: Enums.Classification.QuanTrong, Value: "red" },
            { Key: Enums.Classification.TrungBinh, Value: "green" },
        ];
    };

    // Trạng thái Yes/No
    static YesNo = class {
        static Yes = true;
        static No = false;

        static dicName: iKeyValuePair<boolean, string>[] = [
            { Key: true, Value: "Có" },
            { Key: false, Value: "Không" },
        ];
    };

    // Giới tính
    static Gender = class {
        static readonly dicName: iKeyValuePair<Enums.Gender, string>[] = [
            { Key: Enums.Gender.Male, Value: "Nam" },
            { Key: Enums.Gender.Female, Value: "Nữ" },
            { Key: Enums.Gender.Other, Value: "Khác" },
        ];
    };

    static NewsStatus = class {
        static readonly dicName: iKeyValuePair<Enums.NewsStatus, string>[] = [
            { Key: Enums.NewsStatus.HoanThanh, Value: "Hoàn hành" },
            { Key: Enums.NewsStatus.MoiTao, Value: "Mới tạo" },
        ];

        static readonly dicColorBackground: iKeyValuePair<Enums.NewsStatus, string>[] = [
            { Key: Enums.NewsStatus.HoanThanh, Value: "#F0F5FF" },
            { Key: Enums.NewsStatus.MoiTao, Value: "#FFF7E6" },
        ];

        static readonly dicColor: iKeyValuePair<Enums.NewsStatus, string>[] = [
            { Key: Enums.NewsStatus.HoanThanh, Value: "#2F54EB" },
            { Key: Enums.NewsStatus.MoiTao, Value: "#FA8C16" },
        ];

        static readonly dicIcons: iKeyValuePair<Enums.NewsStatus, string>[] = [
            { Key: Enums.NewsStatus.HoanThanh, Value: "download" },
            { Key: Enums.NewsStatus.MoiTao, Value: "arrow-right" },
        ];
    };

    static KyHuaTra = class {
        static readonly dicName: iKeyValuePair<Enums.KyHuaTra, string>[] = [
            { Key: Enums.KyHuaTra.k1, Value: "Hứa trả 1 kỳ" },
            { Key: Enums.KyHuaTra.k2, Value: "Hứa trả 2 kỳ" },
            { Key: Enums.KyHuaTra.k3, Value: "Hứa trả 3 kỳ" },
            { Key: Enums.KyHuaTra.k4, Value: "Tất cả" },
        ];
    };

    static AttachmentRefType = class {
        static readonly dicName: iKeyValuePair<Enums.AttachmentRefType, string>[] = [
            { Key: Enums.AttachmentRefType.ActionField, Value: "Tác nghiệp" },
            { Key: Enums.AttachmentRefType.CustomerInfo, Value: "Hồ sơ khách hàng" },
        ];
    };

    static ApiActionCode = class {
        static SetupViewForm = "SetupViewForm";
        static SearchData = "SearchData";
        static SetupEditForm = "SetupEditForm";
        static SaveItem = "SaveItem";
        static SetupDisplay = "SetupDisplay";
        static DeleteItem = "DeleteItem";
        static Request = "Request";
        static Approve = "Approve";
        static Reject = "Reject";
        static SaveImage = "SaveImage";
        static ApproveBatch = "ApproveBatch";
        static ApproveBatchNext = "ApproveBatchNext";
        static RejectBatch = "RejectBatch";
        static RequestApproval = "RequestApproval";
        static HistoryApproval = "HistoryApproval";
        static DetailDisplay = "DetailDisplay";
        static UpdateAttachment = "UpdateAttachment";

        //Ds KhachHang
        static DSKHKeHoachVisit = "DSKHKeHoachVisit";
        static DSKHKeHoachVisitMap = "DSKHKeHoachVisitMap";
        static DSKHDaThanhToan = "DSKHDaThanhToan";
        static DSKHChuaVisit = "DSKHChuaVisit";
        static DSKHChuaVisitMap = "DSKHChuaVisitMap";
        static DSKHDaVisit = "DSKHDaVisit";
        static DSKHDaVisitInDay = "DSKHDaVisitInDay";
        static DSKHDaVisitInMonth = "DSKHDaVisitInMonth";
        static GuiKeHoach = "GuiKeHoach";
        static LapKeHoach = "LapKeHoach";

        //Lấy thông tin người đăng nhập
        static GetProfile = "GetProfile";

        static HRDetail = "HRDetail";
        static HomeDisplay = "HomeDisplay";
        static SearchDataByCustomer = "SearchDataByCustomer";
        static CaculatePromiseAmount = "CaculatePromiseAmount";
        static GetReturnCodeByCusExtPhone = "GetReturnCodeByCusExtPhone";

        static UploadLstAttachmentField = "UploadLstAttachmentField";
        static UpdateLstAttachmentField = "UpdateLstAttachmentField";
        static UploadDocumentCustomer = "UploadDocumentCustomer";
        static SaveCustomerExtPhone = "SaveCustomerExtPhone";
        static SaveCustomerAddress = "SaveCustomerAddress";
        static CaculateAnnex = "CaculateAnnex";
    };

    static Features = class {
        static AddressProvince = 1204;
        static AddressDistrict = 1205;
        static AddressTown = 1206;
        static AddressStreet = 1207;
        static ComparingMASourceType = 1336;
        static DocumentType = 1313;
        static LandType = 1339;
        static smx_CollateralGroup_1 = 2004;
    };

    static RandomColor = [
        "#02c39a",
        "#fb5607",
        "#028090",
        "#3a86ff",
        "#8338ec",
        "#ff006e",
        "#e63946",
        "#8ac926",
        "#fee440",
        "#f15bb5",
        "#9a031e",
        "#5f0f40",
        "#7678ed",
        "#245501",
        "#926c15",
    ];
}
