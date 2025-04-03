import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonSpinner,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  createUser,
  clearError,
  clearSuccessMessage,
} from "../../store/slices/user/createUserSlice";
import { useFormCleanup } from "../../hooks/useFormCleanup";
import { fetchHospitals } from "../../store/slices/hospital/fetchHospitalsSlice";

const CreateUser: React.FC = () => {
  const [userInfos, setUserInfos] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    hospitalId: null as number | null,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    hospitalId: "",
  });

  const dispatch = useAppDispatch();
  const { isAuthenticated, user, token } = useAppSelector(
    (state) => state.auth
  );
  const { loading, error, successMessage } = useAppSelector(
    (state) => state.createUser
  );
  
  const {
    hospitals,
    loading: hospitalsLoading,
    error: hospitalsError,
  } = useAppSelector((state) => state.hospitals);
  useEffect(() => {
    dispatch(fetchHospitals())
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar hospitais:", error);
      });
  }, [dispatch]);

  useFormCleanup({
    dispatch,
    clearError,
    clearSuccessMessage,
    resetFormState: () => {
      setUserInfos({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        hospitalId: null,
      });
    },
    resetFormErrors: () => {
      setErrors({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        hospitalId: "",
      });
    },
  });

  const validateInputs = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors: any = {};
    if (!userInfos.firstName.trim()) newErrors.firstName = "Campo obrigatório.";
    if (!userInfos.lastName.trim()) newErrors.lastName = "Campo obrigatório.";
    if (!userInfos.email.trim() || !/^\S+@\S+\.\S+$/.test(userInfos.email))
      newErrors.email = "Email precisa ser válido.";
    if (userInfos.password.length < 6)
      newErrors.password = "Senha precisa ter no mínimo 6 caractéres.";
    if (userInfos.phoneNumber.length > 20)
      newErrors.phoneNumber = "Telefone pode ter no máximo 20 dígitos.";
    if (!userInfos.hospitalId) newErrors.hospitalId = "Selecione um hospital.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(clearSuccessMessage());

    if (validateInputs()) {
      if (user?.id && user.email && user.roles) {
        const payload = {
          userInfos: { ...userInfos },
          user: { ...user },
        };
        dispatch(createUser(payload))
          .unwrap()
          .then(() => {
            setUserInfos({
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              phoneNumber: "",
              hospitalId: null,
            });
          })
          .catch((error) => {
            console.error("Registration failed:", error);
          });
      }
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
          <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
            <h1 className="text-center text-uppercase fw-bold">
              Cadastro de usuários
            </h1>
            <IonCardContent>
              <form
                onSubmit={handleRegister}
                className="row justify-content-center align-items-center gap-3 p-2"
              >
                <div className="col-12">
                  <IonInput
                    color={"dark"}
                    fill="outline"
                    placeholder="Nome"
                    label="Nome"
                    labelPlacement="floating"
                    mode="md"
                    value={userInfos.firstName}
                    onIonInput={(e) => {
                      setUserInfos({
                        ...userInfos,
                        firstName: String(e.target.value),
                      });
                      if (errors.firstName)
                        setErrors({ ...errors, firstName: "" });
                    }}
                  />
                  {errors.firstName && (
                    <span className="text-danger">{errors.firstName}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonInput
                    color={"dark"}
                    fill="outline"
                    placeholder="Sobrenome"
                    label="Sobrenome"
                    labelPlacement="floating"
                    mode="md"
                    value={userInfos.lastName}
                    onIonInput={(e) => {
                      setUserInfos({
                        ...userInfos,
                        lastName: String(e.target.value),
                      });
                      if (errors.lastName)
                        setErrors({ ...errors, lastName: "" });
                    }}
                  />
                  {errors.lastName && (
                    <span className="text-danger">{errors.lastName}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonInput
                    color={"dark"}
                    fill="outline"
                    placeholder="Email"
                    type="email"
                    label="Email"
                    labelPlacement="floating"
                    mode="md"
                    value={userInfos.email}
                    onIonInput={(e) => {
                      setUserInfos({
                        ...userInfos,
                        email: String(e.target.value),
                      });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                  />
                  {errors.email && (
                    <span className="text-danger">{errors.email}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonInput
                    color={"dark"}
                    fill="outline"
                    placeholder="Senha"
                    type="password"
                    label="Senha"
                    labelPlacement="floating"
                    mode="md"
                    value={userInfos.password}
                    onIonInput={(e) => {
                      setUserInfos({
                        ...userInfos,
                        password: String(e.target.value),
                      });
                      if (errors.password)
                        setErrors({ ...errors, password: "" });
                    }}
                  />
                  {errors.password && (
                    <span className="text-danger">{errors.password}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonInput
                    color={"dark"}
                    fill="outline"
                    placeholder="Número de telefone"
                    type="text"
                    label="Número de telefone"
                    labelPlacement="floating"
                    mode="md"
                    value={userInfos.phoneNumber}
                    onIonInput={(e) => {
                      setUserInfos({
                        ...userInfos,
                        phoneNumber: String(e.target.value),
                      });
                      if (errors.phoneNumber)
                        setErrors({ ...errors, phoneNumber: "" });
                    }}
                  />
                  {errors.phoneNumber && (
                    <span className="text-danger">{errors.phoneNumber}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonItem>
                    <IonLabel position="stacked">Hospital</IonLabel>
                    <IonSelect
                      value={userInfos.hospitalId}
                      placeholder="Selecione um hospital"
                      onIonChange={(e) => {
                        setUserInfos({
                          ...userInfos,
                          hospitalId: e.detail.value,
                        });
                        if (errors.hospitalId)
                          setErrors({ ...errors, hospitalId: "" });
                      }}
                    >
                      {hospitalsLoading ? (
                        <IonSelectOption disabled>
                          Carregando hospitais...
                        </IonSelectOption>
                      ) : (
                        hospitals.map((hospital) => (
                          <IonSelectOption
                            key={hospital.id}
                            value={hospital.id}
                          >
                            {hospital.name}
                          </IonSelectOption>
                        ))
                      )}
                    </IonSelect>
                  </IonItem>
                  {errors.hospitalId && (
                    <span className="text-danger">{errors.hospitalId}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonButton
                    expand="block"
                    color="primary"
                    className="custom-button"
                    onClick={handleRegister}
                    disabled={loading}
                  >
                    {loading ? <IonSpinner name="crescent" /> : "Cadastrar"}
                  </IonButton>
                </div>

                {successMessage && (
                  <div className="alert alert-success col-12 text-center">
                    {successMessage}
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger col-12 text-center">
                    {error}
                  </div>
                )}
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreateUser;
