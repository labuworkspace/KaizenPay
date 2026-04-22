import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import SubscriptionForm from './components/SubscriptionForm';
import SubscriptionList from './components/SubscriptionList';
import './index.css';
import useDarkMode from './hooks/useDarkMode';
import { Button } from "@/components/ui/button";

import logo from './assets/Logo_Blue_120-120.png';

const translations = {
  UA: {
    title: "KaiZenPay",
    subtitle: "Менеджер підписок",
    budgetStable: "Ваш бюджет виглядає стабільним.",
    highSpend: "Витрати високі. Перевірте архівні сервіси.",
    entSpend: "Розваги — ваша найбільша стаття витрат.",
    active: "Активні",
    archive: "Архів",
    allCats: "Всі категорії",
    monthlySpend: "Місячні витрати",
    yearlyForecast: "Річний прогноз",
    dailyAverage: "В середньому за день",
    hint: "Порада",
    total: "Всього",
    namePlaceholder: "Назва",
    pricePlaceholder: "Ціна",
    categoryLabel: "Категорія",
    distributionTitle: "Розподіл витрат",
    addTitle: "Додати підписку",
    editTitle: "Редагувати підписку",
    addBtn: "Додати",
    saveBtn: "Зберегти",
    sortByDate: "За датою",
    sortByPrice: "За ціною",
    sortByName: "За назвою",
    categories: {
      Entertainment: "Розваги",
      Work: "Робота",
      Education: "Освіта",
      Utilities: "Комунальні",
      General: "Загальне"
    },
    daysShort: "д."
  },
  EN: {
    title: "KaiZenPay",
    subtitle: "Subscription Manager",
    budgetStable: "Your budget looks stable.",
    highSpend: "Expenses are high. Check unused services.",
    entSpend: "Entertainment is your top expense.",
    active: "Active",
    archive: "Archive",
    allCats: "All Categories",
    monthlySpend: "Monthly Spend",
    yearlyForecast: "Yearly Forecast",
    dailyAverage: "Daily Average",
    hint: "Finance Hint",
    total: "Total",
    namePlaceholder: "Name",
    pricePlaceholder: "Price",
    categoryLabel: "Category",
    distributionTitle: "Expense Distribution",
    addTitle: "Add Subscription",
    editTitle: "Edit Subscription",
    addBtn: "Add",
    saveBtn: "Save",
    sortByDate: "By Date",
    sortByPrice: "By Price",
    sortByName: "By Name",
    categories: {
      Entertainment: "Entertainment",
      Work: "Work",
      Education: "Education",
      Utilities: "Utilities",
      General: "General"
    },
    daysShort: "d."
  }
};

const App = () => {
  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('subscriptions');
    return saved ? JSON.parse(saved) : [];
  });
  const [language, setLanguage] = useState('UA');
  const t = translations[language];

  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newCurrency, setNewCurrency] = useState('USD');
  const [editingId, setEditingId] = useState(null);
  const [viewCurrency, setViewCurrency] = useState('USD');
  const [darkMode, setDarkMode] = useDarkMode();
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const EXCHANGE_RATE = 43.6;

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [subscriptions, darkMode]);

  const addSubscription = (e) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    if (editingId) {
      setSubscriptions(subscriptions.map(s => 
        s.id === editingId 
          ? { ...s, name: newName, price: parseFloat(newPrice), currency: newCurrency, category: newCategory }
          : s
      ));
      setEditingId(null);
    } else {
      const billingDate = new Date();
      billingDate.setDate(billingDate.getDate() + 30);
      const newSub = {
        id: Date.now(),
        name: newName,
        price: parseFloat(newPrice),
        currency: newCurrency,
        category: newCategory,
        nextBillingDate: billingDate.toISOString().split('T')[0],
        archived: false,
      };
      setSubscriptions([...subscriptions, newSub]);
    }
    setNewName(''); 
    setNewPrice('');
  };

  const calculateCosts = () => {
    const activeSubs = subscriptions.filter(s => !s.archived);
    const totalInUSD = activeSubs.reduce((acc, sub) => {
      const price = parseFloat(sub.price) || 0;
      return acc + (sub.currency === 'UAH' ? price / EXCHANGE_RATE : price);
    }, 0);

    const multiplier = viewCurrency === 'UAH' ? EXCHANGE_RATE : 1;
    const monthlyTotal = totalInUSD * multiplier;

    let suggestion = t.budgetStable;
    if (totalInUSD > 150) suggestion = t.highSpend;
    
    const activeWithPrices = activeSubs.filter(s => s.price > 0);
    const topCategory = activeWithPrices.length > 0 ?
      [...activeWithPrices].sort((a,b) => b.price - a.price)[0].category : "";
    
    if (topCategory === 'Entertainment') suggestion = t.entSpend;

    return {
      monthly: monthlyTotal.toFixed(2),
      yearly: (monthlyTotal * 12).toFixed(2),
      daily: (monthlyTotal / 30).toFixed(2),
      suggestion
    };
  };

  const { monthly, yearly, daily, suggestion } = calculateCosts();

  return (
    // Змінено h-screen на min-h-screen та прибрано overflow-hidden для мобільних
    <div className="min-h-screen w-full bg-background text-foreground p-4 md:p-6 lg:p-8 transition-colors flex flex-col">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>

      <div className="max-w-[1800px] mx-auto w-full flex-1 flex flex-col">
        {/* Адаптивний хедер: на мобільних стає в колонку */}
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-lg"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight leading-none">{t.title}</h1>
              <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <Button variant="outline" size="sm" onClick={() => setLanguage(l => l === 'UA' ? 'EN' : 'UA')} className="flex-1 sm:flex-none font-bold border-border bg-card">
              {language}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewCurrency(v => v === 'USD' ? 'UAH' : 'USD')} className="flex-1 sm:flex-none font-bold border-border bg-card">
              {viewCurrency === 'USD' ? '$' : '₴'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setDarkMode(!darkMode)} className="border-border bg-card">
              {darkMode ? '☀️' : '🌙'}
            </Button>
          </div>
        </header>

        {/* Контентна сітка: на мобільних один під одним */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          <div className="lg:col-span-8 flex flex-col">
            <Dashboard 
              monthly={monthly} yearly={yearly} daily={daily}
              suggestion={suggestion} subscriptions={subscriptions.filter(s => !s.archived)} 
              darkMode={darkMode} currency={viewCurrency} exchangeRate={EXCHANGE_RATE}
              difference={-2.4} t={t}
              formComponent={
                <SubscriptionForm
                  newName={newName} setNewName={setNewName}
                  newPrice={newPrice} setNewPrice={setNewPrice}
                  newCategory={newCategory} setNewCategory={setNewCategory}
                  newCurrency={newCurrency} setNewCurrency={setNewCurrency}
                  addSubscription={addSubscription} isEditing={!!editingId}
                  t={t}
                />
              }
            />
          </div>

          <div className="lg:col-span-4 flex flex-col mt-4 lg:mt-0">
            {/* Додано обмеження висоти для списку тільки на десктопі */}
            <div className="lg:flex-1 lg:overflow-y-auto lg:custom-scrollbar lg:pr-2">
              <SubscriptionList
                subscriptions={subscriptions} viewCurrency={viewCurrency}
                exchangeRate={EXCHANGE_RATE} 
                deleteSubscription={(id) => setSubscriptions(subscriptions.filter(s => s.id !== id))}
                toggleArchive={(id) => setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, archived: !s.archived } : s))}
                onEdit={(sub) => {
                  setEditingId(sub.id);
                  setNewName(sub.name);
                  setNewPrice(sub.price.toString());
                  setNewCategory(sub.category);
                  setNewCurrency(sub.currency);
                }}
                filterCategory={filterCategory} setFilterCategory={setFilterCategory}
                sortBy={sortBy} setSortBy={setSortBy} t={t}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
