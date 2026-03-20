/**
 * Multilingual Translations
 * Languages: Arabic (ar - default), French (fr), English (en)
 */
const TRANSLATIONS = {
    ar: {
        dir: 'rtl',
        // Navbar
        'nav.title': 'عمارة',
        'nav.logout': 'خروج',
        // Home
        'home.title': 'مرحباً بك في نظام إدارة العمارات',
        'home.subtitle': 'منصة احترافية، آمنة وموثوقة لتسيير شؤون العمارة بكل سهولة.',
        'home.choose': 'يرجى اختيار صفتك للمتابعة:',
        'home.syndic.title': 'مسؤول العمارة (سانديك)',
        'home.syndic.desc': 'إنشاء حساب العمارة والحصول على الرمز السري للملاك',
        'home.resident.title': 'صاحب شقة',
        'home.resident.desc': 'الانضمام للعمارة الخاصة بك باستخدام الرمز المعطى لك',
        // Syndic Auth
        'syndic.tab.login': 'تسجيل الدخول',
        'syndic.tab.register': 'حساب جديد',
        'syndic.login.title': 'تسجيل الدخول للسانديك',
        'syndic.login.subtitle': 'أدخل رمز العمارة الخاص بك للوصول للوحة التحكم.',
        'syndic.login.code': 'رمز العمارة',
        'syndic.login.password': 'الرمز السري للمدير',
        'syndic.login.btn': 'دخول',
        'syndic.login.error': 'خطأ في رمز العمارة أو الرمز السري.',
        'syndic.reg.title': 'إنشاء حساب العمارة',
        'syndic.reg.subtitle': 'قم بإنشاء السجل الخاص بعمارتك لتبدأ في إدارتها.',
        'syndic.reg.name': 'اسم المسؤول الكامل',
        'syndic.reg.building': 'اسم العمارة أو المجمع',
        'syndic.reg.password': 'الرمز السري للمسؤول',
        'syndic.reg.btn': 'إنشاء حساب جديد',
        // Syndic Dashboard
        'dash.syndic.title': 'لوحة تحكم السانديك',
        'dash.syndic.welcome': 'مرحباً',
        'dash.syndic.managing': '، تدير حاليا',
        'dash.code.title': 'رمز الانضمام للعمارة',
        'dash.code.desc': 'شارك هذا الرمز مع أصحاب الشقق ليتمكنوا من الانضمام لعمارتك في التطبيق.',
        'dash.code.copy': 'نسخ الرمز',
        'dash.stat.apts': 'الشقق المسجلة',
        'dash.stat.balance': 'الرصيد الإجمالي',
        'dash.stat.complaints': 'شكاوى جديدة',
        'dash.table.title': 'قائمة الملاك المنضمين',
        'dash.table.addBtn': 'إضافة شقة يدوياً',
        'dash.table.addTitle': 'تسجيل شقة جديدة',
        'dash.table.ownerName': 'اسم المالك / الساكن',
        'dash.table.aptNum': 'رقم الشقة',
        'dash.table.save': 'حفظ',
        'dash.table.col.owner': 'اسم المالك',
        'dash.table.col.apt': 'رقم الشقة',
        'dash.table.col.date': 'تاريخ الانضمام',
        'dash.table.col.status': 'الحالة',
        'dash.table.col.payment': 'الواجب الشهري',
        'dash.table.col.warning': 'إنذار',
        'dash.table.col.remove': 'إزالة',
        'dash.table.empty': 'لم ينضم أي ملاك بعد. شارك الرمز السري لبدء الإدارة.',
        'dash.complaints.title': 'صندوق الشكاوى',
        // Resident Setup
        'resident.title': 'تسجيل الدخول كصاحب شقة',
        'resident.subtitle': 'أدخل بياناتك ورمز العمارة الذي استلمته من السانديك.',
        'resident.name': 'اسم صاحب الشقة',
        'resident.apt': 'رقم الشقة (أو الباب)',
        'resident.code': 'رمز العمارة السري',
        'resident.btn': 'انضمام للعمارة',
        'resident.error': 'الرمز غير صحيح! المرجو التأكد من مسؤول العمارة.',
        // Resident Dashboard
        'res.dash.title': 'ملف الشقة',
        'res.dash.welcome': 'مرحباً',
        'res.dash.apt': 'شقة رقم',
        'res.warning': 'تنبيه من إدارة العمارة: المرجو تسوية وضعيتكم بخصوص أدائكم للواجبات الشهرية.',
        'res.payment.title': 'الواجب الشهري',
        'res.payment.month': 'الشهر الحالي',
        'res.complaint.title': 'إرسال شكوى',
        'res.complaint.syndic': 'للسانديك',
        'res.complaint.formTitle': 'كتابة شكوى جديدة',
        'res.complaint.placeholder': 'اكتب تفاصيل الشكوى، الاقتراح أو المشكلة الموجهة للسانديك...',
        'res.complaint.send': 'إرسال الشكوى',
        'res.complaint.cancel': 'إلغاء',
        // Chat
        'chat.title': 'شات العمارة',
        'chat.placeholder': 'رسالة، صورة، أو ملف...',
        // Back button
        'btn.back': 'رجوع',
    },

    fr: {
        dir: 'ltr',
        'nav.title': 'Immeuble',
        'nav.logout': 'Déconnexion',
        'home.title': 'Bienvenue sur la plateforme de gestion d\'immeuble',
        'home.subtitle': 'Une plateforme professionnelle, sécurisée et fiable pour gérer votre immeuble facilement.',
        'home.choose': 'Veuillez choisir votre rôle pour continuer :',
        'home.syndic.title': 'Gestionnaire (Syndic)',
        'home.syndic.desc': 'Créer un compte immeuble et obtenir le code secret pour les résidents',
        'home.resident.title': 'Propriétaire d\'appartement',
        'home.resident.desc': 'Rejoindre votre immeuble en utilisant le code fourni par le syndic',
        'syndic.tab.login': 'Se connecter',
        'syndic.tab.register': 'Nouveau compte',
        'syndic.login.title': 'Connexion Syndic',
        'syndic.login.subtitle': 'Entrez votre code immeuble pour accéder au tableau de bord.',
        'syndic.login.code': 'Code de l\'immeuble',
        'syndic.login.password': 'Mot de passe du gestionnaire',
        'syndic.login.btn': 'Connexion',
        'syndic.login.error': 'Code ou mot de passe incorrect.',
        'syndic.reg.title': 'Créer un compte immeuble',
        'syndic.reg.subtitle': 'Créez le profil de votre immeuble pour commencer la gestion.',
        'syndic.reg.name': 'Nom complet du responsable',
        'syndic.reg.building': 'Nom de l\'immeuble ou résidence',
        'syndic.reg.password': 'Mot de passe du responsable',
        'syndic.reg.btn': 'Créer un nouveau compte',
        'dash.syndic.title': 'Tableau de bord Syndic',
        'dash.syndic.welcome': 'Bienvenue',
        'dash.syndic.managing': ', vous gérez actuellement',
        'dash.code.title': 'Code d\'adhésion à l\'immeuble',
        'dash.code.desc': 'Partagez ce code avec les propriétaires pour qu\'ils puissent rejoindre votre immeuble.',
        'dash.code.copy': 'Copier le code',
        'dash.stat.apts': 'Appartements enregistrés',
        'dash.stat.balance': 'Solde total',
        'dash.stat.complaints': 'Nouvelles réclamations',
        'dash.table.title': 'Liste des propriétaires',
        'dash.table.addBtn': 'Ajouter manuellement',
        'dash.table.addTitle': 'Enregistrer un appartement',
        'dash.table.ownerName': 'Nom du propriétaire / résident',
        'dash.table.aptNum': 'Numéro d\'appartement',
        'dash.table.save': 'Enregistrer',
        'dash.table.col.owner': 'Nom du propriétaire',
        'dash.table.col.apt': 'N° Appartement',
        'dash.table.col.date': 'Date d\'adhésion',
        'dash.table.col.status': 'Statut',
        'dash.table.col.payment': 'Cotisation mensuelle',
        'dash.table.col.warning': 'Avertissement',
        'dash.table.col.remove': 'Supprimer',
        'dash.table.empty': 'Aucun propriétaire n\'a encore rejoint. Partagez le code secret.',
        'dash.complaints.title': 'Boîte de réclamations',
        'resident.title': 'Connexion comme propriétaire',
        'resident.subtitle': 'Entrez vos informations et le code immeuble reçu du syndic.',
        'resident.name': 'Nom du propriétaire',
        'resident.apt': 'Numéro d\'appartement (ou porte)',
        'resident.code': 'Code secret de l\'immeuble',
        'resident.btn': 'Rejoindre l\'immeuble',
        'resident.error': 'Code incorrect ! Veuillez vérifier auprès du gestionnaire.',
        'res.dash.title': 'Fiche appartement',
        'res.dash.welcome': 'Bienvenue',
        'res.dash.apt': 'Appartement n°',
        'res.warning': 'Avertissement de la direction : Veuillez régulariser votre situation concernant vos cotisations mensuelles.',
        'res.payment.title': 'Cotisation mensuelle',
        'res.payment.month': 'Mois en cours',
        'res.complaint.title': 'Envoyer une réclamation',
        'res.complaint.syndic': 'Au syndic',
        'res.complaint.formTitle': 'Rédiger une nouvelle réclamation',
        'res.complaint.placeholder': 'Décrivez votre réclamation, suggestion ou problème...',
        'res.complaint.send': 'Envoyer la réclamation',
        'res.complaint.cancel': 'Annuler',
        'chat.title': 'Chat de l\'immeuble',
        'chat.placeholder': 'Message, photo ou fichier...',
        'btn.back': 'Retour',
    },

    en: {
        dir: 'ltr',
        'nav.title': 'Building',
        'nav.logout': 'Logout',
        'home.title': 'Welcome to the Building Management System',
        'home.subtitle': 'A professional, secure and reliable platform to manage your building with ease.',
        'home.choose': 'Please select your role to continue:',
        'home.syndic.title': 'Building Manager (Syndic)',
        'home.syndic.desc': 'Create a building account and get the secret code for residents',
        'home.resident.title': 'Apartment Owner',
        'home.resident.desc': 'Join your building using the code provided by the manager',
        'syndic.tab.login': 'Log In',
        'syndic.tab.register': 'New Account',
        'syndic.login.title': 'Syndic Login',
        'syndic.login.subtitle': 'Enter your building code to access the dashboard.',
        'syndic.login.code': 'Building Code',
        'syndic.login.password': 'Manager Password',
        'syndic.login.btn': 'Login',
        'syndic.login.error': 'Incorrect building code or password.',
        'syndic.reg.title': 'Create Building Account',
        'syndic.reg.subtitle': 'Set up your building profile to start managing it.',
        'syndic.reg.name': 'Full Name of Manager',
        'syndic.reg.building': 'Building or Residence Name',
        'syndic.reg.password': 'Manager Password',
        'syndic.reg.btn': 'Create New Account',
        'dash.syndic.title': 'Syndic Dashboard',
        'dash.syndic.welcome': 'Welcome',
        'dash.syndic.managing': ', you are currently managing',
        'dash.code.title': 'Building Join Code',
        'dash.code.desc': 'Share this code with apartment owners so they can join your building.',
        'dash.code.copy': 'Copy Code',
        'dash.stat.apts': 'Registered Apartments',
        'dash.stat.balance': 'Total Balance',
        'dash.stat.complaints': 'New Complaints',
        'dash.table.title': 'List of Owners',
        'dash.table.addBtn': 'Add Manually',
        'dash.table.addTitle': 'Register Apartment',
        'dash.table.ownerName': 'Owner / Resident Name',
        'dash.table.aptNum': 'Apartment Number',
        'dash.table.save': 'Save',
        'dash.table.col.owner': 'Owner Name',
        'dash.table.col.apt': 'Apt No.',
        'dash.table.col.date': 'Join Date',
        'dash.table.col.status': 'Status',
        'dash.table.col.payment': 'Monthly Fee',
        'dash.table.col.warning': 'Warning',
        'dash.table.col.remove': 'Remove',
        'dash.table.empty': 'No owners have joined yet. Share the secret code to start.',
        'dash.complaints.title': 'Complaints Inbox',
        'resident.title': 'Login as Apartment Owner',
        'resident.subtitle': 'Enter your details and the building code you received from the manager.',
        'resident.name': 'Owner Name',
        'resident.apt': 'Apartment Number (or door)',
        'resident.code': 'Secret Building Code',
        'resident.btn': 'Join Building',
        'resident.error': 'Incorrect code! Please verify with your building manager.',
        'res.dash.title': 'Apartment Profile',
        'res.dash.welcome': 'Welcome',
        'res.dash.apt': 'Apartment No.',
        'res.warning': 'Management Notice: Please settle your situation regarding your monthly fee payments.',
        'res.payment.title': 'Monthly Fee',
        'res.payment.month': 'Current Month',
        'res.complaint.title': 'Send Complaint',
        'res.complaint.syndic': 'To the Syndic',
        'res.complaint.formTitle': 'Write a New Complaint',
        'res.complaint.placeholder': 'Describe your complaint, suggestion or issue...',
        'res.complaint.send': 'Send Complaint',
        'res.complaint.cancel': 'Cancel',
        'chat.title': 'Building Chat',
        'chat.placeholder': 'Message, photo or file...',
        'btn.back': 'Back',
    }
};

// ===== Language Engine =====
const i18n = {
    currentLang: localStorage.getItem('app_lang') || 'ar',

    t(key) {
        const lang = TRANSLATIONS[this.currentLang];
        return (lang && lang[key]) ? lang[key] : (TRANSLATIONS['ar'][key] || key);
    },

    apply() {
        const lang = this.currentLang;
        const dict = TRANSLATIONS[lang];
        
        // Set direction and language on HTML element
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', dict.dir);

        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const attr = el.getAttribute('data-i18n-attr');
            if(attr) {
                el.setAttribute(attr, this.t(key));
            } else {
                el.textContent = this.t(key);
            }
        });

        // Update language button
        const btn = document.getElementById('langBtn');
        if(btn) {
            const labels = { ar: '🌐 AR', fr: '🌐 FR', en: '🌐 EN' };
            btn.textContent = labels[lang] || '🌐';
        }
    },

    cycle() {
        const order = ['ar', 'fr', 'en'];
        const next = order[(order.indexOf(this.currentLang) + 1) % order.length];
        this.currentLang = next;
        localStorage.setItem('app_lang', next);
        this.apply();
    }
};
