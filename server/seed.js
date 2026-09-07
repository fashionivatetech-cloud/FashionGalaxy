require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('./models/Profile');

/*
 * All photos are from Unsplash — full-body or half-body editorial/fashion shots.
 * Layouts alternate between 'left' and 'right'.
 */
const profiles = [
  {
    name: 'Aisha Mehra',
    // Full-body fashion editorial — woman in elegant dress
    photo: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=85&fit=crop&crop=top',
    location: 'Mumbai · Maharashtra',
    department: 'Fashion',
    profession: 'Couture Designer',
    bio: 'Award-winning couture designer with over a decade of experience in bridal and luxury ready-to-wear. Her work has been featured in Vogue India, Harper\'s Bazaar, and Elle.',
    editorial_content: 'Aisha Mehra approaches design as architecture for the body — each silhouette a considered structure, each textile a deliberate surface. Her bridal collections have been worn across three continents, from Jaipur palace weddings to rooftop ceremonies in London and New York. She began her journey at NIFT Mumbai, apprenticed under a master embroiderer in Lucknow, and spent two formative years at a maison in Paris before returning to open her atelier in Bandra West — a space that is simultaneously studio, sanctuary, and archive. Her latest collection, Afterglow, draws from Mughal architectural motifs translated into hand-cut organza and raw silk. She believes fashion is not about the moment of wearing — it is about the decade of remembering.',
    phone: '+91 98765 43210',
    email: 'aisha.mehra@fashiongalaxy.in',
    socialLinks: {
      instagram: 'https://instagram.com/aishamehra',
      linkedin: 'https://linkedin.com/in/aishamehra',
      website: 'https://aishamehra.com',
    },
    tags: ['bridal', 'couture', 'luxury', 'designer'],
    layout_style: 'left',
  },
  {
    name: 'Rohan Kapoor',
    // Half-body editorial — man in structured blazer, urban setting
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=85&fit=crop&crop=top',
    location: 'Delhi · NCR',
    department: 'Technology',
    profession: 'Tech Entrepreneur',
    bio: 'Full-stack developer and serial tech entrepreneur building next-generation SaaS platforms for fashion retail. His ventures have processed over four million customer journeys.',
    editorial_content: 'Rohan Kapoor builds the infrastructure that future creative industries will run on. His SaaS platforms bridge the gap between artisan makers and digital commerce — a space few understand and fewer navigate successfully. He started his first company at twenty-three from a two-bedroom flat in Karol Bagh. A decade later, that company powers inventory systems for sixty independent fashion labels across North India. His current venture, Threadline, uses machine learning to personalise product discovery for D2C fashion brands, reducing return rates by an average of thirty-one percent. He speaks rarely and codes constantly. When asked about the future of fashion technology, he answers with a prototype.',
    phone: '+91 87654 32109',
    email: 'rohan.kapoor@fashiongalaxy.in',
    socialLinks: {
      instagram: '',
      linkedin: 'https://linkedin.com/in/rohankapoor',
      website: 'https://rohankapoor.dev',
    },
    tags: ['developer', 'saas', 'ai', 'ecommerce'],
    layout_style: 'right',
  },
  {
    name: 'Priya Nair',
    // Full-body — woman in motion, contemporary fashion
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=85&fit=crop&crop=top',
    location: 'Bengaluru · Karnataka',
    department: 'Healthcare',
    profession: 'Wellness Coach',
    bio: 'Certified wellness coach and holistic health practitioner. Specialises in performance nutrition for creative professionals and evidence-based mental health advocacy.',
    editorial_content: 'Priya Nair believes the body is the first luxury. Her practice, Rooted Wellness, integrates Ayurvedic tradition with contemporary nutritional science — a methodology she spent seven years developing across clinics in Bengaluru, Sri Lanka, and Amsterdam. Her clients include Bollywood directors, textile entrepreneurs, and national-level athletes who come to her not for quick fixes but for sustained transformation. She writes a monthly column for a national health magazine, has spoken at TEDxBengaluru, and is currently completing her second book on the relationship between creative burnout and dietary deficiency. She does not believe in shortcuts. She believes in systems that outlast willpower.',
    phone: '+91 76543 21098',
    email: 'priya.nair@fashiongalaxy.in',
    socialLinks: {
      instagram: 'https://instagram.com/priyawellness',
      linkedin: 'https://linkedin.com/in/priyanair',
      website: 'https://priyawellness.in',
    },
    tags: ['wellness', 'nutrition', 'holistic', 'mental health'],
    layout_style: 'left',
  },
  {
    name: 'Zaid Siddiqui',
    // Half-body editorial — man in dark tones, moody lighting
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=85&fit=crop&crop=top',
    location: 'Hyderabad · Telangana',
    department: 'Music',
    profession: 'Music Producer',
    bio: 'Independent music producer and sound designer with twenty-three short film credits. Two national award nominations. Known for scores that critics call architecturally sparse and emotionally dense.',
    editorial_content: 'Zaid Siddiqui composes at the boundary between silence and sound. He grew up listening to his grandfather\'s vinyl collection in a house in Mehdipatnam — Ravi Shankar, Miles Davis, Asha Bhosle, Art Blakey — and understood early that music was not about genres but about space. He studied classical tabla before pivoting to electronic production at twenty, teaching himself through online forums and borrowed equipment. His breakthrough came with the score for a forty-minute documentary about Deccan weavers that screened at Rotterdam and Tribeca. Since then, he has composed for features, installations, fashion films, and a live immersive performance at the Hyderabad Literary Festival. He records mostly at night. He says the city sounds different after midnight.',
    phone: '+91 65432 10987',
    email: 'zaid@fashiongalaxy.in',
    socialLinks: {
      instagram: 'https://instagram.com/zaidsound',
      linkedin: '',
      website: 'https://zaidsiddiqui.music',
    },
    tags: ['producer', 'sound design', 'bollywood', 'indie'],
    layout_style: 'right',
  },
  {
    name: 'Sneha Joshi',
    // Full-body — woman in chef-adjacent fashion, confident stance
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=85&fit=crop&crop=top',
    location: 'Pune · Maharashtra',
    department: 'Food',
    profession: 'Chef & Entrepreneur',
    bio: 'Chef and food entrepreneur running a cloud kitchen specialising in reconstructed regional Indian cuisine. Featured in Food52, Bon Appétit India, and multiple pop-up residencies.',
    editorial_content: 'Sneha Joshi\'s kitchen is a laboratory for cultural memory. She reconstructs lost recipes from regional manuscripts — dishes that have not appeared on any menu for decades, sourced from handwritten cookbooks, community elders, and archival research she conducts like an anthropologist. Her cloud kitchen, Bhoomi, dispatches hundreds of these meals across Pune each week, each order accompanied by a card describing the dish\'s origin and the community that invented it. She trained at a culinary school in Florence, spent a year cooking in a dhaba in Nashik, and returned to Pune convinced that the most sophisticated cuisine in the world was hiding in plain sight in Maharashtra\'s villages. Her supper clubs are booked three months in advance.',
    phone: '+91 54321 09876',
    email: 'sneha.joshi@fashiongalaxy.in',
    socialLinks: {
      instagram: 'https://instagram.com/snehakitchen',
      linkedin: 'https://linkedin.com/in/snehajoshi',
      website: 'https://bhoomibysneha.com',
    },
    tags: ['chef', 'cloud kitchen', 'regional cuisine', 'food entrepreneur'],
    layout_style: 'left',
  },
  {
    name: 'Arjun Bose',
    // Half-body editorial — man in smart casual, confident look
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=85&fit=crop&crop=top',
    location: 'Kolkata · West Bengal',
    department: 'IT',
    profession: 'Cybersecurity Analyst',
    bio: 'Cybersecurity analyst and open-source contributor. His tools have been downloaded over eighty thousand times. Speaker at national tech conferences on making enterprise-grade security accessible to independent businesses.',
    editorial_content: 'Arjun Bose moves through digital systems with the instinct of a tracker and the ethics of a guardian. He wrote his first security script at sixteen to protect his father\'s garment export business from phishing attacks — an experience that shaped everything that followed. He went on to study computer science in Kolkata, worked briefly at a cybersecurity firm in Bengaluru, and returned to freelance consulting with a commitment to small and medium enterprises that larger firms overlook. His open-source toolkit, Sentinel Lite, is now used by over twelve hundred businesses across South Asia. He runs a free monthly workshop called Secure Your Work for first-generation entrepreneurs. He believes security is a form of care.',
    phone: '+91 43210 98765',
    email: 'arjun.bose@fashiongalaxy.in',
    socialLinks: {
      instagram: '',
      linkedin: 'https://linkedin.com/in/arjunbose',
      website: 'https://arjunbose.tech',
    },
    tags: ['cybersecurity', 'open source', 'IT', 'speaker'],
    layout_style: 'right',
  },
  {
    name: 'Meera Pillai',
    // Full-body — woman in handloom saree, editorial portrait
    photo: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=85&fit=crop&crop=top',
    location: 'Chennai · Tamil Nadu',
    department: 'Fashion',
    profession: 'Textile Artist',
    bio: 'Sustainable fashion advocate and textile artist creating handloom collections rooted in South Indian heritage. Regular contributor to Vogue India and Business of Fashion.',
    editorial_content: 'Meera Pillai weaves with intention. Her handloom collections trace the vocabulary of South Indian textile traditions — the geometry of Kanchipuram, the restraint of Pochampally, the indigo rituals of Arni. Each piece takes weeks to produce. Each piece is intended to last decades. She studied at the National Institute of Fashion Technology in Chennai, then spent three years apprenticed to master weavers in Thanjavur — an experience she describes as the real education. Her label, Mitti, stocks in four countries and has been worn by heads of state and by farmers\'  daughters at their first job interviews. She believes luxury is not about price. It is about permanence.',
    phone: '+91 32109 87654',
    email: 'meera.pillai@fashiongalaxy.in',
    socialLinks: {
      instagram: 'https://instagram.com/meerapillai',
      linkedin: 'https://linkedin.com/in/meerapillai',
      website: 'https://mittibymeera.com',
    },
    tags: ['sustainable fashion', 'handloom', 'textile', 'heritage'],
    layout_style: 'left',
  },
  {
    name: 'Kabir Malhotra',
    // Half-body — young man in contemporary streetwear, creative vibe
    photo: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=85&fit=crop&crop=top',
    location: 'Jaipur · Rajasthan',
    department: 'Design',
    profession: 'Generative Artist',
    bio: 'Generative artist and designer building tools at the intersection of AI and creative practice. His work is used by independent studios across India. Final-year engineering student.',
    editorial_content: 'Kabir Malhotra is twenty-one years old and already building tools that professional studios are using. He grew up surrounded by the craftsmanship of Jaipur — block printers, blue pottery makers, gem cutters — and developed an early conviction that traditional skills and computational thinking were not opposites but partners. His generative design tools, released free on GitHub, have been adopted by textile designers who use them to create repeat patterns without technical training. His personal work — large-format prints that blend Rajasthani motifs with algorithmic composition — has shown at two art fairs in Delhi and one in Singapore. He is completing his engineering degree, has turned down two corporate offers, and is planning to launch his own creative studio before he graduates.',
    phone: '+91 21098 76543',
    email: 'kabir.malhotra@fashiongalaxy.in',
    socialLinks: {
      instagram: 'https://instagram.com/kabirdesigns',
      linkedin: 'https://linkedin.com/in/kabirmalhotra',
      website: 'https://kabircreates.in',
    },
    tags: ['generative art', 'AI design', 'student', 'creative tech'],
    layout_style: 'right',
  },
  {
    name: 'Tara Khanna',
    // Full-body fashion editorial — woman in contemporary Indian fashion
    photo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=85&fit=crop&crop=top',
    location: 'Mumbai · Maharashtra',
    department: 'Fashion',
    profession: 'Stylist & Creative Director',
    bio: 'Celebrity stylist and creative director with fifteen years of experience across Bollywood, brand campaigns, and international fashion weeks. Known for building looks that define moments.',
    editorial_content: 'Tara Khanna does not follow trends. She participates in their creation. Over fifteen years in the industry, she has styled cover shoots for every major Indian fashion magazine, built visual identities for five of India\'s most recognised film stars, and art-directed campaigns for luxury brands entering the Indian market. She grew up in a household where her mother stitched clothes from magazine photographs and her father collected cinema posters — an upbringing she credits for her instinct to understand fashion as storytelling. Her process begins not with garments but with questions: Who is this person trying to become? What should this image remember? She is currently creative director at a Mumbai-based production studio and is developing a mentorship programme for styling assistants from non-metropolitan backgrounds.',
    phone: '+91 90876 54321',
    email: 'tara.khanna@fashiongalaxy.in',
    socialLinks: {
      instagram: 'https://instagram.com/tarastyling',
      linkedin: 'https://linkedin.com/in/tarakhanna',
      website: 'https://tarakhanna.com',
    },
    tags: ['stylist', 'creative direction', 'bollywood', 'fashion week'],
    layout_style: 'left',
  },
  {
    name: 'Vikram Rao',
    // Half-body editorial — man in formal wear, professional portrait
    photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&q=85&fit=crop&crop=top',
    location: 'Bengaluru · Karnataka',
    department: 'Finance',
    profession: 'Investment Analyst',
    bio: 'Investment analyst specialising in consumer and fashion brand funding. Backed twelve early-stage companies in the lifestyle space. Former consultant at a top-tier management firm.',
    editorial_content: 'Vikram Rao has spent eight years at the intersection of capital and creativity — understanding why some fashion brands endure and why most do not. He began his career in management consulting, working with retail chains undergoing digital transformation, before moving into venture investing with a focus on consumer brands. The companies he has backed range from sustainable packaging startups to AI-powered personal styling platforms. He is known in the industry for asking founders not what their product does, but what ritual it creates in their customer\'s life. He sits on the board of three companies, advises a government initiative on fashion industry formalisation, and teaches a quarterly workshop on building investor-ready brands at a Bengaluru business school.',
    phone: '+91 89765 43210',
    email: 'vikram.rao@fashiongalaxy.in',
    socialLinks: {
      instagram: '',
      linkedin: 'https://linkedin.com/in/vikramrao',
      website: 'https://vikramrao.in',
    },
    tags: ['finance', 'investment', 'venture', 'consumer brands'],
    layout_style: 'right',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Profile.deleteMany({});
    console.log('🗑️  Cleared existing profiles');

    await Profile.insertMany(profiles);
    console.log(`🌱 Seeded ${profiles.length} profiles`);

    mongoose.disconnect();
    console.log('✅ Done');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
