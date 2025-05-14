import { createBrowserRouter, Outlet, RouterProvider, useLocation } from "react-router-dom"
import UserPage from "./pages/admin/user";
import Header from "./components/client/header.client";
import Footer from "./components/client/footer.client";
import { useEffect, useRef, useState } from "react";
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
import NotFound from "./components/share/not.found";
import HomePage from "./pages/client/home";
import CartPage from "./pages/client/cart";
import CheckOut from "./pages/client/checkout";
import CheckOutPage from "./pages/client/checkout";
import DashboardPage from "./pages/admin/dashboard";
import { HelmetProvider } from "react-helmet-async";
import CreateOrder from "./components/admin/createOrder/CreateOrder";
import CreateOrderPage from "./components/admin/createOrder/CreateOrder";
import HistoryPage from "./pages/client/history";
import ProductDetailClientPage from "./pages/client/productDetail";
import CategoryHomePage from "./pages/client/CategoryHome";
import CategoryGenderPage from "./pages/client/categoryGender";
import OrderPage from "./pages/admin/order";
import ChatBoxPage from "./pages/client/chatBox";
import ChatWidget from "./components/client/chat/ChatIcon";
import HomeSearchPage from "./pages/client/homeSearch";

const LayoutClient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef && rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' });
    }

  }, [location]);

  return (
    <div className='layout-app' ref={rootRef}>
      <Header />
      <div className={styles['content-app']}>
        <Outlet />
        <ChatWidget />
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
      path: "/",
      element: (<LayoutApp><LayoutClient /></LayoutApp>),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "cart",
          element:
            <CartPage />
        },
        {
          path: "search",
          element:
            <HomeSearchPage />
        },
        {
          path: "checkout",
          element:
            <CheckOutPage />
        },
        {
          path: "order-history",
          element:
            <HistoryPage />
        },
        {
          path: "product-detail/:productId",
          element:
            <ProductDetailClientPage />
        },
        {
          path: "/category/:categoryId",
          element: <CategoryHomePage />
        },
        {
          path: "/products/:gender",
          element: <CategoryGenderPage />
        }
      ],
    },
    {
      path: "/admin",
      element: (<LayoutApp><LayoutAdmin /> </LayoutApp>),
      errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
        },
        {
          path: "user",
          element:
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
        },
        {
          path: "chat",
          element:
            <ProtectedRoute>
              <ChatBoxPage />
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
        }, {
          path: "order",
          element:
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
        },
        {
          path: "createOrder",
          element:
            <ProtectedRoute>
              <CreateOrderPage />
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
