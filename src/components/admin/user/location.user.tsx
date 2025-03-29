import { Cascader } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

interface AddressSelectorProps {
    onChange: (value: string[]) => void;
}

const AddressSelector: React.FC<AddressSelectorProps & { value?: string[] }> = ({ onChange, value }) => {
    const [options, setOptions] = useState<any[]>([]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const { data } = await axios.get("https://provinces.open-api.vn/api/?depth=3");
                const formattedData = data.map((province: any) => ({
                    label: province.name,
                    value: province.name.toString(),
                    children: province.districts.map((district: any) => ({
                        label: district.name,
                        value: district.name.toString(),
                        children: district.wards.map((ward: any) => ({
                            label: ward.name,
                            value: ward.name.toString(),
                        })),
                    })),
                }));
                setOptions(formattedData);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách địa chỉ:", error);
            }
        };

        fetchProvinces();
    }, []);

    return (
        <Cascader
            options={options}
            placeholder="Chọn địa chỉ"
            onChange={(val) => onChange(val as string[])}
            changeOnSelect
            style={{ width: "100%" }}
            value={value || []}
        />
    );
};



export default AddressSelector;
