import Link from 'next/link';
import React, { useState } from 'react';
import { baseUrl } from '../helpers/baseUrl';
import { useRouter } from 'next/router';

const signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const userSignup = async (e) => {
    e.preventDefault();
    const res = await fetch(`${baseUrl}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const response = await res.json();
    if (response.error) {
      M.toast({ html: response.error, classes: 'red' });
    } else {
      M.toast({ html: response.message, classes: 'green' });
      router.push('/signin');
    }
  };

  return (
    <div className='container card authcard center-align'>
      <h3>Signup</h3>
      <form onSubmit={(e) => userSignup(e)}>
        <input
          type='text'
          placeholder='enter your name'
          name='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          signup
        </button>
        <Link href='/signin'>
          <h5 style={{ cursor: 'pointer' }}>Already have account?</h5>
        </Link>
      </form>
    </div>
  );
};

export default signup;
