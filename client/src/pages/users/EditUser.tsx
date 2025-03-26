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
  IonBackButton,
  IonToggle,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearUserData,
  fetchUserById,
  updateUser,
} from "../../store/slices/user/fetchUserByIdSlice";
import { clearUserError } from "../../store/slices/user/fetchUsersSlice";
import { clearSuccessMessage } from "../../store/slices/activationSlice";
import { fetchHospitals } from "../../store/slices/hospital/fetchHospitalsSlice";

interface UserParams {
  id: string;
}

const EditUser: React.FC = () => {
  const { id } = useParams<UserParams>();
  const userId = parseInt(id, 10);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { user, loading, error, successMessage } = useAppSelector(
    (state) => state.userDetails
  );
  const { hospitals, loading: hospitalsLoading } = useAppSelector(
    (state) => state.hospitals
  );

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    isActive: true,
    hospitalId: null as number | null,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    hospitalId: "",
  });

  useEffect(() => {
    dispatch(fetchUserById(userId))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar usuário:", error);
      });
    dispatch(fetchHospitals())
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar hospitais:", error);
      });

    return () => {
      dispatch(clearUserError());
      dispatch(clearSuccessMessage());
      dispatch(clearUserData());
    };
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setUserInfo({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        isActive: user.isActive,
        hospitalId: user.hospitalId || null,
      });
    }
  }, [user]);

  const validateInputs = () => {
    const newErrors: any = {};
    if (!userInfo.firstName.trim()) newErrors.firstName = "Campo obrigatório.";
    if (!userInfo.lastName.trim()) newErrors.lastName = "Campo obrigatório.";
    if (!userInfo.email.trim() || !/^\S+@\S+\.\S+$/.test(userInfo.email))
      newErrors.email = "Email precisa ser válido.";
    if (userInfo.phoneNumber && userInfo.phoneNumber.length > 20)
      newErrors.phoneNumber = "Telefone pode ter no máximo 20 dígitos.";
    if (!userInfo.hospitalId) newErrors.hospitalId = "Selecione um hospital.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearUserError());
    dispatch(clearSuccessMessage());

    if (validateInputs()) {
      const userDataToUpdate = {
        ...userInfo,
        hospitalId:
          userInfo.hospitalId === null ? undefined : userInfo.hospitalId,
      };
      dispatch(updateUser({ userId, userData: userDataToUpdate }))
        .unwrap()
        .then(() => {
          setTimeout(() => {
            history.push("/users");
          }, 2000);
        })
        .catch((error) => {
          console.error("Atualização falhou:", error);
        });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/users" />
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Sistema Hospitalar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="m-2 row justify-content-center align-items-center mt-6">
          <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
            <h1 className="text-center text-uppercase fw-bold">
              Editar Usuário
            </h1>
            <IonCardContent>
              {loading && !user ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando dados do usuário...</p>
                </div>
              ) : error && !user ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                  <div className="mt-3">
                    <IonButton
                      fill="solid"
                      color="primary"
                      onClick={() => history.push("/users")}
                    >
                      Voltar para a listagem
                    </IonButton>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleUpdate}
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
                      value={userInfo.firstName}
                      onIonInput={(e) => {
                        setUserInfo({
                          ...userInfo,
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
                      value={userInfo.lastName}
                      onIonInput={(e) => {
                        setUserInfo({
                          ...userInfo,
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
                      value={userInfo.email}
                      onIonInput={(e) => {
                        setUserInfo({
                          ...userInfo,
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
                      placeholder="Número de telefone"
                      type="text"
                      label="Número de telefone"
                      labelPlacement="floating"
                      mode="md"
                      value={userInfo.phoneNumber}
                      onIonInput={(e) => {
                        setUserInfo({
                          ...userInfo,
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
                        value={userInfo.hospitalId}
                        placeholder={user?.hospital?.name}
                        onIonChange={(e) => {
                          setUserInfo({
                            ...userInfo,
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
                    <IonItem lines="none">
                      <IonLabel position="stacked">Status do usuário</IonLabel>
                      <IonToggle
                        checked={userInfo.isActive}
                        onIonChange={(e) => {
                          setUserInfo({
                            ...userInfo,
                            isActive: e.detail.checked,
                          });
                        }}
                      >
                        {userInfo.isActive ? "Ativo" : "Inativo"}
                      </IonToggle>
                    </IonItem>
                  </div>

                  <div className="col-12 d-flex justify-content-between">
                    <IonButton
                      color="medium"
                      onClick={() => history.push("/users")}
                    >
                      Cancelar
                    </IonButton>
                    <IonButton
                      expand="block"
                      color="primary"
                      className="custom-button"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <IonSpinner name="crescent" />
                      ) : (
                        "Salvar Alterações"
                      )}
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
              )}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditUser;
