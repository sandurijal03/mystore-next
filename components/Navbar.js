import Link from 'next/link';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import cookie from 'js-cookie';

const NavBar = () => {
  const router = useRouter();
  const cookieuser = parseCookies();
  const user = cookieuser.user ? JSON.parse(cookieuser.user) : '';

  const isActive = (route) => {
    if (route === router.pathname) {
      return 'active';
    } else '';
  };

  return (
    <nav>
      <div className='nav-wrapper #3949ab indigo darken-3'>
        <Link href='/' className='brand-logo'>
          SANDY
        </Link>
        <ul id='nav-mobile' className='right hide-on-med-and-down'>
          <li className={isActive('/cart')}>
            <Link href='/cart'>Cart</Link>
          </li>

          {(user.role === 'admin' || user.role === 'root') && (
            <li className={isActive('/create')}>
              <Link href='/create'>Create</Link>
            </li>
          )}

          {user ? (
            <>
              <li className={isActive('/account')}>
                <Link href='/account'>Account</Link>
              </li>
              <li className={isActive('/signin')}>
                <button
                  className='btn'
                  onClick={() => {
                    cookie.remove('token');
                    cookie.remove('user');
                    router.push('/signin');
                  }}
                >
                  logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className={isActive('/signin')}>
                <Link href='/signin'>Signin</Link>
              </li>
              <li className={isActive('/signup')}>
                <Link href='/signup'>Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
