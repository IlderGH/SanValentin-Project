import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { ShieldCheck, Terminal, MapPin, Globe, Cpu } from 'lucide-react';

const DEFAULTS = {
    pregunta: "¿Quieres ser mi San Valentín?",
    frasesNo: ["Porfis", "¿Segur@?", "Piénsalo otra vez", "Mmmm... ¿segurísim@?", "Te vas a arrepentir"],
    imagenes: ["1", "2", "3"], // IDs de las imágenes
    datosExtra: [
        { etiqueta: "Nombres", valor_censurado: "**********" },
        { etiqueta: "Apellidos", valor_censurado: "**********" }
    ]
};

const BromaView = () => {
    const { id } = useParams();
    const [config, setConfig] = useState(DEFAULTS);
    const [clicsNo, setClicsNo] = useState(0);
    const [siScale, setSiScale] = useState(1);
    const [ipData, setIpData] = useState(null);
    const [showHackerSection, setShowHackerSection] = useState(false);
    const [finalizado, setFinalizado] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                const { data: broma } = await supabase
                    .from('bromas')
                    .select('*, frases_no(*), datos_personalizados(*)')
                    .eq('id', id)
                    .single();

                if (broma) {
                    setConfig({
                        pregunta: broma.pregunta || DEFAULTS.pregunta,
                        frasesNo: broma.frases_no?.length > 0 ? broma.frases_no.map(f => f.frase) : DEFAULTS.frasesNo,
                        imagenes: broma.imagenes_seleccionadas?.length > 0 ? broma.imagenes_seleccionadas : DEFAULTS.imagenes,
                        datosExtra: broma.datos_personalizados?.length > 0 ? broma.datos_personalizados : DEFAULTS.datosExtra
                    });
                }
            };
            fetchData();
        }
        fetch('https://ipapi.co/json/').then(res => res.json()).then(data => setIpData(data));
    }, [id]);

    const handleNo = () => {
        const nuevosClics = clicsNo + 1;
        setClicsNo(nuevosClics);
        setSiScale(prev => prev + 0.4);

        if (nuevosClics === 3) {
            setShowHackerSection(true);
        }
    };

    const currentImage = config.imagenes[clicsNo % config.imagenes.length];
    const currentFraseNo = config.frasesNo[clicsNo % config.frasesNo.length];

    // Función para normalizar la ruta de la imagen
    const getImgPath = (imgName) => `/assets/${imgName}.webp`;

    return (
        <div className="min-h-screen bg-rose-50 flex flex-col text-center overflow-x-hidden">
            <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50">
                <div className="footer_link w-8 h-8">❤️</div>
                <div className="footer_link w-8 h-8">❤️</div>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center p-4 pt-20">
                {!finalizado ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center max-w-sm w-full space-y-6">

                        <h1 className="text-3xl font-black text-rose-600 leading-tight px-2">
                            {config.pregunta}
                        </h1>

                        <AnimatePresence>
                            {showHackerSection && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="terminal w-full bg-zinc-900 rounded-2xl p-4 font-mono text-[10px] text-green-500 shadow-xl border border-green-500/20 text-left overflow-hidden"
                                >
                                    <div className="texto-titulo flex items-center gap-2 border-b border-green-900 pb-1 mb-2 opacity-70">
                                        <Terminal size={15} />
                                        <span>TE HACKIE</span>
                                    </div>
                                    <div className="texto-datos space-y-1 uppercase tracking-tight">
                                        <p className="flex items-center gap-2"><Globe size={10} /> IP: {ipData?.ip || '192.168.1.1'}</p>
                                        <p className="flex items-center gap-2"><MapPin size={10} /> LOC: {ipData ? `${ipData.country_name}` : 'PERU'}</p>
                                        <div className="h-[1px] bg-green-900 my-1" />
                                        {config.datosExtra.map((d, i) => (
                                            <p key={i}>{d.etiqueta}: <span className="text-white">{d.valor_censurado}</span></p>
                                        ))}

                                    </div>
                                    <div className="h-[1px] bg-green-900 my-1" />
                                    <p className="texto-rojo text-[9px] text-red-500 animate-pulse mt-2 italic">SIN PRESIONES JIJIJI</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* IMAGEN PRINCIPAL */}
                        <motion.div key={currentImage} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="shadow-2xl rounded-3xl overflow-hidden border-4 border-white bg-white">
                            <img
                                src={getImgPath(currentImage)}
                                className="w-56 h-56 object-cover"
                                alt="Reacción"
                                onError={(e) => { e.target.src = "/assets/1.webp"; }}
                            />
                        </motion.div>

                        <div className="h-6">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={clicsNo}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -10, opacity: 0 }}
                                    className="text-respuestas text-slate-400 text-sm italic font-medium"
                                >
                                    {clicsNo > 0 && `"${currentFraseNo}"`}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col gap-4 w-full px-4">
                            <motion.button
                                style={{ fontSize: `${siScale * 1.25}rem`, padding: `${siScale}rem 0` }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFinalizado(true)}
                                className="z-50 bg-green-500 text-white font-bold rounded-2xl shadow-lg shadow-green-200 w-full transition-all duration-300"
                            >
                                ¡SÍ! ❤️
                            </motion.button>

                            <button
                                onClick={handleNo}
                                className="bg-slate-200 text-slate-500 font-bold py-3 rounded-2xl w-full text-sm hover:bg-slate-300 active:bg-slate-400 transition-colors"
                            >
                                No
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                        <img src="/assets/3.webp" className="w-64 mb-6 drop-shadow-2xl" alt="Love" />
                        <h2 className="text-4xl font-black text-rose-500 px-4">¡SABÍA QUE DIRÍAS QUE SÍ! ❤️</h2>
                    </motion.div>
                )}
            </main>

            <footer className="w-full p-4 flex justify-between items-end z-[60] bg-rose-50 relative bottom-0">
                <Link to="/admin" className="footer_link w-8 h-8 cursor-default">❤️</Link>
                <div className="footer_text text-[9px] text-slate-400 text-center leading-tight flex-1 px-8 opacity-60">
                    <ShieldCheck size={12} className="inline mb-1 mr-1" />
                    Los datos que se muestran son privados y no se almacenan.
                </div>
                <div className="footer_link w-8 h-8">❤️</div>
            </footer>
        </div>
    );
};

export default BromaView;