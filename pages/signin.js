import { useState } from 'react';
import Link from 'next/link';
import { baseUrl } from '../helpers/baseUrl';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const userLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${baseUrl}/api/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const response = await res.json();
    if (response.error) {
      M.toast({ html: response.error, classes: 'red' });
    } else {
      cookie.set('token', response.token);
      cookie.set('user', response.user);
      router.push('/account');
    }
  };

  return (
    <div className='container card authcard center-align'>
      <h3>Signin</h3>
      <form onSubmit={(e) => userLogin(e)}>
        <input
          type='email'
          placeholder='enter your email'
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='enter your password'
          name='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className='btn waves-effect waves-light'
          type='submit'
          style={{ backgroundColor: '#3949ab' }}
        >
          signin
        </button>
        <Link href='/signup'>
          <h5 style={{ cursor: 'pointer' }}>DOnt have account?</h5>
        </Link>
      </form>
    </div>
  );
};

export default Signin;
