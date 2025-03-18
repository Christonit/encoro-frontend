'use strict';

const uuid4 = require('uuid');
const dayjs = require('dayjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkDelete('events', null, {});

    return queryInterface.bulkInsert('events', [
      {
        id: uuid4.v4(),
        direction: 'Sala Carlos Piantini, Teatro Nacional, Av. Máximo Gómez 35, Santo Domingo',
        city: 'Distrito Nacional',
        place_id: 'ChIJnT_VXdKJr44RHeZMm4m2PXE',
        category: 'art',
        title: 'Shen Yun Performing Arts | Santo Domingo',
        date: dayjs(new Date()).add(1, 'day').format("YYYY-MM-DD"),
        time: '20:00:00',
        description: 'El gong resuena, el telón se abre y una escena celestial aparece ante sus ojos. Las hadas emergen de un mar de nubes ondulantes. Los mongoles cabalgan por praderas tan vastas como el cielo. Las historias clásicas de amor y pérdida, de humor y actos heroicos, cobran vida. Se sorprenderá de lo vibrante, emocionante y profunda que puede ser la culture clásica china.',
        hashtags: JSON.stringify(['ShenYun', 'PerformingArts', 'SantoDomingo']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/Shen-Yun-Perfoming-Arts-450x650-1672260288.jpg', 'https://s3.console.aws.amazon.com/s3/object/encoro-assets?region=us-east-1&prefix=slideshow-thumb-1.fc1776e38e3bc4f52ce8.jpg', 'https://s3.console.aws.amazon.com/s3/object/encoro-assets?region=us-east-1&prefix=slideshow-thumb-3.57a6d8d291ce82d52866.jpg', 'https://s3.console.aws.amazon.com/s3/object/encoro-assets?region=us-east-1&prefix=slideshow-thumb-5.94bc55adbbea119595fd.jpg']),
        entrance_format: 'pay',
        fee: '4400',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      {
        id: uuid4.v4(),
        direction: 'Sambil, Avenida John F. Kennedy, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJ_c63FMqJr44REErLehzalRc',
        category: 'culture',
        title: 'Bodies Cuerpos Humanos Reales. (Del 26 de Agosto al 15 Enero) ',
        date: dayjs(new Date()).add(1, 'day').format("YYYY-MM-DD"),
        time: '21:00:00',
        description: `BODIES CUERPOS HUMANOS REALES es la exhibición educativa más vista a nivel mundial. 
      Llega a República Dominicana la más impresionante y completa muestra de órganos, torsos y 
      cuerpos enteros preservados para su exposición. El carácter de la exposición es 100% educativo. 
      Además de los guías profesionales médicos, la exhibición cuenta con 5 guías virtuales que, 
      a través de pantallas led, interactúan con los expositores generando una experiencia entretenida 
      y recreativa para los asistentes, tanto niños como adultos.`,
        hashtags: JSON.stringify(['humanbodies', 'sambil', 'SantoDomingo']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/ca-times.brightspotcdn.jpg',
          'https://encoro-assets.s3.amazonaws.com/human-bodies-12748_tn.jpg',
          'https://encoro-assets.s3.amazonaws.com/orig-1523907827234.webp',
        ]),
        entrance_format: 'pay',
        fee: '400',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,

      },
      {
        id: uuid4.v4(),
        direction: 'Casa de Teatro, Calle Las Damas, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJKxNHXT2Ir44Rzu94wKttIks',
        category: 'music',
        title: ' Diego Jaar',
        date: dayjs(new Date()).add(1, 'day').format("YYYY-MM-DD"),
        time: '21:30:00',
        description: ``,
        hashtags: JSON.stringify(['music', 'casateatro', 'celebracion']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/12981_tn.jpg'
        ]),
        entrance_format: 'pay',
        fee: '1400',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'music',
        title: `Royal Opera House Temporada 2022/2023`,
        date: dayjs(new Date()).add(1, 'day').format("YYYY-MM-DD"),
        time: '17:30:00',
        description: `La Alianza Royal Opera House presenta la Temporada 22/23 de la emblemática 
        Royal Opera House EN GRAN PANTALLA. Disfruta de las transmisiones de ópera y ballet en la 
        Sala Carlos Piantini del Teatro Nacional Eduardo Brito.`,
        hashtags: JSON.stringify(['music', 'teatro']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/12949_tn.jpg',
          'https://encoro-assets.s3.amazonaws.com/Screenshot_20221105-105716_Gmail.jpg',
          'https://encoro-assets.s3.amazonaws.com/innocence-saariaho-e1649243330583.jpg',
          'https://encoro-assets.s3.amazonaws.com/unnamed-3-scaled.jpg'
        ]),
        entrance_format: 'pay',
        fee: '1030',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Vent Lounge, Calle Eduardo Vicioso, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJCwlfHAxipY4R7Sw-41MwqDs',
        category: 'nightlife',
        title: `Exotic Wednesdays | DJ en vivo los miercoles`,
        date: dayjs(new Date()).add(1, 'day').format("YYYY-MM-DD"),
        time: '17:30:00',
        description: `✨The Most Exclusive Rooftop In Town
        ⏱Todos los días de 10am hasta tarde🔥🔥`,
        hashtags: JSON.stringify(['somosventlounge', 'dondenuncafalla']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/324383665_186697327343078_8754567053534961434_n.jpg'
        ]),
        entrance_format: 'free',
        fee: 0,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Catalonia Santo Domingo, Avenida George Washington, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJIfvt7X5ipY4RgGRt6FLUqIQ',
        category: 'conferences',
        title: `VI Foro de Energía Sostenible`,
        date: dayjs(new Date()).add(2, 'day').format("YYYY-MM-DD"),
        time: '8:30:00',
        description: `El Foro de Energía Sostenible (FES) es una plataforma de impulso del sector energético en la República Dominicana, en la que se establecen conexiones productivas y reciben las informaciones más actualizadas acerca de eficiencia energética, financiamiento, tecnología, regulación, responsabilidad social, cambio climático, entre otros temas de su interés.

        No solo se limita a los equipos del sector renovable, sino que abarca todos los aspectos de la sostenibilidad: humano, social, económico y ambiental, por lo que en el evento participan todos las empresas que estén relacionada con energía en la República Dominicana y el exterior.
        
        Como part del evento contamos con Expo energía donde las empresas pueden exhibir sus productos y servicios.`,
        hashtags: JSON.stringify(['EnergiaRenovable', 'conferences']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/https+__cdn.evbuc.com_images_353340829_417476246589_1_original.avif',
          'https://encoro-assets.s3.amazonaws.com/https+__cdn.evbuc.com_images_353342009_417476246589_1_original.avif'
        ]),
        entrance_format: 'free',
        fee: 0,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Renaissance Santo Domingo Jaragua Hotel & Casino, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJ5WQToymIr44RSzUfzUux5as',
        category: 'nightlife',
        title: `ALTAGRACIA 3 DAY WEEKEND (JAN 20th - 23rd)`,
        date: dayjs(new Date()).add(2, 'day').format("YYYY-MM-DD"),
        time: '21:00:00',
        description: ``,
        hashtags: JSON.stringify(['party', 'dondenuncafalla']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/https+__cdn.evbuc.com_images_417169759_185759333399_1_original.avif'
        ]),
        entrance_format: 'free',
        fee: 0,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Marketcito, Avenida Ingeniero Roberto Pastoriza, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJ1XL2OvCJr44Rd0R6iNOUvX4',
        category: 'bars',
        title: `10mo Aniversario Marketcito`,
        date: dayjs(new Date()).add(2, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: `¡Celebremos 10 años de muchas cosas buenas! Este Domingo 18 de Diciembre tenemos un día completo de actividades para ti!

        •11am - Final del mundial 🇫🇷 vs 🇦🇷
        •1pm - Live DJ @djanthonycamacho
        •5pm - Live DJ @erickzicardi
        •7pm - @lupolancoo
        •9pm - @soypamel
        •10:30pm - @martenfranko `,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/324874275_693016952459504_7757764410166477204_n.jpg',
          'https://encoro-assets.s3.amazonaws.com/319875734_1484249772066678_8346377759914820142_n.jpg'
        ]),
        entrance_format: 'free',
        fee: 0,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'culture',
        title: `Gordos: Una comedia musicl de mucho peso `,
        date: dayjs(new Date()).add(2, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: `Gordos comedia musicl basada en la historia de Jhonny, un adolescente que sufre de obesidad desde su niñez y sueña con bailar. Su historia muestra como se siente respecto a su condición física, las situaciones emocionales con las que ha tenido que lidiar para llevar una vida como sus demás amigos y ver la incomprensión de muchos por su ignorancia sobre esta enfermedad.

        Gordos viaja por la comedia y el drama, mostrando las vicisitudes que pasan las personas obesas en un mundo tan mediático, donde la imagen está asociada al éxito en casi todos los ámbitos sociales.
        
        Evento Para Mayores De 13 Años.
        
        Este importe no se devuelve. El teatro cierra sus puertas puntualmente por lo que el derecho de admisión se pierde si se trata de ingresar después de la hora señalada en esta boleta. `,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/13639_tn.jpg']),
        entrance_format: 'pay',
        fee: 2000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'gastronomy',
        title: ` Alma by The Sphere: Experiencia Gastronomica`,
        date: dayjs(new Date()).add(2, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: `Experiencia Gastronómica con 3 Chefs Estrella Michelin: Toño Pérez, 
        Ramon Freixa y Josean Alija. Mostraremos la gastronomía mas moderna de Norte a Sur 
        y de Este a Oeste de España. Evento para mayores de 18 años. `,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/13654_tn.jpg']),
        entrance_format: 'pay',
        fee: 60000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'music',
        title: `España Entre Cuerdas: Pablo Ferrández En Concierto`,
        date: dayjs(new Date()).add(2, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: `Experiencia Gastronómica con 3 Chefs Estrella Michelin: Toño Pérez, 
        Ramon Freixa y Josean Alija. Mostraremos la gastronomía mas moderna de Norte a Sur 
        y de Este a Oeste de España. Evento para mayores de 18 años. `,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/13720_tn.jpg']),
        entrance_format: 'pay',
        fee: 60000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'conferences',
        title: `Cumbre de Liderazgo Matrimonial`,
        date: dayjs(new Date()).add(2, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: `La primera Cumbre de Liderazgo Matrimonial es un evento que pretende reunir anualmente a parejas con el fin de proveer herramientas al matrimonio de hoy entre un hombre y una mujer, para forjar matrimonios lideres frente a los desafíos globales que presenta hoy en día el matrimonio diseñado por Dios.

        La Cumbre está diseñada para ser estratégicamente innovadora y con un contenido estratégicamente diverso a la luz de la Biblia, para el abordaje de temas de interés social, competencias y nuevos retos del matrimonio Hetero y la familia.
        
        La cumbre de Liderazgo Matrimonial es un evento organizado por la Institución LatidosAR, Organización dedicada a la formación, educación y capacitación en Salud mental, matrimonial e individual y que busca forjar una generación de matrimonios más felices. Esta Institución está dirigida por los Pastores Samuel Liriano y Ammy Reynoso de la Iglesia Metodista Libre, Río de Dios, en Santo Domingo, Distrito Nacional. Ambos pastores trabajan con matrimonios como terapeuta de familia y terapeutas sexual y de parejas.`,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/Cumbre-matrimonial.png']),
        entrance_format: 'pay',
        fee: 60000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'art',
        title: ` ¡Si son 50! ¿Y Qué?`,
        date: dayjs(new Date()).add(3, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: `Yolanda y Orquídea dos mujeres en la cincuentena que en una conferencia interactiva compartn experiencias, tests y un botiquín repleto para vivir esta etapa sin sofoco.`,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/13720_tn.jpg']),
        entrance_format: 'pay',
        fee: 60000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'art',
        title: `El reino de los cielos`,
        date: dayjs(new Date()).add(3, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: ``,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/El-reino-de-los-cielos.png']),
        entrance_format: 'pay',
        fee: 60000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },

      {
        id: uuid4.v4(),
        direction: 'Sala Carlos Piantini, Teatro Nacional, Av. Máximo Gómez 35, Santo Domingo',
        city: 'Distrito Nacional',
        place_id: 'ChIJnT_VXdKJr44RHeZMm4m2PXE',
        category: 'art',
        title: 'Shen Yun Performing Arts | Santo Domingo',
        date: dayjs(new Date()).add(3, 'day').format("YYYY-MM-DD"),
        time: '20:00:00',
        description: 'El gong resuena, el telón se abre y una escena celestial aparece ante sus ojos. Las hadas emergen de un mar de nubes ondulantes. Los mongoles cabalgan por praderas tan vastas como el cielo. Las historias clásicas de amor y pérdida, de humor y actos heroicos, cobran vida. Se sorprenderá de lo vibrante, emocionante y profunda que puede ser la culture clásica china.',
        hashtags: JSON.stringify(['ShenYun', 'PerformingArts', 'SantoDomingo']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/Shen-Yun-Perfoming-Arts-450x650-1672260288.jpg', 'https://s3.console.aws.amazon.com/s3/object/encoro-assets?region=us-east-1&prefix=slideshow-thumb-1.fc1776e38e3bc4f52ce8.jpg', 'https://s3.console.aws.amazon.com/s3/object/encoro-assets?region=us-east-1&prefix=slideshow-thumb-3.57a6d8d291ce82d52866.jpg', 'https://s3.console.aws.amazon.com/s3/object/encoro-assets?region=us-east-1&prefix=slideshow-thumb-5.94bc55adbbea119595fd.jpg']),
        entrance_format: 'pay',
        fee: '4400',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,

      },
      {
        id: uuid4.v4(),
        direction: 'Sambil, Avenida John F. Kennedy, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJ_c63FMqJr44REErLehzalRc',
        category: 'culture',
        title: 'Bodies Cuerpos Humanos Reales. (Del 26 de Agosto al 15 Enero) ',
        date: dayjs(new Date()).add(3, 'day').format("YYYY-MM-DD"),
        time: '21:00:00',
        description: `BODIES CUERPOS HUMANOS REALES es la exhibición educativa más vista a nivel mundial. 
      Llega a República Dominicana la más impresionante y completa muestra de órganos, torsos y 
      cuerpos enteros preservados para su exposición. El carácter de la exposición es 100% educativo. 
      Además de los guías profesionales médicos, la exhibición cuenta con 5 guías virtuales que, 
      a través de pantallas led, interactúan con los expositores generando una experiencia entretenida 
      y recreativa para los asistentes, tanto niños como adultos.`,
        hashtags: JSON.stringify(['humanbodies', 'sambil', 'SantoDomingo']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/ca-times.brightspotcdn.jpg',
          'https://encoro-assets.s3.amazonaws.com/human-bodies-12748_tn.jpg',
          'https://encoro-assets.s3.amazonaws.com/orig-1523907827234.webp',
        ]),
        entrance_format: 'pay',
        fee: '400',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,

      },
      {
        id: uuid4.v4(),
        direction: 'Casa de Teatro, Calle Las Damas, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJKxNHXT2Ir44Rzu94wKttIks',
        category: 'music',
        title: ' Diego Jaar',
        date: dayjs(new Date()).add(3, 'day').format("YYYY-MM-DD"),
        time: '21:30:00',
        description: ``,
        hashtags: JSON.stringify(['music', 'casateatro', 'celebracion']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/12981_tn.jpg'
        ]),
        entrance_format: 'pay',
        fee: '1400',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'music',
        title: `Royal Opera House Temporada 2022/2023`,
        date: dayjs(new Date()).add(3, 'day').format("YYYY-MM-DD"),
        time: '17:30:00',
        description: `La Alianza Royal Opera House presenta la Temporada 22/23 de la emblemática 
        Royal Opera House EN GRAN PANTALLA. Disfruta de las transmisiones de ópera y ballet en la 
        Sala Carlos Piantini del Teatro Nacional Eduardo Brito.`,
        hashtags: JSON.stringify(['music', 'teatro']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/12949_tn.jpg',
          'https://encoro-assets.s3.amazonaws.com/Screenshot_20221105-105716_Gmail.jpg',
          'https://encoro-assets.s3.amazonaws.com/innocence-saariaho-e1649243330583.jpg',
          'https://encoro-assets.s3.amazonaws.com/unnamed-3-scaled.jpg'
        ]),
        entrance_format: 'pay',
        fee: '1030',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Vent Lounge, Calle Eduardo Vicioso, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJCwlfHAxipY4R7Sw-41MwqDs',
        category: 'nightlife',
        title: `Exotic Wednesdays | DJ en vivo los miercoles`,
        date: dayjs(new Date()).add(3, 'day').format("YYYY-MM-DD"),
        time: '17:30:00',
        description: `✨The Most Exclusive Rooftop In Town
        ⏱Todos los días de 10am hasta tarde🔥🔥`,
        hashtags: JSON.stringify(['somosventlounge', 'dondenuncafalla']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/324383665_186697327343078_8754567053534961434_n.jpg'
        ]),
        entrance_format: 'free',
        fee: 0,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Sala Carlos Piantini, Teatro Nacional, Av. Máximo Gómez 35, Santo Domingo',
        city: 'Distrito Nacional',
        place_id: 'ChIJnT_VXdKJr44RHeZMm4m2PXE',
        category: 'art',
        title: 'Shen Yun Performing Arts | Santo Domingo',
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '20:00:00',
        description: 'El gong resuena, el telón se abre y una escena celestial aparece ante sus ojos. Las hadas emergen de un mar de nubes ondulantes. Los mongoles cabalgan por praderas tan vastas como el cielo. Las historias clásicas de amor y pérdida, de humor y actos heroicos, cobran vida. Se sorprenderá de lo vibrante, emocionante y profunda que puede ser la culture clásica china.',
        hashtags: JSON.stringify(['ShenYun', 'PerformingArts', 'SantoDomingo']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/Shen-Yun-Perfoming-Arts-450x650-1672260288.jpg', 'https://s3.console.aws.amazon.com/s3/object/encoro-assets?region=us-east-1&prefix=slideshow-thumb-1.fc1776e38e3bc4f52ce8.jpg', 'https://s3.console.aws.amazon.com/s3/object/encoro-assets?region=us-east-1&prefix=slideshow-thumb-3.57a6d8d291ce82d52866.jpg', 'https://s3.console.aws.amazon.com/s3/object/encoro-assets?region=us-east-1&prefix=slideshow-thumb-5.94bc55adbbea119595fd.jpg']),
        entrance_format: 'pay',
        fee: '4400',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,

      },
      {
        id: uuid4.v4(),
        direction: 'Sambil, Avenida John F. Kennedy, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJ_c63FMqJr44REErLehzalRc',
        category: 'culture',
        title: 'Bodies Cuerpos Humanos Reales. (Del 26 de Agosto al 15 Enero) ',
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '21:00:00',
        description: `BODIES CUERPOS HUMANOS REALES es la exhibición educativa más vista a nivel mundial. 
      Llega a República Dominicana la más impresionante y completa muestra de órganos, torsos y 
      cuerpos enteros preservados para su exposición. El carácter de la exposición es 100% educativo. 
      Además de los guías profesionales médicos, la exhibición cuenta con 5 guías virtuales que, 
      a través de pantallas led, interactúan con los expositores generando una experiencia entretenida 
      y recreativa para los asistentes, tanto niños como adultos.`,
        hashtags: JSON.stringify(['humanbodies', 'sambil', 'SantoDomingo']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/ca-times.brightspotcdn.jpg',
          'https://encoro-assets.s3.amazonaws.com/human-bodies-12748_tn.jpg',
          'https://encoro-assets.s3.amazonaws.com/orig-1523907827234.webp',
        ]),
        entrance_format: 'pay',
        fee: '400',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,

      },
      {
        id: uuid4.v4(),
        direction: 'Casa de Teatro, Calle Las Damas, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJKxNHXT2Ir44Rzu94wKttIks',
        category: 'music',
        title: ' Diego Jaar',
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '21:30:00',
        description: ``,
        hashtags: JSON.stringify(['music', 'casateatro', 'celebracion']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/12981_tn.jpg'
        ]),
        entrance_format: 'pay',
        fee: '1400',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'music',
        title: `Royal Opera House Temporada 2022/2023`,
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '17:30:00',
        description: `La Alianza Royal Opera House presenta la Temporada 22/23 de la emblemática 
        Royal Opera House EN GRAN PANTALLA. Disfruta de las transmisiones de ópera y ballet en la 
        Sala Carlos Piantini del Teatro Nacional Eduardo Brito.`,
        hashtags: JSON.stringify(['music', 'teatro']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/12949_tn.jpg',
          'https://encoro-assets.s3.amazonaws.com/Screenshot_20221105-105716_Gmail.jpg',
          'https://encoro-assets.s3.amazonaws.com/innocence-saariaho-e1649243330583.jpg',
          'https://encoro-assets.s3.amazonaws.com/unnamed-3-scaled.jpg'
        ]),
        entrance_format: 'pay',
        fee: '1030',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Vent Lounge, Calle Eduardo Vicioso, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJCwlfHAxipY4R7Sw-41MwqDs',
        category: 'nightlife',
        title: `Exotic Wednesdays | DJ en vivo los miercoles`,
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '17:30:00',
        description: `✨The Most Exclusive Rooftop In Town
        ⏱Todos los días de 10am hasta tarde🔥🔥`,
        hashtags: JSON.stringify(['somosventlounge', 'dondenuncafalla']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/324383665_186697327343078_8754567053534961434_n.jpg'
        ]),
        entrance_format: 'free',
        fee: 0,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Catalonia Santo Domingo, Avenida George Washington, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJIfvt7X5ipY4RgGRt6FLUqIQ',
        category: 'conferences',
        title: `VI Foro de Energía Sostenible`,
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '8:30:00',
        description: `El Foro de Energía Sostenible (FES) es una plataforma de impulso del sector energético en la República Dominicana, en la que se establecen conexiones productivas y reciben las informaciones más actualizadas acerca de eficiencia energética, financiamiento, tecnología, regulación, responsabilidad social, cambio climático, entre otros temas de su interés.

        No solo se limita a los equipos del sector renovable, sino que abarca todos los aspectos de la sostenibilidad: humano, social, económico y ambiental, por lo que en el evento participan todos las empresas que estén relacionada con energía en la República Dominicana y el exterior.
        
        Como part del evento contamos con Expo energía donde las empresas pueden exhibir sus productos y servicios.`,
        hashtags: JSON.stringify(['EnergiaRenovable', 'conferences']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/https+__cdn.evbuc.com_images_353340829_417476246589_1_original.avif',
          'https://encoro-assets.s3.amazonaws.com/https+__cdn.evbuc.com_images_353342009_417476246589_1_original.avif'
        ]),
        entrance_format: 'free',
        fee: 0,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Renaissance Santo Domingo Jaragua Hotel & Casino, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJ5WQToymIr44RSzUfzUux5as',
        category: 'nightlife',
        title: `ALTAGRACIA 3 DAY WEEKEND (JAN 20th - 23rd)`,
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '21:00:00',
        description: ``,
        hashtags: JSON.stringify(['party', 'dondenuncafalla']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/https+__cdn.evbuc.com_images_417169759_185759333399_1_original.avif'
        ]),
        entrance_format: 'free',
        fee: 0,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Marketcito, Avenida Ingeniero Roberto Pastoriza, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJ1XL2OvCJr44Rd0R6iNOUvX4',
        category: 'bars',
        title: `10mo Aniversario Marketcito`,
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: `¡Celebremos 10 años de muchas cosas buenas! Este Domingo 18 de Diciembre tenemos un día completo de actividades para ti!

        •11am - Final del mundial 🇫🇷 vs 🇦🇷
        •1pm - Live DJ @djanthonycamacho
        •5pm - Live DJ @erickzicardi
        •7pm - @lupolancoo
        •9pm - @soypamel
        •10:30pm - @martenfranko `,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/324874275_693016952459504_7757764410166477204_n.jpg',
          'https://encoro-assets.s3.amazonaws.com/319875734_1484249772066678_8346377759914820142_n.jpg'
        ]),
        entrance_format: 'free',
        fee: 0,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'culture',
        title: `Gordos: Una comedia musicl de mucho peso `,
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: `Gordos comedia musicl basada en la historia de Jhonny, un adolescente que sufre de obesidad desde su niñez y sueña con bailar. Su historia muestra como se siente respecto a su condición física, las situaciones emocionales con las que ha tenido que lidiar para llevar una vida como sus demás amigos y ver la incomprensión de muchos por su ignorancia sobre esta enfermedad.

        Gordos viaja por la comedia y el drama, mostrando las vicisitudes que pasan las personas obesas en un mundo tan mediático, donde la imagen está asociada al éxito en casi todos los ámbitos sociales.
        
        Evento Para Mayores De 13 Años.
        
        Este importe no se devuelve. El teatro cierra sus puertas puntualmente por lo que el derecho de admisión se pierde si se trata de ingresar después de la hora señalada en esta boleta. `,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/13639_tn.jpg']),
        entrance_format: 'pay',
        fee: 2000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'gastronomy',
        title: ` Alma by The Sphere: Experiencia Gastronomica`,
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: `Experiencia Gastronómica con 3 Chefs Estrella Michelin: Toño Pérez, 
        Ramon Freixa y Josean Alija. Mostraremos la gastronomía mas moderna de Norte a Sur 
        y de Este a Oeste de España. Evento para mayores de 18 años. `,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/13654_tn.jpg']),
        entrance_format: 'pay',
        fee: 60000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'music',
        title: `España Entre Cuerdas: Pablo Ferrández En Concierto`,
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: `Experiencia Gastronómica con 3 Chefs Estrella Michelin: Toño Pérez, 
        Ramon Freixa y Josean Alija. Mostraremos la gastronomía mas moderna de Norte a Sur 
        y de Este a Oeste de España. Evento para mayores de 18 años. `,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/13720_tn.jpg']),
        entrance_format: 'pay',
        fee: 60000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'conferences',
        title: `Cumbre de Liderazgo Matrimonial`,
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: `La primera Cumbre de Liderazgo Matrimonial es un evento que pretende reunir anualmente a parejas con el fin de proveer herramientas al matrimonio de hoy entre un hombre y una mujer, para forjar matrimonios lideres frente a los desafíos globales que presenta hoy en día el matrimonio diseñado por Dios.

        La Cumbre está diseñada para ser estratégicamente innovadora y con un contenido estratégicamente diverso a la luz de la Biblia, para el abordaje de temas de interés social, competencias y nuevos retos del matrimonio Hetero y la familia.
        
        La cumbre de Liderazgo Matrimonial es un evento organizado por la Institución LatidosAR, Organización dedicada a la formación, educación y capacitación en Salud mental, matrimonial e individual y que busca forjar una generación de matrimonios más felices. Esta Institución está dirigida por los Pastores Samuel Liriano y Ammy Reynoso de la Iglesia Metodista Libre, Río de Dios, en Santo Domingo, Distrito Nacional. Ambos pastores trabajan con matrimonios como terapeuta de familia y terapeutas sexual y de parejas.`,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/Cumbre-matrimonial.png']),
        entrance_format: 'pay',
        fee: 60000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'art',
        title: ` ¡Si son 50! ¿Y Qué?`,
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: `Yolanda y Orquídea dos mujeres en la cincuentena que en una conferencia interactiva compartn experiencias, tests y un botiquín repleto para vivir esta etapa sin sofoco.`,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/13720_tn.jpg']),
        entrance_format: 'pay',
        fee: 60000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'art',
        title: `El reino de los cielos`,
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: ``,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/El-reino-de-los-cielos.png']),
        entrance_format: 'pay',
        fee: 60000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },

      {
        id: uuid4.v4(),
        direction: 'Sala Carlos Piantini, Teatro Nacional, Av. Máximo Gómez 35, Santo Domingo',
        city: 'Distrito Nacional',
        place_id: 'ChIJnT_VXdKJr44RHeZMm4m2PXE',
        category: 'art',
        title: 'Shen Yun Performing Arts | Santo Domingo',
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '20:00:00',
        description: 'El gong resuena, el telón se abre y una escena celestial aparece ante sus ojos. Las hadas emergen de un mar de nubes ondulantes. Los mongoles cabalgan por praderas tan vastas como el cielo. Las historias clásicas de amor y pérdida, de humor y actos heroicos, cobran vida. Se sorprenderá de lo vibrante, emocionante y profunda que puede ser la culture clásica china.',
        hashtags: JSON.stringify(['ShenYun', 'PerformingArts', 'SantoDomingo']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/Shen-Yun-Perfoming-Arts-450x650-1672260288.jpg', 'https://s3.console.aws.amazon.com/s3/object/encoro-assets?region=us-east-1&prefix=slideshow-thumb-1.fc1776e38e3bc4f52ce8.jpg', 'https://s3.console.aws.amazon.com/s3/object/encoro-assets?region=us-east-1&prefix=slideshow-thumb-3.57a6d8d291ce82d52866.jpg', 'https://s3.console.aws.amazon.com/s3/object/encoro-assets?region=us-east-1&prefix=slideshow-thumb-5.94bc55adbbea119595fd.jpg']),
        entrance_format: 'pay',
        fee: '4400',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,

      },
      {
        id: uuid4.v4(),
        direction: 'Sambil, Avenida John F. Kennedy, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJ_c63FMqJr44REErLehzalRc',
        category: 'culture',
        title: 'Bodies Cuerpos Humanos Reales. (Del 26 de Agosto al 15 Enero) ',
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '21:00:00',
        description: `BODIES CUERPOS HUMANOS REALES es la exhibición educativa más vista a nivel mundial. 
      Llega a República Dominicana la más impresionante y completa muestra de órganos, torsos y 
      cuerpos enteros preservados para su exposición. El carácter de la exposición es 100% educativo. 
      Además de los guías profesionales médicos, la exhibición cuenta con 5 guías virtuales que, 
      a través de pantallas led, interactúan con los expositores generando una experiencia entretenida 
      y recreativa para los asistentes, tanto niños como adultos.`,
        hashtags: JSON.stringify(['humanbodies', 'sambil', 'SantoDomingo']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/ca-times.brightspotcdn.jpg',
          'https://encoro-assets.s3.amazonaws.com/human-bodies-12748_tn.jpg',
          'https://encoro-assets.s3.amazonaws.com/orig-1523907827234.webp',
        ]),
        entrance_format: 'pay',
        fee: '400',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,

      },
      {
        id: uuid4.v4(),
        direction: 'Casa de Teatro, Calle Las Damas, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJKxNHXT2Ir44Rzu94wKttIks',
        category: 'music',
        title: ' Diego Jaar',
        date: dayjs(new Date()).add(4, 'day').format("YYYY-MM-DD"),
        time: '21:30:00',
        description: ``,
        hashtags: JSON.stringify(['music', 'casateatro', 'celebracion']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/12981_tn.jpg'
        ]),
        entrance_format: 'pay',
        fee: '1400',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'music',
        title: `Royal Opera House Temporada 2022/2023`,
        date: dayjs(new Date()).add(5, 'day').format("YYYY-MM-DD"),
        time: '17:30:00',
        description: `La Alianza Royal Opera House presenta la Temporada 22/23 de la emblemática 
        Royal Opera House EN GRAN PANTALLA. Disfruta de las transmisiones de ópera y ballet en la 
        Sala Carlos Piantini del Teatro Nacional Eduardo Brito.`,
        hashtags: JSON.stringify(['music', 'teatro']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/12949_tn.jpg',
          'https://encoro-assets.s3.amazonaws.com/Screenshot_20221105-105716_Gmail.jpg',
          'https://encoro-assets.s3.amazonaws.com/innocence-saariaho-e1649243330583.jpg',
          'https://encoro-assets.s3.amazonaws.com/unnamed-3-scaled.jpg'
        ]),
        entrance_format: 'pay',
        fee: '1030',
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Vent Lounge, Calle Eduardo Vicioso, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJCwlfHAxipY4R7Sw-41MwqDs',
        category: 'nightlife',
        title: `Exotic Wednesdays | DJ en vivo los miercoles`,
        date: dayjs(new Date()).add(5, 'day').format("YYYY-MM-DD"),
        time: '17:30:00',
        description: `✨The Most Exclusive Rooftop In Town
        ⏱Todos los días de 10am hasta tarde🔥🔥`,
        hashtags: JSON.stringify(['somosventlounge', 'dondenuncafalla']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/324383665_186697327343078_8754567053534961434_n.jpg'
        ]),
        entrance_format: 'free',
        fee: 0,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },

      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'music',
        title: `España Entre Cuerdas: Pablo Ferrández En Concierto`,
        date: dayjs(new Date()).add(6, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: `Experiencia Gastronómica con 3 Chefs Estrella Michelin: Toño Pérez, 
        Ramon Freixa y Josean Alija. Mostraremos la gastronomía mas moderna de Norte a Sur 
        y de Este a Oeste de España. Evento para mayores de 18 años. `,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/13720_tn.jpg']),
        entrance_format: 'pay',
        fee: 60000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'conferences',
        title: `Cumbre de Liderazgo Matrimonial`,
        date: dayjs(new Date()).add(6, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: `La primera Cumbre de Liderazgo Matrimonial es un evento que pretende reunir anualmente a parejas con el fin de proveer herramientas al matrimonio de hoy entre un hombre y una mujer, para forjar matrimonios lideres frente a los desafíos globales que presenta hoy en día el matrimonio diseñado por Dios.

        La Cumbre está diseñada para ser estratégicamente innovadora y con un contenido estratégicamente diverso a la luz de la Biblia, para el abordaje de temas de interés social, competencias y nuevos retos del matrimonio Hetero y la familia.
        
        La cumbre de Liderazgo Matrimonial es un evento organizado por la Institución LatidosAR, Organización dedicada a la formación, educación y capacitación en Salud mental, matrimonial e individual y que busca forjar una generación de matrimonios más felices. Esta Institución está dirigida por los Pastores Samuel Liriano y Ammy Reynoso de la Iglesia Metodista Libre, Río de Dios, en Santo Domingo, Distrito Nacional. Ambos pastores trabajan con matrimonios como terapeuta de familia y terapeutas sexual y de parejas.`,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/Cumbre-matrimonial.png']),
        entrance_format: 'pay',
        fee: 60000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'art',
        title: ` ¡Si son 50! ¿Y Qué?`,
        date: dayjs(new Date()).add(6, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: `Yolanda y Orquídea dos mujeres en la cincuentena que en una conferencia interactiva compartn experiencias, tests y un botiquín repleto para vivir esta etapa sin sofoco.`,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/13720_tn.jpg']),
        entrance_format: 'pay',
        fee: 60000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
      {
        id: uuid4.v4(),
        direction: 'Teatro Nacional Eduardo Brito, Avenida Máximo Gómez, Santo Domingo, República Dominicana',
        city: 'Distrito Nacional',
        place_id: 'ChIJodYUTv9hpY4R64hCgFfdZXs',
        category: 'art',
        title: `El reino de los cielos`,
        date: dayjs(new Date()).add(6, 'day').format("YYYY-MM-DD"),
        time: '22:30:00',
        description: ``,
        hashtags: JSON.stringify(['Marketcitord', 'party']),
        media: JSON.stringify(['https://encoro-assets.s3.amazonaws.com/El-reino-de-los-cielos.png']),
        entrance_format: 'pay',
        fee: 60000,
        creator: '5adc6ea5-e45d-4478-93cb-66484a40c67d',
        social_networks: '',
        published_in_ig: false,
        is_active: true
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('events', null, {});

  }
};
