import { useState } from 'react';
import { baseUrl } from '../helpers/baseUrl';
import { parseCookies } from 'nookies';

const create = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [media, setMedia] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const mediaUrl = await imageUpload();
      const res = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price, mediaUrl, description }),
      });
      const response = await res.json();
      if (response.error) {
        M.toast({ html: response.error, classes: 'red' });
      } else {
        M.toast({ html: 'product-created', classes: 'green' });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const imageUpload = async () => {
    const data = new FormData();
    data.append('file', media);
    data.append('upload_preset', 'ecommerce-next');
    data.append('cloud_name', 'instag-clone');
    const res = await fetch(
      ' https://api.cloudinary.com/v1_1/instag-clone/image/upload',
      {
        method: 'POST',
        body: data,
      },
    );
    const response = await res.json();
    return response.url;
  };

  return (
    <form className='container' onSubmit={(e) => handleSubmit(e)}>
      <input
        type='text'
        name='name'
        placeholder='enter product name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type='text'
        name='price'
        placeholder='enter product price'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <div className='file-field input-field'>
        <div className='btn' style={{ backgroundColor: '#3949ab' }}>
          <span>Image Upload</span>
          <input
            type='file'
            accept='image/*'
            onChange={(e) => setMedia(e.target.files[0])}
          />
        </div>
        <img
          className='responsive-img'
          src={media ? URL.createObjectURL(media) : ''}
        />
        <div className='file-path-wrapper'>
          <input className='file-path validate' type='text' />
        </div>
      </div>

      <textarea
        className='materialize-textarea'
        type='text'
        name='description'
        placeholder='enter product description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        className='btn waves-effect waves-light'
        type='submit'
        style={{ backgroundColor: '#3949ab' }}
      >
        create
        <i className='material-icons right'>send</i>
      </button>
    </form>
  );
};

export async function getServerSideprops(ctx) {
  const cookie = parseCookies(ctx);
  const user = cookie.user ? JSON.parse(cookie.user) : '';
  if (user.role !== 'admin') {
    const { res } = ctx;
    res.writeHead(302, { location: '/' });
    res.end();
  }
  return {
    props: {},
  };
}

export default create;
