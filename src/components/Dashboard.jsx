import React from 'react';
import { DollarSign, Calendar, Zap, Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ 
  monthly, yearly, daily, 
  suggestion, subscriptions, 
  darkMode, difference, 
  currency, exchangeRate, 
  t, formComponent 
}) => {
  const currencySymbol = currency === 'USD' ? '$' : '₴';
  const categoryColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#64748b'];
  const categoryKeys = ['Entertainment', 'Work', 'Education', 'Utilities', 'General'];

  const chartData = {
    labels: categoryKeys.map(key => t.categories[key]),
    datasets: [{
      data: categoryKeys.map(cat => 
        subscriptions
          .filter(s => s.category === cat)
          .reduce((acc, s) => {
            const priceInUSD = s.currency === 'UAH' ? s.price / exchangeRate : s.price;
            return acc + priceInUSD;
          }, 0)
      ),
      backgroundColor: categoryColors,
      borderWidth: 0,
      hoverOffset: 15
    }]
  };

  const options = {
    cutout: '82%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        titleColor: darkMode ? '#ffffff' : '#1e293b',
        bodyColor: darkMode ? '#94a3b8' : '#64748b',
        borderColor: darkMode ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
        <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><DollarSign size={18}/></div>
            <div className={`flex items-center text-[10px] font-black ${difference > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
              {difference > 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>} {Math.abs(difference)}%
            </div>
          </div>
          <div className="text-xl font-black">{currencySymbol}{monthly}</div>
          <p className="text-[9px] uppercase text-muted-foreground font-bold tracking-widest mt-1">{t.monthlySpend}</p>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
          <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 w-fit mb-2"><Calendar size={18}/></div>
          <div className="text-xl font-black">{currencySymbol}{yearly}</div>
          <p className="text-[9px] uppercase text-muted-foreground font-bold tracking-widest mt-1">{t.yearlyForecast}</p>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 w-fit mb-2"><Zap size={18}/></div>
          <div className="text-xl font-black">{currencySymbol}{daily}</div>
          <p className="text-[9px] uppercase text-muted-foreground font-bold tracking-widest mt-1">{t.dailyAverage}</p>
        </div>

        <div className="bg-blue-600/5 border border-blue-600/10 p-5 rounded-3xl flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-blue-500/5 rotate-12"><Lightbulb size={70} /></div>
          <span className="text-[9px] font-black uppercase text-blue-500 tracking-widest relative z-10">{t.hint}</span>
          <p className="text-[11px] font-bold text-blue-700 dark:text-blue-400 leading-tight relative z-10">{suggestion}</p>
        </div>
      </div>

      {/* Main Section: Chart & Form */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 flex-1 min-h-0 pb-2">
        {/* Chart Card */}
        <div className="xl:col-span-6 bg-card p-6 rounded-[2rem] border border-border flex flex-col items-center justify-between relative shadow-sm min-h-0">
          <div className="w-full flex justify-between items-center mb-4 shrink-0">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.distributionTitle}</h3>
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          
          <div className="relative w-full flex-1 min-h-[300px] max-h-[450px] xl:max-h-[500px] mx-auto">
            <Doughnut data={chartData} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] md:text-[11px] uppercase text-muted-foreground font-black tracking-[0.2em] mb-1">{t.total}</span>
              <span className="text-4xl md:text-6xl font-black text-foreground leading-none">{currencySymbol}{monthly}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 shrink-0">
            {categoryKeys.map((key, index) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: categoryColors[index] }} />
                <span className="text-[11px] font-black text-muted-foreground uppercase tracking-tight">{t.categories[key]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="xl:col-span-4 bg-card p-8 rounded-[2rem] border border-border shadow-sm flex flex-col justify-center h-full">
          {formComponent}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
