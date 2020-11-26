const presence = new Presence({ clientId: "412593783696261121" });

const presenceData: PresenceData = {
  state: "Página Inicial",
  smallImageKey: "viewing_icon",
  smallImageText: "Website",
  largeImageKey: "large_logo",
  details: "Kael o bot mais divertido do discord",
  startTimestamp: Date.now()
};

const polices = [
  { name: "terms", title: "de Termos de Uso" },
  { name: "privacy", title: "de Privacidade" },
  { name: "partners", title: "para Parceiros" }
];
const dashCategories = [
  { name: "general", title: "geral" },
  { name: "welcome", title: "de boas vindas" },
  { name: "vanity", title: "do sistema de vip" }
];

const POLICES_REGEX = /polices\?p=([a-zA-Z]+)$/;
const COMMANDS_REGEX = /commands\?category=([a-zA-Z]+)$/;
const DASH_CATEGORIES_REGEX = /guilds\/([0-9]{18})$/;
const DASH_CATEGORY_REGEX = /guilds\/([0-9]{18})\/([a-zA-Z]+)$/;

presence.on("UpdateData", () => {
  const { location } = document;
  const host = location.hostname;
  const path = `${location.pathname}${location.search || ""}`;

  if (host === "dash.kaelbot.xyz") {
    presenceData.smallImageText = "Dashboard";
    presenceData.smallImageKey = "viewing_black_icon";

    const serverNameElement = document.querySelector(
      "#root > div > header > div:nth-child(2) > span"
    );
    const serverName = serverNameElement
      ? serverNameElement.textContent
      : "Servidor Desconhecido";

    if (path === "/") presenceData.state = "Seleção de Servidores";
    if (DASH_CATEGORIES_REGEX.test(path)) {
      presenceData.state = `Selecionando uma categoria no servidor ${serverName}`;
    }

    if (DASH_CATEGORY_REGEX.test(path)) {
      const [, , category = ""] = DASH_CATEGORY_REGEX.exec(path);
      const categorySearch = dashCategories.find(
        ({ name }) => name === category
      );

      presenceData.smallImageKey = "editing_black_icon";
      presenceData.state = `Editando informações ${
        categorySearch ? categorySearch.title : category
      } do servidor ${serverName}`;
    }
  } else {
    if (path === "/") presenceData.state = "Página Inicial";
    if (/commands\/?$/.test(path)) presenceData.state = "Visualizando Comandos";
    if (/polices\/?$/.test(path)) presenceData.state = "Visualizando Politicas";

    if (COMMANDS_REGEX.test(path)) {
      const [, commandCategory = "general"] = COMMANDS_REGEX.exec(path);

      presenceData.state = `Visualizando os comandos da categoria ${commandCategory}`;
    }

    if (POLICES_REGEX.test(path)) {
      const [, police = "não definida"] = POLICES_REGEX.exec(path);
      const policeSearch = polices.find(({ name }) => name === police);
      const policeViewing = policeSearch ? policeSearch.title : police;

      presenceData.state = `Visualizando a política ${policeViewing}`;
    }
  }

  presence.setActivity(presenceData);
});
