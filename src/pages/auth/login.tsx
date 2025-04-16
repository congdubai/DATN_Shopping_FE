import { callAddToCart, callLogin } from '@/config/api';
import { useAppSelector } from '@/redux/hooks';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import { Button, Divider, Form, Input, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from 'styles/auth.module.scss';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const callback = params?.get("callback");
    const redirectPath = useAppSelector(state => state.account.redirectPath);


    const getCartFromLocalStorage = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        return cart;
    };

    const syncCartWithServer = async () => {
        const cart = getCartFromLocalStorage();

        try {
            for (const item of cart) {
                const { productId, colorId, sizeId, quantity } = item;
                await callAddToCart(productId, sizeId, colorId, quantity);
            }

            localStorage.removeItem('cart');
            notification.success({
                message: 'Đồng bộ giỏ hàng',
                description: 'Giỏ hàng đã được đồng bộ lên server!',
            });
        } catch (err) {
            console.error('Lỗi khi đồng bộ giỏ hàng:', err);
            notification.error({
                message: 'Lỗi đồng bộ',
                description: 'Có lỗi xảy ra khi đồng bộ giỏ hàng!',
            });
            throw err;
        }

    };


    const onFinish = async (values: any) => {
        const { username, password } = values;
        setIsSubmit(true);

        const res = await callLogin(username, password);
        setIsSubmit(false);

        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(setUserLoginInfo(res.data.user));
            await syncCartWithServer();
            const isAdmin = res.data.user?.role?.name === 'ADMIN';

            window.location.href = redirectPath || (isAdmin ? '/admin/user' : '/');
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            });
        }


    };


    return (
        <div className={styles["login-page"]}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.wrapper}>
                        <div className={styles.heading}>
                            <h2 className={`${styles.text} ${styles["text-large"]}`}>Đăng Nhập</h2>
                            <Divider />
                        </div>
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off">
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="username"
                                rules={[{ required: true, message: 'Email không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                            // wrapperCol={{ offset: 6, span: 16 }}
                            >
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal">Chưa có tài khoản ?
                                <span>
                                    <Link to='/register' > Đăng Ký </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}
export default LoginPage;