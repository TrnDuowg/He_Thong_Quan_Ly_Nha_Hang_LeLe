import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Minus, Trash2, ShoppingCart, 
  CreditCard, Banknote, QrCode, ArrowLeft, Check, Delete, 
  Utensils, ShoppingBag, Truck, Ticket, Percent, ChefHat, RefreshCw
} from 'lucide-react';
import Receipt from '../../components/pos/Receipt';

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE DỮ LIỆU ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCat, setSelectedCat] = useState('All');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- STATE GIAO DIỆN & LOGIC ---
  const initialMode = location.state?.startMode || 'ordering';
  const [mode, setMode] = useState(initialMode); // 'ordering' | 'payment'
  const [orderType, setOrderType] = useState(location.state?.orderType || 'dine_in');
  
  // --- STATE THANH TOÁN ---
  const [amountReceived, setAmountReceived] = useState(''); 
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0); 

  // --- RECEIPT & TABLE ---
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const currentTable = location.state?.tableName || 'Khách Lẻ';
  const currentTableId = location.state?.tableId;

  // --- 1. LOAD API ---
  useEffect(() => {
    const initData = async () => {
      try {
        const resProd = await fetch('http://localhost:3000/api/products');
        const dataProd = await resProd.json();
        if (Array.isArray(dataProd)) {
          setProducts(dataProd);
          setCategories(['All', ...new Set(dataProd.map(p => p.category_name))]);
        }
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    initData();
  }, []);

  // --- 2. TÍNH TOÁN TIỀN ---
  const subTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxRate = 0.08; // Thuế 8%
  const taxAmount = (subTotal - discountAmount) * taxRate; 
  const totalAmount = Math.max(0, subTotal - discountAmount + taxAmount); 
  const changeAmount = (Number(amountReceived) || 0) - totalAmount;

  // --- 3. ACTIONS ---
  const addToCart = (product) => {
    const exist = cart.find(x => x.id === product.id);
    if (exist) setCart(cart.map(x => x.id === product.id ? { ...x, qty: x.qty + 1 } : x));
    else setCart([...cart, { ...product, qty: 1, note: '' }]);
  };
  const updateQty = (id, delta) => {
    setCart(cart.map(item => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item).filter(item => item.qty > 0));
  };
  const removeItem = (id) => setCart(cart.filter(item => item.id !== id));

  // --- 4. ÁP DỤNG MÃ GIẢM GIÁ ---
  const applyDiscount = async () => {
    if (!discountCode.trim()) return;
    try {
        const res = await fetch('http://localhost:3000/api/promotions/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: discountCode, orderTotal: subTotal })
        });
        const data = await res.json();
        if (res.ok) {
            setDiscountAmount(data.discountAmount);
            alert(`✅ ${data.message}`);
        } else {
            setDiscountAmount(0);
            alert(`❌ ${data.message}`);
        }
    } catch (e) { alert("Lỗi kết nối"); }
  };

  // --- 5. GỬI BẾP (KHÔNG THANH TOÁN) ---
  const handleSendKitchen = async () => {
    if (cart.length === 0) return alert("Giỏ hàng trống!");
    const orderData = {
        items: cart, sub_total: subTotal, discount: discountAmount, tax: taxAmount, total_amount: totalAmount,
        staff_id: 1, order_type: orderType, table_id: orderType === 'dine_in' ? currentTableId : null,
        payment: null 
    };
    try {
        const res = await fetch('http://localhost:3000/api/orders', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData)
        });
        if (res.ok) {
            if (currentTableId) {
                await fetch(`http://localhost:3000/api/tables/${currentTableId}/status`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'occupied' })
                });
            }
            alert("✅ Đã gửi đơn xuống bếp!");
            navigate('/pos/tables');
        } else { alert("Lỗi gửi đơn"); }
    } catch (e) { alert("Lỗi kết nối"); }
  };

  // --- 6. THANH TOÁN HOÀN TẤT ---
  const handlePaymentComplete = async () => {
    if (cart.length === 0) return alert("Giỏ hàng trống!");
    const orderData = {
        items: cart, sub_total: subTotal, discount: discountAmount, tax: taxAmount, total_amount: totalAmount,
        staff_id: 1, order_type: orderType, table_id: orderType === 'dine_in' ? currentTableId : null,
        payment: { method: paymentMethod, received: amountReceived }
    };
    try {
        const res = await fetch('http://localhost:3000/api/orders', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData)
        });
        const data = await res.json();
        if (res.ok) {
            setLastOrder({ ...data.order, items: [...cart], sub_total: subTotal, discount: discountAmount, tax: taxAmount, total_amount: totalAmount, payment: { received: amountReceived } });
            setShowReceipt(true);
            if (currentTableId) {
                await fetch(`http://localhost:3000/api/tables/${currentTableId}/status`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'available' })
                });
            }
            setCart([]); setMode('ordering'); setAmountReceived(''); setDiscountAmount(0); setDiscountCode('');
        } else { alert(data.message); }
    } catch (e) { alert("Lỗi kết nối"); }
  };

  // --- FILTER ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCat === 'All' || p.category_name === selectedCat;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCat, searchTerm]);

  // --- NUMPAD COMPONENT ---
  const Numpad = () => {
    const handleNum = (val) => {
        if (val === 'BACK') setAmountReceived(prev => prev.slice(0, -1));
        else if (val === 'C') setAmountReceived('');
        else setAmountReceived(prev => prev + val);
    };
    return (
        <div className="grid grid-cols-3 gap-3 h-full">
            {[1,2,3,4,5,6,7,8,9].map(n => <button key={n} onClick={()=>handleNum(n)} className="bg-white border rounded-xl text-2xl font-bold py-4 hover:bg-blue-50 transition-all shadow-sm">{n}</button>)}
            <button onClick={()=>handleNum('000')} className="bg-slate-100 border rounded-xl font-bold text-slate-600 text-xl">000</button>
            <button onClick={()=>handleNum(0)} className="bg-white border rounded-xl text-2xl font-bold">0</button>
            <button onClick={()=>handleNum('BACK')} className="bg-red-50 border border-red-100 text-red-500 rounded-xl flex items-center justify-center"><Delete/></button>
        </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-60px)] w-full bg-slate-100 p-3 gap-3 overflow-hidden font-sans text-slate-900">
      
      {/* ================= CỘT TRÁI (THAY ĐỔI THEO MODE) ================= */}
      <div className="flex-[2] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
        
        {/* VIEW 1: CHỌN MÓN */}
        {mode === 'ordering' ? (
            <>
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[65%]">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setSelectedCat(cat)} 
                                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedCat === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                                {cat === 'All' ? 'Tất cả' : cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-56">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Tìm tên món..." 
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50">
                    {loading ? <div className="text-center mt-20 text-slate-400">Đang tải thực đơn...</div> : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map(item => (
                                <div key={item.id} onClick={() => addToCart(item)} 
                                    className="bg-white p-3 rounded-2xl cursor-pointer border border-transparent hover:border-blue-500 shadow-sm flex flex-col h-full active:scale-95 transition-all group">
                                    <div className="aspect-square rounded-xl bg-slate-100 mb-3 overflow-hidden relative">
                                        <img src={item.image_url} onError={(e)=>e.target.src='https://via.placeholder.com/150'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute bottom-2 right-2 bg-white p-1.5 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={16} className="text-blue-600"/></div>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight mb-1">{item.name}</h4>
                                    <span className="text-blue-600 font-bold text-base mt-auto">{Number(item.price).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </>
        ) : (
            // VIEW 2: THANH TOÁN
            <div className="flex-1 p-6 flex gap-6 animate-in slide-in-from-right duration-300">
                <div className="flex-1 flex flex-col gap-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <button onClick={() => setMode('ordering')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold bg-slate-50 px-4 py-2 rounded-xl transition-colors">
                            <ArrowLeft size={18}/> Quay lại
                        </button>
                        <h2 className="text-xl font-black text-slate-800 uppercase">Thanh Toán</h2>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-blue-600 font-bold uppercase">Tổng phải thu</p>
                            <p className="text-3xl font-black text-blue-700">{totalAmount.toLocaleString()} đ</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500 font-bold uppercase">Bàn đang chọn</p>
                            <p className="text-lg font-bold text-slate-800">{currentTable}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[ {id:'cash', label:'TIỀN MẶT', icon: Banknote}, {id:'qr', label:'CHUYỂN KHOẢN', icon: QrCode}, {id:'card', label:'THẺ', icon: CreditCard} ].map(m => (
                            <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                                className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === m.id ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 bg-white hover:border-blue-200'}`}>
                                <m.icon size={24} /> <span className="font-bold text-xs">{m.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-inner">
                            <label className="text-slate-400 text-xs font-bold uppercase mb-1 block">Khách đưa</label>
                            <input readOnly value={amountReceived ? Number(amountReceived).toLocaleString() : ''} placeholder="0"
                                className="w-full text-4xl font-black text-right text-slate-900 bg-transparent outline-none placeholder:text-slate-200" />
                        </div>
                        <div className="flex justify-between items-center px-4">
                            <span className="font-bold text-slate-500">Tiền thừa trả khách:</span>
                            <span className={`text-2xl font-black ${changeAmount < 0 ? 'text-red-500' : 'text-green-600'}`}>{changeAmount.toLocaleString()} đ</span>
                        </div>
                    </div>
                </div>

                <div className="w-[300px]">
                    <Numpad />
                </div>
            </div>
        )}
      </div>

      {/* ================= CỘT PHẢI: GIỎ HÀNG (CỐ ĐỊNH) ================= */}
      <div className="w-[360px] bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden shrink-0">
        
        {/* Header Giỏ Hàng */}
        <div className="p-5 border-b border-slate-100 bg-white z-10">
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                {[{id:'dine_in', label:'Tại bàn', icon:Utensils}, {id:'takeaway', label:'Mang về', icon:ShoppingBag}, {id:'delivery', label:'Giao hàng', icon:Truck}].map(type => (
                    <button key={type.id} onClick={() => setOrderType(type.id)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${orderType === type.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        <type.icon size={14} /> {type.label}
                    </button>
                ))}
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-lg text-slate-800">
                    <ShoppingCart className="text-blue-600" /> Giỏ hàng <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{cart.length}</span>
                </div>
                {cart.length > 0 && <button onClick={()=>setCart([])} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>}
            </div>
        </div>

        {/* List Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                <ShoppingBag size={64} className="mb-4 text-slate-300"/> <p>Chưa có món nào</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="p-3 bg-white border border-slate-100 rounded-xl flex gap-3 shadow-sm group hover:border-blue-200 transition-colors">
                <div className="flex flex-col items-center justify-between bg-slate-50 rounded-lg w-8 p-1 h-full">
                   <button onClick={() => updateQty(item.id, 1)} className="hover:text-blue-600"><Plus size={14}/></button>
                   <span className="font-bold text-sm select-none py-1">{item.qty}</span>
                   <button onClick={() => updateQty(item.id, -1)} className="hover:text-red-500"><Minus size={14}/></button>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-slate-800 line-clamp-2 leading-tight">{item.name}</span>
                    <span className="font-bold text-sm text-slate-900 ml-2">{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{Number(item.price).toLocaleString()} / món</p>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 self-center pl-2"><Delete size={18} /></button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-5 border-t border-slate-100 bg-white z-20 shrink-0 space-y-3 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
            {/* Mã giảm giá */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" 
                        placeholder="Mã giảm giá..." value={discountCode} onChange={e => setDiscountCode(e.target.value)} />
                </div>
                <button onClick={applyDiscount} className="bg-slate-100 text-slate-600 px-3 rounded-lg font-bold text-xs hover:bg-slate-200">Áp dụng</button>
            </div>

            <div className="space-y-1 pt-2">
                <div className="flex justify-between text-sm text-slate-500">
                    <span>Tạm tính</span> <span>{subTotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                        <span>Giảm giá</span> <span>-{discountAmount.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm text-slate-500">
                    <span>Thuế (8%)</span> <span>{taxAmount.toLocaleString()}</span>
                </div>
            </div>
            
            <div className="border-t border-slate-100 my-1"></div>
            
            <div className="flex justify-between items-end mb-2">
                <span className="text-slate-800 font-bold">Tổng thanh toán</span>
                <span className="text-2xl font-black text-blue-600">{totalAmount.toLocaleString()}</span>
            </div>
            
            {/* LOGIC NÚT BẤM */}
            {mode === 'ordering' ? (
                <div className="flex gap-2">
                     {/* Nút Gửi Bếp (Chỉ hiện khi Tại bàn) */}
                     {orderType === 'dine_in' && (
                        <button onClick={handleSendKitchen} disabled={cart.length === 0}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 disabled:bg-slate-300 transition-all active:scale-95 shadow-lg shadow-orange-200">
                            <ChefHat size={20}/> GỬI BẾP
                        </button>
                     )}
                     {/* Nút Thanh Toán */}
                     <button onClick={() => setMode('payment')} disabled={cart.length === 0}
                        className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 disabled:bg-slate-300 transition-all active:scale-95 shadow-lg shadow-blue-200">
                        <CreditCard size={20}/> THANH TOÁN
                    </button>
                </div>
            ) : (
                <button onClick={handlePaymentComplete} disabled={changeAmount < 0}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 disabled:bg-slate-300 transition-all active:scale-95 shadow-lg shadow-green-200">
                    <Check size={24}/> HOÀN TẤT
                </button>
            )}
        </div>
      </div>

      {showReceipt && <Receipt order={lastOrder} items={lastOrder?.items} onClose={() => { setShowReceipt(false); navigate('/pos/tables'); }} />}
    </div>
  );
};

export default OrderPage;