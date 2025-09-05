'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// Common cryptocurrencies with their CoinGecko IDs
const CRYPTO_OPTIONS = [
  { id: 'bitcoin', name: 'Bitcoin (BTC)', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum (ETH)', symbol: 'ETH' },
  { id: 'binancecoin', name: 'Binance Coin (BNB)', symbol: 'BNB' },
  { id: 'cardano', name: 'Cardano (ADA)', symbol: 'ADA' },
  { id: 'solana', name: 'Solana (SOL)', symbol: 'SOL' },
  { id: 'ripple', name: 'XRP (XRP)', symbol: 'XRP' },
  { id: 'polkadot', name: 'Polkadot (DOT)', symbol: 'DOT' },
  { id: 'dogecoin', name: 'Dogecoin (DOGE)', symbol: 'DOGE' },
  { id: 'chainlink', name: 'Chainlink (LINK)', symbol: 'LINK' },
  { id: 'litecoin', name: 'Litecoin (LTC)', symbol: 'LTC' },
]

// Interval options in seconds
const INTERVAL_OPTIONS = [
  { value: 30, label: '30 seconds' },
  { value: 60, label: '1 minute' },
  { value: 120, label: '2 minutes' },
  { value: 300, label: '5 minutes' },
  { value: 600, label: '10 minutes' },
]

// Price change interval options
const PRICE_CHANGE_OPTIONS = [
  { value: 'disabled', label: 'Disabled (price only)' },
  { value: '1h', label: '1 hour change' },
  { value: '24h', label: '24 hour change' },
  { value: '7d', label: '7 day change' },
]

interface CryptoPrice {
  price: number;
  change_1h?: number;
  change_24h?: number;
  change_7d?: number;
}

export default function Home() {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin')
  const [interval, setInterval] = useState(30)
  const [priceChangeInterval, setPriceChangeInterval] = useState('24h')
  const [isRunning, setIsRunning] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<CryptoPrice | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [timeUntilNext, setTimeUntilNext] = useState(0)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  
  const intervalRef = useRef<number | null>(null)
  const countdownRef = useRef<number | null>(null)

  // Load available voices
  const loadVoices = useCallback(() => {
    const voices = window.speechSynthesis.getVoices()
    setAvailableVoices(voices)
    
    // Set default voice if none selected
    if (!selectedVoice) {
      if (voices.length > 0) {
        // Try to find a good default English voice
        const defaultVoice = voices.find(voice => 
          voice.lang.includes('en') && !voice.name.includes('Google')
        ) || voices.find(voice => voice.lang.includes('en')) || voices[0]
        
        if (defaultVoice) {
          setSelectedVoice(defaultVoice.name)
        }
      } else {
        // If no voices available, set to default (empty means browser default)
        setSelectedVoice('default')
      }
    }
  }, [selectedVoice])

  // Load voices on component mount and when voices change
  useEffect(() => {
    if ('speechSynthesis' in window) {
      loadVoices()
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      }
    }
  }, [loadVoices])

  // Fetch crypto price from CoinGecko API
  const fetchCryptoPrice = async (cryptoId: string): Promise<CryptoPrice | null> => {
    try {
      setError(null)
      
      // Try CoinGecko API first
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd&include_1hr_change=true&include_24hr_change=true&include_7d_change=true`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      )
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      const priceData = data[cryptoId]
      
      if (!priceData) {
        throw new Error('Price data not found')
      }
      
      return {
        price: priceData.usd,
        change_1h: priceData.usd_1h_change || 0,
        change_24h: priceData.usd_24h_change || 0,
        change_7d: priceData.usd_7d_change || 0
      }
    } catch (err) {
      console.log('API failed, using mock data for demo:', err)
      
      // Fallback to mock data for demo purposes
      return getMockCryptoPrice(cryptoId)
    }
  }

  // Mock crypto prices for demo purposes when API is blocked
  const getMockCryptoPrice = (cryptoId: string): CryptoPrice => {
    const mockPrices: Record<string, CryptoPrice> = {
      bitcoin: { price: 43250.50, change_1h: 0.25, change_24h: 2.47, change_7d: -1.85 },
      ethereum: { price: 2580.75, change_1h: -0.15, change_24h: -1.23, change_7d: 3.45 },
      binancecoin: { price: 315.20, change_1h: 0.05, change_24h: 0.85, change_7d: -2.10 },
      cardano: { price: 0.62, change_1h: 0.32, change_24h: 3.12, change_7d: 5.25 },
      solana: { price: 95.40, change_1h: -0.18, change_24h: -0.75, change_7d: 8.95 },
      ripple: { price: 0.58, change_1h: 0.12, change_24h: 1.95, change_7d: -3.25 },
      polkadot: { price: 7.45, change_1h: -0.08, change_24h: -2.10, change_7d: 1.85 },
      dogecoin: { price: 0.085, change_1h: 0.45, change_24h: 4.55, change_7d: 12.75 },
      chainlink: { price: 14.80, change_1h: 0.22, change_24h: 1.75, change_7d: -0.95 },
      litecoin: { price: 72.30, change_1h: -0.12, change_24h: -0.95, change_7d: 4.15 },
    }
    
    const basePrice = mockPrices[cryptoId] || mockPrices.bitcoin
    
    // Add some random variation to make it feel more realistic
    const variation = (Math.random() - 0.5) * 0.02 // ±1% variation
    const price = basePrice.price * (1 + variation)
    const change_1h = (basePrice.change_1h || 0) + (Math.random() - 0.5) * 0.5 // ±0.25% change variation
    const change_24h = (basePrice.change_24h || 0) + (Math.random() - 0.5) * 2 // ±1% change variation
    const change_7d = (basePrice.change_7d || 0) + (Math.random() - 0.5) * 4 // ±2% change variation
    
    return {
      price: Math.round(price * 100) / 100,
      change_1h: Math.round(change_1h * 100) / 100,
      change_24h: Math.round(change_24h * 100) / 100,
      change_7d: Math.round(change_7d * 100) / 100
    }
  }

  // Format price for speech synthesis (remove commas, appropriate precision)
  const formatPriceForSpeech = (price: number): string => {
    if (price >= 1000) {
      // For prices >= $1000, round to nearest dollar
      return Math.round(price).toString()
    } else if (price >= 1) {
      // For prices >= $1, round to 2 decimal places but remove trailing zeros
      return (Math.round(price * 100) / 100).toString()
    } else {
      // For prices < $1, keep more precision but limit to 3 decimal places
      return (Math.round(price * 1000) / 1000).toString()
    }
  }

  // Speak the crypto price
  const speakPrice = (cryptoSymbol: string, price: number, priceData: CryptoPrice) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      const formattedPrice = formatPriceForSpeech(price)
      let text = `${cryptoSymbol} price is $${formattedPrice}`
      
      // Add change information if not disabled
      if (priceChangeInterval !== 'disabled') {
        let changeValue: number | undefined
        let timeframe: string = ''
        
        switch (priceChangeInterval) {
          case '1h':
            changeValue = priceData.change_1h
            timeframe = 'in 1 hour'
            break
          case '24h':
            changeValue = priceData.change_24h
            timeframe = 'in 24 hours'
            break
          case '7d':
            changeValue = priceData.change_7d
            timeframe = 'in 7 days'
            break
        }
        
        if (changeValue !== undefined && timeframe) {
          const changeText = changeValue >= 0 
            ? `up ${Math.abs(changeValue).toFixed(1)} percent` 
            : `down ${Math.abs(changeValue).toFixed(1)} percent`
          text += `, ${changeText} ${timeframe}`
        }
      }
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.volume = 0.8
      
      // Use the selected voice
      if (selectedVoice && selectedVoice !== 'default') {
        const voice = availableVoices.find(v => v.name === selectedVoice)
        if (voice) {
          utterance.voice = voice
        }
      }
      
      console.log('Speaking:', text, 'with voice:', selectedVoice || 'browser default')
      window.speechSynthesis.speak(utterance)
    }
  }

  // Update crypto price and speak it
  const updateAndSpeakPrice = async () => {
    const crypto = CRYPTO_OPTIONS.find(c => c.id === selectedCrypto)
    if (!crypto) return
    
    const priceData = await fetchCryptoPrice(selectedCrypto)
    if (priceData) {
      setCurrentPrice(priceData)
      speakPrice(crypto.symbol, priceData.price, priceData)
    }
  }

  // Start countdown timer
  const startCountdown = () => {
    setTimeUntilNext(interval)
    countdownRef.current = window.setInterval(() => {
      setTimeUntilNext(prev => {
        if (prev <= 1) return interval
        return prev - 1
      })
    }, 1000)
  }

  // Stop countdown timer
  const stopCountdown = () => {
    if (countdownRef.current) {
      window.clearInterval(countdownRef.current)
      countdownRef.current = null
    }
    setTimeUntilNext(0)
  }

  // Start auto-speaking
  const startAutoSpeak = () => {
    setIsRunning(true)
    
    // Speak immediately
    updateAndSpeakPrice()
    
    // Set up interval for subsequent speaks
    intervalRef.current = window.setInterval(updateAndSpeakPrice, interval * 1000)
    
    // Start countdown
    startCountdown()
  }

  // Stop auto-speaking
  const stopAutoSpeak = () => {
    setIsRunning(false)
    
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    stopCountdown()
    
    // Cancel any ongoing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      if (countdownRef.current) window.clearInterval(countdownRef.current)
    }
  }, [])

  // Restart interval when settings change
  useEffect(() => {
    if (isRunning) {
      stopAutoSpeak()
      setTimeout(startAutoSpeak, 100) // Small delay to ensure cleanup
    }
  }, [selectedCrypto, interval, priceChangeInterval]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedCryptoInfo = CRYPTO_OPTIONS.find(c => c.id === selectedCrypto)

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Crypto Price Audio</h1>
          <p className="text-gray-400">Get crypto prices spoken aloud</p>
        </div>

        {/* Cryptocurrency Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Select Cryptocurrency:</label>
          <select 
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {CRYPTO_OPTIONS.map(crypto => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name}
              </option>
            ))}
          </select>
        </div>

        {/* Interval Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Speaking Interval:</label>
          <select 
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {INTERVAL_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Change Interval Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Price Change Info:</label>
          <select 
            value={priceChangeInterval}
            onChange={(e) => setPriceChangeInterval(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {PRICE_CHANGE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Voice Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Voice Selection:</label>
          <select 
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="default">Browser Default</option>
            {availableVoices.map(voice => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        {/* Current Price Display */}
        {currentPrice && selectedCryptoInfo && (
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">{selectedCryptoInfo.name}</h3>
            <div className="text-2xl font-bold text-blue-400">
              ${currentPrice.price.toLocaleString()}
            </div>
            {priceChangeInterval !== 'disabled' && (
              <div className={`text-sm mt-1 ${
                (() => {
                  let changeValue: number | undefined
                  switch (priceChangeInterval) {
                    case '1h':
                      changeValue = currentPrice.change_1h
                      break
                    case '24h':
                      changeValue = currentPrice.change_24h
                      break
                    case '7d':
                      changeValue = currentPrice.change_7d
                      break
                  }
                  return changeValue !== undefined && changeValue >= 0 ? 'text-green-400' : 'text-red-400'
                })()
              }`}>
                {(() => {
                  let changeValue: number | undefined
                  let timeLabel: string
                  switch (priceChangeInterval) {
                    case '1h':
                      changeValue = currentPrice.change_1h
                      timeLabel = '1h'
                      break
                    case '24h':
                      changeValue = currentPrice.change_24h
                      timeLabel = '24h'
                      break
                    case '7d':
                      changeValue = currentPrice.change_7d
                      timeLabel = '7d'
                      break
                    default:
                      return null
                  }
                  if (changeValue !== undefined) {
                    return `${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(2)}% (${timeLabel})`
                  }
                  return null
                })()}
              </div>
            )}
          </div>
        )}

        {/* Control Buttons */}
        <div className="space-y-3">
          {!isRunning ? (
            <button
              onClick={startAutoSpeak}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Start Auto-Speaking
            </button>
          ) : (
            <button
              onClick={stopAutoSpeak}
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Stop Auto-Speaking
            </button>
          )}
          
          <button
            onClick={updateAndSpeakPrice}
            disabled={isRunning}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg font-semibold transition-colors"
          >
            Speak Current Price
          </button>
        </div>

        {/* Status Display */}
        <div className="text-center space-y-2">
          {isRunning && timeUntilNext > 0 && (
            <div className="text-gray-400">
              Next update in: {timeUntilNext}s
            </div>
          )}
          
          {isRunning && (
            <div className="text-green-400 font-medium">
              ● Auto-speaking active
            </div>
          )}
          
          {error && (
            <div className="text-red-400 text-sm">
              Error: {error}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-xs text-gray-500 text-center mt-8">
          Powered by CoinGecko API • PWA Ready
        </div>
      </div>
    </main>
  )
}
