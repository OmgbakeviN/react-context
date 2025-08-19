import React, { Fragment, useState, useContext } from 'react';
import { Btn, H4, P, Image } from '../../../AbstractElements';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {  toast } from "react-toastify";
import CustomizerContext from "../../../_helper/Customizer"
import { loginUser } from '../../../reduxtool/Auth';
import { useDispatch } from 'react-redux';
import { PermissionContext } from 'react-permission-role';


import logoWhite from '../../../assets/images/logo/logo.png';
import logoDark from '../../../assets/images/logo/logo_dark.png';


const LoginForm = ({ logoClassMain }) => {
  const [togglePassword, setTogglePassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(PermissionContext);



  const { layoutURL } = useContext(CustomizerContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginAuth = async (e) => {
    e.preventDefault();
    let userCredentials = { username, password };

    try {
      const user = await dispatch(loginUser(userCredentials));

      if (loginUser.fulfilled.match(user)) {
        toast.success(`Welcome back ${user.payload.username}!`);
        setUser({
          id: user.payload.id, // ou autre identifiant
          roles: [user.payload.role], // si ton user a un seul rôle
          permissions: user.payload.permissions || [] // si tu as des permissions, sinon []
        });
        // navigate(`${process.env.PUBLIC_URL}/dashboard/default/${layoutURL}`);
        let target = `0`;
        if (user.payload.role === 'REGIONAL') {
          target = `${process.env.PUBLIC_URL}/Pages/FeicomPages/HomePage/Page1/${layoutURL}`;
        } else if (user.payload.role === 'NATIONAL') {
          target = `${process.env.PUBLIC_URL}/Pages/FeicomPages/HomePage/Page1/${layoutURL}`;
        }

        navigate(target, {replace: true});

      } else if (loginUser.rejected.match(user)) {
        const errorMessage = typeof user.payload === 'string'
          ? user.payload
          : user.error?.message || 'Login failed. Please try again.';
        toast.error(errorMessage);
      }
    } catch (err) {
      toast.error('error in connexion');
    }
  };


  return (
    <Fragment>
      <div className='login-card'>
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
              <Link className={`logo ${logoClassMain ? logoClassMain : ''}`} to={process.env.PUBLIC_URL}>
                <Image attrImage={{ className: 'img-fluid for-light', src: logoWhite, alt: 'looginpage', style: { maxWidth: '120px', height: 'auto' } }} />
                <Image attrImage={{ className: 'img-fluid for-dark', src: logoDark, alt: 'looginpage', style: { maxWidth: '120px', height: 'auto' } }} />
              </Link>
            </div>

            <div className='login-main'>
              <Form className='theme-form login-form' onSubmit={loginAuth}>
                <H4>Login in to account</H4>
                <P>Enter your username & password to login</P>
                <FormGroup>
                  <Label className='col-form-label m-0'>Username <i className="icofont icofont-businessman"></i></Label>
                  <Input className='form-control' type='text' placeholder='User_name' onChange={(e) => setUsername(e.target.value)} value={username}/>
                </FormGroup>
                <FormGroup className='position-relative'>
                  <Label className='col-form-label m-0'>Password <i className="icofont icofont-ui-fire-wall"></i></Label>
                  <div className='position-relative'>
                    <Input className='form-control' type={togglePassword ? 'text' : 'password'} name='login[password]' required placeholder='*********' onChange={(e) => setPassword(e.target.value)} value={password}/>
                    <div className='show-hide' onClick={() => setTogglePassword(!togglePassword)}>
                      <span className={togglePassword ? '' : 'show'}></span>
                    </div>
                  </div>
                </FormGroup>
                <FormGroup>
                  <Btn attrBtn={{ className: 'd-block btn-pill btn-air-primary w-100 mt-2 btn-primary-gradien', color: 'primary', type: 'submit' }}>Sign in</Btn>
                </FormGroup>
              </Form>
            </div>
          </div>
        </div>
    </Fragment>
  );
};

export default LoginForm;
