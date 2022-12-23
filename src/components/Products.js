

// eslint-disable-next-line
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  // eslint-disable-next-line
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
// eslint-disable-next-line
import axios from "axios";
// eslint-disable-next-line
import { useSnackbar } from "notistack";
// eslint-disable-next-line
import React, { useEffect, useState } from "react";
// eslint-disable-next-line
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart from "./Cart.js"
import { generateCartItemsFrom } from "./Cart.js";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState(0);
  const [debounceTime, setDebounceTime] = useState(0);
  const [search, setSearch] = useState(0);
  const [cartItemIdAndQty, setCartItemIdAndQty] = useState([]);
  const [cartProductDetail, setCartProductDetail] = useState([]);
  const [currentItem, setCurrentItem] = useState([]);
  const token = localStorage.getItem("token");
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  // eslint-disable-next-line
  const performAPICall = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };



  useEffect(() => {
    performAPICall();
    fetchCart(window.localStorage.getItem('token'));
  }, []);
  
  const handleSearch = (e) => {
    setSearch(e.target.value);
    debounceSearch(e, 500);
  };

  
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */

  const performSearch = async (text) => {
    try {
      const searchData = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setStatus(0);
      setProducts(searchData.data);
    } catch (e) {
      setLoading(false);
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }
      if (e.response.status === 404) {
        setStatus(404);
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  // eslint-disable-next-line

  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTime) {
      clearTimeout(debounceTime);
    }
    const debounceCall = setTimeout(() => {
      performSearch(event.target.value);
    }, debounceTimeout);
    setDebounceTime(debounceCall);
  };




  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */



  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let cartData = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
     setCartItemIdAndQty(cartData.data);

    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };



 


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for(let i = 0; i < items.length; i++) {
      if (productId === items[i].productId) {
        return true;
      }
    }
    return false;
  };


  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * 
   * }
   */

  


  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if(!token) {
      enqueueSnackbar(
        "Login to add an item to the Cart",
        {
          variant: "error",
        });
    } 
 
    if(!isItemInCart(items, productId)) {
      try{
        let res = await axios.post(`${config.endpoint}/cart`, {productId, qty},{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCartItemIdAndQty(res.data);
      } catch(e) {
        if (e.response && e.response.status === 404) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
            {
              variant: "error",
            }
          );
        }
    }
    } else {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "alert",
        });
    }
    
  };

  return (
    <div>
      <Header>
      <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => handleSearch(e)}
        />
      </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => handleSearch(e)}
      />
      <Grid container>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
        <Grid>
        {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "coloumn",
          }}
        >
          <CircularProgress />
          <p>Loading Products...</p>
        </Box>
      ) : status === 404 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "coloumn",
          }}
        >
          <SentimentDissatisfied />
          <p>No products found</p>
        </Box>
      ) : (
        <Grid container className="product-container" spacing={2}>
          {products.map((item) => (
            <Grid item xs={12} md={3} sm={6} key={item._id}>
              <ProductCard product={item} handleAddToCart={async () => await addToCart(window.localStorage.getItem('token'), cartItemIdAndQty, item, item._id, 1, {preventDuplicate: false})} />
            </Grid>
          ))}
        </Grid>
      )}
      </Grid>
        {
          token ? (
            <Grid sx={{my:2, p:1}} item xs={12} md={3} bgcolor="#E9FSE1">
              <Cart 
              products={products}
              items={generateCartItemsFrom(cartItemIdAndQty, products)}
              handleQuantity={addToCart}
              />
            </Grid>
          ) : null
        }
    </Grid>

      <Footer />
    </div>
  );
};

export default Products;
