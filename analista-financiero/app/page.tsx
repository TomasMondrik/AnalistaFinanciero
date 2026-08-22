'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'mine' | 'explore'>('mine');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicker, setEditingTicker] = useState('');
  const [formTicker, setFormTicker] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formType, setFormType] = useState('CEDEAR');

  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => setPortfolio(data));

    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => setNews(data));
  }, []);

  const totalPortfolio = portfolio.reduce((acc, item) => acc + Number(item.amount), 0);

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
    <main className="min-h-screen pb-16 antialiased relative">
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#111726] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
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

      <header className="border-b border-slate-800/80 bg-[#090D16]/90 sticky top-0 z-40 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-100 text-lg">
            AF
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-100 tracking-tight">Análisis Financiero</h1>
            <p className="text-xs text-slate-400">Mercado Argentina & EE.UU.</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-[#111726] border border-slate-800 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <div>
                <h2 className="text-base font-semibold text-slate-100">Tu Portfolio</h2>
                <p className="text-xs text-slate-400">Posiciones actuales y monitoreo continuo</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 bg-slate-800/60 border border-slate-700/50 px-2.5 py-1.5 rounded-md font-mono">
                  Total: ARS {totalPortfolio.toLocaleString('es-AR')}
                </span>
                <button
                  onClick={() => openModal('NUEVO')}
                  className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i> Cargar / Modificar
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="pb-3">Activo</th>
                    <th className="pb-3 text-right">Monto (ARS)</th>
                    <th className="pb-3 text-right">Rend.</th>
                    <th className="pb-3 text-center">Sugerencia IA</th>
                    <th className="pb-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-medium text-slate-300">
                  {portfolio.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 font-semibold text-slate-100">
                        {item.ticker} <span className="text-[10px] text-slate-500 font-normal">{item.type}</span>
                      </td>
                      <td className="text-right font-mono font-semibold text-slate-200">
                        ARS {Number(item.amount).toLocaleString('es-AR')}
                      </td>
                      <td className={`text-right font-semibold ${item.yield >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.yield >= 0 ? `+${item.yield}%` : `${item.yield}%`}
                      </td>
                      <td className="text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border ${
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
                          className="text-slate-400 hover:text-sky-400 p-1"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="lg:col-span-5 space-y-6">
          <div className="bg-[#111726] border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-4 text-xs">
                <button
                  onClick={() => setActiveTab('mine')}
                  className={`pb-1 flex items-center gap-1.5 ${activeTab === 'mine' ? 'border-b-2 border-sky-400 text-sky-400 font-semibold' : 'text-slate-500'}`}
                >
                  <span>Tus Empresas</span>
                </button>
                <button
                  onClick={() => setActiveTab('explore')}
                  className={`pb-1 flex items-center gap-1.5 ${activeTab === 'explore' ? 'border-b-2 border-sky-400 text-sky-400 font-semibold' : 'text-slate-500'}`}
                >
                  <span>Noticias</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">24/7 EN VIVO</span>
            </div>

            <div className="space-y-3.5 max-h-[680px] overflow-y-auto pr-1">
              {news
                .filter((n) => (activeTab === 'mine' ? n.type === 'MINE' : true))
                .map((item) => (
                  <div key={item.id} className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-medium">{item.source}</span>
                      <span className="text-slate-400 font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded">
                        {item.time} • {item.elapsed}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-100">{item.title}</h4>
                    <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80 text-[11px] space-y-1">
                      <span className="text-amber-400 font-medium text-[10px] uppercase block">{item.impactTitle}</span>
                      <p className="text-slate-300 leading-relaxed">{item.impactDescription}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </main>
  );
}