import { baseUrl } from '../helpers/baseUrl';
import { parseCookies } from 'nookies';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';

const Cart = ({ error, products }) => {
  const { token } = parseCookies();
  const router = useRouter();
  const [cartProducts, setCartProducts] = useState(products);
  let price = 0;

  if (!token) {
    return (
      <div className='center-align'>
        <h3>please login to view your card</h3>
        <Link href='/signin'>
          <button className='btn'>login</button>
        </Link>
      </div>
    );
  }

  if (error) {
    M.toast({ html: error, classes: 'red' });
    cookie.remove('user');
    cookie.remove('token');
    router.push('/signin');
  }

  const handleRemove = async (pid) => {
    const res = await fetch(`${baseUrl}/api/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        productId: pid,
      }),
    });
    const response = await res.json();
    setCartProducts(response);
  };

  const CartItems = () => {
    return (
      <>
        {cartProducts.map((item) => {
          price = price + item.quantity * item.product.price;

          return (
            <div style={{ display: 'flex', margin: '20px' }} key={item._id}>
              <img src={item.product.mediaUrl} style={{ width: '30%' }} />
              <div style={{ marginLeft: '20px' }}>
                <h6>{item.product.name}</h6>
                <h6>
                  {item.quantity} * {item.product.price}
                </h6>
                <button
                  className='btn'
                  onClick={() => {
                    handleRemove(item.product._id);
                  }}
                >
                  remove
                </button>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const handleCheckout = async (paymentInfo) => {
    console.log(paymentInfo);
    const res = await fetch(`${baseUrl}/api/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        paymentInfo,
      }),
    });
    const response = await res.json();
    // M.toast({ html: response.message, classes: 'green ' });
    router.push('/');
  };

  const TotalPrice = () => {
    return (
      <div
        className='container'
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        {products.length !== 0 && (
          <StripeCheckout
            name='my store'
            amount={price * 100}
            currency='NPR'
            shippingAddress={true}
            billingAddress={true}
            zipCode={true}
            image={products.length > 0 ? products[0].product.mediaUrl : ''}
            stripeKey='pk_test_51HuwnFBGuDDRye9YXX8WOejln9TbIwm2lTfDmyToK5iDrwvRY18VGMQq7mv4F3vNWG1AAg3sLrKTodgmukWmWPpI00BlrJnKWu'
            token={(paymentInfo) => handleCheckout(paymentInfo)}
          >
            <h5>total Rs ${price}</h5>
            <button className='btn'>Checkout</button>
          </StripeCheckout>
        )}
      </div>
    );
  };

  return (
    <div className='container'>
      <CartItems />
      <TotalPrice />
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const { token } = parseCookies(ctx);
  if (!token) {
    return {
      props: { products: [] },
    };
  }
  const res = await fetch(`${baseUrl}/api/cart`, {
    headers: {
      Authorization: token,
    },
  });
  const products = await res.json();
  if (products.error) {
    return {
      props: { error: products.error },
    };
  }

  return {
    props: { products },
  };
}

export default Cart;
