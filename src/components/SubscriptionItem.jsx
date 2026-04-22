import React from 'react';
import { Pencil, Trash2, Archive, ArchiveRestore, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";

const SubscriptionItem = ({ sub, deleteSubscription, toggleArchive, onEdit, viewCurrency, exchangeRate, t }) => {
  const displayPrice = sub.currency === 'UAH' && viewCurrency === 'USD' 
    ? (sub.price / exchangeRate).toFixed(2) 
    : sub.currency === 'USD' && viewCurrency === 'UAH'
    ? (sub.price * exchangeRate).toFixed(2)
    : sub.price.toFixed(2);

  const currencySymbol = viewCurrency === 'USD' ? '$' : '₴';

  const categoryStyles = {
    Entertainment: "bg-blue-500/10 text-blue-600 border-blue-200",
    Work: "bg-purple-500/10 text-purple-600 border-purple-200",
    Education: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    Utilities: "bg-amber-500/10 text-amber-600 border-amber-200",
    General: "bg-slate-500/10 text-slate-600 border-slate-200"
  };

  // Функція-обробник, щоб уникнути спливання подій
  const handleArchive = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleArchive(sub.id);
  };

  return (
    <div className={`group bg-card p-4 rounded-3xl border border-border shadow-sm transition-all hover:shadow-md ${sub.archived ? 'opacity-60 bg-muted/30' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Інформація про підписку */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 font-bold text-lg ${categoryStyles[sub.category] || categoryStyles.General}`}>
            {sub.name.substring(0, 2).toUpperCase()}
          </div>
          
          <div className="min-w-0 flex flex-col">
            <h4 className="font-black text-foreground truncate text-base leading-tight">
              {sub.name}
            </h4>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${categoryStyles[sub.category] || categoryStyles.General}`}>
                {t.categories[sub.category]}
              </span>
              <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-bold">
                <Clock size={12} />
                29 {t.daysShort}
              </div>
            </div>
          </div>
        </div>

        {/* Права частина: Кнопки та Ціна */}
        <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-dashed border-border pt-3 sm:pt-0 sm:border-0">
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-xl hover:bg-blue-500/10 hover:text-blue-600" 
              onClick={() => onEdit(sub)}
            >
              <Pencil size={14} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-xl hover:bg-purple-500/10 hover:text-purple-600 relative z-10" 
              onClick={handleArchive} // Використовуємо новий обробник
            >
              {sub.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-xl hover:bg-red-500/10 hover:text-red-600" 
              onClick={() => deleteSubscription(sub.id)}
            >
              <Trash2 size={14} />
            </Button>
          </div>

          <div className="text-right shrink-0">
            <span className="text-lg font-black text-foreground">
              <span className="text-sm mr-0.5">{currencySymbol}</span>
              {displayPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionItem;
