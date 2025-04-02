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
    createSubcategory,
    clearError,
    clearSuccessMessage,
  } from "../../store/slices/subcategory/createSubcategorySlice";
  import { useFormCleanup } from "../../hooks/useFormCleanup";
  import { fetchCategories } from "../../store/slices/category/fetchCategoriesSlice";
  
  const CreateSubcategory: React.FC = () => {
    const [subcategoryInfos, setSubcategoryInfos] = useState({
      name: "",
      categoryId: null as number | null,
    });
  
    const [errors, setErrors] = useState({
      name: "",
      categoryId: "",
    });
  
    const dispatch = useAppDispatch();
    const { isAuthenticated, user, token } = useAppSelector(
      (state) => state.auth
    );
    const { loading, error, successMessage } = useAppSelector(
      (state) => state.createSubcategory
    );
    const {
      categories,
      loading: categoriesLoading,
      error: categoriesError,
    } = useAppSelector((state) => state.categories);
  
    useEffect(() => {
      dispatch(fetchCategories())
        .unwrap()
        .catch((error) => {
          console.error("Falha ao carregar categorias:", error);
        });
    }, [dispatch]);
  
    useFormCleanup({
      dispatch,
      clearError,
      clearSuccessMessage,
      resetFormState: () => {
        setSubcategoryInfos({
          name: "",
          categoryId: null,
        });
      },
      resetFormErrors: () => {
        setErrors({
          name: "",
          categoryId: "",
        });
      },
    });
  
    const validateInputs = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newErrors: any = {};
      if (!subcategoryInfos.name.trim()) newErrors.name = "Campo obrigatório.";
      if (!subcategoryInfos.categoryId) newErrors.categoryId = "Selecione uma categoria.";
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
            name: subcategoryInfos.name,
          };
          dispatch(createSubcategory(payload))
            .unwrap()
            .then(() => {
              setSubcategoryInfos({
                name: "",
                categoryId: null,
              });
            })
            .catch((error) => {
              console.error("Subcategory creation failed:", error);
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
                Cadastro de Subcategorias
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
                      placeholder="Nome da Subcategoria"
                      label="Nome da Subcategoria"
                      labelPlacement="floating"
                      mode="md"
                      value={subcategoryInfos.name}
                      onIonInput={(e) => {
                        setSubcategoryInfos({
                          ...subcategoryInfos,
                          name: String(e.target.value),
                        });
                        if (errors.name)
                          setErrors({ ...errors, name: "" });
                      }}
                    />
                    {errors.name && (
                      <span className="text-danger">{errors.name}</span>
                    )}
                  </div>
  
                  <div className="col-12">
                    <IonItem>
                      <IonLabel position="stacked">Categoria</IonLabel>
                      <IonSelect
                        value={subcategoryInfos.categoryId}
                        placeholder="Selecione uma categoria"
                        onIonChange={(e) => {
                          setSubcategoryInfos({
                            ...subcategoryInfos,
                            categoryId: e.detail.value,
                          });
                          if (errors.categoryId)
                            setErrors({ ...errors, categoryId: "" });
                        }}
                      >
                        {categoriesLoading ? (
                          <IonSelectOption disabled>
                            Carregando categorias...
                          </IonSelectOption>
                        ) : (
                          categories.map((category) => (
                            <IonSelectOption
                              key={category.id}
                              value={category.id}
                            >
                              {category.name}
                            </IonSelectOption>
                          ))
                        )}
                      </IonSelect>
                    </IonItem>
                    {errors.categoryId && (
                      <span className="text-danger">{errors.categoryId}</span>
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
  
  export default CreateSubcategory;