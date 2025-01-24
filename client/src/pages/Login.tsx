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
import axios from 'axios';
import { apiConfig } from '../config/apiConfig';
import ImageLogo from '../components/ImageLogo';

const Login: React.FC = () => {
  const [userInfos, setUserInfos] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); 

    try {
      const endpointUrl = `${apiConfig.BACKEND_URL}/users/login`;
      const response = await axios.post(endpointUrl, {
        email: userInfos.email,
        password: userInfos.password,
      });

      localStorage.setItem('auth_token', response.data.token);

      window.location.href = '/home';
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
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
                    disabled={isLoading}
                  >
                    {isLoading ? <IonSpinner name="crescent" /> : 'Login'}
                  </IonButton>
                </div>

                <div className="col-12 p-1 text-center">
                  <IonRouterLink routerLink={"/register"}>
                    <span
                      style={{
                        textDecoration: "underline",
                      }}
                      className="text-primary"
                    >
                      Criar uma nova conta
                    </span>
                  </IonRouterLink>
                  <div className="p-2">
                    <span className="black-text">OU</span>
                  </div>
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