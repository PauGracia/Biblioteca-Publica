// SimpleGoogleLogin.jsx
import { GoogleLogin } from '@react-oauth/google';

const SimpleGoogleLogin = ({ onGoogleToken }) => {
  return (
    <div style={{ margin: '20px 0', textAlign: 'center' }}>
      <GoogleLogin
        onSuccess={credentialResponse => {
          if (credentialResponse?.credential) {
            onGoogleToken(credentialResponse.credential);
          }
        }}
        onError={() => console.error('Google Login Failed')}
        useOneTap={false}
        ux_mode="popup"
        theme="filled_blue"
        size="large"
        text="signin_with"
        shape="rectangular"
        width="300"
        logo_alignment="left"
      />
    </div>
  );
};

export default SimpleGoogleLogin;