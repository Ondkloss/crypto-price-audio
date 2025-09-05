'use client'

let lastPrice: Record<string, Price> | undefined = undefined

interface Price {
  usd: string
}

const speakEvent = (event: React.MouseEvent<HTMLElement>) => {
  event.preventDefault();

  const textarea = document.getElementById("text") as HTMLInputElement;
  const text = textarea.value;
  console.log(textarea, event);

  speak(text)
}

const speak = (value: string) => {
  const utterance = new SpeechSynthesisUtterance();

  utterance.text = value;
  utterance.voice = window.speechSynthesis.getVoices()[0];

  console.log('Trying to speak: ' + value);
  window.speechSynthesis.speak(utterance);
}

const price = async (): Promise<Record<string, Price>> => {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");

  var requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const r = await fetch("https://api.coingecko.com/api/v3/simple/price?x_cg_demo_api_key=CG-BkpMLW7e2hXjAfuk9cgNhGrn&ids=bitcoin,ethereum&vs_currencies=usd", requestOptions)
  const prices: Record<string, Price> = JSON.parse(await r.text())
  return prices
}

const speakPrice = async () => {
  const prices = await price()

  if(prices.bitcoin.usd === lastPrice?.bitcoin.usd && prices.ethereum.usd === lastPrice?.ethereum.usd) {
    speak("the price is the same")
  }
  else {
    speak("bitcoin is at " + prices.bitcoin.usd + " and ethereum is at " + prices.ethereum.usd)
  }

  lastPrice = prices
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <input id="text" />
        <br />
        <button id="speak-price" onClick={async (e) => {
          setInterval(async () => speakPrice(), 60000)
          speakPrice()
        }}>Price</button>
        <button id="speak-button" onClick={(e) => speakEvent(e)}>Speak</button>
      </div>
    </main>
  )
}
