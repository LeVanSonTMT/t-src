import InputUploadFile from "components/InputUploadFile";
import Strings from "constants/strings";
import { DashboardLayout } from "layouts";
import { useState } from "react";
import ExcelJS from 'exceljs';
import { toUnicode } from 'vietnamese-conversion';
import Helpers from "commons/helpers";


const DashboardScreen = () => {


    const [value, setValue] = useState<any>();

    const handleFileUpload = async (file: any) => {
        const reader = new FileReader();

        reader.onload = async (evt) => {
            const data: any[] = [];

            const buffer: any = evt.target.result;
            // Khởi tạo một workbook mới
            const workbook = new ExcelJS.Workbook();
            // Load dữ liệu từ buffer.
            await workbook.xlsx.load(buffer);
            // Lấy worksheet đầu tiên.
            const worksheet = workbook.worksheets[0];
            // Lặp qua các ô trong hàng.
            worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                if (
                    rowNumber === 1 ||
                    rowNumber === 2 ||
                    rowNumber === 3 ||
                    rowNumber === 5 ||
                    rowNumber === 6
                ) {
                } else {
                    const rowData: any[] = [];
                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        // Lấy giá trị của ô.
                        if (Helpers.isNumber(cell.value)) {
                            rowData.push(cell.value);
                        } else {
                            const newStr = cell.value?.toString().trim();
                            const fromTCVN3 = toUnicode(newStr, 'tcvn3');
                            rowData.push(fromTCVN3);
                        };
                    });
                    data.push(rowData);
                };
            });

            console.log(data);
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <DashboardLayout
            isPermission
            title={Strings.COMMON.HOME}
            route={[{ title: Strings.COMMON.HOME, route: "" }]}
        >
            <>{"Dashboard Screen"}</>

            <InputUploadFile
                label="file"
                placeholder="Chọn file"
                onChangeData={(data) => {
                    handleFileUpload(data.file)
                }}
            />

        </DashboardLayout>
    );
};

export default DashboardScreen;