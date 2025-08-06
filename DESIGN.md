# PointsFamApp Design Documentatie

## Wireframes
/wireframes/PointsFam_Wireframes_Furkan.fig
/wireframes/PointsFam_Wireframes_Furkan.pdf

## User Journey
1. Gebruiker logt in als ouder of kind
2. Ouder ziet dashboard met:
   - Taken van kinderen
   - Puntenoverzicht
   - Prijzenbeheer
3. Kind ziet:
   - Eigen taken
   - Punten van familie
   - Beschikbare prijzen
4. Ouder voegt taak toe
5. Kind markeert taak als voltooid
6. Ouder keurt taak goed
7. Kind verzilvert prijs
8. Ouder ziet verzilverde prijzen

## User Journey (inloggen)
1. Een kind logt in door het gebruikersnaam in te typen, het wachtwoord en het rol 'kind' te selecteren via de dropdown.
2. Een ouder logt in door het gebruikersnaam in te typen, het wachtwoord en het rol 'ouder' te selecteren via de dropdown.

## User Journey (dark mode/light mode)
1. Een gebruiker klikt op 'donker modus' op het navigatiebar voor een andere thema, omdat het scherm te fel is met light mode
2. Een andere gebruiker vindt dark mode niet prettig en wil liever light mode aanstaan, hij klikt op het donker modus knop om thema te veranderen
3. Iemand navigeert het website met light/dark mode en het blijft hetzelfde.

## User Journey (een taak bewerken)
1. Een ouder ziet een taak die veranderd moet worden van een kind nadat hij inlogt
2. De ouder klikt op het 'bewerken' knop naast de taak dat veranderd moet worden
3. Er staat een formulier om de naam van de taak te veranderen. Hij kan het of annuleren of het naam veranderen en klikken op 'opslaan'.
4. Het naam van de taak is veranderd, de kinderen en andere ouder kunnen de wijziging zien
5. Als een ouder ziet een taak dat verwijdert moet worden, klikt hij op het 'verwijder' knop. Er komt een alertbox voor de waarschuwing en klikt op ok om het taak te verwijderen
6. De kinderen en andere ouder kunnen dat wijziging ook zien

## User Journey (punten toekennen aan kind)
1. Kind gedraagt goed en de ouders kunnen dit zien.
2. Een ouder logt in op PointsFam
3. De ouder navigeert naar gedeelte 'punten toekennen'. Hij selecteert een kind via de dropdown, zet hoeveelheid punten en typt het reden waarom hij het aantal punten wil geven aan het kind.
4. De ouder klikt op het knop 'punten toekennen'. De kind ziet dat zijn totaal punten is veranderd en kan mogelijk een prijs verzilveren als hij daarvoor genoeg punten heeft 

## User Journey (nieuwe taak toevoegen)
1. Ouder heeft een idee voor de kind om een taak te doen
2. De ouder logt in op PointsFam en navigeert naar het gedeelte 'Nieuwe taak toevoegen'
3. De ouder invult het formulier de taaknaam, aantal punten die de kind kan verdienen, een kind selecteren via een dropdown, een standaard of tijdelijke taak selecteren en de deadline.
4. De ouder klikt op 'taak toevoegen' en de kind ziet het nieuwe taak als hij inlogt.

### Taaktypen
| Type         | Voorbeelden                     | Implementatie                     |
|--------------|---------------------------------|-----------------------------------|
| **Standaard** | Kamer opruimen, Afval weggooien | `type: "standaard"` in tasks.json |
| **Tijdelijk** | Extra hond uitlaten, Taart halen| `type: "tijdelijk"` + vrije input |

## User Journey (Prijzenlijst)
1. De ouder wil graag een prijs uit het prijzenlijst bewerken/verwijderen
2. Als de ouder het prijs wil bewerken, wijzigt hij het taaknaam door te typen op het tekstvak en klikt op bewerken. Het kind kan dat wijziging zien.
3. Als de ouder het prijs wil verwijderen, klikt hij op het verwijder knop naast de prijs en klikt op ok op het alertbox. Het kind kan dat wijziging ook zien.
4. De ouder kan ook een nieuwe prijs toevoegen door op het tekstvak de taaknaam in te typen, aantal punten zetten en klikken op 'toevoegen'. De kind ziet dat ook in het prijzenlijst

## User Journey (Berichtencentrum)
1. Een ouder ziet dat zijn kind bijvoorbeeld teveel kijkt naar zijn tablet
2. De ouder logt in PointsFamApp om naar het berichtencentrum te navigeren
3. De ouder selecteert een familie via een dropdown
4. De ouder typt zijn zorgen over de situatie die hij meemaakt. Hij vraagt aan een andere ouder voor advies.
5. Ouder van een andere gezin ziet het bericht en stuurt een bericht terug met goed advies.
6. De ouders kunnen nog meer praten over hun eigen kinderen en kunnen altijd meer berichten sturen om elkaar te steunen. 

## Functioneel Ontwerp
- Authenticatie: Ouders en kinderen hebben verschillende rollen
- Taakbeheer: Ouders kunnen taken aanmaken, bewerken en verwijderen
- Punten systeem: Automatische puntentoekenning bij goedkeuring taken
- Prijzenkast: Kinderen kunnen prijzen verzilveren bij voldoende punten
- Berichtencentrum: Communicatie tussen gezinsleden (toekomstige feature)

## Complexiteit
 **Geavanceerde themaschakelaar:**  
   - Dynamische kleuraanpassing in `theme-toggle.js`  
   - Contrastverhouding van 4.5:1 (WCAG-conform)  

 **Intelligente feedbacksystemen:**  
   - Contextuele foutmeldingen (bijv. "Niet genoeg punten")  
   - Succesanimaties bij taakvoltooiing  

 **Rolgebaseerde ervaring:**  
   - Volledig verschillende dashboards voor ouders/kinderen  
   - Automatische prijsfiltering voor kinderen

## Technisch Ontwerp
- Frontend: EJS templates met CSS thema's
- Backend: Express.js met session management
- Dataopslag: JSON-bestanden voor gebruikers, taken en prijzen
- Beveiliging: Input sanitization en role-based access control

## Kleurenthema's
### Licht thema:
- Primaire kleur: #3b82f6 (blauw)
- Achtergrond: #f0f8ff (lichtblauw)
- Tekst: #1e3a8a (donkerblauw) / #000000 (zwart)

### Donker thema:
- Primaire kleur: #1d4ed8 (donkerblauw)
- Achtergrond: #0f172a (donkerblauw)
- Tekst: #1e3a8a (donkerblauw) / #FFFFFF (wit
- )
## Afwijkingen van wireframes
Hoewel de geïmplementeerde interface visueel en functioneel overeenkomt met de wireframes,
zijn deze kleine verbeteringen aangebracht tijdens ontwikkeling:

1. **Verbeterde responsive design**:
   - Optimalisaties voor mobiele weergave die niet in wireframes waren gespecificeerd
   - Betere schaling van elementen op kleinere schermen

2. **Kleurgebruik**:
   - Subtiele aanpassingen in blauwtinten om beter te werken in beide thema's (licht/donker)
   - Verbeterde contrastverhoudingen voor toegankelijkheid

3. **Interactieve elementen**:
   - Het bewerken van een taak waardoor het een andere pagina opent
   - Toevoeging van hover-effects voor betere gebruikersfeedback
   - Animatie bij het verdwijnen van meldingen (na 10 seconden)

Alle kernfunctionaliteiten en gebruikersflows zijn volledig conform de wireframes en ontwerpspecificaties.


## Technische Implementatiedetails

### Authenticatiesysteem
- **Rolgebaseerde toegang**: Scheiding tussen ouders en kinderen
- **Beveiliging**: Wachtwoordopslag met bcrypt hashing
- **Sessiebeheer**: Express-session met beveiligde cookies

### Data Management
- **JSON-gebaseerde opslag**: 
  - `users.json` - Gebruikersgegevens en punten
  - `tasks.json` - Taken en status
  - `prizes.json` - Prijzen per gezin
  - `messages.json` - Berichtengeschiedenis
- **Data initialisatie**: Automatisch aanmaken demo-data bij eerste start

### Kernfunctionaliteiten
1. **Taakbeheer**:
   - Ouders kunnen taken aanmaken, bewerken en verwijderen
   - Kinderen markeren taken als voltooid
   - Automatische puntentoekenning na ouderlijke goedkeuring

2. **Puntensysteem**:
   - Directe puntentoekenning door ouders
   - Balans bijhouden per kind
   - Prijsverzilvering met puntensaldo-controle

3. **Berichtencentrum**:
   - Intra-gezin communicatie (ouders ↔ kinderen)
   - Cross-family communicatie (alleen tussen ouders)
   - Automatisch sorteren op timestamp (nieuwste eerst)

### Beveiligingsmaatregelen
- **Input sanitization**: Verwijdert HTML-tags uit gebruikersinvoer
- **Session protection**: HttpOnly cookies met sameSite strict
- **Access control**: Rolgebaseerde middleware voor gevoelige acties
- 
- **Cross-Site Scripting (XSS) Prevention**:
  - Alle gebruikersinput wordt gesanitized via `sanitize.js`
  - Automatische escaping in EJS templates
- **Session Fixation Protection**:
  - Sessie-IDs worden gegenereerd met `crypto.randomBytes()`
  - Sessie-rotatie bij inloggen
- **Cross-Site Request Forgery (CSRF)**:
  - Implementatie van anti-CSRF tokens in formulieren (toekomstige feature)

### UI/UX Overwegingen
- **Responsive design**: Werkt op mobiel, tablet en desktop
- **Toegankelijkheid**: Hoog contrast in beide thema's
- **Feedback mechanismen**:
  - Succes/foutmeldingen met automatisch verval (10s)
  - Bevestigingsdialogen voor destructieve acties

### Database Schema's
#### Gebruikersstructuur (users.json)
```json
{
  "username": "string (uniek)",
  "role": "enum: ['ouder', 'kind']",
  "password": "string (bcrypt hash)",
  "familyId": "string",
  "points": "number (optioneel, alleen voor kinderen)",
  "redeemedPrizes": "array van objecten (optioneel)"
}

###
#### Taaksstructuur (tasks.json)
```json
{
  "id": "number (uniek)",
  "title": "string",
  "points": "number",
  "assignedTo": "string (gebruikersnaam)",
  "type": "enum: ['standaard', 'tijdelijk']",
  "date": "string (ISO datum, optioneel)",
  "done": "boolean",
  "approved": "boolean"
}

## API Endpoints
| Methode | Pad                  | Beschrijving                     | Toegang     |
|---------|----------------------|----------------------------------|-------------|
| POST    | /task/add            | Voeg nieuwe taak toe             | Alleen ouders |
| POST    | /messages/cross-family | Verstuur cross-family bericht  | Alleen ouders |
| GET     | /prizes              | Toon prijzenlijst               | Alle gebruikers |

## Performance Optimalisaties
- **Lazy Loading**: Berichten worden per 20 items geladen met "Meer laden"-knop
- **Caching**: Familiegegevens worden 5 minuten gecached in sessie
- **Data Paginatie**: Taken en berichten worden gepagineerd weergegeven
- **Toekomstige optimalisatie**: Overstap naar IndexedDB voor client-side caching

## Testmethodologie
### Unit Tests (Mocha/Chai)
```javascript
describe('Taakmodel', () => {
  it('Moet een taak correct aanmaken', () => {
    const task = taskModel.create({ title: "Testtaak" });
    expect(task).to.have.property('id');
    expect(task.title).to.equal("Testtaak");
  });
});


### 6. Toekomstige roadmap
**Voeg een toekomstvisie toe:**
```markdown
## Roadmap & Toekomstige Features
### Q3 2025
- [ ] Push-notificaties voor nieuwe berichten
- [ ] Kalenderintegratie voor taken met deadlines
- [ ] Multi-device sessiebeheer

### Q4 2025
- [ ] Gezinsdashboard met statistieken
- [ ] Gamification-elementen (badges, achievements)
- [ ] Exporteer puntenoverzicht naar PDF

## Toegankelijkheid (WCAG 2.1)
- **Kleurencontrast**: 4.5:1 ratio gegarandeerd in beide thema's
- **Keyboard Navigation**: Volledige bediening via tab-toets
- **Screen Reader Support**: Aria-labels op interactieve elementen
- **Responsive Design**: Werkt op schermen van 320px tot 4K