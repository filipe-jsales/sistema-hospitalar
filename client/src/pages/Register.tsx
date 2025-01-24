import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonInput,
  IonRouterLink,
  IonButton,
  IonSpinner,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
} from '@ionic/react';
import { useState } from 'react';
import axios from 'axios';
import { apiConfig } from '../config/apiConfig';

const Register: React.FC = () => {
  const [userInfos, setUserInfos] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    const newErrors: any = {};
    if (!userInfos.firstName.trim()) newErrors.firstName = 'Campo obrigatório.';
    if (!userInfos.lastName.trim()) newErrors.lastName = 'Campo obrigatório.';
    if (!userInfos.email.trim() || !/^\S+@\S+\.\S+$/.test(userInfos.email))
      newErrors.email = 'Email precisa ser válido.';
    if (userInfos.password.length < 6)
      newErrors.password = 'Senha precisa ter no mínimo 6 caractéres.';
    if (userInfos.phoneNumber.length > 20)
      newErrors.phoneNumber = 'Telefone pode ter no máximo 20 dígitos.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); 
    if (validateInputs()) {
      try {
        const endpointUrl = `${apiConfig.BACKEND_URL}/users/register`;
        const response = await axios.post(endpointUrl, userInfos);
        setSuccessMessage('Registro feito com sucesso! Por favor verifique seu email para ativar sua conta.');
        setErrorMessage('');
        console.log('Response:', response.data);
        setUserInfos({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phoneNumber: '',
        });
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.message || 'Um erro ocorreu durante o registro. Por favor tente de novo.'
        );
        setSuccessMessage('');
        console.error('Registration Error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false)
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton /> 
          </IonButtons>
          <IonTitle>Sistema Hospitalar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="m-2 row justify-content-center align-items-center mt-6">
          <IonCard style={{ width: '90%', maxWidth: '45rem' }}>
          <h1 className='text-center text-uppercase fw-bold'>Cadastro de usuários</h1>
            <IonCardContent>
              <form
                onSubmit={handleRegister}
                className="row justify-content-center align-items-center gap-3 p-2"
              >
                <div className="col-12">
                  <IonInput
                    color={'dark'}
                    fill="outline"
                    placeholder="Nome"
                    label="Nome"
                    labelPlacement="floating"
                    mode="md"
                    value={userInfos.firstName}
                    onIonInput={(e) =>
                      setUserInfos({ ...userInfos, firstName: String(e.target.value) })
                    }
                  />
                  {errors.firstName && <span className="text-danger">{errors.firstName}</span>}
                </div>

                <div className="col-12">
                  <IonInput
                    color={'dark'}
                    fill="outline"
                    placeholder="Sobrenome"
                    label="Sobrenome"
                    labelPlacement="floating"
                    mode="md"
                    value={userInfos.lastName}
                    onIonInput={(e) =>
                      setUserInfos({ ...userInfos, lastName: String(e.target.value) })
                    }
                  />
                  {errors.lastName && <span className="text-danger">{errors.lastName}</span>}
                </div>

                <div className="col-12">
                  <IonInput
                    color={'dark'}
                    fill="outline"
                    placeholder="Email"
                    type="email"
                    label="Email"
                    labelPlacement="floating"
                    mode="md"
                    value={userInfos.email}
                    onIonInput={(e) =>
                      setUserInfos({ ...userInfos, email: String(e.target.value) })
                    }
                  />
                  {errors.email && <span className="text-danger">{errors.email}</span>}
                </div>

                <div className="col-12">
                  <IonInput
                    color={'dark'}
                    fill="outline"
                    placeholder="Senha"
                    type="password"
                    label="Senha"
                    labelPlacement="floating"
                    mode="md"
                    value={userInfos.password}
                    onIonInput={(e) =>
                      setUserInfos({ ...userInfos, password: String(e.target.value) })
                    }
                  />
                  {errors.password && <span className="text-danger">{errors.password}</span>}
                </div>

                <div className="col-12">
                  <IonInput
                    color={'dark'}
                    fill="outline"
                    placeholder="Número de telefone"
                    type="text"
                    label="Número de telefone"
                    labelPlacement="floating"
                    mode="md"
                    value={userInfos.phoneNumber}
                    onIonInput={(e) =>
                      setUserInfos({ ...userInfos, phoneNumber: String(e.target.value) })
                    }
                  />
                  {errors.phoneNumber && <span className="text-danger">{errors.phoneNumber}</span>}
                </div>

                <div className="col-12">
                  <IonButton
                    expand="block"
                    color="primary"
                    className="custom-button"
                    onClick={handleRegister}
                    disabled={isLoading}
                  >
                    {isLoading ? <IonSpinner name="crescent" /> : 'Cadastrar'}
                  </IonButton>
                </div>
                {/*<div className="col-12 p-1 text-center">
                  <IonRouterLink routerLink="/login">
                    <span style={{ textDecoration: 'underline' }} className="text-primary">
                      Já possui uma conta? Login
                    </span>
                  </IonRouterLink>
                </div>*/}
              </form>
            </IonCardContent>
            {successMessage && (
              <div className="alert alert-success col-12">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="alert alert-danger col-12">{errorMessage}</div>
            )}
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
