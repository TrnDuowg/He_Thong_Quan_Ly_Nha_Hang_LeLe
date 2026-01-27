import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Save, ImageIcon, Layers, Trash2, X, PlusCircle 
} from 'lucide-react';

const ComboPage = () => {
  const [combos, setCombos] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- 1. LOAD DANH SÁCH ---
  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/products');
      const data = await res.json();
      if(Array.isArray(data)){
          setCombos(data.filter(p => p.is_combo === 1)); 
          setProducts(data.filter(p => p.is_combo === 0)); 
      }
    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // --- 2. XỬ LÝ CHỌN COMBO (LOAD CHI TIẾT) ---
  const handleSelectCombo = async (comboId) => {
    try {
        // Gọi API lấy chi tiết để có danh sách items
        const res = await fetch(`http://localhost:3000/api/products/${comboId}`);
        const data = await res.json();
        
        // Format giá tiền hiển thị (thêm dấu chấm)
        const formattedPrice = data.price ? Number(data.price).toLocaleString('vi-VN') : '';
        
        setSelectedCombo({ 
            ...data, 
            price: formattedPrice,
            items: data.items || [] // Backend trả về items
        });
    } catch (e) {
        console.error("Lỗi lấy chi tiết combo");
    }
  };

  const handleCreateNew = () => {
    setSelectedCombo({
      id: null,
      name: 'Combo Mới',
      price: '',
      image_url: '',
      category_id: 1, 
      items: [] 
    });
  };

  // --- 3. LOGIC INPUT GIÁ TIỀN ---
  const handlePriceChange = (e) => {
      // Chỉ lấy số, bỏ hết ký tự lạ
      const rawValue = e.target.value.replace(/\D/g, '');
      // Format lại thành dạng 100.000
      const formatted = rawValue ? Number(rawValue).toLocaleString('vi-VN') : '';
      setSelectedCombo({ ...selectedCombo, price: formatted });
  };

  // --- 4. LOGIC ITEM COMBO ---
  const handleAddItemToCombo = (product) => {
      if (!selectedCombo) return;
      const exists = selectedCombo.items.find(i => i.id === product.id);
      if (exists) return; // Đã có thì thôi
      const newItem = { ...product, qty: 1 };
      setSelectedCombo(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const handleRemoveItemFromCombo = (indexToRemove) => {
      setSelectedCombo(prev => ({
          ...prev,
          items: prev.items.filter((_, idx) => idx !== indexToRemove)
      }));
  };

  // --- 5. LƯU & XÓA COMBO ---
  const handleSave = async () => {
    if (!selectedCombo.name) return alert("Nhập tên Combo");

    // Dữ liệu gửi đi (Clean giá tiền)
    const payload = {
        ...selectedCombo,
        price: selectedCombo.price.replace(/\./g, ''), // Xóa dấu chấm trước khi gửi
        is_combo: 1,
        combo_items: selectedCombo.items // Gửi kèm danh sách món
    };

    const url = selectedCombo.id 
        ? `http://localhost:3000/api/products/${selectedCombo.id}` 
        : 'http://localhost:3000/api/products';
    const method = selectedCombo.id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            alert("Đã lưu thành công!");
            fetchData();
        } else {
            alert("Lỗi khi lưu");
        }
    } catch (e) { alert("Lỗi kết nối"); }
  };

  const handleDeleteCombo = async () => {
      if(!selectedCombo.id) return;
      if(!window.confirm("Bạn chắc chắn muốn xóa Combo này?")) return;

      try {
          await fetch(`http://localhost:3000/api/products/${selectedCombo.id}`, { method: 'DELETE' });
          alert("Đã xóa Combo");
          setSelectedCombo(null);
          fetchData();
      } catch (e) { alert("Lỗi xóa"); }
  };

  // Lọc thư viện
  const filteredLibrary = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex h-full overflow-hidden bg-slate-50">
      
      {/* CỘT 1: DANH SÁCH */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 z-10">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Danh sách Combo</h3>
            <button onClick={handleCreateNew} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"><Plus size={18}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
           {combos.map(c => (
               <div key={c.id} onClick={() => handleSelectCombo(c.id)} 
                    className={`flex gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedCombo?.id === c.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-transparent hover:bg-slate-100'}`}>
                   <img src={c.image_url} className="w-12 h-12 rounded bg-gray-200 object-cover" onError={(e)=>e.target.src='https://via.placeholder.com/150'}/>
                   <div>
                       <h4 className="font-bold text-sm text-slate-800">{c.name}</h4>
                       <p className="text-xs text-slate-500">{Number(c.price).toLocaleString()}đ</p>
                   </div>
               </div>
           ))}
        </div>
      </div>

      {/* CỘT 2: EDITOR */}
      <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden min-w-[500px]">
        {selectedCombo ? (
            <>
                <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
                    <span className="text-slate-900 font-bold text-lg">{selectedCombo.id ? `Sửa: ${selectedCombo.name}` : 'Tạo Combo Mới'}</span>
                    <div className="flex gap-2">
                        {selectedCombo.id && (
                            <button onClick={handleDeleteCombo} className="px-4 py-2 rounded-lg text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-2">
                                <Trash2 size={18} /> Xóa
                            </button>
                        )}
                        <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
                            <Save size={18} /> Lưu Thay Đổi
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Thông tin */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm grid grid-cols-12 gap-6">
                            <div className="col-span-4">
                                <div className="aspect-square rounded-lg bg-slate-100 relative overflow-hidden group">
                                    <img src={selectedCombo.image_url} className="w-full h-full object-cover" onError={(e)=>e.target.src='https://via.placeholder.com/150'} />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <input className="absolute inset-0 opacity-0 cursor-pointer" /> {/* Placeholder upload */}
                                        <ImageIcon className="text-white" />
                                    </div>
                                    <input className="absolute bottom-0 w-full text-xs p-1 bg-white/90 border-t outline-none" 
                                        placeholder="Link ảnh..." value={selectedCombo.image_url} 
                                        onChange={e => setSelectedCombo({...selectedCombo, image_url: e.target.value})}/>
                                </div>
                            </div>
                            <div className="col-span-8 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tên Combo</label>
                                    <input className="w-full border rounded-lg p-2.5 text-sm" value={selectedCombo.name} 
                                        onChange={e => setSelectedCombo({...selectedCombo, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Giá bán (VNĐ)</label>
                                    <input className="w-full border rounded-lg p-2.5 text-sm font-bold text-blue-600" 
                                        value={selectedCombo.price} 
                                        onChange={handlePriceChange} placeholder="0" />
                                </div>
                            </div>
                        </div>

                        {/* Thành phần */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Layers size={20}/> Thành phần ({selectedCombo.items.length})</h3>
                            <div className="bg-white rounded-xl border border-slate-200 p-4 min-h-[150px]">
                                {selectedCombo.items.length === 0 ? (
                                    <div className="text-center text-slate-400 py-10 border-2 border-dashed rounded-lg">Chưa có món nào. Chọn từ thư viện bên phải.</div>
                                ) : (
                                    <div className="grid gap-2">
                                        {selectedCombo.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                                <img src={item.image_url} className="w-10 h-10 rounded object-cover" onError={(e)=>e.target.src='https://via.placeholder.com/150'}/>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold">{item.name}</p>
                                                    <p className="text-xs text-slate-500">{item.qty}x</p>
                                                </div>
                                                <button onClick={() => handleRemoveItemFromCombo(idx)} className="text-red-400 hover:bg-red-50 p-2 rounded"><X size={18}/></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Layers size={64} className="mb-4 opacity-20" />
                <p>Chọn Combo để sửa hoặc tạo mới</p>
            </div>
        )}
      </div>

      {/* CỘT 3: THƯ VIỆN */}
      <div className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10">
        <div className="p-4 border-b border-slate-200">
            <h4 className="font-bold mb-2">Thư Viện Món Ăn</h4>
            <div className="relative">
                <Search className="absolute left-2 top-2.5 text-slate-400" size={16} />
                <input className="w-full pl-8 p-2 bg-slate-100 rounded text-sm" placeholder="Tìm món..." 
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredLibrary.map(item => (
                <div key={item.id} onClick={() => handleAddItemToCombo(item)}
                    className="flex gap-2 p-2 rounded border border-slate-100 hover:border-blue-400 cursor-pointer bg-white group transition-all">
                    <img src={item.image_url} className="w-10 h-10 rounded object-cover bg-gray-200" onError={(e)=>e.target.src='https://via.placeholder.com/150'}/>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-500">{Number(item.price).toLocaleString()}đ</p>
                    </div>
                    <PlusCircle size={16} className="text-slate-300 group-hover:text-blue-600 self-center"/>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default ComboPage;