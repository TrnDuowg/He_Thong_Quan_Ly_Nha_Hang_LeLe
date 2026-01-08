import React, { useState } from 'react';
import { 
  Search, RefreshCw, LayoutGrid, User, Clock, 
  Armchair, DollarSign, CalendarClock, Move, Merge, 
  PlusCircle, CreditCard, X 
} from 'lucide-react';

// --- MOCK DATA ---
const FLOORS = [
  { id: 'all', name: 'Tất cả' },
  { id: 'floor1', name: 'Tầng 1' },
  { id: 'floor2', name: 'Tầng 2' },
  { id: 'terrace', name: 'Sân thượng' },
];

const TABLES = [
  // Tầng 1
  { id: 1, name: 'Bàn 01', floor: 'floor1', seats: 4, status: 'empty' },
  { id: 2, name: 'Bàn 02', floor: 'floor1', seats: 4, status: 'occupied', guests: 3, time: '45p', total: 550000 },
  { id: 3, name: 'Bàn 03', floor: 'floor1', seats: 4, status: 'empty' },
  { id: 4, name: 'Bàn 04', floor: 'floor1', seats: 6, status: 'payment', guests: 6, time: '1h 20p', total: 1250000 },
  { id: 5, name: 'Bàn 05', floor: 'floor1', seats: 4, status: 'reserved', info: '18:30 - A.Minh' },
  { id: 6, name: 'Bàn 06', floor: 'floor1', seats: 2, status: 'empty' },
  { id: 7, name: 'Bàn 07', floor: 'floor1', seats: 4, status: 'empty' },
  { id: 8, name: 'Bàn 08', floor: 'floor1', seats: 4, status: 'empty' },
  { id: 9, name: 'Bàn 09', floor: 'floor1', seats: 6, status: 'empty' },
  { id: 10, name: 'Bàn 10', floor: 'floor1', seats: 6, status: 'empty' },
  // Tầng 2
  { id: 11, name: 'Bàn 11', floor: 'floor2', seats: 2, status: 'occupied', guests: 2, time: '10p', total: 120000 },
  { id: 12, name: 'Bàn 12', floor: 'floor2', seats: 4, status: 'reserved', info: '20:00 - C.Hạnh' },
  { id: 13, name: 'Bàn 13', floor: 'floor2', seats: 8, status: 'empty', info: 'VIP Room' },
];

const STATUS_CONFIG = {
  empty: { color: 'slate', icon: Armchair, label: 'Trống', bg: 'bg-white', border: 'border-slate-200' },
  occupied: { color: 'emerald', icon: User, label: 'Có khách', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  reserved: { color: 'amber', icon: CalendarClock, label: 'Đặt trước', bg: 'bg-amber-50', border: 'border-amber-200' },
  payment: { color: 'rose', icon: DollarSign, label: 'Thanh toán', bg: 'bg-rose-50', border: 'border-rose-300', animate: 'animate-pulse' },
};

// --- MODAL COMPONENT ---
const TableDetailModal = ({ table, onClose }) => {
  if (!table) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-emerald-100 text-emerald-600">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{table.name}</h3>
              <p className="text-xs text-emerald-600 font-bold">Đang phục vụ • {table.guests || 0} khách</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
            <span>Thời gian: <b className="text-slate-800">{table.time || '0p'}</b></span>
            <span>Phục vụ: <b className="text-slate-800">NV. Tuấn Anh</b></span>
          </div>

          {/* Bill Preview */}
          <div className="mb-6 rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-bold">Tên món</th>
                  <th className="px-4 py-2 font-bold text-center">SL</th>
                  <th className="px-4 py-2 font-bold text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-white"><td className="px-4 py-3">Combo Gà Rán (L)</td><td className="px-4 py-3 text-center">1</td><td className="px-4 py-3 text-right">250.000đ</td></tr>
                <tr className="bg-white"><td className="px-4 py-3">Pizza Hải Sản</td><td className="px-4 py-3 text-center">1</td><td className="px-4 py-3 text-right">220.000đ</td></tr>
                <tr className="bg-white"><td className="px-4 py-3">Pepsi Tươi</td><td className="px-4 py-3 text-center">2</td><td className="px-4 py-3 text-right">40.000đ</td></tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold">
                <tr>
                  <td className="px-4 py-3 text-right text-slate-500" colSpan="2">Tổng cộng:</td>
                  <td className="px-4 py-3 text-right text-emerald-600 text-base">{(table.total || 0).toLocaleString()}đ</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center gap-1 rounded-lg bg-blue-600 p-3 text-white transition-all hover:bg-blue-700 hover:shadow-lg">
              <PlusCircle size={24} />
              <span className="font-bold text-sm">Thêm món</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 rounded-lg bg-emerald-600 p-3 text-white transition-all hover:bg-emerald-500 hover:shadow-lg">
              <CreditCard size={24} />
              <span className="font-bold text-sm">Thanh toán</span>
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 p-3 text-slate-500 transition-all hover:bg-slate-50 hover:text-blue-600 hover:border-blue-600">
              <Move size={20} />
              <span className="font-medium text-sm">Chuyển bàn</span>
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 p-3 text-slate-500 transition-all hover:bg-slate-50 hover:text-blue-600 hover:border-blue-600">
              <Merge size={20} />
              <span className="font-medium text-sm">Gộp bàn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const TableMap = () => {
  const [activeFloor, setActiveFloor] = useState('all');
  const [selectedTable, setSelectedTable] = useState(null);

  const filteredTables = activeFloor === 'all' 
    ? TABLES 
    : TABLES.filter(t => t.floor === activeFloor);

  // Group tables by floor for rendering
  const tablesByFloor = {
    floor1: filteredTables.filter(t => t.floor === 'floor1'),
    floor2: filteredTables.filter(t => t.floor === 'floor2'),
    terrace: filteredTables.filter(t => t.floor === 'terrace'),
  };

  const renderTableCard = (table) => {
    const status = STATUS_CONFIG[table.status];
    const Icon = status.icon;
    
    // Dynamic styles based on status color
    const colorClasses = {
      slate: 'text-slate-400 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white',
      emerald: 'text-emerald-600 bg-emerald-100',
      amber: 'text-amber-600 bg-amber-100',
      rose: 'text-rose-500 bg-rose-100',
    };

    const textColors = {
      slate: 'text-slate-800',
      emerald: 'text-emerald-900',
      amber: 'text-amber-900',
      rose: 'text-rose-900',
    };

    return (
      <div 
        key={table.id}
        onClick={() => setSelectedTable(table)}
        className={`group relative flex flex-col gap-3 rounded-xl border p-4 transition-all cursor-pointer hover:shadow-lg ${status.bg} ${status.border} ${status.animate || ''} hover:border-blue-500`}
      >
        <div className="flex justify-between items-start">
          <div className={`flex items-center justify-center size-10 rounded-full transition-colors ${colorClasses[status.color]}`}>
            <Icon size={20} />
          </div>
          <span className={`rounded px-2 py-0.5 text-xs font-bold ${status.color === 'slate' ? 'bg-slate-100 text-slate-500' : `bg-${status.color}-100 text-${status.color}-700`}`}>
            {status.label}
          </span>
        </div>
        
        <div className="flex flex-col">
          <h4 className={`text-lg font-bold ${textColors[status.color]}`}>{table.name}</h4>
          
          {table.status === 'empty' && (
            <p className="text-slate-500 text-xs mt-1">{table.seats} Ghế {table.info && `• ${table.info}`}</p>
          )}
          
          {table.status === 'occupied' || table.status === 'payment' ? (
            <>
              <div className={`flex items-center gap-2 mt-2 text-xs font-medium text-${status.color}-700`}>
                <Clock size={14} /> {table.time}
                <User size={14} className="ml-1" /> {table.guests}
              </div>
              <p className={`font-bold text-sm mt-1 text-${status.color}-600`}>{table.total?.toLocaleString()}đ</p>
            </>
          ) : null}

          {table.status === 'reserved' && (
            <>
              <p className="text-amber-700 text-xs mt-1 font-medium">{table.info}</p>
              <p className="text-amber-700 text-xs">SĐT: ...889</p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      
      {/* Filters Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between border-b border-slate-200 px-6 py-4 bg-white shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {FLOORS.map(floor => (
            <button 
              key={floor.id}
              onClick={() => setActiveFloor(floor.id)}
              className={`flex items-center justify-center rounded-lg px-5 py-2 text-sm font-bold transition-all whitespace-nowrap ${
                activeFloor === floor.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200'
              }`}
            >
              {floor.name}
            </button>
          ))}
        </div>
        
        <div className="flex flex-1 md:justify-end gap-3 w-full md:w-auto">
          <div className="relative flex w-full max-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm outline-none" 
              placeholder="Tìm bàn..." 
            />
          </div>
          <button className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-slate-900 hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm">
            <RefreshCw size={20} className="text-blue-600" />
            <span className="hidden sm:inline text-sm font-bold">LÀM MỚI</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 py-4 flex flex-wrap gap-3 text-sm shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
          <span className="text-slate-500">Tổng: <span className="text-slate-800 font-bold">16</span></span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
          <span className="text-slate-500">Trống: <span className="text-slate-800 font-bold">8</span></span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-slate-500">Có khách: <span className="text-slate-800 font-bold">5</span></span>
        </div>
        {/* ... more stats */}
      </div>

      {/* Map Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
        
        {(activeFloor === 'all' || activeFloor === 'floor1') && tablesByFloor.floor1.length > 0 && (
          <div className="mb-8">
            <h3 className="text-slate-900 text-lg font-bold mb-4 flex items-center gap-2">
              <LayoutGrid className="text-blue-600" size={24} /> Khu Vực Tầng 1
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {tablesByFloor.floor1.map(renderTableCard)}
            </div>
          </div>
        )}

        {(activeFloor === 'all' || activeFloor === 'floor2') && tablesByFloor.floor2.length > 0 && (
          <div className="mb-8">
            <h3 className="text-slate-900 text-lg font-bold mb-4 flex items-center gap-2">
              <LayoutGrid className="text-blue-600" size={24} /> Khu Vực Tầng 2
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {tablesByFloor.floor2.map(renderTableCard)}
            </div>
          </div>
        )}

      </div>

      {/* Modal Detail */}
      <TableDetailModal 
        table={selectedTable} 
        onClose={() => setSelectedTable(null)} 
      />

    </div>
  );
};

export default TableMap;