"use client";

// ============================================================
// StadiumFlow AI - Pre-Order Food & Merchandise (Neo-Brutalist)
// Skip-the-line ordering with timed pickup slots
// ============================================================

import { useState } from "react";
import { ShoppingBag, Plus, Minus, Clock, Check, MapPin, ChevronDown, Zap, ShoppingCart } from "lucide-react";
import { foodVendors, type MenuItem } from "@/lib/mock-data";
import { useAttendeeStore } from "@/lib/store";
import { generateId } from "@/lib/utils";

export default function PreOrderPage() {
  const [selectedVendor, setSelectedVendor] = useState(foodVendors[0].id);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [pickupSlot, setPickupSlot] = useState("10");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { addPreOrder, addNotification, addPoints } = useAttendeeStore();

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
      vendorName: vendor.name,
      items: cartItems.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
      total,
      pickupTime: new Date(Date.now() + parseInt(pickupSlot) * 60000),
      status: "preparing",
    });
    addPoints(30);
    addNotification({
      id: generateId(),
      title: "Pre-Order Confirmed! 🍽️",
      message: `Your order from ${vendor.name} will be ready in ${pickupSlot} minutes. Skip the line!`,
      type: "info",
      timestamp: new Date(),
      read: false,
    });
    setOrderPlaced(true);
    setCart({});
    setTimeout(() => setOrderPlaced(false), 5000);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "#BF5FFF", border: "2px solid #000", boxShadow: "3px 3px 0 #000" }}>
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: "#F5F0E8" }}>Pre-Order & Skip Line</h1>
          <p className="text-xs" style={{ color: "#5c6bc0" }}>Order food & merch with timed pickup</p>
        </div>
        {cartCount > 0 && (
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ background: "#BF5FFF", border: "2px solid #000", boxShadow: "2px 2px 0 #000" }}>
            <ShoppingCart className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-black text-white">{cartCount}</span>
          </div>
        )}
      </div>

      {/* Order Success Banner */}
      {orderPlaced && (
        <div className="rounded-xl p-4 flex items-center gap-3 animate-bounce-in"
          style={{ background: "rgba(0,255,135,0.08)", border: "2px solid #00FF87", boxShadow: "4px 4px 0 #00FF87" }}>
          <Check className="w-6 h-6 flex-shrink-0" style={{ color: "#00FF87" }} />
          <div>
            <p className="text-sm font-black" style={{ color: "#00FF87" }}>Order Placed! 🎉</p>
            <p className="text-xs" style={{ color: "#9fa8da" }}>Ready in ~{pickupSlot} min. +30 points earned!</p>
          </div>
          <span className="comic-label ml-auto">+30 PTS</span>
        </div>
      )}

      {/* Vendor Selector */}
      <div>
        <label htmlFor="vendor-select" className="text-[11px] font-black uppercase tracking-wider mb-1.5 block" style={{ color: "#5c6bc0" }}>
          Select Vendor
        </label>
        <div className="relative">
          <select
            id="vendor-select"
            value={selectedVendor}
            onChange={(e) => { setSelectedVendor(e.target.value); setCart({}); }}
            className="w-full px-4 py-3 rounded-xl text-sm font-bold border-2 focus:outline-none appearance-none cursor-pointer"
            style={{ background: "#1A1A1A", borderColor: "rgba(255,255,255,0.12)", color: "#F5F0E8" }}
          >
            {foodVendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.category}) — {v.currentWait} min wait
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#5c6bc0" }} />
        </div>
      </div>

      {/* Vendor Info Card */}
      <div className="rounded-xl p-4 flex items-center justify-between"
        style={{ background: "#111", border: "2px solid #BF5FFF", boxShadow: "4px 4px 0 #BF5FFF" }}>
        <div>
          <p className="text-sm font-black" style={{ color: "#F5F0E8" }}>{vendor.name}</p>
          <p className="text-xs capitalize mt-0.5" style={{ color: "#9fa8da" }}>{vendor.category}</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{ background: "rgba(0,255,135,0.1)", border: "1px solid rgba(0,255,135,0.3)", color: "#00FF87" }}>
            <Clock className="w-3.5 h-3.5" />
            <span className="font-black">{vendor.currentWait} min</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#5c6bc0" }}>
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-semibold">{vendor.zoneId.replace("food-", "").toUpperCase()} Court</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: "#F5F0E8" }}>Menu</h2>
        <div className="space-y-2">
          {vendor.menu.map((item) => {
            const qty = cart[item.id] || 0;
            return (
              <div
                key={item.id}
                className="rounded-xl p-3.5 flex items-center justify-between transition-all duration-150"
                style={{
                  background: "#111",
                  border: `2px solid ${qty > 0 ? "#BF5FFF" : "rgba(255,255,255,0.07)"}`,
                  boxShadow: qty > 0 ? "3px 3px 0 #BF5FFF" : "3px 3px 0 rgba(0,0,0,0.4)",
                  opacity: item.available ? 1 : 0.45,
                }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold" style={{ color: "#F5F0E8" }}>{item.name}</p>
                    {item.popular && (
                      <span className="comic-label text-[9px]" style={{ background: "#FF3333", color: "#fff", borderColor: "#000" }}>🔥 HOT</span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "#5c6bc0" }}>
                    ₹{item.price} · Ready in {item.prepTime} min
                  </p>
                </div>

                {item.available ? (
                  <div className="flex items-center gap-2">
                    {qty > 0 && (
                      <>
                        <button onClick={() => updateCart(item.id, -1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-black transition-all"
                          style={{ background: "#222", border: "2px solid rgba(255,255,255,0.12)", color: "#F5F0E8" }}
                          aria-label={`Remove one ${item.name}`}>
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-black w-5 text-center tabular-nums" style={{ color: "#BF5FFF" }}>{qty}</span>
                      </>
                    )}
                    <button onClick={() => updateCart(item.id, 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-black transition-all"
                      style={{
                        background: qty > 0 ? "#BF5FFF" : "rgba(191,95,255,0.15)",
                        border: "2px solid #BF5FFF",
                        boxShadow: qty > 0 ? "2px 2px 0 #000" : "none",
                        color: qty > 0 ? "#fff" : "#BF5FFF",
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
        <div className="rounded-xl p-4 space-y-4 animate-slide-up"
          style={{ background: "#111", border: "2px solid #00FF87", boxShadow: "4px 4px 0 #00FF87" }}>
          <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: "#00FF87" }}>Your Order</h3>

          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-xs">
                <span style={{ color: "#9fa8da" }}>{item.name} × {item.quantity}</span>
                <span className="font-black tabular-nums" style={{ color: "#F5F0E8" }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm pt-3" style={{ borderTop: "1px dashed rgba(0,255,135,0.3)" }}>
            <span style={{ color: "#9fa8da" }}>Total</span>
            <span className="font-black tabular-nums" style={{ color: "#00FF87" }}>₹{total}</span>
          </div>

          {/* Pickup time */}
          <div>
            <label className="text-[11px] font-black uppercase tracking-wider mb-2 block" style={{ color: "#5c6bc0" }}>Pickup In</label>
            <div className="grid grid-cols-4 gap-2">
              {["10", "15", "20", "30"].map((mins) => (
                <button key={mins} onClick={() => setPickupSlot(mins)}
                  className="py-2.5 rounded-lg text-xs font-black uppercase transition-all duration-150"
                  style={{
                    background: pickupSlot === mins ? "#00FF87" : "#0A0A0A",
                    color: pickupSlot === mins ? "#0A0A0A" : "#5c6bc0",
                    border: `2px solid ${pickupSlot === mins ? "#000" : "rgba(255,255,255,0.06)"}`,
                    boxShadow: pickupSlot === mins ? "2px 2px 0 #000" : "none",
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
