/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUpdateCount } from '../store/authSlice';

function UserUi() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const _id = useSelector((state) => state.auth.userData._id);
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newPost, setNewPost] = useState({ caption: '', postImage: null });
  const [newProduct, setNewProduct] = useState({ productName: '', productPrize: '', productDescription: '', productImage: null });
  const updateCount = useSelector(state => state.auth.updateCount);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/iframe/userPage");
    } else {
      getPost();
      seeProduct();
      getUserDetails();
    }
  }, [isLoggedIn, navigate]);

  const getPost = async () => {
    const url = `http://localhost:8000/api/v1/posts/seepost?_id=${_id}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching posts: ${response.status}`);
      }
      const result = await response.json();
      setPosts(result.data.post);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserDetails = async () => {
    const url = `http://localhost:8000/api/v1/users/getuser?_id=${_id}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Error fetching user details: ${response.status}`);
      }
      const result = await response.json();
      setUserDetails(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('caption', newPost.caption);
    formData.append('postImage', newPost.postImage);
    formData.append('owner', _id);
    try {
      const response = await fetch('http://localhost:8000/api/v1/posts/post', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Error posting: ${response.status}`);
      }
      setNewPost({ caption: '', postImage: null });
      setShowAddPostForm(false);
      dispatch(setUpdateCount());
      getPost();
    } catch (error) {
      console.error(error);
    }
  };

  const removePost = async (postId) => {
    const url = `http://localhost:8000/api/v1/posts/removepost?_id=${postId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error removing post: ${response.status}`);
      }
      getPost();
    } catch (error) {
      console.error(error);
    }
  };

  const seeProduct = async () => {
    const url = `http://localhost:8000/api/v1/vendors/products?_id=${_id}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.status}`);
      }
      const result = await response.json();
      setProducts(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('owner', _id);
    formData.append('productName', newProduct.productName);
    formData.append('productPrize', newProduct.productPrize);
    formData.append('productDescription', newProduct.productDescription);
    formData.append('productImage', newProduct.productImage);
    try {
      const response = await fetch('http://localhost:8000/api/v1/vendors/addproduct', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Error adding product: ${response.status}`);
      }
      setNewProduct({ productName: '', productPrize: '', productDescription: '', productImage: null });
      setShowAddProductForm(false);
      seeProduct();
    } catch (error) {
      console.error(error);
    }
  };

  const removeProduct = async (productId) => {
    const url = `http://localhost:8000/api/v1/vendors/removeproduct?_id=${productId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error removing product: ${response.status}`);
      }
      seeProduct();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-slate-500 min-h-screen flex flex-col p-4 items-center justify-center">
      <div className="flex flex-col bg-slate-800 rounded-lg shadow-lg flex-grow w-full max-w-4xl">
        <div className="flex-none p-6 border-b border-slate-600">
          <h1 className="text-3xl font-bold text-white mb-4">User Details</h1>
          {userDetails ? (
            <div>
              <p className="text-lg text-white"><strong>Phone Number:</strong> {userDetails.user.phnNo}</p>
            </div>
          ) : (
            <p className="text-white">Loading user details...</p>
          )}
        </div>

        {/* Add Post Button and Form */}
        <div className="p-6 bg-slate-800">
          <button
            onClick={() => setShowAddPostForm(true)}
            className="bg-blue-600 text-white py-2 px-4 rounded mb-4 hover:bg-blue-700"
          >
            Add Post
          </button>
          {showAddPostForm && (
            <form onSubmit={addPost} className="bg-slate-700 p-4 rounded-lg shadow-md mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Add New Post</h3>
              <label className="block text-white mb-2">Caption:</label>
              <input
                type="text"
                value={newPost.caption}
                onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                className="w-full p-2 mb-2 rounded"
                required
              />
              <label className="block text-white mb-2">Post Image:</label>
              <input
                type="file"
                onChange={(e) => setNewPost({ ...newPost, postImage: e.target.files[0] })}
                className="w-full p-2 mb-2 rounded"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowAddPostForm(false)}
                className="bg-red-600 text-white py-2 px-4 rounded ml-2 hover:bg-red-700"
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-b border-slate-600 bg-slate-700">
          <nav className="flex space-x-4 p-4">
            <button
              className={`py-2 px-4 text-sm font-semibold text-white ${activeTab === 'posts' ? 'bg-slate-600 rounded-lg' : 'hover:bg-slate-600 rounded-lg'}`}
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </button>
            <button
              className={`py-2 px-4 text-sm font-semibold text-white ${activeTab === 'products' ? 'bg-slate-600 rounded-lg' : 'hover:bg-slate-600 rounded-lg'}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-6">
          {activeTab === 'posts' && (
            <div>
              {posts.map((post) => (
                <div key={post._id} className="bg-slate-700 rounded-lg p-4 mb-4">
                  <p className="text-white mb-2">{post.caption}</p>
                  <img src={`http://localhost:8000/${post.postImage}`} alt="Post" className="w-full h-auto mb-2" />
                  <button
                    onClick={() => removePost(post._id)}
                    className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                  >
                    Remove Post
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <button
                onClick={() => setShowAddProductForm(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded mb-4 hover:bg-blue-700"
              >
                Add Product
              </button>
              {showAddProductForm && (
                <form onSubmit={addProduct} className="bg-slate-700 p-4 rounded-lg shadow-md mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Add New Product</h3>
                  <label className="block text-white mb-2">Product Name:</label>
                  <input
                    type="text"
                    value={newProduct.productName}
                    onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                    className="w-full p-2 mb-2 rounded"
                    required
                  />
                  <label className="block text-white mb-2">Product Prize:</label>
                  <input
                    type="text"
                    value={newProduct.productPrize}
                    onChange={(e) => setNewProduct({ ...newProduct, productPrize: e.target.value })}
                    className="w-full p-2 mb-2 rounded"
                    required
                  />
                  <label className="block text-white mb-2">Product Description:</label>
                  <textarea
                    value={newProduct.productDescription}
                    onChange={(e) => setNewProduct({ ...newProduct, productDescription: e.target.value })}
                    className="w-full p-2 mb-2 rounded"
                    required
                  />
                  <label className="block text-white mb-2">Product Image:</label>
                  <input
                    type="file"
                    onChange={(e) => setNewProduct({ ...newProduct, productImage: e.target.files[0] })}
                    className="w-full p-2 mb-2 rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddProductForm(false)}
                    className="bg-red-600 text-white py-2 px-4 rounded ml-2 hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </form>
              )}
              {products.map((product) => (
                <div key={product._id} className="bg-slate-700 rounded-lg p-4 mb-4">
                  <h3 className="text-white mb-2">{product.productName}</h3>
                  <p className="text-white mb-2">{product.productPrize}</p>
                  <p className="text-white mb-2">{product.productDescription}</p>
                  <img src={`http://localhost:8000/${product.productImage}`} alt="Product" className="w-full h-auto mb-2" />
                  <button
                    onClick={() => removeProduct(product._id)}
                    className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                  >
                    Remove Product
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserUi;
