# nexus-cli 🚀

A powerful, feature-rich CLI tool built with **Node.js + TypeScript** for SESD Workshop 2.  
It integrates **4 live APIs**, supports **12 commands**, and is structured with **OOP principles**.

---

## ✨ Features

- 🎨 **Rich colored output** using Chalk
- ⏳ **Loading spinners** for API calls with Ora
- 🐙 **GitHub API** — user profiles & repositories
- 🌦️ **OpenWeatherMap API** — current weather & forecasts
- 💬 **ZenQuotes API** — random inspirational quotes (with local fallback)
- 😂 **JokeAPI** — programming & general jokes
- 🧮 **Math evaluation** using mathjs (supports `sin`, `sqrt`, `^`)
- 🌍 **World clock** with timezone support
- 📄 **File metadata** inspector
- 🏷️ **Flags/options** on every command
- ✅ **Input validation** layer
- 🔢 **Version command**
- 🆘 **Help descriptions** for all commands

---

## 📁 Project Structure

```
src/
├── index.ts              # CLI entry point
├── app.ts                # App class (OOP orchestrator)
├── commands/
│   ├── GreetCommand.ts
│   ├── FileInfoCommand.ts
│   ├── GitHubCommand.ts
│   ├── WeatherCommand.ts
│   ├── QuoteCommand.ts
│   ├── JokeCommand.ts
│   ├── CalcCommand.ts
│   └── TimeCommand.ts
├── api/
│   ├── BaseAPIClient.ts  # Abstract base class
│   ├── GitHubClient.ts
│   ├── WeatherClient.ts
│   ├── QuoteClient.ts
│   └── JokeClient.ts
└── utils/
    ├── logger.ts
    └── validator.ts
```

**OOP Design:**
- `BaseAPIClient` (abstract) → extended by `GitHubClient`, `WeatherClient`, `QuoteClient`, `JokeClient`
- `App` class owns the Commander program and orchestrates all command registrations
- Each `*Command` class encapsulates its own `register()` logic

---

## 🛠️ Setup

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/SESD-W2.git
cd SESD-W2

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your OpenWeatherMap API key
# Get a free key at: https://openweathermap.org/api

# 4. Build the project
npm run build
```

### Optional: Install globally
```bash
npm link
# Now you can use `nexus` globally
```

Or run directly without building:
```bash
npx ts-node src/index.ts <command>
```

---

## 📋 Available Commands

### `nexus greet <name>`
Display a personalized ASCII greeting.

```bash
nexus greet "Alice"
nexus greet "Alice" --lang hi   # Options: en, hi, es, fr, de, jp
```

---

### `nexus fileinfo <path>`
Show detailed metadata about any file.

```bash
nexus fileinfo package.json
nexus fileinfo src/index.ts --size-only
```

---

### `nexus github user <username>` *(GitHub API)*
Show a GitHub user's full profile.

```bash
nexus github user torvalds
nexus github user torvalds --json   # Raw JSON output
```

---

### `nexus github repos <username>` *(GitHub API)*
List the top starred repositories of a user.

```bash
nexus github repos torvalds
nexus github repos microsoft --limit 3
```

---

### `nexus weather current <city>` *(OpenWeatherMap API)*
Show current weather for a city. Requires `OPENWEATHER_API_KEY`.

```bash
nexus weather current "London"
nexus weather current "Mumbai"
```

---

### `nexus weather forecast <city>` *(OpenWeatherMap API)*
Show a 3-day weather forecast for a city.

```bash
nexus weather forecast "Tokyo"
```

---

### `nexus quote` *(ZenQuotes API)*
Fetch a random inspirational quote.

```bash
nexus quote
```

---

### `nexus joke` *(JokeAPI)*
Fetch a random joke.

```bash
nexus joke
nexus joke --category Programming   # Options: Programming, Misc, Dark, Any
```

---

### `nexus calc <expression>`
Safely evaluate a math expression using mathjs.  
Supports: `+`, `-`, `*`, `/`, `^`, `sqrt()`, `sin()`, `cos()`, `log()`, `pi`, `e`

```bash
nexus calc "2^10 + sqrt(144)"       # → 1036
nexus calc "sin(pi / 2)"            # → 1
nexus calc "(5 + 3) * 4 / 2"        # → 16
nexus calc "log(100, 10)"           # → 2
nexus calc "2^10" --precision 0
```

---

### `nexus time <timezone>`
Show the current time in any IANA timezone.

```bash
nexus time "Asia/Kolkata"
nexus time "America/New_York"
nexus time "Europe/London" --format 12
```

> Full timezone list: [Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

---

### `nexus --version` / `nexus -v`
Show the current CLI version.

```bash
nexus --version      # → 1.0.0
```

### `nexus --help`
Show all available commands and options.

```bash
nexus --help
nexus github --help
nexus weather --help
```

---

## 🔑 API Reference

| API | Key Required | Docs |
|---|---|---|
| GitHub REST API | ❌ No | [docs.github.com](https://docs.github.com/en/rest) |
| OpenWeatherMap | ✅ Yes (free) | [openweathermap.org/api](https://openweathermap.org/api) |
| ZenQuotes | ❌ No | [zenquotes.io](https://zenquotes.io) |
| JokeAPI | ❌ No | [jokeapi.dev](https://jokeapi.dev) |

---

## 🧩 Technologies Used

| Package | Purpose |
|---|---|
| `commander` | CLI framework |
| `chalk` | Colored terminal output |
| `axios` | HTTP client |
| `ora` | Loading spinners |
| `mathjs` | Safe math expression evaluator |
| `figlet` | ASCII art |
| `dotenv` | Environment variable management |
| `typescript` | Type safety |
| `ts-node` | Run TS directly for development |

---

## 👨‍💻 Author

**Vansh Agarwal** — SESD Workshop 2
