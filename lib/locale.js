/* eslint-disable spellcheck/spell-checker */
/* eslint-env node, browser */
export const locale = new class LocaleManager {
	get $() {
		return localStorage.getItem('language-override')
			|| navigator.language
			|| 'en'
	}
	set $(l) {
		if (
			!l
			|| !(typeof l === 'string')
			|| l.toLowerCase() == navigator.language.toLowerCase()
		) localStorage.removeItem('language-override')
		else localStorage.setItem('language-override', l)
	}
}

window.locale = locale

export const LOCALE = Object.freeze({
	zh: {
		CN: '大陆',
		HK: '香港',
		SG: '新加坡',
		TW: '台湾省',
		_: '中文'
	},
	en: {
		AU: 'Australia',
		BZ: 'Belize',
		CA: 'Canada',
		GB: 'United Kingdom',
		IE: 'Ireland',
		JM: 'Jamaica',
		NZ: 'New Zealand',
		PH: 'Philippines',
		TT: 'Trinidad & Tobago',
		US: 'United States',
		ZA: 'South Africa',
		ZW: 'Zimbabwe',
		_: 'English'
	},
	ja: '日本語',
	de: {
		AT: 'Austria',
		CH: 'Switzerland',
		DE: 'Germany',
		LI: 'Liechtenstein',
		LU: 'Luxembourg',
		_: 'Deutsch'
	},
	/*
	Not yet included locales
	fr: {
		BE: 'Belgium',
		CA: 'Canada',
		CH: 'Switzerland',
		FR: 'France',
		LU: 'Luxembourg',
		MC: 'Monaco',
		_: 'Français'
	},
	ar: {
		AE: 'U.A.E.',
		BH: 'Bahrain',
		DZ: 'Algeria',
		EG: 'Egypt',
		IQ: 'Iraq',
		JO: 'Jordan',
		KW: 'Kuwait',
		LB: 'Lebanon',
		LY: 'Libya',
		MA: 'Morocco',
		OM: 'Oman',
		QA: 'Qatar',
		SA: 'Saudi Arabia',
		SY: 'Syria',
		TN: 'Tunisia',
		YE: 'Yemen',
		_: 'Arabic'
	},
	af:  'Afrikaans',
	an:  'Aragonese',
	as:  'Assamese',
	ast:  'Asturian',
	az:  'Azerbaijani',
	be:  'Belarusian',
	bg:  'Bulgarian',
	bn:  'Bengali',
	br:  'Breton',
	bs:  'Bosnian',
	ca:  'Catalan',
	ce:  'Chechen',
	ch:  'Chamorro',
	co:  'Corsican',
	cr:  'Cree',
	cs:  'Czech',
	cv:  'Chuvash',
	cy:  'Welsh',
	da:  'Danish',
	el:  'Greek',
	eo:  'Esperanto',
	es: {
		AR: 'Argentina',
		BO: 'Bolivia',
		CL: 'Chile',
		CO: 'Colombia',
		CR: 'Costa Rica',
		DO: 'Dominican Republic',
		EC: 'Ecuador',
		ES: 'Spain',
		GT: 'Guatemala',
		HN: 'Honduras',
		MX: 'Mexico',
		NI: 'Nicaragua',
		PA: 'Panama',
		PE: 'Peru',
		PR: 'Puerto Rico',
		PY: 'Paraguay',
		SV: 'El Salvador',
		UY: 'Uruguay',
		VE: 'Venezuela',
		_: 'Spanish'
	},
	et:  'Estonian',
	eu:  'Basque',
	fa: {
		IR: 'Persian/Iran',
		_: 'Farsi'
	},
	fi:  'Finnish',
	fj:  'Fijian',
	fo:  'Faeroese',
	fur:  'Friulian',
	fy:  'Frisian',
	ga:  'Irish',
	gd: {
		IE: 'Irish',
		_: 'Scots Gaelic'
	},
	gl:  'Galacian',
	gu:  'Gujurati',
	he:  'Hebrew',
	hi:  'Hindi',
	hr:  'Croatian',
	hsb:  'Upper Sorbian',
	ht:  'Haitian',
	hu:  'Hungarian',
	hy:  'Armenian',
	id:  'Indonesian',
	is:  'Icelandic',
	it: {
		CH: 'Switzerland',
		_: 'Italian'
	},
	iu:  'Inuktitut',
	ji:  'Yiddish',
	ka:  'Georgian',
	kk:  'Kazakh',
	km:  'Khmer',
	kn:  'Kannada',
	ko: {
		KP: 'North Korea',
		KR: 'South Korea',
		_: 'Korean'
	},
	ks:  'Kashmiri',
	ky:  'Kirghiz',
	la:  'Latin',
	lb:  'Luxembourgish',
	lt:  'Lithuanian',
	lv:  'Latvian',
	mi:  'Maori',
	mk:  'FYRO Macedonian',
	ml:  'Malayalam',
	mo:  'Moldavian',
	mr:  'Marathi',
	ms:  'Malay',
	mt:  'Maltese',
	my:  'Burmese',
	nb:  'Bokmal',
	ne:  'Nepali',
	ng:  'Ndonga',
	nl: {
		BE: 'Belgian',
		_: 'Dutch'
	},
	nn:  'Nynorsk',
	no:  'Norwegian',
	nv:  'Navajo',
	oc:  'Occitan',
	om:  'Oromo',
	or:  'Oriya',
	pa: {
		IN: 'India',
		PK: 'Pakistan',
		_: 'Punjabi'
	},
	pl:  'Polish',
	pt: {
		BR: 'Brazil',
		_: 'Portuguese'
	},
	qu:  'Quechua',
	rm:  'Rhaeto-Romanic',
	ro: {
		MO: 'Moldavia',
		_: 'Romanian'
	},
	ru: {
		MO: 'Moldavia',
		_: 'Russian'
	},
	sa:  'Sanskrit',
	sb:  'Sorbian',
	sc:  'Sardinian',
	sd:  'Sindhi',
	sg:  'Sango',
	si:  'Singhalese',
	sk:  'Slovak',
	sl:  'Slovenian',
	so:  'Somani',
	sq:  'Albanian',
	sr:  'Serbian',
	sv: {
		FI: 'Finland',
		SV: 'Sweden',
		_: 'Swedish'
	},
	sw:  'Swahili',
	sx:  'Sutu',
	sz:  'Lappish',
	ta:  'Tamil',
	te:  'Teluga',
	th:  'Thai',
	tig:  'Tigre',
	tk:  'Turkmen',
	tlh:  'Klingon',
	tn:  'Tswana',
	tr:  'Turkish',
	ts:  'Tsonga',
	tt:  'Tatar',
	uk:  'Ukrainian',
	ur:  'Urdu',
	ve:  'Venda',
	vi:  'Vietnamese',
	vo:  'Volapuk',
	wa:  'Walloon',
	xh:  'Xhosa',
	zu:  'Zulu',
	*/
})
