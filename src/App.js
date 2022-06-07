import { useContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { UserContext } from './context/userContext';

import Auth from './pages/Auth';
import Product from './pages/Product';
import Detail from './pages/Detail';
import Complain from './pages/Complain';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import ComplainAdmin from './pages/ComplainAdmin';
import Category from './pages/Category';
import ProductAdmin from './pages/ProductAdmin';
import UpdateCategory from './pages/UpdateCategory';
import AddCategory from './pages/AddCategory';
import AddProduct from './pages/AddProduct';
import UpdateProduct from './pages/UpdateProduct';

import { API, setAuthToken } from './config/api'

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  console.clear();
  console.log(state);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    if (state.isLogin === false) {
      navigate('/auth');
    } else {
      if (state.user.status === 'admin') {
        navigate('/product-admin');
      } else if (state.user.status === 'customer') {
        navigate('/');
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth');
      if (response.status === 404) {
        return dispatch({
          type: 'AUTH_ERROR',
        });
      }
      let payload = response.data.data.user;
      payload.token = localStorage.token;
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.token) {
      checkUser();
    }
  }, []);
  
  return (
    <Routes>
      <Route exact path="/" element={<Product />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/product/:id" element={<Detail />} />
      <Route path="/complain" element={<Complain />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/complain-admin" element={<ComplainAdmin />} />
      <Route path="/category" element={<Category />} />
      <Route path="/update-category/:id" element={<UpdateCategory />} />
      <Route path="/add-category" element={<AddCategory />} />
      <Route path="/product-admin" element={<ProductAdmin />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/update-product/:id" element={<UpdateProduct />} />
    </Routes>
  );
}

export default App;
