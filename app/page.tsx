'use client'

const speak = (event: React.MouseEvent<HTMLElement>) => {
  event.preventDefault();
  
  const textarea = document.getElementById("text") as HTMLInputElement;
  const text = textarea.value;
  console.log(textarea, event);

  const utterance = new SpeechSynthesisUtterance();

  utterance.text = text;
  utterance.voice = window.speechSynthesis.getVoices()[0];

  console.log('Trying to speak: ' + text);
  window.speechSynthesis.speak(utterance);
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
      <input id="text" value={"Hello world"} />
      <br />
      <button id="speak-button" onClick={(e) => speak(e)}>Speak</button>
      </div>
    </main>
  )
}
