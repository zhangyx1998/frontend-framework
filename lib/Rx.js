export default {
	get internalCookie() { return /^_{2,}INTERNAL_*(?<name>.*?)_*$/gi },
	get mail() { return /^\w+(\w+|\.|-)*\w+@([\w\-_]+\.)+[a-z]{1,3}$/gi },
	get ID() { return /^[a-z][a-z0-9\-_]{4,15}$/gi },
	get devMode() { return /^((dev(elopment)?)|debug|dbg)$/i }
}
