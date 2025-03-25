import { useEffect, useState } from 'react';
import { Result } from "antd";
import { useAppSelector } from '@/redux/hooks';

interface IProps {
    hideChildren?: boolean;
    children: React.ReactNode;
    requiredRole: 'admin' | 'user';
}

const Access = ({ hideChildren = false, requiredRole, children }: IProps) => {
    const [allow, setAllow] = useState<boolean>(false);

    const role = useAppSelector(state => state.account.user.role.name)?.toLowerCase();

    useEffect(() => {
        if (role === requiredRole.toLowerCase()) {
            setAllow(true);
        } else {
            setAllow(false);
        }
    }, [role, requiredRole]);

    return (
        <>
            {allow || import.meta.env.VITE_ACL_ENABLE === 'false' ? (
                <>{children}</>
            ) : (
                !hideChildren && (
                    <Result
                        status="403"
                        title="Truy cập bị từ chối"
                        subTitle="Xin lỗi, bạn không có quyền truy cập thông tin này"
                    />
                )
            )}
        </>
    );
};

export default Access;
