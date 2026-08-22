'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'mine' | 'explore'>('mine');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<any>(null);
  const [editingTicker, setEditingTicker] = useState('');
  const [formTicker, setFormTicker] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formType, setFormType] = useState('CEDEAR');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        new Notification('Análisis Financiero PWA', {
          body: '¡Notificaciones activadas en tu dispositivo!',
        });
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => setPortfolio(data));

    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => setNews(data));
  }, []);

  const totalPortfolio = portfolio.reduce((acc, item) => acc + Number(item.amount), 0);

  // Oportunidades sugeridas por el motor de análisis
  const opportunities = [
    { ticker: 'PAMP', name: 'Pampa Energía', catalyst: 'Balance Q2 masivo + Tarifas', target: '+22.4%', status: 'Alta Convicción', thesis: 'Fuerte generación de caja en dólares por exportación de gas y capacidad de transporte habilitada.' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', catalyst: 'Sobreventa por temor antitrust', target: '+18.1%', status: 'Value Play', thesis: 'Valuación castigada injustamente respecto a sus pares de Big Tech manteniendo márgenes del 30%.' },
    { ticker: 'AL30', name: 'Bono Soberano ARS', catalyst: 'Acumulación de reservas BCRA', target: '+31.0%', status: 'Riesgo Alto', thesis: 'Paridad atractiva con flujo de cupones garantizado en el mediano plazo si se consolida el superávit.' }
  ];

  const openModal = (ticker = '', amount = '', type = 'CEDEAR') => {
    if (ticker === 'NUEVO') {
      setEditingTicker('');
      setFormTicker('');
      setFormAmount('');
      setFormType('CEDEAR');
    } else {
      setEditingTicker(ticker);
      setFormTicker(ticker);
      setFormAmount(amount.toString());
      setFormType(type);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker: formTicker, amount: formAmount, type: formType }),
    });

    const res = await fetch('/api/portfolio');
    const data = await res.json();
    setPortfolio(data);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (confirm(`¿Seguro que vendiste todo ${formTicker}?`)) {
      await fetch(`/api/portfolio?ticker=${formTicker}`, { method: 'DELETE' });
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      setPortfolio(data);
      setIsModalOpen(false);
    }
  };

  return (
    <main className="min-h-screen pb-20 antialiased bg-[#070A11] text-slate-100">
      {/* Modal Tesis Inversión */}
      {selectedThesis && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center px-4">
          <div className="bg-[#0F1626] border border-sky-500/30 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded border border-sky-500/20">{selectedThesis.status}</span>
                <h3 className="text-lg font-bold text-slate-100 mt-1">{selectedThesis.ticker} - {selectedThesis.name}</h3>
              </div>
              <button onClick={() => setSelectedThesis(null)} className="text-slate-400 hover:text-white">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Catalizador Principal:</span>
                <p className="text-slate-200 font-semibold">{selectedThesis.catalyst}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Rendimiento Objetivo Proyectado:</span>
                <p className="text-emerald-400 font-mono font-bold text-sm">{selectedThesis.target}</p>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <span className="text-amber-400 font-semibold block mb-1">Tesis Estratégica:</span>
                <p className="text-slate-300 leading-relaxed">{selectedThesis.thesis}</p>
              </div>
            </div>
            <button onClick={() => setSelectedThesis(null)} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-xl text-xs font-semibold">Cerrar Tesis</button>
          </div>
        </div>
      )}

      {/* Modal Edición de Posición */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#0F1626] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  {editingTicker ? `Editar Posición: ${editingTicker}` : 'Cargar Nuevo Activo'}
                </h3>
                <p className="text-xs text-slate-400">Actualizá tus montos o compras/ventas</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Ticker / Activo</label>
                <input
                  type="text"
                  value={formTicker}
                  onChange={(e) => setFormTicker(e.target.value.toUpperCase())}
                  placeholder="Ej: YPFD, NVDA, AL30"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono uppercase focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tipo de Activo</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="CEDEAR">CEDEAR</option>
                    <option value="Acción AR">Acción AR (Merval)</option>
                    <option value="Renta Fija">Renta Fija / Bono</option>
                    <option value="ETF">ETF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Monto Invertido (ARS)</label>
                  <input
                    type="number"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="Ej: 40750"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center gap-3 border-t border-slate-800">
                {editingTicker && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-2 rounded-lg font-semibold"
                  >
                    <i className="fa-solid fa-trash-can mr-1"></i> Vendí Todo
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-4 py-2 rounded-lg font-bold">
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Estilo Terminal */}
      <header className="border-b border-slate-800/80 bg-[#070A11]/90 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-8 py-3.5 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center font-black text-slate-950 text-sm shadow-lg shadow-sky-500/20">
            AF
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-100 tracking-tight flex items-center gap-2">
              Análisis Financiero <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">PWA V2.4</span>
            </h1>
            <p className="text-[11px] text-slate-400">Terminal de Inversiones • Merval & Wall Street</p>
          </div>
        </div>

        <button
          onClick={requestNotificationPermission}
          className={`text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-2 transition ${
            notificationsEnabled
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-sky-500/10 text-sky-400 border-sky-500/30 hover:bg-sky-500/20'
          }`}
        >
          <i className={`fa-solid ${notificationsEnabled ? 'fa-bell' : 'fa-bell-slash'}`}></i>
          <span className="hidden sm:inline">{notificationsEnabled ? 'Alertas Activas' : 'Activar PWA'}</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
        
        {/* RESUMEN DE ESTADO DE CUENTA Y EVALUADOR DE RIESGO DEL SISTEMA */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0F1626] border border-slate-800 rounded-xl p-5 space-y-2">
            <span className="text-slate-400 text-xs font-medium">Patrimonio Total Monitoreado</span>
            <div className="text-2xl font-mono font-bold text-slate-100">
              ARS {totalPortfolio.toLocaleString('es-AR')}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <i className="fa-solid fa-arrow-trend-up"></i> Cartera diversificada en 9 activos
            </div>
          </div>

          <div className="bg-[#0F1626] border border-slate-800 rounded-xl p-5 space-y-2">
            <span className="text-slate-400 text-xs font-medium">Evaluador del Sistema (IA)</span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-sm font-bold text-slate-100">Riesgo Moderado / Alerta RGTI</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Sugerencia activa: Reducir posición especulativa en RGTI y tomar ganancia parcial en YPFD.
            </p>
          </div>

          <div className="bg-[#0F1626] border border-slate-800 rounded-xl p-5 space-y-2">
            <span className="text-slate-400 text-xs font-medium">Distribución por Mercado</span>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex mt-1">
              <div className="bg-sky-500 h-full w-[65%]" title="CEDEARs (65%)"></div>
              <div className="bg-amber-500 h-full w-[35%]" title="Acciones AR (35%)"></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>CEDEARs / Global: 65%</span>
              <span>Merval / Local: 35%</span>
            </div>
          </div>
        </section>

        {/* TABLA DE PORTFOLIO + PANEL DE NOTICIAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Columna Izquierda: Tabla Portfolio */}
          <section className="lg:col-span-7 space-y-6">
            <div className="bg-[#0F1626] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <div>
                  <h2 className="text-base font-bold text-slate-100">Posiciones de Cartera</h2>
                  <p className="text-xs text-slate-400">Monitoreo cuantitativo y órdenes sugeridas</p>
                </div>
                <button
                  onClick={() => openModal('NUEVO')}
                  className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-2"
                >
                  <i className="fa-solid fa-plus text-xs"></i> Nueva Posición
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="pb-3">Activo</th>
                      <th className="pb-3 text-right">Monto (ARS)</th>
                      <th className="pb-3 text-right">Rend.</th>
                      <th className="pb-3 text-center">Recomendación</th>
                      <th className="pb-3 text-right">Editar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                    {portfolio.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 font-semibold text-slate-100">
                          {item.ticker} <span className="text-[10px] text-slate-500 font-normal block">{item.type}</span>
                        </td>
                        <td className="text-right font-mono font-semibold text-slate-200">
                          ARS {Number(item.amount).toLocaleString('es-AR')}
                        </td>
                        <td className={`text-right font-semibold font-mono ${item.yield >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {item.yield >= 0 ? `+${item.yield}%` : `${item.yield}%`}
                        </td>
                        <td className="text-center">
                          <span className={`text-[10px] px-2.5 py-1 rounded-md border font-semibold ${
                            item.status === 'green' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            item.status === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {item.action}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => openModal(item.ticker, item.amount, item.type)}
                            className="text-slate-400 hover:text-sky-400 p-1.5"
                          >
                            <i className="fa-solid fa-pen-to-square text-sm"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECCIÓN DE OPORTUNIDADES Y RADAR DE MERCADO */}
            <div className="bg-[#0F1626] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Oportunidades Destacadas (Radar)</h3>
                  <p className="text-[11px] text-slate-400">Sugerencias del algoritmo según catalizadores</p>
                </div>
                <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded">3 Activos</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {opportunities.map((opp) => (
                  <div key={opp.ticker} className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-100 text-sm">{opp.ticker}</span>
                        <span className="text-emerald-400 font-mono font-bold text-xs">{opp.target}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{opp.name}</p>
                      <p className="text-[10px] text-slate-300 mt-2 font-medium">{opp.catalyst}</p>
                    </div>
                    <button
                      onClick={() => setSelectedThesis(opp)}
                      className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-sky-400 text-[10px] py-1.5 rounded font-semibold border border-slate-700 transition"
                    >
                      Ver Tesis Completa
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Columna Derecha: Panel Noticias */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-[#0F1626] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center space-x-4 text-xs">
                  <button
                    onClick={() => setActiveTab('mine')}
                    className={`pb-1.5 flex items-center gap-1.5 transition ${activeTab === 'mine' ? 'border-b-2 border-sky-400 text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <i className="fa-solid fa-briefcase text-[10px]"></i>
                    <span>Tus Empresas</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('explore')}
                    className={`pb-1.5 flex items-center gap-1.5 transition ${activeTab === 'explore' ? 'border-b-2 border-sky-400 text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <i className="fa-solid fa-globe text-[10px]"></i>
                    <span>Mercado General</span>
                  </button>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> EN VIVO
                </span>
              </div>

              <div className="space-y-3.5 max-h-[720px] overflow-y-auto pr-1">
                {news
                  .filter((n) => (activeTab === 'mine' ? n.type === 'MINE' : true))
                  .map((item) => (
                    <div key={item.id} className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400 font-medium">{item.source}</span>
                        <span className="text-slate-400 font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded">
                          {item.time} • {item.elapsed}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 leading-snug">{item.title}</h4>
                      <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-[11px] space-y-1">
                        <span className="text-amber-400 font-semibold text-[10px] uppercase tracking-wider block">{item.impactTitle}</span>
                        <p className="text-slate-300 leading-relaxed">{item.impactDescription}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>

        </div>
      </main>
    </main>
  );
}