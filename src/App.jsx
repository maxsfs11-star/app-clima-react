import { useState, useEffect } from "react";

function App() {
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [cidade, setCidade] = useState(() => {
    return localStorage.getItem("ultimaCidade") || "";
  });
  const [dadosClima, setDadosClima] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function buscarClima(nomeCidade = cidade) {
    if (nomeCidade.trim() === "") {
      setErro("Digite o nome de uma cidade.");
      setDadosClima(null);
      return;
    }

    try {
      setErro("");
      setCarregando(true);

      const apiKey = "e6fd4ff8d4378e1a25f023b7a22f2f97";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${nomeCidade},BR&appid=${apiKey}&units=metric&lang=pt_br`;

      const resposta = await fetch(url);
      const dados = await resposta.json();

      if (dados.cod !== 200) {
        setErro("Cidade não encontrada.");
        setDadosClima(null);
        return;
      }

      setMostrarDetalhes(false);
      setDadosClima(dados);
      localStorage.setItem("ultimaCidade", nomeCidade);
    } catch (error) {
      setErro("Ocorreu um erro ao buscar o clima.");
      setDadosClima(null);
    } finally {
      setCarregando(false);
    }
  }

  function pressionarEnter(e) {
    if (e.key === "Enter") {
      buscarClima();
    }
  }

  function pegarClasseClima() {
    if (!dadosClima) return "bg-padrao";

    const clima = dadosClima.weather[0].main.toLowerCase();

    if (clima.includes("clear")) return "bg-sol";
    if (clima.includes("cloud")) return "bg-nublado";
    if (clima.includes("rain")) return "bg-chuva";

    return "bg-padrao";
  }

  function pegarIconeClima() {
    if (!dadosClima) return "🌤️";

    const icone = dadosClima.weather[0].icon;

    if (icone.includes("01")) return "☀️";
    if (icone.includes("02")) return "🌤️";
    if (icone.includes("03") || icone.includes("04")) return "☁️";
    if (icone.includes("09") || icone.includes("10")) return "🌧️";
    if (icone.includes("11")) return "⛈️";
    if (icone.includes("13")) return "❄️";
    if (icone.includes("50")) return "🌫️";

    return "🌍";
  }

  useEffect(() => {
    const cidadeSalva = localStorage.getItem("ultimaCidade");

    if (cidadeSalva) {
      buscarClima(cidadeSalva);
    }
  }, []);

  return (
    <div className={`container ${pegarClasseClima()}`}>
      <div className="card">
        <h1 className="titulo">Clima 🌤️</h1>

        <div className="busca-area">
          <input
            type="text"
            name="cidade"
            id="cidade"
            placeholder="Digite uma cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            onKeyDown={pressionarEnter}
            className="input-cidade"
          />

          <button onClick={() => buscarClima()} className="botao-buscar">
            Buscar
          </button>
        </div>

        {carregando && <p className="carregando">Carregando...</p>}

        {erro && <p className="mensagem-erro">{erro}</p>}

        {dadosClima && !carregando && (
          <div className="resultado-clima">
            <h2 className="cidade">
              {dadosClima.name}, {dadosClima.sys.country}
            </h2>

            <div className="icone-clima">{pegarIconeClima()}</div>

            <p className="temperatura">{dadosClima.main.temp.toFixed(1)}°C</p>

            <p className="descricao">
              Clima: {dadosClima.weather[0].description}
            </p>

            <button
              className="botao-detalhes"
              onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
            >
              {mostrarDetalhes ? "Menos informações" : "Mais informações"}
            </button>

            {mostrarDetalhes && (
              <div className="detalhes-clima">
                <p>
                  Sensação térmica: {dadosClima.main.feels_like.toFixed(1)}°C
                </p>
                <p>Mínima: {dadosClima.main.temp_min.toFixed(1)}°C</p>
                <p>Máxima: {dadosClima.main.temp_max.toFixed(1)}°C</p>
                <p>Umidade: {dadosClima.main.humidity}%</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
