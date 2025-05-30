import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router';

const Login = () => {
  const { setUser } = useAuth() as any;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      localStorage.setItem('authToken', token);
      navigate('/');
    }
  }, []);

  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex justify-center items-center h-screen">
      <section className="w-full flex justify-center min-h-screen p-11 bg-cover bg-fixed bg-center bg-no-repeat bg-[url('/assets/fondo.jpg'),_linear-gradient(to_bottom,_#1E59FF_0%,_#022EB9_100%)] md:stl-bg-[url('/assets/fondo.jpg'),_linear-gradient(to_bottom,_#1E59FF_0%,_#022EB9_100%)] 2xl:stl-bg-[url('/assets/fondo.jpg'),_linear-gradient(to_bottom,_#1E59FF_0%,_#022EB9_100%)]">
        <div className="flex flex-col justify-center items-center relative">
          <div className="card display-body card-z300 flex flex-wrap w-xl sm:px-9 sm:py-16">
            <div className="w-full">
              <div className="flex justify-center mb-8">
                <img width={120} src="/assets/iot-logo.svg" alt="Logo" />
              </div>
              <div className="text-center">
                <h1 className="display-large text-xenon-800 font-extrabold">
                  IoT Platform
                </h1>
              </div>
            </div>
            <div className="w-full mt-8 mb-4">
              <div className="w-full mb-4 md:space-y-0 sm:mb-0 border border-neutral-200 rounded-lg cursor-pointer">
                <button
                  name="button"
                  type="submit"
                  className="btn btn-neutral flex justify-center items-center px-4 typo-display-body h-10 block w-full"
                  onClick={signInWithGoogle}>
                  <div className="flex items-center justify-center text-slate-500 text-sm">
                    <img
                      width="16"
                      className="mr-2"
                      src="/assets/icon-google.svg"
                    />
                    Log in with Google
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <button
        onClick={signInWithGoogle}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Iniciar sesión con Google
      </button> */}
    </div>
  );
};

export default Login;
