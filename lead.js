// Guarda un lead en el CRM de Life City desde cualquier landing.
// Uso: import { guardarLead } from 'https://proyectos-lifecity.github.io/crm/lead.js'
import { firebaseConfig, SDK } from './firebase-config.js';
let dbp;
async function db() {
  if (!dbp) dbp = (async () => {
    const { initializeApp } = await import(`${SDK}/firebase-app.js`);
    const fs = await import(`${SDK}/firebase-firestore.js`);
    return { fs, db: fs.getFirestore(initializeApp(firebaseConfig, 'lc-leads')) };
  })();
  return dbp;
}
const cut = (v, n) => String(v ?? '').trim().slice(0, n);
export async function guardarLead(d) {
  const { fs, db: store } = await db();
  const q = new URLSearchParams(location.search);
  const utm = ['utm_source', 'utm_medium', 'utm_campaign'].map(k => q.get(k)).filter(Boolean).join(' / ');
  return fs.addDoc(fs.collection(store, 'leads'), {
    nombre: cut(d.nombre, 120), celular: cut(d.celular, 40), correo: cut(d.correo, 160), monto: cut(d.monto, 80),
    mensaje: cut(d.mensaje, 2000), proyecto: cut(d.proyecto, 60), origen: cut(d.origen || (utm ? 'Campaña' : 'Web'), 60),
    pagina: cut(location.href, 300), utm: cut(utm, 300), etapa: 'nuevo', creado: fs.serverTimestamp()
  });
}
