import { FooterToolbar, ModalForm, ProCard, ProFormSwitch, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { callCreateRole, callUpdateRole } from "@/config/api";
import { CheckSquareOutlined } from "@ant-design/icons";
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetSingleRole } from "@/redux/slice/roleSlide";
import { IRole } from "@/types/backend";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reloadTable: () => void;
    dataInit?: IRole | null;
    setDataInit: (v: any) => void;
}

const ModalRole = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const submitRole = async (valuesForm: any) => {
        const { description, active, name, permissions } = valuesForm;
        const checkedPermissions = [];

        if (permissions) {
            for (const key in permissions) {
                if (key.match(/^[1-9][0-9]*$/) && permissions[key] === true) {
                    checkedPermissions.push({ id: key });
                }
            }
        }

        if (dataInit?.id) {
            //update
            const role = {
                name, description, active, permissions: checkedPermissions
            }
            const res = await callUpdateRole(role, dataInit.id);
            if (res.data) {
                message.success("Cập nhật role thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const role = {
                name, description, active, permissions: checkedPermissions
            }
            const res = await callCreateRole(role);
            if (res.data) {
                message.success("Thêm mới role thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setOpenModal(false);
        setDataInit(null);
    }

    return (
        <>
            <ModalForm
                title={<>{dataInit?.id ? "Cập nhật Role" : "Tạo mới Role"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,

                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitRole}
                submitter={{
                    render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                    submitButtonProps: {
                        icon: <CheckSquareOutlined />
                    },
                    searchConfig: {
                        resetText: "Hủy",
                        submitText: <>{dataInit?.id ? "Cập nhật" : "Tạo mới"}</>,
                    }
                }}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Tên Role"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                            placeholder="Nhập name"
                        />
                    </Col>
                    <Col span={24}>
                        <ProFormTextArea
                            label="Miêu tả"
                            name="description"
                            placeholder="Nhập miêu tả role"
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalRole;
