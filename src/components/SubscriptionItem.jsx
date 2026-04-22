import React from 'react';
import { Trash2, Archive, Clock, Edit2 } from 'lucide-react';
import dayjs from 'dayjs';
import { Card, CardContent } from "./ui/card";

const categoryTheme = {
  Entertainment: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
  Work: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" },
  Education: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  Utilities: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  General: { bg: "bg-slate-100 dark:bg-slate-800/50", text: "text-slate-700 dark:text-slate-400", border: "border-slate-200 dark:border-slate-700" },
};

const SubscriptionItem = ({ sub, currency, exchangeRate, deleteSubscription, archiveSubscription, onEdit, t }) => {
  const daysLeft = dayjs(sub.nextBillingDate).diff(dayjs(), 'day');
  const progress = Math.max(0, Math.min(100, ((30 - daysLeft) / 30) * 100));
  const initials = sub.name.substring(0, 2).toUpperCase();
  const theme = categoryTheme[sub.category] || categoryTheme.General;

  const displayPrice = () => {
    const price = parseFloat(sub.price) || 0;
    const rate = parseFloat(exchangeRate) || 43.6;
    if (sub.currency === currency) return price.toFixed(2);
    return (sub.currency === 'USD' ? price * rate : price / rate).toFixed(2);
  };

  return (
    <Card className="bg-card border border-border overflow-hidden relative group transition-all hover:border-accent shadow-sm mb-1">
      <div className="absolute bottom-0 left-0 h-1 bg-muted w-full">
        <div className={`h-full transition-all duration-1000 ${daysLeft <= 3 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${progress}%` }} />
      </div>

      <CardContent className="flex justify-between items-center p-4 pb-5 gap-3">
        <div className="flex items-center gap-4 flex-1">
          <div className={`size-11 flex items-center justify-center rounded-xl border shrink-0 font-bold text-xs tracking-wider shadow-sm ${theme.bg} ${theme.text} ${theme.border}`}>
            {initials}
          </div>
          <div>
            <h3 className="font-bold leading-none mb-2 text-foreground">{sub.name}</h3>
            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${theme.bg} ${theme.text} ${theme.border}`}>
                {t.categories[sub.category] || sub.category}
              </span>
              <span className={`text-[11px] font-medium flex items-center gap-1 ${daysLeft <= 3 ? 'text-red-500' : 'text-muted-foreground'}`}>
                <Clock size={12}/> {daysLeft}{t.daysShort}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(sub)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-blue-500 transition-colors"><Edit2 size={16}/></button>
            <button onClick={() => archiveSubscription(sub.id)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-blue-500 transition-colors"><Archive size={16}/></button>
            <button onClick={() => deleteSubscription(sub.id)} className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16}/></button>
          </div>

          <div className="text-right min-w-[80px]">
            <span className="font-bold text-base text-foreground">
              {currency === 'USD' ? '$' : '₴'}{displayPrice()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionItem;
