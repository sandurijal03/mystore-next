import { useRouter } from 'next/router';
import { useRef, useEffect, useState } from 'react';
import { baseUrl } from '../../helpers/baseUrl';
import { parseCookies } from 'nookies';
import cookie2 from 'js-cookie';

const Product = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const modalRef = useRef(null);
  const cookie = parseCookies();
  const user = cookie.user ? JSON.parse(cookie.user) : '';

  useEffect(() => {
    M.Modal.init(modalRef.current);
  }, []);

  if (router.isFallback) {
    return <h3>Loading.........</h3>;
  }

  const getModal = () => {
    return (
      <div id='modal1' className='modal' ref={modalRef}>
        <div className='modal-content'>
          <h4>{product.name}</h4>
          <p>Are you sure you want to delete this?</p>
        </div>
        <div className='modal-footer'>
          <button
            className='btn waves-effect waves-light blue'
            type='submit'
            name='action'
          >
            cancel
          </button>

          <button
            className='btn waves-effect waves-light red'
            onClick={() => deleteProduct()}
          >
            yes
          </button>
        </div>
      </div>
    );
  };

  const deleteProduct = async () => {
    const res = await fetch(`${baseUrl}/api/product/${product._id}`, {
      method: 'DELETE',
    });
    await res.json();
    router.push('/');
  };

  const addToCart = async () => {
    const res = await fetch(`${baseUrl}/api/cart`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookie.token,
      },
      body: JSON.stringify({
        quantity,
        productId: product._id,
      }),
    });
    const response = await res.json();
    if (response.error) {
      M.toast({ html: error, classes: 'red' });
      cookie2.remove('user');
      cookie2.remove('token');
      router.push('/login');
    }
    M.toast({ html: response.message, classes: 'green' });
  };

  return (
    <div className='container center-align'>
      <h3>{product.name}</h3>
      <img src={product.mediaUrl} style={{ width: '30%' }} />
      <h5>RS {product.price}</h5>
      <input
        type='number'
        style={{ width: '400px', margin: '10px' }}
        min='1'
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        placeholder='Quantity'
      />

      {user ? (
        <button
          className='btn waves-effect waves-light'
          onClick={() => addToCart()}
        >
          Add
          <i className='material-icons right'>add</i>
        </button>
      ) : (
        <button
          className='btn waves-effect waves-light'
          onClick={() => router.push('/signin')}
        >
          Login to add
        </button>
      )}

      <p className='left-align'>{product.description}</p>
      {user.role !== 'user' && (
        <button
          className='btn  modal-trigger waves-effect waves-light red'
          type='submit'
          name='action'
          data-target='modal1'
        >
          delete
          <i className='material-icons right'>delete</i>
        </button>
      )}

      {getModal()}
    </div>
  );
};

export const getServerSideProps = async ({ params: { id } }) => {
  const response = fetch(`http://localhost:3000/api/product/${id}`);
  const data = await response.json();
  return {
    props: {
      product: data,
    },
  };
};

// export const getStaticProps = async ({ params: { id } }) => {
//   const response = await fetch(`${baseUrl}/api/product/${id}`);
//   const data = await response.json();
//   return {
//     props: {
//       product: data,
//     },
//   };
// };

// export const getStaticPaths = () => {
//   return {
//     paths: [{ params: { id: '5fef8cbffaacaf3b638c8af9' } }],
//     fallback: true,
//   };
// };

export default Product;
