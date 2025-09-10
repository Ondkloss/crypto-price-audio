# Crypto Price Audio

A Progressive Web App (PWA) that speaks cryptocurrency prices at regular intervals. Built with Next.js, TypeScript, and TailwindCSS.

## 🚀 Live Demo

**Access the app directly from GitHub Pages:** [https://ondkloss.github.io/crypto-price-audio/](https://ondkloss.github.io/crypto-price-audio/)

No installation required! Just visit the link above to use the app in your browser.

## Features

- 🔊 Text-to-speech cryptocurrency price announcements
- ⏰ Configurable speaking intervals (30s to 10 minutes)
- 📈 Price change information (1h, 24h, 7d)
- 🎙️ Voice selection options
- 📱 Progressive Web App (PWA) - install on your device
- 🌙 Dark theme interface
- 💰 Supports popular cryptocurrencies (Bitcoin, Ethereum, and more)

## 🛠️ Local Development

This is a [Next.js](https://nextjs.org/) project. To run it locally:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 🏗️ Build and Deploy

### GitHub Pages (Automatic)

This project is automatically deployed to GitHub Pages using GitHub Actions:

- Every push to the `main` branch triggers a build and deployment
- The built static files are deployed to the `gh-pages` branch
- The app is then available at: `https://ondkloss.github.io/crypto-price-audio/`

### Manual Build

To build the project locally:

```bash
# Build for production
npm run build

# The static files will be generated in the ./out directory
```

### Other Deployment Options

You can also deploy this Next.js app to other platforms:

- **Vercel**: Use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
- **Netlify**: Connect your GitHub repository to Netlify
- **Any static hosting**: Use the files from the `./out` directory after running `npm run build`

## 📖 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [TailwindCSS](https://tailwindcss.com/) - utility-first CSS framework
- [CoinGecko API](https://www.coingecko.com/en/api) - cryptocurrency data provider

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📢 Disclosure

This repo is very much made possible by Copilot, which did the bulk of the code. Thanks for the assist Copilot!
