import PropTypes from 'prop-types';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { Container } from '@mui/material';
import { XCircleIcon } from '@heroicons/react/outline';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';

const PAGE_SIZE = 3;

const prices = [
  {
    name: '₹1 to ₹50',
    value: '1-50',
  },
  {
    name: '₹51 to ₹200',
    value: '51-200',
  },
  {
    name: '₹201 to ₹1000',
    value: '201-1000',
  },
];

const ratings = [1, 2, 3, 4, 5];

Search.propTypes = {
  products: PropTypes.array,
  countProducts: PropTypes.number,
  categories: PropTypes.array,
  pages: PropTypes.number,
};

export default function Search(props) {
  const router = useRouter();

  const { query = 'all', category = 'all', price = 'all', rating = 'all', sort = 'featured', page = 1 } = router.query;

  const { products, countProducts, categories, pages } = props;

  const filterSearch = ({ page, category, sort, min, max, searchQuery, price, rating }) => {
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    // eslint-disable-next-line no-unused-expressions
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    // eslint-disable-next-line no-unused-expressions
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;

    router.push({
      pathname: router.pathname,
      query,
    });
  };
  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };
  const pageHandler = (page) => {
    filterSearch({ page });
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };

  const { state, dispatch } = useContext(Store);
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      toast.error('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };
  return (
    <Layout title="search">
      <Container>
        <div className="grid md:grid-cols-4 md:gap-5">
          <div>
            <div className="my-3">
              <h2>Categories</h2>
              <select className="w-full flex p-2 hover:bg-gray-300" value={category} onChange={categoryHandler}>
                <option value="all">All</option>
                {categories &&
                  categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-3">
              <h2>Prices</h2>
              <select className="w-full p-2 hover:bg-gray-300" value={price} onChange={priceHandler}>
                <option value="all">All</option>
                {prices &&
                  prices.map((price) => (
                    <option key={price.value} value={price.value}>
                      {price.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-3">
              <h2>Ratings</h2>
              <select className="w-full p-2 hover:bg-gray-300" value={rating} onChange={ratingHandler}>
                <option value="all">All</option>
                {ratings &&
                  ratings.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} star{rating > 1 && 's'} & up
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="mb-2 flex items-center justify-between border-b-2 pb-2">
              <div className="flex items-center">
                {products.length === 0 ? 'No' : countProducts} Results
                {query !== 'all' && query !== '' && ` : ${query}`}
                {category !== 'all' && ` : ${category}`}
                {price !== 'all' && ` : Price ${price}`}
                {rating !== 'all' && ` : Rating ${rating} & up`}
                &nbsp;
                {(query !== 'all' && query !== '') || category !== 'all' || rating !== 'all' || price !== 'all' ? (
                  <button type="button" onClick={() => router.push('/search')}>
                    <XCircleIcon className="h-5 w-5 ml-4 hover:text-rose-300" />
                  </button>
                ) : null}
              </div>
              <div>
                <select className="w-full p-2 hover:bg-gray-300" value={sort} onChange={sortHandler}>
                  <option value="featured">Featured</option>
                  <option value="lowest">Price: Low to High</option>
                  <option value="highest">Price: High to Low</option>
                  <option value="toprated">Customer Reviews</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3  ">
                {products.map((product) => (
                  <ProductItem key={product._id} product={product} addToCartHandler={addToCartHandler} />
                ))}
              </div>
              <ul className="flex">
                {products.length > 0 &&
                  [...Array(pages).keys()].map((pageNumber) => (
                    <li key={pageNumber}>
                      <button
                        type="button"
                        className={`default-button m-2 ${page === pageNumber + 1 ? 'font-bold' : ''} `}
                        onClick={() => pageHandler(pageNumber + 1)}
                      >
                        {pageNumber + 1}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || '';
  const price = query.price || '';
  const rating = query.rating || '';
  const sort = query.sort || '';
  const searchQuery = query.query || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};
  const categoryFilter = category && category !== 'all' ? { category } : {};
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};
  // 10-50
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};
  const order =
    sort === 'featured'
      ? { isFeatured: -1 }
      : sort === 'lowest'
      ? { price: 1 }
      : sort === 'highest'
      ? { price: -1 }
      : sort === 'toprated'
      ? { rating: -1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  await db.connect();
  const categories = await Product.find().distinct('category');
  const productDocs = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    '-reviews'
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  });

  await db.disconnect();
  const products = productDocs.map(db.convertDocToObj);

  return {
    props: {
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
    },
  };
}
