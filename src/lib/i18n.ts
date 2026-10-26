export type Locale = 'fr' | 'ar';

export interface TranslationSchema {
  brand: {
    name: string;
    arabicName: string;
    tagline: string;
    subTagline: string;
  };
  nav: {
    feed: string;
    posts: string;
    experts: string;
    askButton: string;
    admin: string;
    myQuestions: string;
    about: string;
    roleSimulation: string;
    switchLang: string;
  };
  roles: {
    normal_user: string;
    expert: string;
    moderator: string;
    admin: string;
  };
  anonymityBadge: {
    title: string;
    desc: string;
  };
  feed: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    filterAnswered: string;
    filterWaiting: string;
    emptyTitle: string;
    emptyDesc: string;
    anonymousAuthor: string;
    askedOn: string;
    directTarget: string;
    publicFeed: string;
    answersCount: (n: number) => string;
    helpful: string;
    report: string;
    directBadge: string;
    feedBadge: string;
  };
  posts: {
    title: string;
    subtitle: string;
    likes: string;
    readMore: string;
    createPost: string;
    empty: string;
  };
  experts: {
    title: string;
    subtitle: string;
    verifiedBadge: string;
    acceptingQuestions: string;
    quotaFull: string;
    askDirect: string;
    specialties: string;
    location: string;
    credentials: string;
    answersGiven: string;
    postsCount: string;
    followers: string;
    follow: string;
    following: string;
  };
  askModal: {
    title: string;
    typeChoiceLabel: string;
    feedChoice: string;
    feedChoiceDesc: string;
    directChoice: string;
    directChoiceDesc: string;
    selectExpert: string;
    topicLabel: string;
    titleLabel: string;
    titlePlaceholder: string;
    bodyLabel: string;
    bodyPlaceholder: string;
    languageLabel: string;
    publishConsent: string;
    submit: string;
    cancel: string;
    anonymityReminder: string;
    distressDetectedTitle: string;
    distressDetectedDesc: string;
    emergencyHelplines: { label: string; phone: string }[];
    understandAndContinue: string;
  };
  admin: {
    title: string;
    subtitle: string;
    tabs: {
      questions: string;
      reports: string;
      experts: string;
      distress: string;
      audit: string;
    };
    stats: {
      pendingQuestions: string;
      pendingReports: string;
      pendingExperts: string;
      distressAlerts: string;
    };
    actions: {
      approve: string;
      reject: string;
      hide: string;
      restore: string;
      viewDetails: string;
      selectReason: string;
      reasons: {
        spam: string;
        insult: string;
        inappropriate: string;
        theological_error: string;
        distress: string;
        privacy: string;
      };
    };
    audit: {
      action: string;
      moderator: string;
      target: string;
      date: string;
    };
  };
  common: {
    loading: string;
    save: string;
    close: string;
    back: string;
    success: string;
    error: string;
  };
}

export const translations: Record<Locale, TranslationSchema> = {
  fr: {
    brand: {
      name: 'ilm.me',
      arabicName: 'علم',
      tagline: 'Posez votre question à ceux qui savent. Gardez votre nom.',
      subTagline: 'Plateforme anonyme de consultation auprès d\'experts qualifiés et vérifiés.',
    },
    nav: {
      feed: 'Questions & Réponses',
      posts: 'Billets des experts',
      experts: 'Nos experts',
      askButton: 'Poser une question',
      admin: 'Espace Modération',
      myQuestions: 'Mes questions',
      about: 'À propos & Charte',
      roleSimulation: 'Rôle actif',
      switchLang: 'العربية',
    },
    roles: {
      normal_user: 'Utilisateur anonyme',
      expert: 'Expert vérifié',
      moderator: 'Modérateur',
      admin: 'Administrateur',
    },
    anonymityBadge: {
      title: 'Anonymat technique garanti',
      desc: 'Aucun lien entre votre compte et vos questions n\'est accessible aux experts ou aux autres membres.',
    },
    feed: {
      title: 'Flux des questions anonymes',
      subtitle: 'Questions posées par la communauté et avis d\'experts vérifiés.',
      searchPlaceholder: 'Rechercher une question, un mot-clé ou un sujet...',
      filterAll: 'Toutes les catégories',
      filterAnswered: 'Répondues seulement',
      filterWaiting: 'En attente de réponse',
      emptyTitle: 'Aucune question trouvée',
      emptyDesc: 'Soyez le premier à poser une question anonyme sur ce sujet.',
      anonymousAuthor: 'Auteur anonyme',
      askedOn: 'Posée le',
      directTarget: 'Question directe adressée à',
      publicFeed: 'Question publique',
      answersCount: (n: number) => n === 1 ? '1 réponse d\'expert' : `${n} réponses d'experts`,
      helpful: 'Utile',
      report: 'Signaler',
      directBadge: 'Directe',
      feedBadge: 'Publique',
    },
    posts: {
      title: 'Billets & Rappels des experts',
      subtitle: 'Articles courts, conseils et réflexions rédigés par les spécialistes vérifiés.',
      likes: 'J\'aime',
      readMore: 'Lire la suite',
      createPost: 'Publier un billet',
      empty: 'Aucun billet publié pour le moment.',
    },
    experts: {
      title: 'Annuaire des experts vérifiés',
      subtitle: 'Savants, enseignants et spécialistes dont les diplômes ou ijazates ont été vérifiés.',
      verifiedBadge: 'Vérifié par la modération',
      acceptingQuestions: 'Accepte les questions directes',
      quotaFull: 'Quota atteint pour aujourd\'hui',
      askDirect: 'Poser une question directe',
      specialties: 'Spécialités',
      location: 'Localisation',
      credentials: 'Titres & Qualifications',
      answersGiven: 'réponses fournies',
      postsCount: 'billets publiés',
      followers: 'abonnés',
      follow: 'Suivre',
      following: 'Suivi',
    },
    askModal: {
      title: 'Poser une question anonyme',
      typeChoiceLabel: 'Mode d\'envoi de la question',
      feedChoice: 'Sur le flux public',
      feedChoiceDesc: 'Visible par tous après modération. Tout expert vérifié peut y répondre.',
      directChoice: 'Directement à un expert',
      directChoiceDesc: 'Uniquement visible par l\'expert sélectionné et l\'équipe de modération.',
      selectExpert: 'Sélectionner un expert disponible',
      topicLabel: 'Sujet ou catégorie',
      titleLabel: 'Résumé court de votre question',
      titlePlaceholder: 'Ex: Question sur la validité de la prière lors d\'un voyage court',
      bodyLabel: 'Détails de votre question',
      bodyPlaceholder: 'Expliquez votre situation avec clarté et précision. Ne mentionnez aucun nom ou détail personnel qui permettrait de vous identifier.',
      languageLabel: 'Langue de la question',
      publishConsent: 'Si je reçois une réponse satisfaisante, j\'accepte qu\'elle soit publiée anonymement pour en faire bénéficier la communauté.',
      submit: 'Envoyer ma question',
      cancel: 'Annuler',
      anonymityReminder: 'Rappel de confidentialité : Votre identité, e-mail et adresse IP ne sont jamais communiqués aux experts ni exposés sur le site.',
      distressDetectedTitle: 'Besoin d\'écoute ou d\'aide immédiate ?',
      distressDetectedDesc: 'Votre message semble exprimer une situation de grande détresse psychologique ou de danger. Notre plateforme fournit des avis éthiques et religieux, mais face à une urgence ou une détresse aiguë, des professionnels formés sont à votre disposition.',
      emergencyHelplines: [
        { label: 'Protection civile (Algérie)', phone: '14 / 1021' },
        { label: 'Police secours (Algérie)', phone: '17 / 1548' },
        { label: 'Écoute & Détresse psychologique', phone: '3033' },
      ],
      understandAndContinue: 'J\'ai compris, continuer ma question',
    },
    admin: {
      title: 'Espace Modération & Administration',
      subtitle: 'Surveillance des contenus, respect de la charte et examen des dossiers d\'experts.',
      tabs: {
        questions: 'Questions en attente',
        reports: 'Signalements',
        experts: 'Dossiers experts',
        distress: 'Alertes Détresse',
        audit: 'Journal d\'audit',
      },
      stats: {
        pendingQuestions: 'Questions à modérer',
        pendingReports: 'Signalements en cours',
        pendingExperts: 'Dossiers à vérifier',
        distressAlerts: 'Alertes urgentes',
      },
      actions: {
        approve: 'Approuver',
        reject: 'Rejeter',
        hide: 'Masquer',
        restore: 'Rétablir',
        viewDetails: 'Examiner',
        selectReason: 'Motif du rejet',
        reasons: {
          spam: 'Spam ou publicité non autorisée',
          insult: 'Manque de respect ou propos injurieux',
          inappropriate: 'Hors charte ou contenu inapproprié',
          theological_error: 'Erreur manifeste à vérifier par le comité',
          distress: 'Routé vers les services d\'assistance psychologique',
          privacy: 'Contient des données personnelles ou identifiantes',
        },
      },
      audit: {
        action: 'Action',
        moderator: 'Modérateur',
        target: 'Élément',
        date: 'Date & Heure',
      },
    },
    common: {
      loading: 'Chargement...',
      save: 'Enregistrer',
      close: 'Fermer',
      back: 'Retour',
      success: 'Opération réussie',
      error: 'Une erreur est survenue',
    },
  },
  ar: {
    brand: {
      name: 'ilm.me',
      arabicName: 'علم',
      tagline: 'اسأل أهل العلم، واحتفظ باسمك.',
      subTagline: 'منصة آمنة ومجهولة الهوية لطرح الأسئلة الدينية والأخلاقية على خبراء موثوقين.',
    },
    nav: {
      feed: 'الأسئلة والأجوبة',
      posts: 'منشورات الخبراء',
      experts: 'أهل العلم المعتمدون',
      askButton: 'اطرح سؤالاً',
      admin: 'لوحة الإشراف',
      myQuestions: 'أسئلتي',
      about: 'عن المنصة والميثاق',
      roleSimulation: 'الدور الحالي',
      switchLang: 'Français',
    },
    roles: {
      normal_user: 'مستخدم بهوية مجهولة',
      expert: 'عالم / خبير موثّق',
      moderator: 'مشرف محتوى',
      admin: 'مدير النظام',
    },
    anonymityBadge: {
      title: 'سرية تامة وهوية محمية',
      desc: 'لا يمكن للخبراء أو المستخدمين الاطلاع على هويتك أو بريدك أو أي بيانات شخصية.',
    },
    feed: {
      title: 'خلاصة الأسئلة المجهولة',
      subtitle: 'أسئلة المستفتين وإجابات نخبة من أهل العلم الموثقين.',
      searchPlaceholder: 'ابحث عن سؤال أو فتوى أو كلمة مفتاحية...',
      filterAll: 'جميع الأقسام',
      filterAnswered: 'الأسئلة المجابة فقط',
      filterWaiting: 'في انتظار الإجابة',
      emptyTitle: 'لم يتم العثور على أي سؤال',
      emptyDesc: 'كن أول من يطرح سؤالاً مجهول الهوية في هذا القسم.',
      anonymousAuthor: 'سائل بهوية مجهولة',
      askedOn: 'طُرح في',
      directTarget: 'سؤال خاص موجّه إلى',
      publicFeed: 'سؤال عام في الخلاصة',
      answersCount: (n: number) => n === 1 ? 'إجابة واحدة' : `${n} إجابات من أهل العلم`,
      helpful: 'مفيد',
      report: 'إبلاغ',
      directBadge: 'سؤال مباشر',
      feedBadge: 'سؤال عام',
    },
    posts: {
      title: 'منشورات وفوائد أهل العلم',
      subtitle: 'مقالات قصيرة، نصائح وفوائد شرعية منتقاة من الخبراء المعتمدين.',
      likes: 'إعجاب',
      readMore: 'قراءة المزيد',
      createPost: 'كتابة منشور جديد',
      empty: 'لا توجد منشورات حالياً.',
    },
    experts: {
      title: 'دليل العلماء والخبراء المعتمدين',
      subtitle: 'نخبة من الأساتذة والعلماء تم التحقق من شهاداتهم وإجازاتهم العلمية.',
      verifiedBadge: 'موثق ومعتمد من الإدارة',
      acceptingQuestions: 'يستقبل الأسئلة المباشرة',
      quotaFull: 'اكتمل نصاب اليوم من الأسئلة',
      askDirect: 'سؤال مباشر للشيخ',
      specialties: 'التخصصات',
      location: 'الموقع',
      credentials: 'المؤهلات والإجازات',
      answersGiven: 'إجابة مقدمة',
      postsCount: 'منشوراً',
      followers: 'متابع',
      follow: 'متابعة',
      following: 'تتابعه',
    },
    askModal: {
      title: 'طرح سؤال بهوية مجهولة',
      typeChoiceLabel: 'طريقة إرسال السؤال',
      feedChoice: 'في الخلاصة العامة',
      feedChoiceDesc: 'يظهر للجميع بعد مراجعته من المشرفين، ويمكن لأي خبير موثّق الإجابة عنه.',
      directChoice: 'مباشرة إلى عالم محدد',
      directChoiceDesc: 'سؤال خاص يطلع عليه فقط الخبير المختار وفريق الإشراف.',
      selectExpert: 'اختر الشيخ أو الخبير المتاح',
      topicLabel: 'القسم أو الموضوع',
      titleLabel: 'عنوان مختصر للسؤال',
      titlePlaceholder: 'مثال: حكم الجمع بين الصلاتين في السفر القصير',
      bodyLabel: 'تفاصيل السؤال ووقائعه',
      bodyPlaceholder: 'اشرح مسألتك بوضوح ودقة. لا تذكر أي أسماء حقيقية أو تفاصيل قد تكشف هويتك.',
      languageLabel: 'لغة السؤال',
      publishConsent: 'في حال ورود إجابة شافية، أوافق على نشرها بهوية مجهولة لتعم الفائدة للجميع.',
      submit: 'إرسال السؤال بأمان',
      cancel: 'إلغاء',
      anonymityReminder: 'تذكير بالسرية: اسمك، بريدك، ورقم هاتفك وعنوانك الرقمي محجوبة تماماً ولا تُرسل لأي طرف.',
      distressDetectedTitle: 'هل أنت بحاجة لمساعدة أو دعم عاجل؟',
      distressDetectedDesc: 'يبدو من محتوى رسالتك وجود أزمة نفسية أو خطر داهم. منصتنا تقدم استشارات شرعية وتوجيهية، ولكن في الحالات الطارئة يُرجى التواصل الفوري مع المختصين.',
      emergencyHelplines: [
        { label: 'الحماية المدنية (الجزائر)', phone: '14 / 1021' },
        { label: 'الشرطة والنجدة (الجزائر)', phone: '17 / 1548' },
        { label: 'الخط الأخضر للإصغاء النفسي', phone: '3033' },
      ],
      understandAndContinue: 'فهمت ذلك، والمتابعة لطرح السؤال',
    },
    admin: {
      title: 'لوحة الإشراف والإدارة',
      subtitle: 'متابعة المحتوى، مراجعة ملفات العلماء، ومعالجة البلاغات والحالات الطارئة.',
      tabs: {
        questions: 'أسئلة بانتظار المراجعة',
        reports: 'البلاغات والشكاوى',
        experts: 'طلبات توثيق الخبراء',
        distress: 'تنبيهات الدعم العاجل',
        audit: 'سجل العمليات الإدارية',
      },
      stats: {
        pendingQuestions: 'أسئلة للمراجعة',
        pendingReports: 'بلاغات مفتوحة',
        pendingExperts: 'ملفات تنتظر الاعتماد',
        distressAlerts: 'تنبيهات عاجلة',
      },
      actions: {
        approve: 'قبول ونشر',
        reject: 'رفض',
        hide: 'حجب مؤقت',
        restore: 'استعادة',
        viewDetails: 'معاينة التفاصيل',
        selectReason: 'سبب الرفض',
        reasons: {
          spam: 'محتوى دعائي أو غير ملائم',
          insult: 'إساءة أو ألفاظ غير لائقة',
          inappropriate: 'مخالف لميثاق المنصة',
          theological_error: 'خطأ ظاهر يحال للجنة العلمية',
          distress: 'إحالة لأقسام الدعم النفسي والإنساني',
          privacy: 'يتضمن معلومات هوية شخصية',
        },
      },
      audit: {
        action: 'العملية',
        moderator: 'المشرف',
        target: 'العنصر',
        date: 'الوقت والتاريخ',
      },
    },
    common: {
      loading: 'جاري التحميل...',
      save: 'حفظ',
      close: 'إغلاق',
      back: 'رجوع',
      success: 'تمت العملية بنجاح',
      error: 'حدث خطأ غير متوقع',
    },
  },
};
