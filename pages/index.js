import Link from 'next/link';
import { baseUrl } from '../helpers/baseUrl';

const Home = ({ products }) => {
  const ProductList = products.map((product) => (
    <div className='card pcard' key={product._id}>
      <div className='card-image'>
        <img src={product.mediaUrl} />
        <span className='card-title'>{product.name}</span>
      </div>
      <div className='card-content'>
        <p>RS {product.price}</p>
      </div>
      <div className='card-action'>
        <Link href={`/product/[id]`} as={`/product/${product._id}`}>
          View Product
        </Link>
      </div>
    </div>
  ));
  return <div className='rootcard'>{ProductList}</div>;
};

// export const getStaticProps = async () => {
//   const res = await fetch(`${baseUrl}/api/products`);
//   const data = await res.json();
//   return {
//     props: {
//       products: data,
//     },
//   };
// };

export const getServerSideProps = async () => {
  const res = await fetch(`${baseUrl}/api/products`);
  const data = await res.json();
  return {
    props: {
      products: data,
    },
  };
};

export default Home;
