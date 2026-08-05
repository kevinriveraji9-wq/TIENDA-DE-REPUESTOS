/* ============================================================
   Datos semilla de la maqueta
   ============================================================ */

const VEHICULOS = [
  { id: 'spark-gt', marca: 'Chevrolet', linea: 'Spark GT', anio: 2016, motor: '1.2L', color: 'Rojo' },
  { id: 'sandero',  marca: 'Renault',   linea: 'Sandero',  anio: 2018, motor: '1.6L', color: 'Gris' },
  { id: 'mazda2',   marca: 'Mazda',     linea: '2 Sedán',  anio: 2019, motor: '1.5L', color: 'Blanco' },
  { id: 'hilux',    marca: 'Toyota',    linea: 'Hilux',    anio: 2020, motor: '2.4L Diésel', color: 'Plata' },
  { id: 'picanto',  marca: 'Kia',       linea: 'Picanto',  anio: 2017, motor: '1.0L', color: 'Azul' },
  { id: 'logan',    marca: 'Renault',   linea: 'Logan',    anio: 2015, motor: '1.6L', color: 'Beige' },
];

const MARCAS_AUTO = ['Chevrolet', 'Renault', 'Mazda', 'Toyota', 'Kia', 'Hyundai', 'Nissan', 'Ford', 'Suzuki', 'Volkswagen'];

const CATEGORIAS = [
  { id: 'todos',      nombre: 'Todo',          icon: 'grid' },
  { id: 'frenos',     nombre: 'Frenos',        icon: 'disc' },
  { id: 'motor',      nombre: 'Motor',         icon: 'filter' },
  { id: 'suspension', nombre: 'Suspensión',    icon: 'shock' },
  { id: 'electrico',  nombre: 'Eléctrico',     icon: 'battery' },
  { id: 'luces',      nombre: 'Luces',         icon: 'headlight' },
  { id: 'rines',      nombre: 'Rines y llantas', icon: 'rim' },
  { id: 'interior',   nombre: 'Interior',      icon: 'seat' },
  { id: 'audio',      nombre: 'Audio',         icon: 'speaker' },
  { id: 'exterior',   nombre: 'Exterior',      icon: 'spoiler' },
];

/* compat: ids de VEHICULOS, o 'universal' */
const PRODUCTOS_SEED = [
  {
    id: 'p01', nombre: 'Pastillas de freno delanteras', marca: 'Brembo', ref: 'BR-P4521',
    tipo: 'Repuestos', categoria: 'frenos', icon: 'disc', precio: 128000, stock: 24, stockMin: 6,
    compat: ['spark-gt', 'picanto', 'sandero'], destacado: true,
    descripcion: 'Juego de 4 pastillas cerámicas de baja pulverización. Frenado estable en pendiente y menor desgaste del disco.'
  },
  {
    id: 'p02', nombre: 'Disco de freno ventilado 256mm', marca: 'ATE', ref: 'AT-D256',
    tipo: 'Repuestos', categoria: 'frenos', icon: 'disc', precio: 215000, stock: 8, stockMin: 4,
    compat: ['sandero', 'logan'], destacado: false,
    descripcion: 'Disco ventilado con tratamiento anticorrosivo. Se recomienda cambiar en pares.'
  },
  {
    id: 'p03', nombre: 'Filtro de aceite', marca: 'Mann Filter', ref: 'MN-W7015',
    tipo: 'Repuestos', categoria: 'motor', icon: 'filter', precio: 32000, stock: 62, stockMin: 15,
    compat: ['spark-gt', 'mazda2', 'picanto', 'logan'], destacado: true,
    descripcion: 'Filtro con válvula antirretorno. Cambio sugerido cada 5.000 km junto con el aceite.'
  },
  {
    id: 'p04', nombre: 'Kit de correa de repartición', marca: 'Gates', ref: 'GT-K015',
    tipo: 'Repuestos', categoria: 'motor', icon: 'belt', precio: 385000, stock: 5, stockMin: 3,
    compat: ['sandero', 'logan'], destacado: false,
    descripcion: 'Kit completo: correa, tensor y rodillo guía. Incluye instructivo de sincronización.'
  },
  {
    id: 'p05', nombre: 'Bujías de iridio (juego x4)', marca: 'NGK', ref: 'NG-IR4',
    tipo: 'Repuestos', categoria: 'motor', icon: 'sparkplug', precio: 96000, stock: 0, stockMin: 8,
    compat: ['spark-gt', 'mazda2', 'picanto'], destacado: false,
    descripcion: 'Electrodo de iridio de larga duración. Mejora el arranque en frío y el consumo.'
  },
  {
    id: 'p06', nombre: 'Amortiguador delantero', marca: 'Monroe', ref: 'MO-A882',
    tipo: 'Repuestos', categoria: 'suspension', icon: 'shock', precio: 268000, stock: 12, stockMin: 4,
    compat: ['spark-gt', 'logan'], destacado: true,
    descripcion: 'Amortiguador a gas con calibración original. Recomendado cambiar el par completo.'
  },
  {
    id: 'p07', nombre: 'Batería 60Ah libre de mantenimiento', marca: 'MAC', ref: 'MC-60D',
    tipo: 'Repuestos', categoria: 'electrico', icon: 'battery', precio: 420000, stock: 3, stockMin: 5,
    compat: ['universal'], destacado: true,
    descripcion: '12 meses de garantía. Se recibe la batería usada como parte de pago.'
  },
  {
    id: 'p08', nombre: 'Alternador 90A remanufacturado', marca: 'Bosch', ref: 'BS-AL90',
    tipo: 'Repuestos', categoria: 'electrico', icon: 'alternator', precio: 610000, stock: 2, stockMin: 2,
    compat: ['sandero', 'logan', 'hilux'], destacado: false,
    descripcion: 'Remanufacturado con rodamientos y regulador nuevos. Probado en banco.'
  },
  {
    id: 'p09', nombre: 'Farola delantera derecha', marca: 'Depo', ref: 'DP-F210R',
    tipo: 'Repuestos', categoria: 'luces', icon: 'headlight', precio: 340000, stock: 6, stockMin: 3,
    compat: ['spark-gt'], destacado: false,
    descripcion: 'Farola homologada con lente de policarbonato y ajuste de altura.'
  },
  {
    id: 'p10', nombre: 'Radiador de aluminio', marca: 'Valeo', ref: 'VL-R330',
    tipo: 'Repuestos', categoria: 'motor', icon: 'radiator', precio: 520000, stock: 4, stockMin: 2,
    compat: ['hilux', 'sandero'], destacado: false,
    descripcion: 'Núcleo de aluminio con tanques reforzados. Incluye empaques de montaje.'
  },

  {
    id: 'l01', nombre: 'Rines deportivos 15" (juego x4)', marca: 'Konig', ref: 'KG-R15B',
    tipo: 'Lujos', categoria: 'rines', icon: 'rim', precio: 1450000, stock: 3, stockMin: 2,
    compat: ['universal'], destacado: true,
    descripcion: 'Aleación negro satinado, 4x100. Incluye balanceo y montaje en tienda.'
  },
  {
    id: 'l02', nombre: 'Barra LED 12" para exploradoras', marca: 'Nitro', ref: 'NT-LB12',
    tipo: 'Lujos', categoria: 'luces', icon: 'ledstrip', precio: 185000, stock: 18, stockMin: 5,
    compat: ['universal'], destacado: true,
    descripcion: '6000K, carcasa de aluminio con certificación IP67. Ideal para camioneta.'
  },
  {
    id: 'l03', nombre: 'Exploradoras redondas LED', marca: 'Nitro', ref: 'NT-EX4',
    tipo: 'Lujos', categoria: 'luces', icon: 'foglight', precio: 145000, stock: 9, stockMin: 4,
    compat: ['universal'], destacado: false,
    descripcion: 'Par de exploradoras con soporte ajustable y arnés con relé incluido.'
  },
  {
    id: 'l04', nombre: 'Forros de silla en cuerina', marca: 'AutoStyle', ref: 'AS-FS01',
    tipo: 'Lujos', categoria: 'interior', icon: 'seat', precio: 320000, stock: 11, stockMin: 4,
    compat: ['universal'], destacado: true,
    descripcion: 'Juego completo, costura reforzada. Disponible en negro, beige y bicolor.'
  },
  {
    id: 'l05', nombre: 'Tapetes de caucho tipo bandeja', marca: 'AutoStyle', ref: 'AS-TP03',
    tipo: 'Lujos', categoria: 'interior', icon: 'mat', precio: 128000, stock: 26, stockMin: 8,
    compat: ['universal'], destacado: false,
    descripcion: 'Bordes altos que contienen el agua y el barro. Fácil de lavar.'
  },
  {
    id: 'l06', nombre: 'Cubrevolante deportivo', marca: 'AutoStyle', ref: 'AS-CV07',
    tipo: 'Lujos', categoria: 'interior', icon: 'wheelcover', precio: 45000, stock: 34, stockMin: 10,
    compat: ['universal'], destacado: false,
    descripcion: 'Cuerina perforada con costura roja. Diámetro estándar 38 cm.'
  },
  {
    id: 'l07', nombre: 'Parlantes coaxiales 6.5" (par)', marca: 'Pioneer', ref: 'PN-C65',
    tipo: 'Lujos', categoria: 'audio', icon: 'speaker', precio: 275000, stock: 7, stockMin: 3,
    compat: ['universal'], destacado: true,
    descripcion: '250W pico. Instalación disponible en tienda con o sin adaptador.'
  },
  {
    id: 'l08', nombre: 'Radio pantalla 9" Android', marca: 'Sound Pro', ref: 'SP-A9',
    tipo: 'Lujos', categoria: 'audio', icon: 'screen', precio: 690000, stock: 4, stockMin: 2,
    compat: ['universal'], destacado: true,
    descripcion: 'Android Auto y CarPlay inalámbrico, GPS y cámara de reversa incluida.'
  },
  {
    id: 'l09', nombre: 'Cámara de reversa HD', marca: 'Sound Pro', ref: 'SP-CR1',
    tipo: 'Lujos', categoria: 'audio', icon: 'camera', precio: 115000, stock: 15, stockMin: 5,
    compat: ['universal'], destacado: false,
    descripcion: 'Visión nocturna y líneas guía. Se conecta a cualquier pantalla con entrada RCA.'
  },
  {
    id: 'l10', nombre: 'Spoiler trasero universal', marca: 'AeroLine', ref: 'AL-SP2',
    tipo: 'Lujos', categoria: 'exterior', icon: 'spoiler', precio: 230000, stock: 5, stockMin: 2,
    compat: ['universal'], destacado: false,
    descripcion: 'Fibra ABS lista para pintar del color del carro. Montaje con cinta 3M.'
  },
  {
    id: 'l11', nombre: 'Película polarizada 3M (metro)', marca: '3M', ref: 'MM-PL35',
    tipo: 'Lujos', categoria: 'exterior', icon: 'tint', precio: 95000, stock: 40, stockMin: 10,
    compat: ['universal'], destacado: false,
    descripcion: 'Nivel 35% permitido por norma. Instalación profesional en el local.'
  },
  {
    id: 'l12', nombre: 'Aromatizante de rejilla (x3)', marca: 'Little Trees', ref: 'LT-AR3',
    tipo: 'Lujos', categoria: 'interior', icon: 'freshener', precio: 24000, stock: 58, stockMin: 12,
    compat: ['universal'], destacado: false,
    descripcion: 'Fragancias: nueva carrocería, vainilla y cítricos. Duración aproximada 45 días.'
  },
];

/* Datos del negocio — reemplazar por los reales del cliente */
const NEGOCIO = {
  nombre: 'Autopartes Pitalito',
  eslogan: 'Repuestos y lujos para tu carro',
  ciudad: 'Pitalito, Huila',
  direccion: 'Cra. 4 # 12-45, Barrio Centro',
  telefono: '+57 300 000 0000',
  whatsapp: '573000000000',
  horario: 'Lun a Sáb · 7:30 am – 6:30 pm',
};
