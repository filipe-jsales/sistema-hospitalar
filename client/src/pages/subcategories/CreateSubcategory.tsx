import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonSpinner,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonList,
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
import { fetchSubcategories } from "../../store/slices/subcategory/fetchSubcategoriesSlice";
import Header from "../../components/Header/Header";

const CreateSubcategory: React.FC = () => {
  const [subcategoryInfos, setSubcategoryInfos] = useState({
    name: "",
    categoryId: null as number | null,
  });

  const [errors, setErrors] = useState({
    name: "",
    categoryId: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading, error, successMessage } = useAppSelector(
    (state) => state.createSubcategory
  );
  const { categories, loading: categoriesLoading } = useAppSelector(
    (state) => state.categories
  );

  const {
    subcategories,
    loading: subcategoriesLoading,
    error: subcategoriesError,
    pagination,
  } = useAppSelector((state) => state.subcategories);

  useEffect(() => {
    dispatch(fetchCategories({ page: 1 }))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar categorias:", error);
      });

    loadSubcategories(1);
  }, [dispatch]);

  const loadSubcategories = (page: number) => {
    dispatch(fetchSubcategories({ page }))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar subcategorias:", error);
      });
  };

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
    if (!subcategoryInfos.categoryId)
      newErrors.categoryId = "Selecione uma categoria.";
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
          categoryId: subcategoryInfos.categoryId,
        };
        dispatch(createSubcategory(payload))
          .unwrap()
          .then(() => {
            setSubcategoryInfos({
              name: "",
              categoryId: null,
            });
            loadSubcategories(1);
            setCurrentPage(1);
          })
          .catch((error) => {
            console.error("Subcategory creation failed:", error);
          });
      }
    }
  };

  return (
    <IonPage>
      <Header />
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
                      if (errors.name) setErrors({ ...errors, name: "" });
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
                      ) : categories && categories.length > 0 ? (
                        categories.map((category) => (
                          <IonSelectOption
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </IonSelectOption>
                        ))
                      ) : (
                        <IonSelectOption disabled>
                          Nenhuma categoria encontrada
                        </IonSelectOption>
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

        <div className="m-2 row justify-content-center align-items-center mt-4">
          <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
            <h2 className="text-center text-uppercase fw-bold mt-3">
              Subcategorias
            </h2>
            <IonCardContent>
              {subcategoriesLoading ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando subcategorias...</p>
                </div>
              ) : subcategoriesError ? (
                <div className="alert alert-danger text-center">
                  {subcategoriesError}
                </div>
              ) : subcategories.length === 0 ? (
                <div className="alert alert-info text-center">
                  Nenhuma subcategoria encontrada.
                </div>
              ) : (
                <>
                  <IonList>
                    {subcategories.map((subcategory) => (
                      <IonItem key={subcategory.id}>
                        <IonLabel>
                          <h2>{subcategory.name}</h2>
                          <p>ID da Categoria: {subcategory.categoryId}</p>
                        </IonLabel>
                      </IonItem>
                    ))}
                  </IonList>

                  {pagination && pagination.totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                      <IonButton
                        fill="clear"
                        disabled={currentPage === 1}
                        onClick={() => {
                          const newPage = Math.max(1, currentPage - 1);
                          setCurrentPage(newPage);
                          loadSubcategories(newPage);
                        }}
                      >
                        Anterior
                      </IonButton>

                      <div className="d-flex align-items-center mx-2">
                        <span>
                          Página {currentPage} de {pagination.totalPages}
                        </span>
                      </div>

                      <IonButton
                        fill="clear"
                        disabled={currentPage === pagination.totalPages}
                        onClick={() => {
                          const newPage = Math.min(
                            pagination.totalPages,
                            currentPage + 1
                          );
                          setCurrentPage(newPage);
                          loadSubcategories(newPage);
                        }}
                      >
                        Próxima
                      </IonButton>
                    </div>
                  )}
                </>
              )}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreateSubcategory;
