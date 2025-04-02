import {
  bagOutline,
  brushOutline,
  carOutline,
  cutOutline,
  homeOutline,
  logOutOutline,
  manOutline,
  medicalOutline,
  notificationsOutline,
  peopleCircleOutline,
  personAddOutline,
  warningOutline,
} from "ionicons/icons";

export interface SideMenuPages {
  url: string;
  icon: string;
  title: string;
}

// TODO: change this name to represent the sidemenu pages
export const appPages: SideMenuPages[] = [
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
    url: "/notifications",
    icon: notificationsOutline,
  },
  {
    title: "Temas",
    url: "/themes",
    icon: brushOutline,
  },
  {
    title: "Categorias",
    url: "/categories",
    icon: bagOutline,
  },
  {
    title: "Subcategorias",
    url: "/subcategories",
    icon: carOutline,
  },
  {
    title: "Incidentes",
    url: "/incidents",
    icon: cutOutline,
  },
  {
    title: "Responsáveis",
    url: "/responsibles",
    icon: manOutline,
  },
  {
    title: "Prioridades",
    url: "/priorities",
    icon: warningOutline,
  },
  // {
  //   title: "Serviços Notificantes",
  //   url: "/hospitals",
  //   icon: medicalOutline,
  // },
  {
    title: "Unidades Organizacionais",
    url: "/organizational-unities",
    icon: medicalOutline,
  },
  {
    title: "Logout",
    url: "/login",
    icon: logOutOutline,
  },
];
