import {
  homeOutline,
  logOutOutline,
  medicalOutline,
  peopleCircleOutline,
  personAddOutline,
} from "ionicons/icons";

export interface AppPage {
  url: string;
  icon: string;
  title: string;
}

// TODO: change this name to represent the sidemenu pages
export const appPages: AppPage[] = [
  {
    title: "Home",
    url: "/home",
    icon: homeOutline,
  },
  {
    title: "Cadastro de Usuário",
    url: "/users/create-user",
    icon: personAddOutline,
  },
  {
    title: "Listar Usuários",
    url: "/users",
    icon: peopleCircleOutline,
  },
  {
    title: "Listar Hospitais",
    url: "/hospitals",
    icon: medicalOutline,
  },
  {
    title: "Notificações",
    url: "/hospitals",
    icon: medicalOutline,
  },
  {
    title: "Temas",
    url: "/hospitals",
    icon: medicalOutline,
  },
  {
    title: "Categorias",
    url: "/hospitals",
    icon: medicalOutline,
  },
  {
    title: "Subcategorias",
    url: "/hospitals",
    icon: medicalOutline,
  },
  {
    title: "Incidentes",
    url: "/incidents",
    icon: medicalOutline,
  },
  {
    title: "Responsáveis",
    url: "/hospitals",
    icon: medicalOutline,
  },
  {
    title: "Prioridades",
    url: "/hospitals",
    icon: medicalOutline,
  },
  {
    title: "Serviços Notificantes",
    url: "/hospitals",
    icon: medicalOutline,
  },
  {
    title: "Unidades Organizacionais",
    url: "/hospitals",
    icon: medicalOutline,
  },
  {
    title: "Logout",
    url: "/login",
    icon: logOutOutline,
  },
];
