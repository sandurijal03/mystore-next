import { parseCookies } from 'nookies';
import { useEffect, useRef } from 'react';
import { baseUrl } from '../helpers/baseUrl';
import UserRoles from '../components/UserRoles';

const Account = ({ orders }) => {
  const orderCard = useRef(null);
  const cookie = parseCookies();
  const user = cookie.user ? JSON.parse(cookie.user) : '';

  useEffect(() => {
    M.Collapsible.init(orderCard.current);
  }, []);

  const OrderHistory = () => {
    return (
      <ul className='collapsible' ref={orderCard}>
        {orders.map((item) => {
          return (
            <li key={item._id}>
              <div className='collapsible-header'>
                <i className='material-icons'>folder</i>
                {item.createdAt}
              </div>
              <div className='collapsible-body'>
                <h4>Total: Rs {item.total}</h4>
                {item.products.map((productItem) => {
                  return (
                    <h5 key={productItem._id}>
                      {productItem.product.name} * {productItem.quantity}
                    </h5>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className='container'>
      <div
        className='center-align white-text'
        style={{
          backgroundColor: '#1565c0',
          padding: '3px',
          marginTop: '10px',
        }}
      >
        <h4>{user.name}</h4>
        <h4>{user.email}</h4>
      </div>
      <h4>Order History</h4>
      {orders.length === 0 ? (
        <div className='container'>
          <h5>You have no any orders made</h5>
        </div>
      ) : (
        <OrderHistory />
      )}
      {user.role === 'root' && <UserRoles />}
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const { token } = parseCookies(ctx);
  if (!token) {
    const { res } = ctx;
    res.writeHead(302, { location: '/signin' });
    res.end();
  }

  const res = await fetch(`${baseUrl}/api/orders`, {
    headers: {
      Authorization: token,
    },
  });
  const response = await res.json();

  return {
    props: { orders: response },
  };
}

export default Account;
