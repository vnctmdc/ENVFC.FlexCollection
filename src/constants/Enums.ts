enum FunctionCodes {
    VIEW = "VIEW",
    ADD = "ADD",
    EDIT = "EDIT",
    DELETE = "DELETE",
    DISPLAY = "DISPLAY",

    ApproveRejectValuation = "ApproveRejectValuation",

    RequestApproval = "RequestApprove", // Yêu cầu phê duyệt
    Approve = "APPROVE", // Phê duyệt
    Reject = "Reject", // Phê duyệt
    Cancel = "Cancel",
    ApproveByBatch = "ApproveByBatch",
    RequestApproveByBatch = "RequestApproveByBatch",
    ReceiveApprove = "ReceiveApprove",
    ApproveSeftValuation = "ApproveSeftValuation",
    RejectValuation = "RejectValuation",
}

enum RenderPressAgencyDetailType {
    CoCauToChuc = 1,
    LichSuGapMat = 2,
    LichSuThayDoiNhanSu = 3,
    QuanHeGiuaCacCoQuanBT = 4,
    AnhKhac = 5,
    LichSuQuanHe = 6,
}

enum RenderAgencyHRContentType {
    NhanThan = 1,
    LichNhacNho = 2,
}

enum Attitude {
    TichCuc = 1,
    TieuCuc = 2,
    TrungLap = 3,
}

enum NewsStatus {
    MoiTao = 1,
    HoanThanh = 2,
}

// Giới tính
enum Gender {
    Female = 0, // Nữ
    Male = 1, // Nam
    Other = 2, // Khác
}

enum NegativeNews {
    ChuaPhatSinh = 1,
    DaPhatSinh = 2,
}

enum NewStatus {
    MoiTao = 1,
    HoanThanh = 2,
}

enum Classification {
    QuanTrong = 1,
    TrungBinh = 2,
    BinhThuong = 3,
}

enum PositiveType {
    TruyenHinh = 1,
    BaoMang = 2,
    BaoGiay = 3,
    MangXaHoi = 4,
    DienDan = 5,
}

enum NotificationType {
    SinhNhat = 1,
    KyNiem = 2,
    ThanhLap = 3,
    TruyenThong = 4,
}

enum CommentRefType {
    NegativeNews = 1,
    PressAgency = 2,
    News = 3,
    Notification = 4,
    PressAgencyHR = 5,
    NegativeNewsDetail = 6,
}

enum Rate {
    BinhThuong = 1,
    QuanTrong = 2,
}

enum RelationshipWithMB {
    NongAm = 1,
    ThietLap = 2,
    HieuBiet = 3,
    ThanThiet = 4,
}

enum KyHuaTra {
    k1 = 1,
    k2 = 2,
    k3 = 3,
    k4 = 4,
}

enum KetQuaLienHe {
    HuaThanhToan = 67
}

enum PromisePaid {
    ThatHua = 1,
    TraDu = 2,
}

enum AttachmentRefType {
    ActionField = 2,
    CustomerInfo = 3,
}

enum SourceType {
    Core = 1,
    FlexCollection = 2
}

enum Collection_ActionSchedule {
    Open = 1,
    Implement = 2
}

export {
    Collection_ActionSchedule,
    SourceType,
    KetQuaLienHe,
    Rate,
    CommentRefType,
    Classification,
    NewStatus,
    FunctionCodes,
    Gender,
    Attitude,
    NewsStatus,
    NegativeNews,
    RenderPressAgencyDetailType,
    RenderAgencyHRContentType,
    PositiveType,
    NotificationType,
    RelationshipWithMB,
    AttachmentRefType,
    KyHuaTra,
    PromisePaid,
};
