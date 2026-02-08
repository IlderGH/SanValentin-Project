import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Trash2, Link as LinkIcon, Save, Heart, ShieldAlert, Sparkles } from 'lucide-react';



const Admin = () => {
    const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState(['1']);
    const toggleImagen = (id) => {
        setImagenesSeleccionadas(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id) // Si ya está, la quita
                : [...prev, id] // Si no está, la agrega
        );
    };
    const imagenes = Array.from({ length: 21 }, (_, i) => i + 1);
    const [pregunta, setPregunta] = useState('¿Quieres ser mi San Valentín?');
    const [frasesNo, setFrasesNo] = useState(['No', '¿Estás segura?', 'Piénsalo bien...']);
    const [datosExtra, setDatosExtra] = useState([
        { etiqueta: 'Nombres', valor: '********' },
        { etiqueta: 'Apellidos', valor: '********' },
        { etiqueta: 'Mascota', valor: '********' }
    ]);
    const [loading, setLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');

    // Funciones de manejo de estado (igual que antes)
    const addFraseNo = () => setFrasesNo([...frasesNo, '']);
    const updateFraseNo = (index, val) => {
        const newFrases = [...frasesNo];
        newFrases[index] = val;
        setFrasesNo(newFrases);
    };

    const addDatoExtra = () => setDatosExtra([...datosExtra, { etiqueta: '', valor: '' }]);
    const updateDatoExtra = (index, field, val) => {
        const newDatos = [...datosExtra];
        newDatos[index][field] = val;
        setDatosExtra(newDatos);
    };

    const guardarProyecto = async () => {
        setLoading(true);
        try {
            const { data: broma, error: errorBroma } = await supabase
                .from('bromas')
                .insert([{
                    pregunta,
                    imagenes_seleccionadas: imagenesSeleccionadas
                }])
                .select().single();

            if (errorBroma) throw errorBroma;

            await supabase.from('frases_no').insert(frasesNo.map(f => ({ broma_id: broma.id, frase: f })));
            await supabase.from('datos_personalizados').insert(datosExtra.map(d => ({
                broma_id: broma.id, etiqueta: d.etiqueta, valor_censurado: d.valor
            })));

            setGeneratedLink(`${window.location.origin}/v/${broma.id}`);
        } catch (e) {
            alert("Error al guardar: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-100 pb-10 px-4 pt-6">
            <div className="max-w-md mx-auto">

                {/* Header */}
                <header className="text-center mb-8">
                    <div className="inline-block p-3 bg-white rounded-2xl shadow-sm mb-4">
                        <Heart className="text-rose-500 fill-rose-500 animate-pulse" size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">San Valentin Admin</h1>
                    <p className="text-slate-500 text-sm">En esta pagina puedes realizar una configuracion personalizada para la pagina principal</p>
                </header>

                {/* Card Principal */}
                <div className="space-y-6">

                    {/* Sección Pregunta */}
                    <section className="bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-xl shadow-rose-200/50 border border-white">
                        <label className="flex items-center gap-2 text-rose-600 font-bold mb-3 text-sm uppercase tracking-wider">
                            <Sparkles size={16} /> Pregunta Principal
                        </label>
                        <input
                            className="w-full p-4 bg-rose-50/50 border-2 border-rose-100 rounded-2xl focus:outline-none focus:border-rose-400 transition-colors text-slate-700"
                            placeholder="¿Quieres ser mi novia?"
                            value={pregunta}
                            onChange={(e) => setPregunta(e.target.value)}
                        />
                    </section>

                    {/* Sección Frases NO */}
                    <section className="bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-xl shadow-rose-200/50 border border-white">
                        <label className="flex items-center gap-2 text-rose-600 font-bold mb-3 text-sm uppercase tracking-wider">
                            🚫 Frases botón "NO"
                        </label>
                        <div className="space-y-3">
                            {frasesNo.map((f, i) => (
                                <div key={i} className="flex gap-2 group">
                                    <input
                                        className="flex-1 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none text-sm"
                                        value={f}
                                        onChange={(e) => updateFraseNo(i, e.target.value)}
                                    />
                                    <button
                                        onClick={() => setFrasesNo(frasesNo.filter((_, idx) => idx !== i))}
                                        className="p-3 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addFraseNo}
                            className="w-full mt-4 py-2 border-2 border-dashed border-rose-200 rounded-xl text-rose-400 text-sm font-medium hover:bg-rose-50 transition-colors flex justify-center items-center gap-2"
                        >
                            <Plus size={16} /> Añadir opción
                        </button>
                    </section>

                    {/* Sección Datos Intimidantes */}
                    <section className="bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-xl shadow-rose-200/50 border border-white">
                        <label className="flex items-center gap-2 text-rose-600 font-bold mb-3 text-sm uppercase tracking-wider">
                            <ShieldAlert size={18} /> Datos para Intimidar
                        </label>
                        <div className="space-y-3">
                            {datosExtra.map((d, i) => (
                                <div key={i} className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <input
                                        placeholder="Etiqueta (ej: Nombre)"
                                        className="w-full p-2 bg-transparent font-bold text-xs uppercase text-slate-500 outline-none"
                                        value={d.etiqueta}
                                        onChange={(e) => updateDatoExtra(i, 'etiqueta', e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            placeholder="Valor censurado"
                                            className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm"
                                            value={d.valor}
                                            onChange={(e) => updateDatoExtra(i, 'valor', e.target.value)}
                                        />
                                        <button onClick={() => setDatosExtra(datosExtra.filter((_, idx) => idx !== i))} className="text-slate-400">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addDatoExtra}
                            className="w-full mt-4 py-2 text-rose-400 text-sm font-medium hover:underline flex justify-center items-center gap-2"
                        >
                            <Plus size={16} /> Agregar campo personalizado
                        </button>
                    </section>

                    <section className="bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-xl shadow-rose-200/50 border border-white">
                        <label className="flex flex-col mb-4">
                            <span className="text-rose-600 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                🖼️ Galería de Reacciones
                            </span>
                            <span className="text-xs text-slate-400">Selecciona las fotos que rotarán al decir "NO"</span>
                        </label>

                        <div className="grid grid-cols-3 gap-3 max-h-72 overflow-y-auto p-2 custom-scrollbar">
                            {imagenes.map((num) => {
                                const idStr = num.toString();
                                const isSelected = imagenesSeleccionadas.includes(idStr);

                                return (
                                    <div
                                        key={num}
                                        onClick={() => toggleImagen(idStr)}
                                        className={`relative cursor-pointer rounded-xl overflow-hidden border-4 transition-all transform ${isSelected
                                            ? 'border-rose-500 scale-95 shadow-inner'
                                            : 'border-transparent opacity-50 hover:opacity-80'
                                            }`}
                                    >
                                        <img
                                            src={`/assets/${num}.webp`}
                                            alt={`Foto ${num}`}
                                            className="w-full h-24 object-cover"
                                        />
                                        {isSelected && (
                                            <div className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-0.5 shadow-md">
                                                <Plus size={14} className="rotate-45" />
                                            </div>
                                        )}
                                        {/* Badge con el orden de selección (opcional, para que sepa cuántas lleva) */}
                                        {isSelected && (
                                            <div className="absolute bottom-1 left-1 bg-black/50 text-[10px] text-white px-1.5 rounded">
                                                #{imagenesSeleccionadas.indexOf(idStr) + 1}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                    {/* Botón Guardar */}
                    <button
                        disabled={loading}
                        onClick={guardarProyecto}
                        className={`w-full py-5 rounded-3xl font-black text-white shadow-lg shadow-rose-300 flex justify-center items-center gap-3 transition-all active:scale-95 ${loading ? 'bg-rose-300' : 'bg-rose-500 hover:bg-rose-600'}`}
                    >
                        {loading ? 'GENERANDO...' : <><Save size={22} /> CREAR LINK PERSONALIZADO</>}
                    </button>

                    {/* Link Generado */}
                    {generatedLink && (
                        <div className="mt-6 p-6 bg-emerald-500 rounded-3xl text-white shadow-xl animate-in fade-in zoom-in duration-300">
                            <p className="text-xs font-bold uppercase mb-2 opacity-80">¡Listo! Envía este enlace:</p>
                            <div className="flex items-center gap-2 bg-white/20 p-3 rounded-2xl overflow-hidden">
                                <span className="text-sm truncate flex-1 font-mono italic">{generatedLink}</span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedLink);
                                        alert("¡Copiado al portapapeles!");
                                    }}
                                    className="bg-white text-emerald-600 p-2 rounded-xl"
                                >
                                    <LinkIcon size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;