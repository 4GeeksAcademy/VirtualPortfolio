// src/store/appContext.js
import React, { useState, useRef } from "react";

// Crea el contexto
export const Context = React.createContext(null);

// Define getState
const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      allCriptoCoins: [],    // Lista completa de monedas con información (desde coins/markets)
      criptoIds: [],         // Sólo los IDs de las monedas
      coinsDetails: [],      // Detalles específicos (en este caso idéntico a allCriptoCoins)
      selectedCoinDetail: null, // Detalle de la moneda seleccionada
    },
    actions: {
      // Función principal para cargar todos los datos
      loadAllCoinsAndDetails: async () => {
        const store = getStore();
        const actions = getActions();

        // Verificar si los datos ya están en localStorage
        const savedCoins = localStorage.getItem("allCriptoCoins");
        const savedDetails = localStorage.getItem("coinsDetails");

        if (savedCoins && savedDetails) {
          // Cargar desde localStorage si existen
          const parsedCoins = JSON.parse(savedCoins);
          const parsedDetails = JSON.parse(savedDetails);
          setStore({
            allCriptoCoins: parsedCoins,
            coinsDetails: parsedDetails,
            criptoIds: parsedCoins.map(coin => coin.id),
          });
          console.log("Datos cargados desde localStorage");
          return;
        }

        // Si no están en localStorage, hacer el fetch
        try {
          console.log("Fetching top coins by market cap...");
          const details = await actions.fetchCoinsMarkets();

          // allCriptoCoins y coinsDetails serán el mismo array en este caso
          setStore({
            allCriptoCoins: details,
            criptoIds: details.map(coin => coin.id),
            coinsDetails: details
          });

          localStorage.setItem("allCriptoCoins", JSON.stringify(details));
          localStorage.setItem("coinsDetails", JSON.stringify(details));
          console.log("Datos cargados desde la API y guardados en localStorage");
        } catch (error) {
          console.error("Error cargando los datos:", error);
        }
      },

      // Fetch para obtener el top de monedas ordenadas por market cap
      fetchCoinsMarkets: async () => {
        // Ajusta per_page según tus necesidades, ej: 250 o 1000.
        const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false";
        const requestOptions = {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) throw new Error("Error fetching coins from markets endpoint");
        const data = await response.json();
        return data; // data es un array de objetos de monedas con todos los detalles
      },

      // Acción para cargar detalles de una moneda específica
      loadCoinDetail: async (id) => {
        const store = getStore();

        // Verificar en localStorage
        const savedDetail = localStorage.getItem(`coinDetail_${id}`);
        if (savedDetail) {
          // Verificar si el detalle ya está cargado para evitar actualizaciones redundantes
          const parsedDetail = JSON.parse(savedDetail);
          if (store.selectedCoinDetail?.id !== parsedDetail.id) {
            setStore({ selectedCoinDetail: parsedDetail });
            console.log("Detalle cargado desde localStorage para:", id);
          }
          return;
        }

        try {
          console.log("Fetching detail for coin:", id);
          const requestOptions = {
            method: "GET",
            headers: { accept: "application/json" },
          };
          const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`, requestOptions);
          if (!response.ok) throw new Error(`Error fetching details for ${id}`);
          const data = await response.json();

          // Verificar si el detalle ya está cargado
          if (store.selectedCoinDetail?.id !== data.id) {
            setStore({ selectedCoinDetail: data });
            localStorage.setItem(`coinDetail_${id}`, JSON.stringify(data));
            console.log("Detalle cargado desde API y guardado en localStorage para:", id);
          }
        } catch (error) {
          console.error("Error loading coin detail:", error);
        }
      },
      
      // Aquí podrías añadir más acciones para manejar favoritos, portafolios, etc.
    },
  };
};

// Define el StoreWrapper
export const StoreWrapper = ({ children }) => {
  const [state, setState] = useState(getState);
  
  // Almacena las acciones en un useRef para evitar que se recren en cada render
  const actionsRef = useRef();

  if (!actionsRef.current) {
    const initialState = getState({
      getStore: () => state.store,
      getActions: () => actionsRef.current.actions,
      setStore: (updatedStore) => setState(prev => ({
        ...prev,
        store: { ...prev.store, ...updatedStore }
      })),
    });
    actionsRef.current = initialState.actions;
  }

  return (
    <Context.Provider value={{ store: state.store, actions: actionsRef.current }}>
      {children}
    </Context.Provider>
  );
};

export default getState;
