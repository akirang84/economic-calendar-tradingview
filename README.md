# TradingView Economic Calendar ICS Feed Generator 📅

This project generates an **ICS (iCalendar) file** feed for high-importance economic events, making it easy to subscribe to these events using calendar applications like **iOS Calendar**, **Google Calendar**, or **Outlook**.

---

## Features 🚀

- Fetches **high-importance economic events** for the current month.
- Generates an **ICS calendar feed** compatible with most calendar applications.
- Allows users to set alerts (notifications) at the event start time.
- Deployed as a **Firebase Cloud Function** for easy access via HTTP.

---

## How It Works ⚙️

1. **Fetch Events**:  
   The function retrieves economic events using the [TradingView Economic Calendar API](https://economic-calendar.tradingview.com/events).

2. **Filter Events**:  
   - Fetches only **high-importance** events (`importance: 3`).
   - Filters events for specific countries (`US`, `IN`).

3. **Generate ICS File**:  
   Converts the fetched events into a valid **iCalendar (.ics)** file format using the `ics` library.

4. **Set Alerts**:  
   Adds a **notification alert** for each event at its start time.

5. **Serve ICS Feed**:  
   The generated ICS file is served over an HTTPS endpoint.

---

## Installation 🛠️

### Prerequisites:
- **Node.js** v16 or higher.
- Firebase CLI installed:
   ```bash
   npm install -g firebase-tools
