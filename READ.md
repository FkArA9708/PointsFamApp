# Wachtwoorden voor alle gebruikers

## KIND GEBRUIKERS

1. Gebruikersnaam: kind1, wachtwoord: kind123, rol: kind, familieA
2. Gebruikersnaam: kind2, wachtwoord: kind123, rol: kind, familieA
3. Gebruikersnaam: kind3, wachtwoord: kind456, rol: kind, familieB

## OUDER GEBRUIKERS

1. Gebruikersnaam: ouder1, wachtwoord: ouder123, rol: ouder, familieA
2. Gebruikersnaam: ouder2, wachtwoord: ouder123, rol: ouder, familieA
3. Gebruikersnaam: ouder3, wachtwoord: ouder456, rol: ouder, familieB


**PointsFamApp**
Een puntenapplicatie voor gezinnen. Kinderen verdienen punten met huishoudelijke taken en goed gedrag, en kunnen deze punten later inwisselen voor leuke prijzen.


**Inhoudsopgave**

-Beschrijving

-Features

-Technologieën

-Installatie

-Gebruik

-Projectstructuur

-Ontwerp & Documentatie

-Toekomstige uitbreidingen

-Licentie

-Auteur

**Beschrijving**
PointsFamApp is een webapplicatie waarmee ouders taken en goed gedrag van hun kinderen kunnen belonen met punten. Kinderen kunnen hun gespaarde punten inzien en zelf kiezen uit een prijzenlijst (bijvoorbeeld “extra schermtijd” of “bepaal wat we eten”).

De app ondersteunt meerdere gezinnen, heeft een aparte inlog voor ouders en kinderen, en biedt een licht/donker-modus. Daarnaast is er een berichtencentrum waarbinnen gezinsleden kunnen communiceren, en (optioneel) kunnen ouders van verschillende gezinnen ervaringen uitwisselen.

**Features**

# Must have

Taken & punten. Ouders kunnen taken toevoegen (zowel standaard als vrije taken) met een bepaald aantal punten.

Rollen. Aparte dashboards voor ouders en kinderen.

Taak afronden. Kinderen kunnen taken als “voltooid” markeren, ouders keuren ze goed waarna punten worden toegekend.

Punten geven zonder taak. Ouders kunnen los punten toekennen (bijv. voor goed gedrag) met een reden.

Prijzenlijst. Ouders beheren een lijst met prijzen, kinderen kunnen bij voldoende punten een prijs verzilveren.

Inloggen & sessies. Veilige inlog met bcrypt-wachtwoorden en sessiebeheer.

Licht/donker-modus. Volledig thema-ondersteuning via CSS-variabelen.

# Wanna have / Wish

Berichtencentrum. Ouders en kinderen kunnen binnen het gezin berichten sturen.

Cross-family communicatie. Ouders van verschillende gezinnen kunnen met elkaar praten (bijv. opvoedtips delen).

# Overig

Responsive. Werkt op desktop, tablet en mobiel.

Geen database nodig. Data wordt opgeslagen in JSON-bestanden (makkelijk te vervangen door een echte database).

Wireframes & user journeys. Zie map /wireframes en DESIGN.md.


**Technologieën**

Backend: Node.js, Express.js

Templating: EJS + express-ejs-layouts

Styling: CSS (met variabelen voor licht/donker)

Client-side JavaScript: Voor thema-schakelaar en kleine interacties

Sessies: express-session

Wachtwoorden: bcrypt

Dataopslag: JSON-bestanden (via eigen storage-utility)

Overig: Body-parser, sanitize-input (XSS-bescherming)

**Installatie**
Clone de repository

bash
git clone <repository-url>
cd PointsFamApp
Afhankelijkheden installeren

bash
npm install
Start de applicatie

bash
npm start
Of met auto-herstart tijdens ontwikkeling:

bash
npm run dev
Open de browser
Ga naar http://localhost:3000

Bij de eerste start worden automatisch voorbeeldgegevens aangemaakt in de data/ map.

Gebruik Demo-accounts boven in READ.md om in te loggen in de applicatie.

# Functionaliteiten per rol

Ouder
-Taken aanmaken, bewerken en verwijderen

-Punten toekennen (los van taken)

-Voltooide taken goedkeuren

-Prijzenlijst beheren

-Berichten sturen naar gezin en andere gezinnen

-Overzicht van alle kinderen en hun punten

Kind
-Eigen taken zien en afvinken

-Punten van zichzelf en andere gezinsleden bekijken

-Prijzen verzilveren (als punten toereikend zijn)

-Berichten sturen naar gezinsleden

**Projectstructuur**

pointsfamapp/
app.js                     # Hoofdbestand Express-app
package.json
READ.md
DESIGN.md                  # Uitgebreide ontwerpdocumentatie
.gitignore
controllers/               # Route-handlers
    messagesController.js
    prizesController.js
    tasksController.js
    usersController.js
models/                    # Data-modellen (JSON-opslag)
    messagesModel.js
    prizesModel.js
    taskModel.js
    userModel.js
routes/                    # Express-routes
    index.js
middleware/                # Eigen middleware
    auth.js                # Rolcontrole
    sanitize.js            # XSS-bescherming
utils/                      # Hulpfuncties
    storage.js             # Lezen/schrijven JSON
    initializeData.js       # Aanmaken startdata
data/                       # JSON-bestanden (wordt automatisch aangemaakt)
    users.json
    tasks.json
    prizes.json
    messages.json
public/                     # Statische bestanden
    css/
        style.css
    js/
        theme-toggle.js
views/                       # EJS-templates
    layouts/
        layout.ejs
    dashboard.ejs
    login.ejs
    messages.ejs
    prizes.ejs
    editTask.ejs
    error.ejs
wireframes/                  # Ontwerpbestanden
    PointsFam_Wireframes_Furkan.fig
    PointsFam_Wireframes_Furkan.pdf

**Ontwerp & Documentatie**

In de map /wireframes vind u:

Figma-bestand (PointsFam_Wireframes_Furkan.fig), bewerkbaar ontwerp.

PDF met de wireframes van de belangrijkste schermen.

Daarnaast is er een uitgebreid DESIGN.md met:

-User journeys (bijv. taak toevoegen, punten toekennen, prijzen beheren, berichten sturen)

-Functioneel ontwerp

-Technisch ontwerp

-Kleurenthema's (licht/donker)

-Afwijkingen van wireframes (verbeteringen)

-Toegankelijkheid en beveiliging

-Toekomstige uitbreidingen

-Push-notificaties voor nieuwe berichten

-Kalenderweergave van taken met deadlines

-Gamification-elementen (badges, niveau’s)

-Uitbreiden berichtencentrum met groepschats

-Export van puntenoverzicht naar PDF


**Auteur**
Furkan Kara
Project in opdracht van CrossConnected