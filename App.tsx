
import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  InstitutionType, 
  Institution,
  PonpesInstitution,
  NonPonpesInstitution,
  EducationLevelDetail
} from './types';
import { INSTITUTION_METADATA, MOCK_DATA } from './constants';

const years = ['2021', '2022', '2023', '2024', '2025'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | InstitutionType>('dashboard');
  const [institutions, setInstitutions] = useState<Institution[]>(MOCK_DATA as any);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Institution | null>(null);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = institutions.length;
    const students = institutions.reduce((acc, curr) => acc + (curr.stats?.totalStudents || 0), 0);
    const teachers = institutions.reduce((acc, curr) => acc + (curr.stats?.totalTeachers || 0), 0);
    const byType = Object.values(InstitutionType).map(type => ({
      name: INSTITUTION_METADATA[type].label,
      count: institutions.filter(i => i.type === type).length
    }));
    
    const growthData = years.map(year => {
      const bosTotal = institutions.reduce((acc, curr) => acc + (curr.financialAid?.bos?.[year] || 0), 0);
      return { year, bos: bosTotal / 1000000 };
    });

    return { total, students, teachers, byType, growthData };
  }, [institutions]);

  const handleOpenAdd = () => {
    const type = activeTab === 'dashboard' ? InstitutionType.PONPES : (activeTab as InstitutionType);
    const newItem = createEmptyInstitution(type);
    setEditingItem(newItem);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Institution) => {
    setEditingItem(JSON.parse(JSON.stringify(item))); // Deep copy
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setInstitutions(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleSave = (item: Institution) => {
    setInstitutions(prev => {
      const index = prev.findIndex(i => i.id === item.id);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = item;
        return updated;
      }
      return [...prev, item];
    });
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleExportExcel = () => alert('Mengekspor ke Excel...');
  const handleExportPdf = () => alert('Mengekspor ke PDF...');

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white w-64 transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:relative lg:translate-x-0 z-50 h-full overflow-y-auto shrink-0`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="font-bold text-lg leading-tight uppercase tracking-wider italic">SI-Pedipontren<br/><span className="text-emerald-400 text-xs not-italic">Kemenag Gowa</span></h1>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              Dashboard
            </button>
            <div className="pt-6 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Lembaga</div>
            {Object.values(InstitutionType).map((type) => (
              <button 
                key={type}
                onClick={() => setActiveTab(type)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === type ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                {INSTITUTION_METADATA[type].icon('w-5 h-5')}
                {INSTITUTION_METADATA[type].label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg lg:hidden">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-slate-800">
              {activeTab === 'dashboard' ? 'Statistik Sektoral' : `Data ${INSTITUTION_METADATA[activeTab as InstitutionType].label}`}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExportExcel} className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-sm font-semibold">Excel</button>
            <button onClick={handleExportPdf} className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors text-sm font-semibold">PDF</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {activeTab === 'dashboard' ? (
            <DashboardView stats={stats} />
          ) : (
            <InstitutionListView 
              type={activeTab as InstitutionType} 
              data={institutions.filter(i => i.type === activeTab)}
              onAdd={handleOpenAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>

      {/* Full Modal Form */}
      {isModalOpen && editingItem && (
        <InstitutionFormModal 
          item={editingItem} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

// --- View Components ---

const DashboardView: React.FC<{ stats: any }> = ({ stats }) => {
  const COLORS = ['#10b981', '#0ea5e9', '#6366f1', '#f59e0b', '#f43f5e'];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Lembaga" value={stats.total} color="emerald" sub="Kemenag Gowa" />
        <StatCard label="Total Santri" value={stats.students.toLocaleString()} color="sky" sub="Terverifikasi" />
        <StatCard label="Total Pengajar" value={stats.teachers.toLocaleString()} color="indigo" sub="BPJS & Non-BPJS" />
        <StatCard label="Dana BOS (Jt)" value={`Rp ${stats.growthData[stats.growthData.length-1]?.bos || 0}`} color="amber" sub="Tahun Berjalan" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h4 className="text-lg font-bold mb-6 text-slate-800">Distribusi Lembaga</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.byType} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="count">
                  {stats.byType.map((_: any, index: number) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h4 className="text-lg font-bold mb-6 text-slate-800">Tren Anggaran BOS (Jutaan Rp)</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="bos" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, sub }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{label}</p>
    <h3 className={`text-4xl font-black text-slate-900 mt-2`}>{value}</h3>
    <p className="text-slate-400 text-xs mt-2 font-medium">{sub}</p>
  </div>
);

const InstitutionListView: React.FC<{ 
  type: InstitutionType, 
  data: Institution[], 
  onAdd: () => void,
  onEdit: (item: Institution) => void,
  onDelete: (id: string) => void
}> = ({ type, data, onAdd, onEdit, onDelete }) => {
  const meta = INSTITUTION_METADATA[type];
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center sticky top-0 bg-slate-50 py-2 z-10">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{meta.label}</h3>
          <p className="text-slate-500 font-medium">Kabupaten Gowa</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 font-bold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Tambah Lembaga
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.map(item => (
          <div key={item.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
            <div className={`h-2.5 bg-${meta.color}-500 w-full`}></div>
            <div className="p-7">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-${meta.color}-50 text-${meta.color}-600`}>{meta.icon('w-7 h-7')}</div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NSP / Izin</p>
                  <p className="text-xs font-bold text-slate-700">{item.legality.licenseNumber || '-'}</p>
                </div>
              </div>
              <h4 className="text-xl font-black text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors mb-1">{item.basic.name}</h4>
              <p className="text-slate-500 text-sm italic font-medium">"{item.basic.tagline}"</p>
              
              <div className="mt-6 space-y-3 pt-5 border-t border-slate-50">
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  <span className="truncate">{item.basic.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span>{item.stats.totalStudents} Santri • {item.stats.totalTeachers} Guru</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => onEdit(item)}
                  className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                >
                  Edit Data
                </button>
                <button 
                  onClick={() => onDelete(item.id)}
                  className="px-4 py-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Form Components ---

const InstitutionFormModal: React.FC<{ 
  item: Institution, 
  onClose: () => void, 
  onSave: (item: Institution) => void 
}> = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState<Institution>(item);
  const [activeFormTab, setActiveFormTab] = useState<'dasar' | 'legalitas' | 'pendidikan' | 'keuangan' | 'fasilitas'>('dasar');

  const updateNested = (path: string, value: any) => {
    const keys = path.split('.');
    setFormData((prev: any) => {
      const copy = { ...prev };
      let current = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const isPonpes = formData.type === InstitutionType.PONPES;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header Modal */}
        <div className="p-6 border-b flex justify-between items-center shrink-0 bg-slate-50">
          <div>
            <h3 className="text-xl font-black text-slate-800">
              {item.id.length > 5 ? 'Edit Data Lembaga' : 'Tambah Lembaga Baru'}
            </h3>
            <p className="text-slate-500 text-sm font-medium">Tipe: {INSTITUTION_METADATA[formData.type].label}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Form Tabs Navigation */}
        <div className="flex border-b bg-white px-6 overflow-x-auto no-scrollbar shrink-0">
          <FormTab label="Dasar & Profil" active={activeFormTab === 'dasar'} onClick={() => setActiveFormTab('dasar')} />
          <FormTab label="Legalitas & Org" active={activeFormTab === 'legalitas'} onClick={() => setActiveFormTab('legalitas')} />
          <FormTab label="Pendidikan & Santri" active={activeFormTab === 'pendidikan'} onClick={() => setActiveFormTab('pendidikan')} />
          <FormTab label="Keuangan & Bantuan" active={activeFormTab === 'keuangan'} onClick={() => setActiveFormTab('keuangan')} />
          <FormTab label="Fasilitas & Dokumentasi" active={activeFormTab === 'fasilitas'} onClick={() => setActiveFormTab('fasilitas')} />
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {activeFormTab === 'dasar' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nama Lembaga" value={formData.basic.name} onChange={v => updateNested('basic.name', v)} />
              <Input label="Tagline / Motto" value={formData.basic.tagline} onChange={v => updateNested('basic.tagline', v)} />
              <Input label="Deskripsi Singkat" textarea value={formData.basic.description} onChange={v => updateNested('basic.description', v)} className="col-span-full" />
              <Input label="Alamat Lengkap" value={formData.basic.address} onChange={v => updateNested('basic.address', v)} className="col-span-full" />
              <Input label="Telepon" value={formData.basic.phone} onChange={v => updateNested('basic.phone', v)} />
              <Input label="Email" value={formData.basic.email} onChange={v => updateNested('basic.email', v)} />
              <Input label="Website" value={formData.basic.website} onChange={v => updateNested('basic.website', v)} />
              <Input label="Tahun Berdiri" value={formData.stats.yearFounded} onChange={v => updateNested('stats.yearFounded', v)} />
              <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl">
                <Input label="Visi" textarea value={formData.visionMisi.vision} onChange={v => updateNested('visionMisi.vision', v)} />
                <Input label="Misi" textarea value={formData.visionMisi.mision} onChange={v => updateNested('visionMisi.mision', v)} />
                <Input label="Program Unggulan" value={formData.visionMisi.program} onChange={v => updateNested('visionMisi.program', v)} className="col-span-full" />
              </div>
            </div>
          )}

          {activeFormTab === 'legalitas' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nama Pimpinan" value={formData.legality.leader} onChange={v => updateNested('legality.leader', v)} />
              <Input label="Nomor Izin / NSP" value={formData.legality.licenseNumber} onChange={v => updateNested('legality.licenseNumber', v)} />
              <Input label="Nama Yayasan" value={formData.legality.foundation} onChange={v => updateNested('legality.foundation', v)} />
              <Input label="Legalitas Yayasan (SK)" value={formData.legality.legalityDetails} onChange={v => updateNested('legality.legalityDetails', v)} />
              <Input label="Media Sosial" value={formData.legality.socialMedia} onChange={v => updateNested('legality.socialMedia', v)} />
              <Input label="URL Google Maps" value={formData.legality.gmapsUrl} onChange={v => updateNested('legality.gmapsUrl', v)} />
            </div>
          )}

          {activeFormTab === 'pendidikan' && (
            <div className="space-y-8">
              {isPonpes ? (
                // PONPES Specific Levels
                ['ula', 'wustha', 'ulya'].map(level => (
                  <div key={level} className="p-6 border-2 border-slate-100 rounded-3xl space-y-6">
                    <h4 className="text-lg font-black uppercase text-slate-800 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">{level.charAt(0).toUpperCase()}</span>
                      Tingkat {level} / {level === 'ula' ? 'MI/SD' : level === 'wustha' ? 'MTS/SMP' : 'MA/SMA'}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Select label="Jenis" options={['pkpps', 'madrasah', 'diknas']} value={(formData as any).levels[level].type} onChange={v => updateNested(`levels.${level}.type`, v)} />
                      <Input label="Santri (L)" type="number" value={(formData as any).levels[level].students.male} onChange={v => updateNested(`levels.${level}.students.male`, Number(v))} />
                      <Input label="Santri (P)" type="number" value={(formData as any).levels[level].students.female} onChange={v => updateNested(`levels.${level}.students.female`, Number(v))} />
                      <Input label="Guru" type="number" value={(formData as any).levels[level].personnel.teachers} onChange={v => updateNested(`levels.${level}.personnel.teachers`, Number(v))} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                       <Input label="BPJS Guru (Kes)" type="number" value={(formData as any).levels[level].bpjs.teacherHealth} onChange={v => updateNested(`levels.${level}.bpjs.teacherHealth`, Number(v))} />
                       <Input label="BPJS Guru (Ket)" type="number" value={(formData as any).levels[level].bpjs.teacherWork} onChange={v => updateNested(`levels.${level}.bpjs.teacherWork`, Number(v))} />
                       <Input label="BPJS Staf (Kes)" type="number" value={(formData as any).levels[level].bpjs.staffHealth} onChange={v => updateNested(`levels.${level}.bpjs.staffHealth`, Number(v))} />
                       <Input label="BPJS Staf (Ket)" type="number" value={(formData as any).levels[level].bpjs.staffWork} onChange={v => updateNested(`levels.${level}.bpjs.staffWork`, Number(v))} />
                    </div>
                  </div>
                ))
              ) : (
                // NON-PONPES Education Fields
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <Input label="Santri (L) SD/MI" type="number" value={(formData as any).studentEducationLevels.maleSd} onChange={v => updateNested('studentEducationLevels.maleSd', Number(v))} />
                  <Input label="Santri (P) SD/MI" type="number" value={(formData as any).studentEducationLevels.femaleSd} onChange={v => updateNested('studentEducationLevels.femaleSd', Number(v))} />
                  <Input label="Santri (L) SMP/MTs" type="number" value={(formData as any).studentEducationLevels.maleSmp} onChange={v => updateNested('studentEducationLevels.maleSmp', Number(v))} />
                  <Input label="Santri (P) SMP/MTs" type="number" value={(formData as any).studentEducationLevels.femaleSmp} onChange={v => updateNested('studentEducationLevels.femaleSmp', Number(v))} />
                  <Input label="Pendidik" type="number" value={(formData as any).studentEducationLevels.teachers} onChange={v => updateNested('studentEducationLevels.teachers', Number(v))} />
                  <Input label="Tenaga Kependidikan" type="number" value={(formData as any).studentEducationLevels.staff} onChange={v => updateNested('studentEducationLevels.staff', Number(v))} />
                  <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-sky-50 rounded-3xl">
                     <Input label="BPJS Guru (Kes)" type="number" value={(formData as any).bpjs.teacherHealth} onChange={v => updateNested('bpjs.teacherHealth', Number(v))} />
                     <Input label="BPJS Guru (Ket)" type="number" value={(formData as any).bpjs.teacherWork} onChange={v => updateNested('bpjs.teacherWork', Number(v))} />
                     <Input label="BPJS Staf (Kes)" type="number" value={(formData as any).bpjs.staffHealth} onChange={v => updateNested('bpjs.staffHealth', Number(v))} />
                     <Input label="BPJS Staf (Ket)" type="number" value={(formData as any).bpjs.staffWork} onChange={v => updateNested('bpjs.staffWork', Number(v))} />
                  </div>
                </div>
              )}
              <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                <h5 className="font-bold text-slate-700">Kurikulum & Materi</h5>
                {isPonpes ? (
                  <Input label="Kitab Kuning yang Diajarkan" textarea value={(formData as any).kitabKuning} onChange={v => updateNested('kitabKuning', v)} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Mata Pelajaran" value={(formData as any).subjects} onChange={v => updateNested('subjects', v)} />
                    <Input label="Buku Pembelajaran" value={(formData as any).learningBooks} onChange={v => updateNested('learningBooks', v)} />
                    <Input label="Media Pembelajaran (TV, Sound, dll)" value={(formData as any).media} onChange={v => updateNested('media', v)} />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeFormTab === 'keuangan' && (
            <div className="space-y-10">
              <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
                <h4 className="text-xl font-black text-emerald-800 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Bantuan Operasional Sekolah (BOS) per Tahun
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {years.map(year => (
                    <Input key={year} label={year} type="number" value={formData.financialAid.bos[year] || 0} onChange={v => updateNested(`financialAid.bos.${year}`, Number(v))} />
                  ))}
                </div>
              </div>
              
              <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
                <h4 className="text-xl font-black text-indigo-800 mb-6 flex items-center gap-2">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   Bantuan Insentif per Tahun
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {years.map(year => (
                    <Input key={year} label={year} type="number" value={formData.financialAid.incentive[year] || 0} onChange={v => updateNested(`financialAid.incentive.${year}`, Number(v))} />
                  ))}
                </div>
              </div>

              {isPonpes && (
                <>
                  <FinancialAidSection label="Bantuan PIP" path="financialAid.pip" data={formData.financialAid.pip} update={updateNested} color="rose" />
                  <FinancialAidSection label="Bantuan Inkubasi" path="financialAid.inkubasi" data={formData.financialAid.inkubasi} update={updateNested} color="amber" />
                  <FinancialAidSection label="Bantuan BOP" path="financialAid.bop" data={formData.financialAid.bop} update={updateNested} color="sky" />
                </>
              )}
            </div>
          )}

          {activeFormTab === 'fasilitas' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-6 bg-slate-50 rounded-3xl">
                   <h5 className="font-bold text-slate-800 mb-4">Lantai Gedung / Fasilitas Bangunan</h5>
                   {isPonpes ? (
                      <div className="grid grid-cols-2 gap-4">
                        {Object.keys((formData as PonpesInstitution).buildingFloors).map(key => (
                           <Input key={key} label={key.toUpperCase()} type="number" value={(formData as PonpesInstitution).buildingFloors[key as any]} onChange={v => updateNested(`buildingFloors.${key}`, Number(v))} />
                        ))}
                      </div>
                   ) : (
                      <div className="space-y-2">
                        {['Kantor', 'Ruang Belajar', 'WC', 'Masjid/Mushalla', 'Perpustakaan'].map(f => (
                           <label key={f} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 cursor-pointer hover:bg-emerald-50 transition-colors">
                              <input type="checkbox" className="w-5 h-5 accent-emerald-600 rounded" checked={formData.facilities.includes(f)} onChange={e => {
                                const newFac = e.target.checked ? [...formData.facilities, f] : formData.facilities.filter(x => x !== f);
                                updateNested('facilities', newFac);
                              }} />
                              <span className="text-sm font-semibold text-slate-700">{f}</span>
                           </label>
                        ))}
                      </div>
                   )}
                 </div>
                 <div className="p-6 bg-slate-50 rounded-3xl">
                    <h5 className="font-bold text-slate-800 mb-4">Prestasi & Dokumentasi</h5>
                    <div className="space-y-4">
                      <Input label="Prestasi Pendidikan" value={formData.achievements.education} onChange={v => updateNested('achievements.education', v)} />
                      <Input label="Prestasi Olahraga" value={formData.achievements.sports} onChange={v => updateNested('achievements.sports', v)} />
                      <Input label="Prestasi Seni & Budaya" value={formData.achievements.arts} onChange={v => updateNested('achievements.arts', v)} />
                      <Input label="Tautan Foto Dokumentasi (G-Drive)" value={formData.documentation.googleDriveLink} onChange={v => updateNested('documentation.googleDriveLink', v)} />
                    </div>
                 </div>
              </div>
              <div className="p-8 bg-slate-900 rounded-3xl text-white">
                 <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                   <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Kegiatan Ekstrakurikuler
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Kegiatan Olahraga" textarea theme="dark" value={formData.extracurriculars.sports} onChange={v => updateNested('extracurriculars.sports', v)} />
                    <Input label="Kegiatan Seni" textarea theme="dark" value={formData.extracurriculars.arts} onChange={v => updateNested('extracurriculars.arts', v)} />
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-6 border-t flex justify-end gap-3 bg-slate-50 shrink-0">
          <button onClick={onClose} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-white transition-colors">Batal</button>
          <button 
            onClick={() => onSave(formData)}
            className="px-10 py-3 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/30"
          >
            Simpan Data
          </button>
        </div>
      </div>
    </div>
  );
};

const FormTab = ({ label, active, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={`px-6 py-4 text-sm font-bold border-b-4 transition-all whitespace-nowrap ${active ? 'border-emerald-500 text-emerald-600 bg-emerald-50/30' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
  >
    {label}
  </button>
);

const Input = ({ label, value, onChange, type = 'text', textarea, className = '', theme = 'light' }: any) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>
    {textarea ? (
      <textarea 
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none focus:ring-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500 focus:ring-emerald-500/20' : 'bg-white border-slate-100 focus:border-emerald-500 focus:ring-emerald-500/10'}`}
        rows={3} value={value} onChange={e => onChange(e.target.value)}
      />
    ) : (
      <input 
        type={type} className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none focus:ring-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500 focus:ring-emerald-500/20' : 'bg-white border-slate-100 focus:border-emerald-500 focus:ring-emerald-500/10'}`}
        value={value} onChange={e => onChange(e.target.value)}
      />
    )}
  </div>
);

const Select = ({ label, options, value, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-black uppercase tracking-widest text-slate-500">{label}</label>
    <select 
      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-white transition-all outline-none focus:border-emerald-500"
      value={value} onChange={e => onChange(e.target.value)}
    >
      {options.map((opt: string) => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
    </select>
  </div>
);

const FinancialAidSection = ({ label, path, data, update, color }: any) => (
  <div className={`p-8 bg-${color}-50 rounded-3xl border border-${color}-100`}>
    <h4 className={`text-xl font-black text-${color}-800 mb-6`}>{label} per Tahun</h4>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {years.map(year => (
        <Input key={year} label={year} type="number" value={data?.[year] || 0} onChange={(v: string) => update(`${path}.${year}`, Number(v))} />
      ))}
    </div>
  </div>
);

// --- Utilities ---

const createEmptyInstitution = (type: InstitutionType): Institution => {
  const base: any = {
    id: Math.random().toString(36).substr(2, 9),
    type,
    basic: { name: '', tagline: '', description: '', address: '', phone: '', email: '', website: '' },
    legality: { leader: '', licenseNumber: '', foundation: '', legalityDetails: '', socialMedia: '', gmapsUrl: '' },
    stats: { yearFounded: '', totalStudents: 0, totalTeachers: 0 },
    financialAid: { bos: {}, incentive: {}, other: {} },
    extracurriculars: { sports: '', arts: '' },
    visionMisi: { vision: '', mision: '', program: '' },
    documentation: { googleDriveLink: '' },
    facilities: [],
    achievements: { education: '', sports: '', arts: '' }
  };

  if (type === InstitutionType.PONPES) {
    return {
      ...base,
      levels: {
        ula: createEmptyLevel(),
        wustha: createEmptyLevel(),
        ulya: createEmptyLevel(),
      },
      universityAcceptance: {},
      universityNames: '',
      kitabKuning: '',
      buildingFloors: { office: 0, mosque: 0, dormMale: 0, dormFemale: 0, classroom: 0, library: 0, hall: 0, kitchen: 0 },
      financialAid: { ...base.financialAid, pip: {}, inkubasi: {}, bop: {} }
    } as PonpesInstitution;
  } else {
    return {
      ...base,
      studentEducationLevels: { maleSd: 0, femaleSd: 0, maleSmp: 0, femaleSmp: 0, maleSma: 0, femaleSma: 0, teachers: 0, staff: 0 },
      munaqasyahParticipants: {},
      munaqasyahGraduates: {},
      bpjs: { teacherHealth: 0, teacherWork: 0, staffHealth: 0, staffWork: 0 },
      subjects: '',
      learningBooks: '',
      media: ''
    } as NonPonpesInstitution;
  }
};

const createEmptyLevel = (): EducationLevelDetail => ({
  type: '',
  students: { male: 0, female: 0 },
  personnel: { teachers: 0, staff: 0 },
  bpjs: { teacherHealth: 0, teacherWork: 0, staffHealth: 0, staffWork: 0 },
  unParticipants: {},
  unGraduates: {}
});

export default App;
