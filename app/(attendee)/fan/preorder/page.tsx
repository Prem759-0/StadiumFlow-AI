"use client";

// ============================================================
// StadiumFlow AI - Pre-Order Food & Merchandise (Neo-Brutalist)
// Skip-the-line ordering with timed pickup slots
// ============================================================

import { useState, useEffect } from "react";
import { ShoppingBag, Plus, Minus, Clock, Check, MapPin, ChevronDown, Zap, ShoppingCart, Loader2, Bot, Sparkles, Package } from "lucide-react";
import { foodVendors, type MenuItem } from "@/lib/mock-data";
import { useAttendeeStore } from "@/lib/store";
import { generateId } from "@/lib/utils";

export default function PreOrderPage() {
  const [selectedVendor, setSelectedVendor] = useState(foodVendors[0].id);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [pickupSlot, setPickupSlot] = useState("10");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [deliveryProgress, setDeliveryProgress] = useState(0);
  const [aiSuggestion, setAiSuggestion] = useState<{item: MenuItem, vendorId: string, reason: string} | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { addPreOrder, addNotification, addPoints, profile } = useAttendeeStore();

  const vendor = foodVendors.find((v) => v.id === selectedVendor)!;

  const updateCart = (itemId: string, delta: number) => {
    setCart((prev) => {
      const newQty = (prev[itemId] || 0) + delta;
      if (newQty <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const item = vendor.menu.find((m) => m.id === id);
      return item ? { ...item, quantity: qty } : null;
    })
    .filter(Boolean) as (MenuItem & { quantity: number })[];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const placeOrder = () => {
    if (cartItems.length === 0) return;
    addPreOrder({
      id: generateId(),
      vendorId: vendor.id,
      vendorName: vendor.name,
      items: cartItems.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
      total,
      pickupTime: new Date(Date.now() + parseInt(pickupSlot) * 60000),
      status: "preparing",
    });
    addPoints(30);
    addNotification({
      id: generateId(),
      title: "Order Out for Delivery! 🚀",
      message: `Your order from ${vendor.name} is on its way to Seat ${profile.seatSection}-${profile.seatRow}-${profile.seatNumber}.`,
      type: "info",
      timestamp: new Date(),
      read: false,
    });
    
    setOrderPlaced(true);
    setDeliveryProgress(0);
    setCart({});
    
    // Simulate live delivery tracking
    const interval = setInterval(() => {
      setDeliveryProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setOrderPlaced(false), 3000); // Hide after fully delivered
          return 100;
        }
        return prev + 5; // Reaches 100% in a few seconds for demo
      });
    }, 400);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "#BF5FFF", border: "2px solid #000", boxShadow: "3px 3px 0 #000" }}>
          <ShoppingBag className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: "#050505" }}>Pre-Order & Skip Line</h1>
          <p className="text-xs" style={{ color: "#555555" }}>Order food & merch with timed pickup</p>
        </div>
        {cartCount > 0 && (
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ background: "#BF5FFF", border: "2px solid #000", boxShadow: "2px 2px 0 #000" }}>
            <ShoppingCart className="w-3.5 h-3.5 text-black" />
            <span className="text-xs font-black text-black">{cartCount}</span>
          </div>
        )}
      </div>

      {/* Live Seat Delivery Tracker */}
      {orderPlaced && (
        <div className="rounded-xl p-5 comic-panel relative overflow-hidden animate-bounce-in"
          style={{ background: "#00FF87", border: "4px solid #000", boxShadow: "6px 6px 0 #000" }}>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <h2 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
                <Package className="w-5 h-5" /> Live Seat Delivery
              </h2>
              <p className="text-xs font-bold text-black/80">
                {deliveryProgress < 100 ? "AI Drone/Runner is navigating to you..." : "Delivered! Enjoy! 🎉"}
              </p>
            </div>
            <span className="comic-label bg-white text-black">+30 PTS</span>
          </div>
          
          <div className="relative h-12 w-full mt-4">
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-white/50 border-2 border-black -translate-y-1/2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${deliveryProgress}%` }}
              />
            </div>
            <div 
              className="absolute top-0 transition-all duration-300 -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${deliveryProgress}%` }}
            >
              <div className="bg-[#FFE600] border-2 border-black p-1.5 rounded-full shadow-[2px_2px_0_#000]">
                {deliveryProgress < 100 ? <Zap className="w-4 h-4 text-black animate-pulse" /> : <Check className="w-4 h-4 text-black" />}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-2 px-1 relative z-10">
            <span className="text-[10px] font-bold uppercase text-black/70">Vendor</span>
            <span className="text-[10px] font-bold uppercase text-black/70">Seat {profile.seatSection}-{profile.seatRow}</span>
          </div>
        </div>
      )}

      {/* AI Smart Suggestion Panel */}
      <div className="rounded-xl p-5 comic-panel relative overflow-hidden"
        style={{ background: "#00C6FF", border: "3px solid #000", boxShadow: "6px 6px 0 #000" }}>
        {/* Background decorative pattern */}
        <div className="absolute -right-4 -top-4 opacity-20 pointer-events-none">
          <Bot className="w-24 h-24 text-black" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" />
            AI Smart Concessions
          </h2>
          
          {!aiSuggestion ? (
            <div>
              <p className="text-xs font-bold text-black/80 mb-4">
                Not sure what to eat? Let Gemini analyze the match context and current wait times to pick the best option for you!
              </p>
              <button
                onClick={() => {
                  setIsAiLoading(true);
                  setTimeout(() => {
                    const fastestVendor = [...foodVendors].sort((a, b) => a.currentWait - b.currentWait)[0];
                    const item = fastestVendor.menu.find(m => m.popular) || fastestVendor.menu[0];
                    setAiSuggestion({
                      item,
                      vendorId: fastestVendor.id,
                      reason: `Based on the high-energy match, you need something quick! ${fastestVendor.name} has the absolute shortest queue right now (${fastestVendor.currentWait} min) and their ${item.name} is a crowd favorite.`
                    });
                    setIsAiLoading(false);
                  }, 1500);
                }}
                disabled={isAiLoading}
                className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-[#FFE600] text-black border-[3px] border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-50"
              >
                {isAiLoading ? (
                  <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Analyzing queues...</span>
                ) : (
                  <span className="flex items-center justify-center gap-2"><Zap className="w-4 h-4" /> Get AI Recommendation</span>
                )}
              </button>
            </div>
          ) : (
            <div className="animate-fade-in space-y-3">
              <div className="bg-white p-3 rounded-lg border-2 border-black shadow-[3px_3px_0_#000]">
                <p className="text-xs font-bold text-[#555] italic mb-2">"{aiSuggestion.reason}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-black">{aiSuggestion.item.name}</p>
                    <p className="text-[10px] font-bold text-[#555] uppercase tracking-wider">{foodVendors.find(v => v.id === aiSuggestion.vendorId)?.name} · ₹{aiSuggestion.item.price}</p>
                  </div>
                  <span className="comic-label bg-[#00FF87] text-black text-[9px] border-black">FASTEST</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedVendor(aiSuggestion.vendorId);
                  setCart({ [aiSuggestion.item.id]: 1 });
                  // Scroll to bottom implicitly by user action
                }}
                className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-black text-[#00FF87] border-[3px] border-black shadow-[4px_4px_0_#00FF87] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#00FF87] transition-all"
              >
                Order AI Pick
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Vendor Selector */}
      <div>
        <label htmlFor="vendor-select" className="text-[11px] font-black uppercase tracking-wider mb-1.5 block" style={{ color: "#555555" }}>
          Select Vendor
        </label>
        <div className="relative">
          <select
            id="vendor-select"
            value={selectedVendor}
            onChange={(e) => { setSelectedVendor(e.target.value); setCart({}); }}
            className="w-full px-4 py-3 rounded-xl text-sm font-black border-[3px] focus:outline-none appearance-none cursor-pointer transition-shadow hover:shadow-[4px_4px_0_#000]"
            style={{ background: "#FFFFFF", borderColor: "#000000", color: "#050505" }}
          >
            {foodVendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.category}) — {v.currentWait} min wait
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#555555" }} />
        </div>
      </div>

      {/* Vendor Info Card */}
      <div className="rounded-xl p-4 flex items-center justify-between comic-panel"
        style={{ background: "#FFFFFF", border: "3px solid #000", boxShadow: "6px 6px 0 #000" }}>
        <div>
          <p className="text-sm font-black" style={{ color: "#050505" }}>{vendor.name}</p>
          <p className="text-xs font-bold capitalize mt-0.5" style={{ color: "#555555" }}>{vendor.category}</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{ background: "#00FF87", border: "2px solid #000", color: "#000" }}>
            <Clock className="w-3.5 h-3.5" />
            <span className="font-black">{vendor.currentWait} min</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{ background: "#FFFFFF", border: "2px solid #000000", color: "#050505" }}>
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-bold">{vendor.zoneId.replace("food-", "").toUpperCase()} Court</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: "#050505" }}>Menu</h2>
        <div className="space-y-2">
          {vendor.menu.map((item) => {
            const qty = cart[item.id] || 0;
            return (
              <div
                key={item.id}
                className="rounded-xl p-3.5 flex items-center justify-between transition-all duration-150"
                style={{
                  background: qty > 0 ? "#BF5FFF" : "#FFFFFF",
                  border: "3px solid #000",
                  boxShadow: qty > 0 ? "6px 6px 0 #000" : "3px 3px 0 #000",
                  transform: qty > 0 ? "translate(-3px, -3px)" : "none",
                  opacity: item.available ? 1 : 0.45,
                }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-black ${qty > 0 ? 'text-white' : 'text-black'}`}>{item.name}</p>
                    {item.popular && (
                      <span className="comic-label text-[9px]" style={{ background: "#FF3333", color: "#fff", borderColor: "#000" }}>🔥 HOT</span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 font-bold ${qty > 0 ? 'text-white/80' : 'text-[#555555]'}`}>
                    ₹{item.price} · Ready in {item.prepTime} min
                  </p>
                </div>

                {item.available ? (
                  <div className="flex items-center gap-2">
                    {qty > 0 && (
                      <>
                        <button onClick={() => updateCart(item.id, -1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-black transition-all hover:scale-110 active:scale-95"
                          style={{ background: "#FFFFFF", border: "2px solid #000000", color: "#050505" }}
                          aria-label={`Remove one ${item.name}`}>
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className={`text-sm font-black w-5 text-center tabular-nums ${qty > 0 ? 'text-white' : 'text-black'}`}>{qty}</span>
                      </>
                    )}
                    <button onClick={() => updateCart(item.id, 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-black transition-all hover:scale-110 active:scale-95"
                      style={{
                        background: qty > 0 ? "#FFFFFF" : "#FFFFFF",
                        border: "2px solid #000",
                        boxShadow: "2px 2px 0 #000",
                        color: "#000",
                      }}
                      aria-label={`Add one ${item.name}`}>
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-black px-2.5 py-1 rounded" style={{ background: "rgba(255,51,51,0.1)", color: "#FF3333", border: "1px solid #FF3333" }}>Sold Out</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart & Checkout */}
      {cartItems.length > 0 && (
        <div className="rounded-xl p-4 space-y-4 animate-slide-up comic-panel"
          style={{ background: "#FFFFFF", border: "3px solid #000", boxShadow: "6px 6px 0 #000" }}>
          <h3 className="text-xs font-black uppercase tracking-wider text-black">Your Order</h3>

          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-xs">
                <span style={{ color: "#555555" }}>{item.name} × {item.quantity}</span>
                <span className="font-black tabular-nums" style={{ color: "#050505" }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm pt-3" style={{ borderTop: "1px dashed rgba(0,255,135,0.3)" }}>
            <span style={{ color: "#555555" }}>Total</span>
            <span className="font-black tabular-nums" style={{ color: "#00FF87" }}>₹{total}</span>
          </div>

          {/* Pickup time */}
          <div>
            <label className="text-[11px] font-black uppercase tracking-wider mb-2 block" style={{ color: "#555555" }}>Pickup In</label>
            <div className="grid grid-cols-4 gap-2">
              {["10", "15", "20", "30"].map((mins) => (
                <button key={mins} onClick={() => setPickupSlot(mins)}
                  className="py-2.5 rounded-lg text-xs font-black uppercase transition-all duration-150 active:translate-y-1 hover:-translate-y-1"
                  style={{
                    background: pickupSlot === mins ? "#BF5FFF" : "#FFFFFF",
                    color: pickupSlot === mins ? "#FFFFFF" : "#000",
                    border: "2px solid #000",
                    boxShadow: pickupSlot === mins ? "none" : "3px 3px 0 #000",
                    transform: pickupSlot === mins ? "translate(3px, 3px)" : "none"
                  }}>
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <button onClick={placeOrder}
            className="w-full nb-btn nb-btn-green rounded-xl py-4 text-sm">
            <Zap className="w-5 h-5" />
            Place Pre-Order · ₹{total}
          </button>
        </div>
      )}
    </div>
  );
}
