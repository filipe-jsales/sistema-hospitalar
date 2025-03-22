import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonItem,
  IonLabel,
  IonList,
  IonChip,
  IonIcon,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonAlert,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import { RefresherEventDetail } from "@ionic/core";
import {
  createOutline,
  trashOutline,
  checkmarkCircle,
  closeCircle,
} from "ionicons/icons";
import {
  clearUserError,
  clearUsers,
  fetchUsers,
  UserData,
} from "../store/slices/user/fetchUsersSlice";

const UsersList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.users);
  const [searchText, setSearchText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  useEffect(() => {
    loadUsers();

    return () => {
      dispatch(clearUsers());
      dispatch(clearUserError());
    };
  }, [dispatch]);

  const loadUsers = () => {
    dispatch(fetchUsers())
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar usuários:", error);
      });
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    dispatch(fetchUsers())
      .unwrap()
      .finally(() => {
        event.detail.complete();
      });
  };

  const handleEdit = (user: UserData) => {
    //TODO: implementar a navegação para a página de edição
    console.log("Editar usuário:", user);
    // Exemplo: history.push(`/users/edit/${user.id}`);
  };

  const handleDelete = (user: UserData) => {
    setSelectedUser(user);
    setShowAlert(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      //TODO: implementar a lógica de deleção
      console.log("Deletar usuário:", selectedUser);
      // Exemplo: dispatch(deleteUser(selectedUser.id))
      setShowAlert(false);
      setSelectedUser(null);
    }
  };

  //TODO: mudar a lógica de filtragem/paginação para o backend
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const searchLower = searchText.toLowerCase();

    return fullName.includes(searchLower) || email.includes(searchLower);
  });

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
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="m-2 row justify-content-center align-items-center mt-6">
          <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
            <h1 className="text-center text-uppercase fw-bold">
              Listagem de Usuários
            </h1>

            <IonCardContent>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <IonSearchbar
                  value={searchText}
                  onIonInput={(e) => setSearchText(e.detail.value || "")}
                  placeholder="Buscar usuários"
                />

                <IonButton
                  color="primary"
                  routerLink="/users/create"
                  className="ms-2"
                >
                  Novo Usuário
                </IonButton>
              </div>

              {loading ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando usuários...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="alert alert-info col-12 text-center">
                  {searchText
                    ? "Nenhum usuário encontrado com esta busca."
                    : "Nenhum usuário cadastrado."}
                </div>
              ) : (
                <IonList>
                  {filteredUsers.map((user: UserData) => (
                    <IonItem key={user.id} className="mb-2">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <IonLabel>
                            <h2>{`${user.firstName} ${user.lastName}`}</h2>
                            <p>{user.email}</p>
                            <p>{user.phoneNumber || "Sem telefone"}</p>
                          </IonLabel>
                        </div>

                        <div className="d-flex align-items-center">
                          <IonChip color={user.isActive ? "success" : "danger"}>
                            <IonIcon
                              icon={
                                user.isActive ? checkmarkCircle : closeCircle
                              }
                            />
                            <IonLabel>
                              {user.isActive ? "Ativo" : "Inativo"}
                            </IonLabel>
                          </IonChip>

                          <IonButton
                            fill="clear"
                            color="primary"
                            onClick={() => handleEdit(user)}
                          >
                            <IonIcon slot="icon-only" icon={createOutline} />
                          </IonButton>

                          <IonButton
                            fill="clear"
                            color="danger"
                            onClick={() => handleDelete(user)}
                          >
                            <IonIcon slot="icon-only" icon={trashOutline} />
                          </IonButton>
                        </div>
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              )}

              {!loading && !error && users.length > 0 && (
                <div className="text-center mt-3">
                  <p>Total de usuários: {users.length}</p>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Confirmar exclusão"
          message={`Tem certeza que deseja excluir o usuário ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => {
                setSelectedUser(null);
              },
            },
            {
              text: "Excluir",
              handler: confirmDelete,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default UsersList;
