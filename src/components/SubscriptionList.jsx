import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ArchiveRestore } from 'lucide-react';
import dayjs from 'dayjs';
import SubscriptionItem from './SubscriptionItem';
// Імпортуємо нові UI-компоненти
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SubscriptionList = ({ 
  subscriptions, 
  viewCurrency, 
  exchangeRate, 
  deleteSubscription, 
  toggleArchive, 
  onEdit, 
  filterCategory, 
  setFilterCategory, 
  sortBy, 
  setSortBy, 
  t 
}) => {
  const [showArchive, setShowArchive] = useState(false);

  const activeSubs = useMemo(() => {
    let filtered = subscriptions.filter(s => !s.archived);
    if (filterCategory !== 'All') filtered = filtered.filter(s => s.category === filterCategory);
    
    return [...filtered].sort((a, b) => {
      if (sortBy === 'price') {
        const priceA = a.currency === 'UAH' ? a.price / exchangeRate : a.price;
        const priceB = b.currency === 'UAH' ? b.price / exchangeRate : b.price;
        return priceB - priceA;
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return dayjs(a.nextBillingDate).unix() - dayjs(b.nextBillingDate).unix();
    });
  }, [subscriptions, filterCategory, sortBy, exchangeRate]);

  const archivedSubs = useMemo(() => subscriptions.filter(s => s.archived), [subscriptions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold">{t.active} ({activeSubs.length})</h2>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Фільтр Сортування */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-9 w-[130px] bg-card border-input rounded-xl text-xs font-bold">
              <SelectValue placeholder={t.sortByDate} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-card shadow-xl">
              <SelectItem value="date" className="text-xs">{t.sortByDate}</SelectItem>
              <SelectItem value="price" className="text-xs">{t.sortByPrice}</SelectItem>
              <SelectItem value="name" className="text-xs">{t.sortByName}</SelectItem>
            </SelectContent>
          </Select>

          {/* Фільтр Категорій */}
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="h-9 w-[140px] bg-card border-input rounded-xl text-xs font-bold">
              <SelectValue placeholder={t.allCats} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-card shadow-xl">
              <SelectItem value="All" className="text-xs">{t.allCats}</SelectItem>
              {Object.entries(t.categories).map(([key, value]) => (
                <SelectItem key={key} value={key} className="text-xs">
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence mode="popLayout">
          {activeSubs.map(sub => (
            <motion.div key={sub.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SubscriptionItem 
                sub={sub} 
                currency={viewCurrency} 
                exchangeRate={exchangeRate} 
                deleteSubscription={deleteSubscription} 
                archiveSubscription={() => toggleArchive(sub.id)}
                onEdit={onEdit}
                t={t}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {archivedSubs.length > 0 && (
        <div className="mt-10 border-t border-border pt-6">
          <button 
            onClick={() => setShowArchive(!showArchive)} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            {showArchive ? <ChevronUp size={14}/> : <ChevronDown size={14}/>} 
            {t.archive} ({archivedSubs.length})
          </button>
          
          {showArchive && (
            <div className="grid grid-cols-1 gap-3 mt-4">
              {archivedSubs.map(sub => (
                <div key={sub.id} className="flex items-center gap-3">
                  <div className="flex-1 opacity-50 grayscale-[0.5]">
                    <SubscriptionItem 
                      sub={sub} 
                      currency={viewCurrency} 
                      exchangeRate={exchangeRate} 
                      deleteSubscription={deleteSubscription} 
                      archiveSubscription={() => toggleArchive(sub.id)} 
                      onEdit={onEdit}
                      t={t}
                    />
                  </div>
                  <button 
                    onClick={() => toggleArchive(sub.id)} 
                    className="h-10 w-10 flex items-center justify-center bg-card border border-border rounded-xl hover:text-blue-500 transition-all shrink-0 shadow-sm"
                  >
                    <ArchiveRestore size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriptionList;