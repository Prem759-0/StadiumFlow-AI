"use client";

// ============================================================
// StadiumFlow AI - Pre-Order Food & Merchandise
// Skip-the-line ordering with timed pickup slots
// ============================================================

import { useState } from "react";
import {
  ShoppingBag,
  Plus,
  Minus,
  Clock,
  Check,
  MapPin,
  ChevronDown,
} from "lucide-react";
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

  const placeOrder = () => {
    if (cartItems.length === 0) return;

    addPreOrder({
      id: generateId(),
      vendorName: vendor.name,
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      pickupTime: new Date(Date.now() + parseInt(pickupSlot) * 60000),
      status: "preparing",
    });

    addPoints(30);
    addNotification({
      id: generateId(),
      title: "Pre-Order Confirmed! 🍽️",
      message: `Your order from ${vendor.name} will be ready in ${pickupSlot} minutes. Skip the line and pick up!`,
      type: "info",
      timestamp: new Date(),
      read: false,
    });

    setOrderPlaced(true);
    setCart({});
    setTimeout(() => setOrderPlaced(false), 5000);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-accent-purple" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Pre-Order & Skip Line</h1>
          <p className="text-xs text-navy-400">
            Order food & merch with timed pickup
          </p>
        </div>
      </div>

      {/* Order Success */}
      {orderPlaced && (
        <div className="glass rounded-xl p-4 border-electric-500/30 bg-electric-500/10 flex items-center gap-3 animate-slide-up">
          <Check className="w-6 h-6 text-electric-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-electric-400">Order Placed!</p>
            <p className="text-xs text-navy-200">
              Ready in ~{pickupSlot} min. +30 points earned!
            </p>
          </div>
        </div>
      )}

      {/* Vendor Selector */}
      <div>
        <label htmlFor="vendor-select" className="text-xs text-navy-400 mb-1 block">
          Select Vendor
        </label>
        <div className="relative">
          <select
            id="vendor-select"
            value={selectedVendor}
            onChange={(e) => {
              setSelectedVendor(e.target.value);
              setCart({});
            }}
            className="w-full px-4 py-2.5 rounded-lg bg-navy-800 text-white text-sm border border-white/10 focus:border-electric-500/50 focus:outline-none appearance-none cursor-pointer"
          >
            {foodVendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.category}) - {v.currentWait} min wait
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
        </div>
      </div>

      {/* Vendor Info */}
      <div className="glass rounded-xl p-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">{vendor.name}</p>
          <p className="text-xs text-navy-400 capitalize">{vendor.category}</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-electric-400">
            <Clock className="w-3 h-3" /> {vendor.currentWait} min
          </span>
          <span className="flex items-center gap-1 text-navy-300">
            <MapPin className="w-3 h-3" /> {vendor.zoneId.replace("food-", "").toUpperCase()} Court
          </span>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-white">Menu</h2>
        {vendor.menu.map((item) => (
          <div
            key={item.id}
            className={`glass rounded-xl p-3 flex items-center justify-between transition-all ${
              !item.available ? "opacity-50" : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white">{item.name}</p>
                {item.popular && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-accent-amber/20 text-accent-amber">
                    🔥 HOT
                  </span>
                )}
              </div>
              <p className="text-xs text-navy-400">
                ₹{item.price} • Ready in {item.prepTime} min
              </p>
            </div>
            {item.available ? (
              <div className="flex items-center gap-2">
                {(cart[item.id] || 0) > 0 && (
                  <>
                    <button
                      onClick={() => updateCart(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-navy-700 flex items-center justify-center hover:bg-navy-600 transition-colors"
                      aria-label={`Remove one ${item.name}`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-5 text-center tabular-nums">
                      {cart[item.id]}
                    </span>
                  </>
                )}
                <button
                  onClick={() => updateCart(item.id, 1)}
                  className="w-7 h-7 rounded-lg bg-electric-500/20 text-electric-400 flex items-center justify-center hover:bg-electric-500/30 transition-colors"
                  aria-label={`Add one ${item.name}`}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span className="text-xs text-accent-red">Sold Out</span>
            )}
          </div>
        ))}
      </div>

      {/* Cart & Checkout */}
      {cartItems.length > 0 && (
        <div className="glass rounded-xl p-4 space-y-3 border-electric-500/20 bg-electric-500/5 animate-slide-up">
          <h3 className="text-sm font-bold text-white">Your Order</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-xs text-navy-200">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium text-white tabular-nums">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
          <div className="border-t border-white/10 pt-2 flex justify-between text-sm">
            <span className="text-navy-200">Total</span>
            <span className="font-bold text-electric-400 tabular-nums">
              ₹{total}
            </span>
          </div>

          {/* Pickup Slot */}
          <div>
            <label htmlFor="pickup-slot" className="text-xs text-navy-400 mb-1 block">
              Pickup in
            </label>
            <div className="flex gap-2">
              {["10", "15", "20", "30"].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setPickupSlot(mins)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    pickupSlot === mins
                      ? "bg-electric-500/20 text-electric-400 border border-electric-500/30"
                      : "bg-navy-800 text-navy-400 border border-white/5"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={placeOrder}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-electric-600 to-electric-500 text-navy-950 font-bold text-sm transition-all hover:shadow-lg hover:shadow-electric-500/30"
          >
            Place Pre-Order • ₹{total}
          </button>
        </div>
      )}
    </div>
  );
}
