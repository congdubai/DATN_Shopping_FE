import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import UserPage from "./pages/admin/user";
import Header from "./components/client/header.client";
import Footer from "./components/client/footer.client";
import { useEffect } from "react";
import styles from 'styles/app.module.scss';
import LayoutApp from "./components/share/layout.app";
import LoginPage from "./pages/auth/login";
import LayoutAdmin from "./components/admin/layout.admin";
import ProtectedRoute from "./components/share/protected-route.ts";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { fetchAccount } from "./redux/slice/accountSlide";
import RolePage from "./pages/admin/role";
import ProductPage from "./pages/admin/product";
import CategoryPage from "./pages/admin/category";
import ColorPage from "./pages/admin/color";
import SizePage from "./pages/admin/size";
import ProductDetailPage from "./pages/admin/productDetail";
const LayoutClient = () => {
  return (
    <div className='layout-app'>
      <Header />
      <div className={styles['content-app']}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.account.isLoading);


  useEffect(() => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;
    dispatch(fetchAccount())
  }, [])

  const router = createBrowserRouter([
    {
      path: "/admin",
      element: (<LayoutApp><LayoutAdmin /> </LayoutApp>),
      children: [
        {
          path: "user",
          element:
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
        },
        {
          path: "role",
          element:
            <ProtectedRoute>
              <RolePage />
            </ProtectedRoute>
        },
        {
          path: "product",
          element:
            <ProtectedRoute>
              <ProductPage />
            </ProtectedRoute>
        },
        {
          path: "category",
          element:
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
        },
        {
          path: "color",
          element:
            <ProtectedRoute>
              <ColorPage />
            </ProtectedRoute>
        },
        {
          path: "size",
          element:
            <ProtectedRoute>
              <SizePage />
            </ProtectedRoute>
        },
        {
          path: "productDetail",
          element:
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
        }
      ],
    },


    {
      path: "/login",
      element: <LoginPage />,
    },

  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>

  )
}
