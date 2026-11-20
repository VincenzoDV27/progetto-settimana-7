# SportsHub

**SportsHub** è una mini web application che permette di cercare squadre sportive, consultare i risultati delle ultime partite e visualizzare i prossimi incontri.

I dati vengono recuperati tramite le API di [TheSportsDB](https://www.thesportsdb.com/).

## Funzionalità

- **Ricerca squadre:** ricerca di squadre sportive tramite nome.
- **Dettagli squadra:** visualizzazione delle ultime partite e dei prossimi incontri.
- **Preferiti:** possibilità di aggiungere e rimuovere squadre dai preferiti.
- **Salvataggio locale:** i preferiti vengono salvati nel `localStorage` e rimangono disponibili dopo il refresh della pagina.
- **Filtro per sport:** possibilità di filtrare le squadre preferite per calcio, basket e football americano.
- **Gestione delle richieste:** utilizzo di `AbortController` per annullare le richieste precedenti ancora in corso.
- **Responsive design:** interfaccia adattabile a diverse dimensioni dello schermo.
- **Feedback visivi:** spinner durante il caricamento e messaggi di errore in caso di problemi.

## Filtro per sport

Nella sezione dei preferiti è possibile filtrare le squadre per sport:

- **Tutti:** mostra tutte le squadre.
- **Calcio:** mostra le squadre di calcio.
- **Basket:** mostra le squadre di basket.
- **Football:** mostra le squadre di football americano.

**Test:** aggiungere ai preferiti Napoli, Chicago Sky e Chicago Bears. Selezionando i diversi filtri dovrà comparire solamente la squadra appartenente allo sport scelto.

## Tecnologie utilizzate

- HTML5
- CSS3
- JavaScript
- Bootstrap 5.3.9
- Fetch API
- TheSportsDB API
- LocalStorage

## Struttura del progetto

```text
SportsHub/
│
├── index.html
│
└── assets/
    ├── css/
    │   └── style.css
    │
    └── js/
        └── script.js
```

## API

Il progetto utilizza [TheSportsDB API](https://www.thesportsdb.com/), un servizio che fornisce informazioni sulle squadre e sugli eventi sportivi.

Gli endpoint principali utilizzati sono:

| Endpoint                     | Descrizione                     |
| ---------------------------- | ------------------------------- |
| `searchteams.php?t={nome}`   | Ricerca delle squadre           |
| `eventsnext.php?id={teamId}` | Recupero dei prossimi eventi    |
| `eventslast.php?id={teamId}` | Recupero degli ultimi risultati |

Il progetto utilizza la chiave API gratuita `123`, che presenta alcune limitazioni nella quantità di dati restituiti.

## Come avviare il progetto

1. Clonare o scaricare la repository.
2. Aprire la cartella `SportsHub`.
3. Aprire il file `index.html` nel browser.
4. Cercare una squadra utilizzando l'apposito campo di ricerca.
