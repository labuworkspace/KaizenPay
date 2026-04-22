import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SubscriptionForm = ({ 
  newName, setNewName, newPrice, setNewPrice, 
  newCategory, setNewCategory, newCurrency, setNewCurrency, 
  addSubscription, isEditing, t 
}) => {
  return (
    <form onSubmit={addSubscription} className="h-full flex flex-col justify-between gap-6">
      <div className="space-y-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
          {isEditing ? t.editTitle : t.addTitle}
        </h3>

        {/* Назва */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase ml-1 text-muted-foreground">{t.namePlaceholder}</label>
          <Input 
            type="text" 
            placeholder="Netflix, Spotify..." 
            className="h-12 bg-background border-input rounded-xl text-base focus-visible:ring-blue-500/20"
            value={newName} onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        
        {/* Ціна та Валюта */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase ml-1 text-muted-foreground">{t.pricePlaceholder}</label>
          <div className="flex gap-2">
            <Input 
              type="number" min="0" step="0.01" placeholder="0.00" 
              className="h-12 bg-background border-input rounded-xl text-base flex-1 focus-visible:ring-blue-500/20"
              value={newPrice} onChange={(e) => setNewPrice(e.target.value)}
            />
            
            <Select value={newCurrency} onValueChange={setNewCurrency}>
              <SelectTrigger className="h-12 w-[110px] rounded-xl border-input bg-background font-bold focus:ring-blue-500/20">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-card shadow-xl">
                <SelectItem value="USD" className="rounded-lg cursor-pointer">$ USD</SelectItem>
                <SelectItem value="UAH" className="rounded-lg cursor-pointer">₴ UAH</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      
        {/* Категорія */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase ml-1 text-muted-foreground">{t.categoryLabel}</label>
          <Select value={newCategory} onValueChange={setNewCategory}>
            <SelectTrigger className="h-12 w-full rounded-xl border-input bg-background font-medium focus:ring-blue-500/20">
              <SelectValue placeholder={t.categoryLabel} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-card shadow-xl">
              {Object.entries(t.categories).map(([key, value]) => (
                <SelectItem key={key} value={key} className="rounded-lg cursor-pointer">
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        type="submit" 
        className={cn(
          "h-14 w-full rounded-2xl flex items-center justify-center gap-3 text-base font-bold transition-all text-white",
          // ДИНАМІЧНА ЧАСТИНА:
          isEditing 
            ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30" 
            : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
        )}
      >
        {isEditing ? <CheckCircle className="size-5" /> : <PlusCircle className="size-5" />}
        <span>{isEditing ? t.saveBtn : t.addBtn}</span>
      </Button>
    </form>
  );
};

export default SubscriptionForm;