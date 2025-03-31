import { 
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonInput,
  IonRouterLink,
  IonButton,
  IonSpinner,
} from '@ionic/react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';
import { useHistory } from 'react-router-dom';
import ImageLogo from '../../components/ImageLogo';

const Login: React.FC = () => {
  const [userInfos, setUserInfos] = useState({
    email: '',
    password: '',
  });

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dispatching login action with credentials:', userInfos);
    dispatch(login(userInfos))
      .unwrap()
      .then((token) => {
        console.log('Login successful, token:', token);
        history.push('/home');
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  };

  return (
    <IonPage>
      <IonContent>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          }}
        >
          <IonCard style={{ width: "90%", maxWidth: "25rem" }}>
            <IonCardContent>
              <form
                onSubmit={handleLogin}
                className="row justify-content-center align-items-center gap-3 p-2"
              >
                <ImageLogo />
                <div className="col-12">
                  <IonInput
                    color={"dark"}
                    fill="outline"
                    placeholder="Email"
                    type="email"
                    label="Email"
                    labelPlacement="floating"
                    className="black-text"
                    value={userInfos.email}
                    mode="md"
                    onIonInput={(e) =>
                      setUserInfos({
                        ...userInfos,
                        email: String(e.target.value),
                      })
                    }
                  ></IonInput>
                </div>

                <div className="col-12">
                  <IonInput
                    color={"dark"}
                    placeholder="Senha"
                    type="password"
                    label="Senha"
                    labelPlacement="floating"
                    fill="outline"
                    className="black-text"
                    mode="md"
                    value={userInfos.password}
                    onIonInput={(e) =>
                      setUserInfos({
                        ...userInfos,
                        password: String(e.target.value),
                      })
                    }
                  ></IonInput>
                </div>
                <div className="col-12">
                  <IonButton
                    expand="block"
                    type="submit"
                    color="primary"
                    className="custom-button"
                    disabled={loading}
                  >
                    {loading ? <IonSpinner name="crescent" /> : 'Login'}
                  </IonButton>
                </div>
                {error && (
                  <div className="col-12 text-center" style={{ color: 'red', marginTop: '10px' }}>
                    {error}
                  </div>
                )}
                <div className="col-12 text-center">
                  <IonRouterLink routerLink={"/redefinition"}>
                    <span
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      className="text-primary "
                    >
                      Esqueci minha senha
                    </span>
                  </IonRouterLink>
                </div>
              </form>
            </IonCardContent>
          </IonCard>
          </div>
        </IonContent>
      </IonPage>
  );
};

export default Login;